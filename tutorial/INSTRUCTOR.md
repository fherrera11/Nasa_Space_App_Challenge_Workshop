# Instructor guide

## 90-minute PowerPoint

Use the [90-minute PowerPoint](../slides/Where-on-Earth-90-Minutes.pptx), the [student PDF](../slides/Where-on-Earth-90-Minutes.pdf) and the [student walkthrough](README.md#90-minute-workshop).

| Time | Slides | Facilitation |
| --- | --- | --- |
| 0–8 | 1–4 | Ask “Raise your hand if you’ve heard of GIS.” Look for a city boundary, an old river channel and the source of a smoke plume. |
| 8–18 | 5–8 | Have pairs sketch a point, a track and a box. Use the DEM cells, two similar-sized patches drawn in Web Mercator, and a tiled basemap to introduce the other representations. |
| 18–30 | 9–16 | Compare astronaut and satellite views. Show Esri, Mapbox, MapLibre and Google Maps. In the full app, show the saved A23A date and source. |
| 30–42 | 17–20 | Open the workshop folder and start the local server. Use the [first-pin page](http://localhost:8000/tutorial/first-pin/), the NASA feed and the local GeoJSON Feature. |
| 42–51 | 21 | Allow nine minutes to type three lines, save and reload. The event layer should contain one orange pin. Use the worked example if a pair needs a checkpoint. |
| 51–64 | 22–25 | Apply the original box, then move its north edge. Expect three, then two icebergs. Ask what `ST_Intersects` would return for the same three-row example. Compare the March point with the April image. |
| 64–75 | 26–29 | Offer wildfire, ash and GeoAI prompts. Give pairs four quiet minutes, then exchange a finding and a limitation. |
| 75 | 30–32 | Clickable references for later reading. Advance through these three slides without a lecture. |
| 75–88 | 33–37 | Show the My Esri navigation and the two native date toggles, then the Expo nearby-library app. Use a prepared simulator or open the small source files. Allow three minutes per platform. |
| 88–90 | 38 | Thank the room and invite questions or one final project idea. |

**Before the session.** Give participants access to the workshop folder. Slide 17’s left QR and workshop link open the public GitHub repository. Confirm the classroom network can reach it. The right QR opens NASA’s feed. The maps use online SDKs or tiles. Slides 19, 22 and 23 support a paper activity.

**Before a mobile demo.** Resolve the Swift package on a Mac, sync the Gradle project in Android Studio, and run `npm ci` in the Expo project ahead of time. The native demos work in developer mode. Show only the menu navigation when demonstrating My Esri. The Expo practice list uses no key. Live Google Places queries require a separately configured server-side key, Google Cloud billing, and a reachable relay. [Mobile setup and dated observations](../mobile/README.md)

**If you present from the slides alone**, use slide 34’s masked Esri screenshots to find the upper 100.x/200.x row. Slide 35 shows the workshop’s running iPhone app. On slide 36, cover the right image and ask which way the orange point should move after a week. Reveal 13 March and compare both longitudes. On slide 37, ask students what the two fictional library names can tell them about actual nearby places. [Full-size screenshots and credits](../slides/images/mobile/README.md) · [Capture your iPhone simulator](../mobile/ios-iceberg/README.md#put-your-iphone-screenshot-on-slide-35)

## Preparation, 10–15 minutes before students arrive

- Open the PowerPoint. Serve the repository root and open the [practice map](http://localhost:8000/tutorial/first-pin/) and [complete map](http://localhost:8000/application/?data=sample) in separate browser tabs.
- Test the room's internet access to NASA, `js.arcgis.com`, and `services.arcgisonline.com`. The sample replaces the NASA API only. Have a screenshot or printed event list ready if the SDK/CDN is blocked; use the JSON and numeric bounds for a paper query in that case.
- Open `application/?data=sample`. Confirm the archive label and an event's source link. Try all categories and a box containing a known event from the list. Counts can change when the snapshot is refreshed.
- Check that students at the back can read the projected map labels and that the slide 17 QR codes scan. Slides 30–32 link to the image and data sources.
- Choose a regional question familiar to participants. Avoid assuming students have experienced disasters or asking them to share personal experiences.
- Pair students with mixed experience. Offer navigator/analyst roles and accept verbal explanations as evidence of learning.

## Expected answers and discussion prompts

- Panning changes the visible map, not the stored query. Only the explicit category/area selection changes the count.
- Longitude is X/east–west, latitude is Y/north–south; coordinates use longitude first.
- Same snapshot + category + bounds + selection rule should reproduce the same count.
- A point on a rectangle edge is included. A box is not an administrative boundary.
- Storms can move. An earlier point can fall inside a box while the latest point lies outside. The app is explicit about which question it answers.
- EONET contains event metadata and source references. Imagery layers are related services, not image pixels embedded in the event response.
- Sample/live differences reflect scopes and download dates as well as event changes. Do not compare them as a trend.
- Counts can reflect curation and reporting differences. To assess exposure, add suitable event footprints, dated population or assets, validated spatial operations, and subject expertise.

## Practical browser acceptance checks

1. Load live data; verify status, markers, count, and any cap notice. Load sample; confirm the archived label and changed scope.
2. Choose a list item and a marker. Both should show category, observation date, coordinates, and original source links.
3. Choose an available category, record its count, select a box, and clear it. The original category count should return.
4. Apply bounds enclosing a known point, then bounds excluding it. Try a point exactly on a numeric boundary.
5. Enter south > north and verify an explanatory message. Cancel two-click selection with Escape. Try typed antimeridian bounds.
6. Check a narrow/mobile window, keyboard tab order, select inputs, buttons, and list entries. The numeric bounds and event list provide alternatives to precise map clicking.
7. Temporarily block the NASA request in browser developer tools and reload to verify automatic sample fallback. Restore the network afterward. Fully offline loading will not work with this CDN-based SDK.
8. Optional: run `npm test` with Node installed. No packages are required. This checks pure logic, not SDK rendering or external service uptime.

## Instructor recovery exercise without a map

Open the sample JSON in an editor. Choose one event and record its latest valid Point. Ask whether it lies inside West −130, East −60, South 15, North 60. Compare longitude and latitude against the bounds. This teaches the spatial predicate even if classroom internet blocks the SDK. Label this as a contingency activity, not a fully offline application.
