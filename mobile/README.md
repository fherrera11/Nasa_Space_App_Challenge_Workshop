# Three mobile introductions

The final 15 minutes of the workshop show the same dated iceberg point on two native maps, then a search for libraries close to a chosen point. For a classroom demo, resolve the native and Expo dependencies before participants arrive. The web lab and the archived data need no mobile installation.

| Starter | Open | Try this |
| --- | --- | --- |
| [Swift for iOS](ios-iceberg/README.md) | `ios-iceberg/IcebergMap.xcodeproj` in Xcode on a Mac | Toggle between 6 and 13 March. Is the later observation farther east? |
| [Kotlin for Android](android-iceberg/README.md) | `android-iceberg/` in Android Studio | Choose the same date and compare both native markers. |
| [React Native with Expo](places-expo/README.md) | `places-expo/` in a terminal | Open a fictional practice list, or connect the optional Google Places relay for a live radius search. |

## Find the Esri native Lite license

1. Sign in to [My Esri](https://my.esri.com/) in your browser and open your account menu.
2. Choose **Profile & Settings** and the **Overview** tab.
3. Locate **ArcGIS Maps SDKs for Native Apps License Strings** and choose **View license strings**.
4. Copy the Lite string for the native SDK version you are deploying. Both starters pin **200.8.0**. Choose the upper row marked **Runtime Lite (100.x/200.x)**. The platform guides give the exact local setting.
5. Rebuild the app to pick up the setting. It shows the license result near the source link. The navigational names follow Esri’s current instructions. [Esri’s walkthrough and account requirements](https://developers.arcgis.com/kotlin/v200/license-and-deployment/get-a-license/)

During development the native starters run without a deployment string. The label or watermark can indicate developer use. A Lite production license covers specific native capabilities. ArcGIS online service authentication and possible service charges are separate. Both starters use Esri’s publicly accessible tiled World Topographic Map service and retain the SDK attribution. Internet is needed for the tiles. The two sample positions are stored in the source so they stay tied to the same archive.

To project the steps without displaying your account, use **slide 34** or open the full-size [account menu](../slides/images/mobile/esri-profile-menu.png), [Overview tab](../slides/images/mobile/esri-overview.png) and [masked license viewer](../slides/images/mobile/esri-lite-license.png). The [image credits and app captures](../slides/images/mobile/README.md) accompany slides 34–37.

## Data used by both native projects

| UTC date | Longitude | Latitude |
| --- | ---: | ---: |
| 6 March 2026 | −33.43° | −48.60° |
| 13 March 2026 | −31.79° | −48.95° |

Both are Point observations in `EONET_2734` from the [class archive](../sample-data/eonet-snapshot.json). The button replaces the visible graphic. The shift between the points describes a change in the recorded position over that week. The GeoJSON example retains the later point. [NASA event record](https://eonet.gsfc.nasa.gov/api/v3/events/EONET_2734) · [Esri Swift 200.x](https://developers.arcgis.com/swift/v200/) · [Esri Kotlin 200.x](https://developers.arcgis.com/kotlin/v200/)
