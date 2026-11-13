# EONET fallback snapshot

[a23a.geojson](a23a.geojson) is the small teaching Feature from slide 20. Its longitude, latitude and UTC date come from the latest valid Point in the archived A23A record. The date is shortened to a calendar date for the exercise. The web map uses the full snapshot below.

`eonet-snapshot.json` combines four NASA EONET v3 responses retrieved on **November 12, 2026 (America/Los_Angeles)**. Event objects remain unchanged; the workshop wrapper merges them and deduplicates by event ID. The requests were:

```text
https://eonet.gsfc.nasa.gov/api/v3/events?status=all&days=365&limit=12&category=wildfires
https://eonet.gsfc.nasa.gov/api/v3/events?status=all&days=365&limit=12&category=severeStorms
https://eonet.gsfc.nasa.gov/api/v3/events?status=all&days=365&limit=12&category=volcanoes
https://eonet.gsfc.nasa.gov/api/v3/events?status=all&days=365&limit=12&category=seaLakeIce
```

It contains 48 returned events, including open and closed events, selected to offer category variety for teaching. This archive uses a different time/status scope from the live app and is not a representative global sample. Its recorded coordinates and dates are historical observations, not present conditions. The date above describes download time, not event time. Original source URLs remain in each event.

The file uses EONET's native `{ "events": [...] }` JSON structure. It is **not** a GeoJSON FeatureCollection. Each geometry has GeoJSON-style type and coordinates plus an EONET observation date. Review [NASA's schema](https://eonet.gsfc.nasa.gov/docs/v3) and [disclaimer](https://eonet.gsfc.nasa.gov/what-is-eonet).

Use the app's **Use sample data** button or `?data=sample`. On a live API failure the application automatically tries this file. Serve the repository root, so `../sample-data/eonet-snapshot.json` resolves correctly.

To update the archive, download the four URLs above, merge the event arrays and deduplicate by ID, validate the JSON, replace the file, and update this provenance file **and the sample date in `application/app.js`**. Inspect titles, dates, category diversity, and query counts before using a new snapshot for teaching. Never label an archive as live data.
