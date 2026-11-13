# Hands-on tutorial: location as evidence

**Your mission:** help a research team decide which event reports deserve closer investigation in a chosen region. Produce a map-based observation, name the query scope, and explain what evidence is still missing.

Work in pairs if helpful: one person navigates or edits, the other checks dates and explains the spatial question. Swap halfway through. Beginners can complete every core activity with the supplied working files; experienced participants can try the optional changes.

## 90-minute workshop

1. **Inspect the evidence, minutes 0–30.** Draw one point for an iceberg, a line for its dated positions and a polygon for your study area. A vector feature stores coordinates and attributes. A raster stores a grid, such as terrain heights. The basemap supplies geographic context and tiles load portions at the current zoom. WGS 84 uses longitude and latitude in degrees. Web Mercator draws these onto a plane with scale that increases toward the poles. Choose an equal-area projection when comparing areas.
2. **Open and run the project, minutes 30–37.** Find the workshop directory containing `application`, `sample-data`, `mobile` and `tutorial`, then open a terminal there. On Windows run `py -m http.server 8000`. On macOS/Linux run `python3 -m http.server 8000`. Leave the server running and open [the practice map](http://localhost:8000/tutorial/first-pin/). Check for the A23A record and **0 pins**.
3. **Connect the data, minutes 37–42.** Open [the GeoJSON Feature](../sample-data/a23a.geojson) and find the same coordinates in [the archive](../sample-data/eonet-snapshot.json) under `EONET_2734`. Find one of its reporting sources. The point is an observation from 13 March 2026. The EONET response and a GeoJSON Feature have different outer structures. [NASA v3 data guide](https://eonet.gsfc.nasa.gov/docs/v3) · [GeoJSON specification](https://www.rfc-editor.org/rfc/rfc7946)
4. **Build and test, minutes 42–64.** Add the three lines shown in the [pin lab below](#build-a-pin-and-test-an-area), save and reload. In [the full app](http://localhost:8000/application/?data=sample), select **Sea and Lake Ice**. Apply West −60, East −25, South −65, North −45. Predict which of the three icebergs will disappear if North moves to −50. Report the two names, which boundary moved and one thing a single dated point cannot tell you.
5. **Explore and pitch, minutes 64–75.** Choose smoke and towns, ash and wind, ice and shipping, or a local issue. Decide what should be a point, line, polygon or raster. A GeoAI team might outline smoke pixels on labeled satellite images. Explain how a held-out image from another location or date could expose confusion between smoke and cloud.
6. **Take it to mobile, minutes 75–90.** Open the [mobile project guide](../mobile/README.md). Compare the same two archived dates in the Swift and Kotlin demos. Compare that location question with a library search around San Francisco City Hall. The React Native starter’s practice list is available without a Google key. Bring one question to the closing discussion.

### Optional SQL for slide 24

PostGIS extends PostgreSQL with spatial data types and operations. If you already have a PostgreSQL database with the PostGIS extension enabled, this self-contained, read-only query reproduces the **second** box for the three ice points identified in the first box.

```sql
WITH observations(title, lon, lat) AS (
  VALUES ('Iceberg A23A', -31.79, -48.95),
         ('Iceberg A23J', -41.72, -52.86),
         ('Iceberg D33D', -55.47, -63.78)
), events AS (
  SELECT title, ST_SetSRID(ST_MakePoint(lon, lat), 4326) AS geom
  FROM observations
)
SELECT title FROM events
WHERE ST_Intersects(geom, ST_MakeEnvelope(-60, -65, -25, -50, 4326))
ORDER BY title;
```

The result is **Iceberg A23J** and **Iceberg D33D**. ST_MakeEnvelope takes west, south, east and north. Boundary points intersect the box. Try North at −53 and predict which row remains. [PostGIS spatial relationships](https://postgis.net/workshops/postgis-intro/spatial_relationships.html)

## Build a pin and test an area

Start the server from the [repository root](../README.md#start-here). Open [One iceberg, one pin](http://localhost:8000/tutorial/first-pin/) and keep it beside your editor. Your pair will place one real observation and then test whether that point falls inside an area.

**37–42 minutes · Read the report.** Find Iceberg A23A, its date and one linked reporting source. The exercise uses NASA's saved EONET event EONET_2734. In its latest valid Point, `[-31.79, -48.95]` means 31.79° west, 48.95° south. The observation date is 13 March 2026 UTC. Predict where the pin should appear. The normal EONET response wraps dated, GeoJSON-style geometries in event records. [NASA v3 data guide](https://eonet.gsfc.nasa.gov/docs/v3)

**42–51 minutes · Build the pin.** Open [student.js](first-pin/student.js). The coordinate line is in place. Add these three lines inside `placePin`, before the closing brace.

```js
const point = new Point({ longitude, latitude });
const pin = new Graphic({ geometry: point, symbol });
eventsLayer.add(pin);
```

The Point locates the observation. The Graphic gives the point a symbol. The GraphicsLayer holds the graphic. Save and reload. Look for **Your map · 1 pin** and the orange marker in the South Atlantic. The **See the worked example** link opens a completed copy you can compare with yours. If the map service is unavailable, use the coordinates in the page or the slides for the following comparison.

**51–56 minutes · Select an area.** Follow **Open Earth Event Lab for the area query**. Select **Use sample data**, **Sea and Lake Ice**, then **Clear area**. Enter West `-60`, East `-25`, South `-65`, North `-45`, and select **Apply geographic box**. Record the three names and inspect one source. The counter reads **3 of 48 mapped events**. The archive contains 12 ice records across the whole map.

**56–64 minutes · Test a prediction.** Which iceberg will leave the box when North moves to `-50`? Keep the other three bounds fixed and test. A23A drops out because −48.95° is north of −50°. A23J and D33D remain. Panning and changing a marker's color affect what you see. Changing the boundary tests which dated points qualify. Write one sentence reporting your count, boundary and a missing piece of evidence.

**64–75 minutes · Choose your own question.** Try North at `-53`, investigate another category, or sketch a project that combines an event layer with dated roads, towns, smoke or terrain. Compare a finding and a limitation with a partner.

The exercises below are optional ways to explore the full map during the hackathon.

## Explore the full map

Follow the root [README](../README.md) to start the server. Keep the app and an editor open side by side. No build command is required. Save an edit and refresh the browser to see it.

1. Choose **Use sample data** so pairs share a stable dataset.
2. Choose any category present in the dropdown. What changed?
3. Select a marker or event list entry. Locate its observation date, coordinates, and original source.
4. Predict whether your chosen geographic region contains many or few of these records. State why.

**GIS idea:** a geographic information system connects location to attributes such as category and date. The basemap provides context. Event markers form a separate layer. Seeing clusters is useful for exploration, but the visible pattern depends on data collection and map scale.

## Give the map a purpose

Open `application/index.html`. Change the question in the header paragraph to one your pair can investigate, such as “Which reported wildfire locations fall inside our study area?” Save and refresh.

Open `application/app.js` and find **Step 1**:

```js
const eventsLayer = new GraphicsLayer();
const areaLayer = new GraphicsLayer();
```

The **Map** stores layers. The **MapView** displays the map and handles navigation. A **Graphic** joins a geometry with attributes and a symbol. No ArcGIS Pro project is required to use these concepts on the web.

Change the initial `center: [0, 20]` to `center: [-100, 40]` and `zoom: 2` to `zoom: 3`. Refresh. You changed the view, not the underlying event data or query. Longitude comes first: west is negative, north is positive. These coordinates use WGS84, commonly identified as EPSG:4326.

**Checkpoint:** Does moving the map change the count? It should not. Panning changes display; the explicit area query changes the result.

## Understand the event data

Open [NASA's response](https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=60&limit=5) or `sample-data/eonet-snapshot.json` in your editor. Find an event's `title`, `categories`, `sources`, and `geometry`.

An API is a published way to request data. JSON is the structured response format. EONET returns event metadata, not a satellite image file. Its related layers endpoint describes imagery services; using imagery requires additional work.

```json
{"type":"Point","coordinates":[-100,40],"date":"2026-01-01T00:00:00Z"}
```

This is an **illustrative observation**, not a real event. Its position is longitude −100°, latitude 40°. The `Z` means UTC. GeoJSON standardizes geometry types and coordinate order. EONET's native response wraps dated geometries inside events rather than returning a GeoJSON FeatureCollection.

In `app.js`, find **Step 2** and the `API` constant. `fetch` requests the URL, checks HTTP status, and parses JSON. `latestPoints` in `core.js` rejects invalid coordinates, sorts valid Points by date, and keeps one per event. One marker can summarize a moving event with many observations.

Optional edit: change `days=60` to `days=14`, click **Load live data**, and compare the status and count. Restore 60 afterward. A smaller response does not prove fewer events happened globally. Live counts vary, the query is capped, and open status comes from EONET. The sample button deliberately ignores this live-query change.

**Checkpoint:** State the current dataset's date/status scope aloud. How would you notice the app fell back to sample data?

## Filter by an event attribute

Choose a category and compare the count with **All categories**. Read the category names in the list; symbol color is only a visual aid, not the sole source of meaning.

In `core.js`, find:

```js
e.categories.some(c => c.id === category)
```

This tests an attribute: “Does this event have the chosen category?” It accounts for multiple categories. The dropdown uses categories found in the current data, so volcanoes or storms may be absent from a small sample. NASA's full categories endpoint lists the available catalog categories.

Optional edit: change one color in the `colors` object in `app.js`. Refresh. Explain why a different color does not change the selection or establish event severity.

**Checkpoint:** What changed in the data result, and what changed only in appearance?

## Test a geographic area

1. Predict the result before querying.
2. Click **Select on map**. Click one corner of a study area, then the opposite corner. On a touch screen, tap the corners. Escape or **Cancel selection** cancels an unfinished box.
3. Compare the result list and count. Change category while keeping the area.
4. Use **Clear area**. Does the original category count return?
5. For a reproducible query, enter West **−130**, East **−60**, South **15**, North **60** and click **Apply geographic box**. Read the stored bounds below the form.

The rectangle is a study area, not a country boundary. The app asks “Which latest mapped Points intersect this box?” Boundary points count. In `core.js`, latitude must lie between south and north, and longitude must lie between west and east:

```js
lat >= south && lat <= north
```

This is a **spatial query**: it computes a relationship between location and area and creates a reproducible subset. Displaying markers alone does not perform this selection. It remains a simple analytical step, not an impact model.

Technical option: enter West **170**, East **−170**, South **−20**, North **20**. West greater than east represents a box crossing the antimeridian. The app draws two pieces and tests longitudes on either side. The two-click method always uses minimum/maximum longitudes, so use typed bounds for a crossing box.

Coordinates are angular degrees. A degree of longitude covers different ground distances at different latitudes. Do not multiply degrees by a single constant for a proximity study; a future distance feature should use a suitable projection or geodesic calculation.

**Checkpoint:** Can another pair reproduce your count using the same snapshot, category, and four bounds? If not, compare input values and dataset labels.

## Report a finding

Complete this sentence with your actual results:

> In [live query or sample archive], [N] of [M] mapped event records match [category] and have a latest valid Point in [four bounds]. The observation dates are [dates]. This suggests [question for investigation]. It does not establish [missing evidence].

Open one original source. Does its date or description change your interpretation? What would a newer Polygon or an earlier storm observation add?

No matches does not establish safety. A marker is not a fire perimeter or storm footprint. Event counts are not damage, hazard severity, population exposure, or a trend. NASA warns that spatial and temporal extents are approximate. Use official local emergency information for operational decisions.

## Independent challenges

Choose one and present a 60-second result, including a limitation.

| Level | Challenge | Success check |
| --- | --- | --- |
| No coding | Compare two equal-sized degree boxes using the same category | Report both bounds/counts; explain why equal degrees do not imply equal land area |
| Beginner | Recenter the app on a region and change the guiding question | A partner can explain what question the app now supports |
| Beginner | Change a category color and improve an instruction | Labels still convey meaning without relying on color |
| Intermediate | Add an observation-date filter in `selectRecords` and a date input | Test points before, on, and after the date; label this as observation time |
| Intermediate | List excluded geometry types in the status message | Polygon-only records are transparent rather than silently disappearing |
| Advanced | Export the selected records as a GeoJSON FeatureCollection | Every feature has Point geometry plus event ID, date, category, and source properties |
| Advanced | Compare all dated observations with the latest-point method | Deduplicate by event ID and explain why the counts differ |
| Advanced | Join event footprints with a documented population layer | Explain time alignment, projection, licensing, and why a point alone cannot establish exposure |

For a hackathon, start with a person and a decision: “Who needs this information, when, and to decide what?” Identify the spatial relationship you need (within, intersects, near, or along a route), choose suitable evidence, and state the uncertainty in the interface.

## Troubleshooting

- Blank page or blocked modules: use HTTP, check the developer console, enable WebGL, and try a recent browser. School networks may block `js.arcgis.com`.
- Blank basemap: check access to `services.arcgisonline.com`; marker data and tiles are independent network requests.
- Live data fails: wait for the automatic fallback or choose **Use sample data**. The status names the archive and its scope.
- Sample returns 404: start the server from the repository root, not inside `application/`.
- No events: clear the area, choose all categories, inspect the data label, and then try the sample. Zero is a valid query result.
- Edits disappear or do nothing: save the correct file, refresh, and check for a JavaScript syntax error. Undo the most recent edit if needed.
- Source link unavailable: external providers control their pages. Record the URL and event date; do not invent replacement evidence.
