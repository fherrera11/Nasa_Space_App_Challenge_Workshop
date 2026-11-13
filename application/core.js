// Pure GIS/data functions: usable in the browser and in the Node checks.
export function latestPoints(events) {
  let skipped = 0;
  const records = [];
  for (const event of events) {
    const points = (event.geometry || []).filter(g => g.type === 'Point' &&
      Array.isArray(g.coordinates) && g.coordinates.length >= 2 &&
      g.coordinates.slice(0, 2).every(Number.isFinite) &&
      Math.abs(g.coordinates[0]) <= 180 && Math.abs(g.coordinates[1]) <= 90 &&
      Number.isFinite(Date.parse(g.date)));
    points.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    if (!points.length) { skipped++; continue; }
    records.push({ ...event, point: points[0], categories: event.categories || [], sources: event.sources || [] });
  }
  return { records, skipped };
}

// Inclusive point-in-box test in WGS84 degrees. west > east wraps the dateline.
export function inBox([lon, lat], { west, south, east, north }) {
  return lat >= south && lat <= north &&
    (west <= east ? lon >= west && lon <= east : lon >= west || lon <= east);
}

export function selectRecords(records, category, box) {
  return records.filter(e => (!category || e.categories.some(c => c.id === category)) &&
    (!box || inBox(e.point.coordinates, box)));
}

export function safeURL(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
