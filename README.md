# Earth Event Lab

A **90-minute NASA Space Apps Challenge workshop** about what a location can tell us. Participants interpret Earth imagery, build a web map pin, test which icebergs fall inside an area, and explore three mobile prototypes. The browser lab uses no account, API key, paid service or package installation.

## The 90-minute presentation

- Present [Where on Earth? · 90 Minutes](slides/Where-on-Earth-90-Minutes.pptx) and share the [matching slide PDF](slides/Where-on-Earth-90-Minutes.pdf).
- The [90-minute instructor schedule](tutorial/INSTRUCTOR.md#90-minute-powerpoint) and [student walkthrough](tutorial/README.md#90-minute-workshop) follow the deck. Start both web tabs before the session. Pre-open one or more of the [mobile starters](mobile/README.md) if you intend to demonstrate them live.
- Slide 17’s GitHub link and left QR are placeholders. The workshop folder contains the class data, the web lab and the three mobile projects. The right QR opens a live [NASA EONET data request](https://eonet.gsfc.nasa.gov/api/v3/events?category=seaLakeIce&limit=5).
- Slides **34–37** show the My Esri license settings, an Esri iPhone reference, both dates in the running Kotlin app, and the Expo practice screen. The [screenshot credits](slides/images/mobile/README.md) include full-size images.

## Start here

1. Download or clone this repository and open a terminal in its root folder.
2. Start a static server with an available option:

   | System | Command |
   | --- | --- |
   | Windows with Python | `py -m http.server 8000 --bind 127.0.0.1` |
   | macOS / Linux with Python | `python3 -m http.server 8000 --bind 127.0.0.1` |
   | Any system with VS Code Live Server installed | Open the root folder and choose **Open with Live Server** on `application/index.html` |

3. Visit [the app](http://localhost:8000/application/). Use a recent browser with WebGL enabled.
4. Open [the first-pin lab](http://localhost:8000/tutorial/first-pin/) and [Earth Event Lab with the class sample](http://localhost:8000/application/?data=sample) in separate tabs.

Stop the Python server with **Ctrl+C**. If port 8000 is occupied, use 8001 in the command and URLs. Avoid opening the application as a `file://` URL: browser security blocks local module and data requests.

Python is only a convenient static server, not part of the GIS application. Use any existing static web server if Python is unavailable. The app uses plain HTML, CSS, and JavaScript.

## Test on a Mac

1. Open a copy or clone of the workshop on your Mac. In Terminal, switch to the folder containing this README. Start the browser lab using the macOS command above.
2. In a second Terminal tab in the same folder, run `open mobile/ios-iceberg/IcebergMap.xcodeproj`. In Xcode 16.4 or newer, wait for the ArcGIS package to resolve, select the **IcebergMap** scheme and an iPhone simulator, then press **⌘R**.
3. Compare the orange pin on **6 March** and **13 March**. To put your own simulator capture into slide 35, close the PowerPoint file and run `python3 scripts/update_ios_screenshot.py` from the repository root. See the [Swift guide](mobile/ios-iceberg/README.md#put-your-iphone-screenshot-on-slide-35) for the screenshot and PDF export steps.

## What participants will learn

- Explain how location changes a question and which additional evidence a decision requires.
- Interpret longitude/latitude coordinates and dated event observations.
- Turn EONET JSON into map graphics, filter categories, and count locations within a geographic box.
- Distinguish map display, a spatial query, and a validated assessment of exposure or risk.
- Communicate uncertainty and cite original data sources.

## 90-minute schedule

| Minutes | Activity |
| --- | --- |
| 0–18 | Explore NASA imagery. Compare points, lines, polygons and rasters. Investigate projections, basemaps and tiles. |
| 18–30 | Meet an Earth-observing satellite, NASA EONET, Esri and three other mapping platforms. |
| 30–42 | Get the files, launch the local project, inspect a dated observation and open its GeoJSON Feature. |
| 42–64 | Build a pin, predict and test two area queries, read a PostGIS equivalent and discuss uncertainty. |
| 64–75 | Consider a GeoAI smoke exercise and develop a question in pairs. |
| 75–90 | Walk through My Esri licensing, Swift, Kotlin and React Native/Google Places. Close with questions. |

## Repository guide

| Resource | Purpose |
| --- | --- |
| `application/` | Complete, buildless map application; `core.js` contains data and spatial logic |
| `slides/` | 90-minute PowerPoint, matching PDF and slide images |
| `mobile/` | Swift/Xcode and Kotlin/Gradle projects and an Expo app with an optional Places relay |
| `tutorial/README.md` | Paced practical activities and explanations |
| `tutorial/first-pin/` | Three-line pin exercise and a worked example |
| `tutorial/INSTRUCTOR.md` | Preparation, facilitation, answers, troubleshooting |
| `sample-data/` | NASA event records plus query provenance |
| `tests/` | Optional Node checks of coordinate, selection, and data handling |
| `scripts/update_ios_screenshot.py` | Capture an iPhone simulator screen and update slide 35 |

## Sharing from GitHub

After publication, students can clone the repository or use GitHub’s **Code → Download ZIP** and extract it. Slide 17’s workshop URL and QR use the same placeholder. The [instructor guide](tutorial/INSTRUCTOR.md#90-minute-powerpoint) explains how to update them.

## Data and design choices

The app requests `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=60&limit=500`. This is a bounded learning dataset, not a complete inventory of natural events. Category options come from the loaded response, so unavailable categories do not appear. Click **Use sample data** for reproducible practice or open `application/?data=sample`. A failed live request automatically attempts the local sample after a 15-second timeout.

Each event contributes its latest **valid Point** geometry by observation date. A newer Polygon can exist; the chosen point is not necessarily the event’s latest geometry. Polygon-only events are omitted and counted in the status message. A storm track may intersect your area even when its latest point does not. Count units are unique event records with a mapped point, not all observations or affected people. Category and spatial filters combine with AND. The query uses WGS84 degree bounds, includes boundaries, and never estimates distance in degrees. Typed west > east bounds cross the antimeridian; two-click selection uses the smaller longitude and larger longitude directly and does not wrap.

The application pins **ArcGIS Maps SDK for JavaScript 4.34**, a deliberate teaching version with the AMD loader. It does not claim to teach the latest release’s setup. The public Esri World Topographic Map tiled service avoids token-based basemap styles. The SDK, tiles, NASA API, and original source sites need network access. Sample data replaces NASA requests only; it is **not a fully offline map**. A blocked basemap can leave a blank background even when event graphics load. Esri attribution remains visible. ArcGIS Pro is discussed but no desktop installation or license is needed.

## Validation

Optional for instructors with Node.js: run `npm test` (no `npm install`). Tests cover inclusive box edges, antimeridian handling, latest valid points, unsupported geometry, combined filters, fallback JSON, and safe source URLs. See the instructor guide for browser checks.

## Official references

- [NASA EONET v3 documentation](https://eonet.gsfc.nasa.gov/docs/v3): event fields, query parameters, geometries, categories, sources, imagery layers.
- [NASA EONET disclaimer](https://eonet.gsfc.nasa.gov/what-is-eonet): approximate extents and general-information use.
- [Esri Maps SDK documentation](https://developers.arcgis.com/javascript/latest/): web mapping and spatial analysis capabilities; latest setup differs from this pinned version.
- [MapView](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html), [GraphicsLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html), [TileLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-TileLayer.html).
- [Esri GIS overview](https://www.esri.com/en-us/what-is-gis/overview) and [ArcGIS Pro introduction](https://pro.arcgis.com/en/pro-app/latest/get-started/get-started.htm).

This workshop is an independent educational resource. NASA and Esri retain their respective names, data notices, and software terms. Check service availability before presenting.
