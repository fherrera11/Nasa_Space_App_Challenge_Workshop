import http from 'node:http';
import { pathToFileURL } from 'node:url';

const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';
const circle = { center: { latitude: 37.7793, longitude: -122.4193 }, radius: 1500 };

export function createRelay(apiKey, requestPlaces = fetch) {
  let requesting = false;
  return http.createServer(async (req, res) => {
    function reply(status, body) {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(body));
    }
    if (req.url !== '/nearby' || req.method !== 'POST') return reply(404, { error: 'Use POST /nearby.' });
    if (!apiKey) return reply(503, { error: 'Set GOOGLE_PLACES_API_KEY in the relay terminal.' });
    if (requesting) return reply(429, { error: 'Another search is in progress.' });
    requesting = true;
    try {
      const response = await requestPlaces(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.googleMapsUri,places.attributions'
        },
        body: JSON.stringify({ includedTypes: ['library'], maxResultCount: 5, rankPreference: 'DISTANCE',
          locationRestriction: { circle } }),
        signal: AbortSignal.timeout(12000)
      });
      if (!response.ok) {
        return reply(502, { error: 'Google Places returned HTTP ' + response.status + '. Check API access, billing and quota.' });
      }
      const result = await response.json();
      const places = (result.places || []).map(place => ({
        name: place.displayName?.text || 'Unnamed place',
        mapsUri: place.googleMapsUri,
        attributions: place.attributions || []
      }));
      reply(200, { places });
    } catch {
      reply(502, { error: 'Google Places could not be reached.' });
    } finally {
      requesting = false;
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.PLACES_BIND_HOST || '127.0.0.1';
  const port = Number(process.env.PORT || 4100);
  createRelay(process.env.GOOGLE_PLACES_API_KEY).listen(port, host, () => {
    console.log('Workshop relay listening on http://' + host + ':' + port);
  });
}
