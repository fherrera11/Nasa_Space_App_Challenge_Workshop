import { latestPoints, selectRecords, safeURL } from './core.js';

const $ = id => document.getElementById(id);
const API = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=60&limit=500';
let records = [], box = null, selecting = false, firstCorner = null, mode = '', skipped = 0;
// Step 1: the map holds layers; the view manages their display and interaction.
if (!window.require) $('status').textContent = 'ArcGIS SDK unavailable. Check internet access and reload. Sample data cannot replace the SDK.';
else window.require(['esri/Map', 'esri/views/MapView', 'esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/geometry/Point', 'esri/geometry/Polygon'],
  async (ArcGISMap, MapView, GraphicsLayer, Graphic, Point, Polygon) => {
  const eventsLayer = new GraphicsLayer();
  const areaLayer = new GraphicsLayer();
  // Public legacy tiled basemap: no token or paid location service used here.
  const map = new ArcGISMap({ layers: [eventsLayer, areaLayer] });
  // Use public raster tiles to avoid the authentication required by basemap styles.
  const [TileLayer, Basemap] = await new Promise(resolve => window.require(['esri/layers/TileLayer', 'esri/Basemap'], (...modules) => resolve(modules)));
  map.basemap = new Basemap({ baseLayers: [new TileLayer({ url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer' })] });
  const view = new MapView({ container: 'viewDiv', map, center: [0, 20], zoom: 2, constraints: { rotationEnabled: false } });
  const colors = { wildfires: '#cf491f', severeStorms: '#7148b5', volcanoes: '#a32f56', seaLakeIce: '#087e99' };
  const detail = (event) => {
    const el = $('details'); el.replaceChildren();
    const add = (tag, text) => { const node = document.createElement(tag); node.textContent = text; el.append(node); };
    add('h2', event.title);
    add('p', `${event.categories.map(c => c.title).join(', ')} · ${event.closed ? 'Closed' : 'Open in EONET'}`);
    add('p', `Latest mapped Point: ${event.point.date} · Longitude ${event.point.coordinates[0]}, latitude ${event.point.coordinates[1]}`);
    const dates = (event.geometry || []).map(g => g.date).filter(d => Number.isFinite(Date.parse(d))).sort((a,b) => Date.parse(a)-Date.parse(b));
    add('p', `Observation dates in this response: ${dates[0] || 'Unknown'} to ${dates.at(-1) || 'Unknown'}. ${event.closed ? `Closed: ${event.closed}.` : ''}`);
    if (event.description) add('p', event.description);
    add('p', mode.startsWith('Sample') ? 'Archived sample; these are not current conditions.' : 'Open status does not establish present danger.');
    for (const source of event.sources) {
      const href = safeURL(source.url);
      if (!href) continue;
      const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = `Source: ${source.id}`;
      const p = document.createElement('p'); p.append(a); el.append(p);
    }
    if (!event.sources.length) add('p', 'No source links supplied.');
  };
  function render() {
    const matches = selectRecords(records, $('category').value, box);
    eventsLayer.removeAll(); $('results').replaceChildren();
    for (const event of matches) {
      const [longitude, latitude] = event.point.coordinates;
      eventsLayer.add(new Graphic({ geometry: new Point({ longitude, latitude }), attributes: { eventId: event.id }, symbol: { type: 'simple-marker', size: 11, color: colors[event.categories[0]?.id] || '#12675f', outline: { color: 'white', width: 1 } } }));
      const li = document.createElement('li'), button = document.createElement('button');
      button.textContent = `${event.title} · ${event.categories.map(c => c.title).join(', ')}`;
      button.onclick = () => { detail(event); view.goTo({ center: [longitude, latitude], zoom: 5 }).catch(() => {}); };
      li.append(button); $('results').append(li);
    }
    $('count').textContent = `${matches.length} of ${records.length} mapped events`;
    if (!matches.length) { const li = document.createElement('li'); li.textContent = 'No matches. Try another category or clear the area.'; $('results').append(li); }
  }
  function applyBox(next) {
    box = next; selecting = false; firstCorner = null; $('draw').textContent = 'Select on map'; areaLayer.removeAll();
    if (box) {
      const ranges = box.west <= box.east ? [[box.west, box.east]] : [[box.west, 180], [-180, box.east]];
      for (const [w,e] of ranges) areaLayer.add(new Graphic({ geometry: new Polygon({ spatialReference: { wkid: 4326 }, rings: [[[w,box.south],[w,box.north],[e,box.north],[e,box.south],[w,box.south]]] }), symbol: { type: 'simple-fill', color: [18,103,95,0.08], outline: { color: '#12675f', width: 2 } } }));
      for (const key of ['west','east','south','north']) $(key).value = box[key];
    }
    $('area').textContent = box ? `Area: W ${box.west.toFixed(2)}°, E ${box.east.toFixed(2)}°, S ${box.south.toFixed(2)}°, N ${box.north.toFixed(2)}°. Boundary points included.` : 'No area selected. All loaded locations count.';
    render();
  }
  // Step 2: retrieve JSON, with a timeout and an explicit archived-data fallback.
  async function load(sample = false) {
    $('live').disabled = $('sample').disabled = true;
    $('status').textContent = sample ? 'Loading archived sample…' : 'Requesting NASA events…';
    try {
      const response = await fetch(sample ? '../sample-data/eonet-snapshot.json' : API, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.events)) throw new Error('Unexpected EONET response');
      ({ records, skipped } = latestPoints(data.events));
      mode = sample ? 'Sample snapshot · 2026-11-12 · all statuses, prior 365 days, up to 12 per category' : 'Live request · open events, prior 60 days, limit 500';
      $('status').textContent = `${mode}. ${data.events.length} returned; ${skipped} without a usable Point omitted.${!sample && data.events.length >= 500 ? ' Result cap reached: this is a subset.' : ''}`;
      const categories = new Map(); records.forEach(e => e.categories.forEach(c => categories.set(c.id, c.title)));
      $('category').replaceChildren(new Option('All categories', ''));
      [...categories].sort((a,b) => a[1].localeCompare(b[1])).forEach(([id,title]) => $('category').add(new Option(title,id)));
      $('details').textContent = 'Select an event to inspect its date and sources.'; render();
    } catch (error) {
      if (!sample) { await load(true); $('status').textContent = `Live data unavailable (${error.message}). ${$('status').textContent}`; }
      else $('status').textContent = `Sample unavailable: ${error.message}. Serve the repository root over HTTP and retry. Previous results, if any, remain visible.`;
    } finally { $('live').disabled = $('sample').disabled = false; }
  }
  $('category').onchange = render;
  $('live').onclick = () => load(); $('sample').onclick = () => load(true);
  $('clear').onclick = () => applyBox(null);
  $('draw').onclick = () => { selecting = !selecting; firstCorner = null; $('draw').textContent = selecting ? 'Cancel selection' : 'Select on map'; $('area').textContent = selecting ? 'Click the first corner, then the opposite corner. Escape cancels.' : 'Selection cancelled; previous area retained.'; };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && selecting) { selecting = false; firstCorner = null; $('draw').textContent = 'Select on map'; $('area').textContent = 'Selection cancelled; previous area retained.'; } });
  $('bounds').onsubmit = e => {
    e.preventDefault(); const next = Object.fromEntries(['west','east','south','north'].map(k => [k, Number($(k).value)]));
    if (next.south > next.north) { $('area').textContent = 'South must be less than or equal to north.'; return; }
    applyBox(next);
  };
  view.on('click', async e => {
    if (selecting && e.mapPoint) {
      const p = { lon: ((e.mapPoint.longitude + 180) % 360 + 360) % 360 - 180, lat: e.mapPoint.latitude };
      if (!firstCorner) { firstCorner = p; $('area').textContent = 'Now click the opposite corner.'; return; }
      applyBox({ west: Math.min(p.lon,firstCorner.lon), east: Math.max(p.lon,firstCorner.lon), south: Math.min(p.lat,firstCorner.lat), north: Math.max(p.lat,firstCorner.lat) }); return;
    }
    const hit = await view.hitTest(e, { include: eventsLayer });
    const id = hit.results.find(r => r.graphic?.attributes?.eventId)?.graphic.attributes.eventId;
    if (id) detail(records.find(r => r.id === id));
  });
  try {
    await view.when();
    for (const id of ['live','sample','category','draw','clear','apply']) $(id).disabled = false;
    await load(new URLSearchParams(location.search).get('data') === 'sample');
  } catch (error) { $('status').textContent = `Map failed to start: ${error.message}. Check WebGL and network access.`; }
}, error => { $('status').textContent = `ArcGIS modules failed: ${error.message}`; });
