import { latestPoints, safeURL } from '../../application/core.js';

const status = document.getElementById('status');
const worked = new URLSearchParams(location.search).get('example') === '1';
if (worked) {
  const link = document.getElementById('example');
  link.href = './';
  link.textContent = 'Return to your own map';
}

async function runLesson() {
  const response = await fetch('../../sample-data/eonet-snapshot.json');
  if (!response.ok) throw new Error('The saved sample could not be opened. Serve the repository root over HTTP.');
  const data = await response.json();
  const event = latestPoints(data.events).records.find(item => item.id === 'EONET_2734');
  if (!event) throw new Error('The saved sample needs the Iceberg A23A record for this exercise.');
  const observation = event.point;
  document.getElementById('record-title').textContent = [event.title, event.categories[0].title, event.id].join(' · ');
  const { date, type, coordinates } = observation;
  document.getElementById('observation').textContent = JSON.stringify({ date, type, coordinates }, null, 2);
  const sources = document.getElementById('sources');
  sources.append('Sources listed by EONET: ');
  for (const [index, source] of event.sources.entries()) {
    if (index) sources.append(' · ');
    const url = safeURL(source.url);
    if (!url) { sources.append(source.id); continue; }
    const link = document.createElement('a');
    link.href = url;
    link.textContent = source.id;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    sources.append(link);
  }

  if (!window.require) throw new Error('The ArcGIS SDK is unavailable. Use the observation above to compare the coordinates with the bounds on the slides.');
  const [ArcGISMap, MapView, GraphicsLayer, Graphic, Point, Basemap, TileLayer] = await new Promise((resolve, reject) => {
    window.require(['esri/Map', 'esri/views/MapView', 'esri/layers/GraphicsLayer', 'esri/Graphic',
      'esri/geometry/Point', 'esri/Basemap', 'esri/layers/TileLayer'], (...modules) => resolve(modules), reject);
  });
  const eventsLayer = new GraphicsLayer();
  const basemap = new Basemap({ baseLayers: [new TileLayer({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'
  })] });
  const map = new ArcGISMap({ basemap, layers: [eventsLayer] });
  const view = new MapView({ container: 'viewDiv', map, center: [-37, -50], zoom: 3 });
  await view.when();
  const symbol = { type: 'simple-marker', size: 16, color: '#cc421f', outline: { color: 'white', width: 2 } };
  const { placePin } = worked ? await import('./worked-example.js') : await import('./student.js');
  placePin(observation, eventsLayer, Point, Graphic, symbol);
  const count = eventsLayer.graphics.length;
  status.textContent = count
    ? (worked ? 'Worked example' : 'Your map') + ' · ' + count + (count === 1 ? ' pin' : ' pins') + ' in the event layer. Compare the position with the saved observation.'
    : 'Your map · 0 pins. Add the three lines in student.js and reload.';
}

runLesson().catch(error => { status.textContent = error.message || 'Map unavailable. Check the internet connection and WebGL.'; });
