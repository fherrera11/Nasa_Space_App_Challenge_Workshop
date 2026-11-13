# One iceberg in Swift

1. On a Mac with **Xcode 16.4 or newer**, open the [IcebergMap project](IcebergMap.xcodeproj) in Finder, or run `open mobile/ios-iceberg/IcebergMap.xcodeproj` in Terminal from the workshop root. The app targets iOS 17 or later. The project and lockfile pin ArcGIS Maps SDK for Swift 200.8.0.
2. Let Xcode finish downloading the package. Select the **IcebergMap** scheme and an installed **iPhone simulator**, then press **⌘R**. If the device menu has no simulator, download an iOS simulator runtime in Xcode Settings. A simulator build works without a paid Apple developer membership or a deployment license. Keep internet access for the first package download and for the basemap.
3. The opening screen should read **Iceberg A-23A**, **13 March 2026**, **31.79° west, 48.95° south**. Tap **Show 6 March** and look for **33.43° west, 48.60° south**. Tap **Show 13 March** to move the orange marker east again.
4. Open [IcebergView.swift](IcebergMap/IcebergView.swift). Find `Observation`, `Point`, `Graphic` and `GraphicsOverlay`. Try changing the symbol size and run again.

## Put your iPhone screenshot on slide 35

Slide 35 includes a capture of the workshop app running on an iPhone 17 Pro simulator with iOS 26.4. To refresh it, put IcebergMap on screen, choose the date you want to show and close the PowerPoint file. In Terminal at the workshop root, run this command.

```sh
python3 scripts/update_ios_screenshot.py
```

The command calls `xcrun simctl`, saves the portrait PNG at `slides/images/mobile/swift-iceberg.png`, and replaces the image and caption on the Swift slide. To select one of several booted simulators, use `xcrun simctl list devices booted` and pass `--device UDID`. To use a screenshot you saved from Simulator, pass `--image "/path/to/capture.png"`.

Reopen `slides/Where-on-Earth-90-Minutes.pptx`, check slide 35, and choose **File → Export → PDF** in PowerPoint. Save over `slides/Where-on-Earth-90-Minutes.pdf`. [Esri’s original reference image](https://developers.arcgis.com/swift/v200/sample-code/style-graphics-with-symbols/)

## Optional native license

Follow the [My Esri steps](../README.md#find-the-esri-native-lite-license). In the folder containing the Xcode project and `Workshop.xcconfig`, create `Local.xcconfig` with this line, replacing the example value with your version-matched string.

```text
WORKSHOP_ARCGIS_LICENSE = your-200x-lite-string
```

Rebuild. `Workshop.xcconfig` includes the local override and `IcebergMapApp.swift` applies it before creating the map. The file is ignored by Git. Leave it absent for the development exercise. The basemap comes from Esri’s online tiled service. [Esri prerequisites](https://developers.arcgis.com/swift/v200/system-requirements/system-requirements-for-200-8/) · [Apply a license in Swift](https://developers.arcgis.com/swift/v200/license-and-deployment/use-a-license-in-your-app/)
