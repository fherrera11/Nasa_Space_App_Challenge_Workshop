# One iceberg in Kotlin

1. In Android Studio choose **Open** and select the **android-iceberg** folder containing [settings.gradle.kts](settings.gradle.kts). Use JDK 17 for Gradle and install Android SDK Platform 36 through **SDK Manager**. The project pins ArcGIS Maps SDK for Kotlin 200.8.0.
2. Let Gradle sync. Select the **app** configuration and an API 28+ emulator or device with hardware-accelerated graphics. Press **Run**.
3. Switch between the two dates. Compare the orange marker and the coordinates to the iOS starter. Open the NASA source link to identify the original record.
4. In [MainActivity.kt](app/src/main/java/org/spaceapps/iceberg/MainActivity.kt), find the two `Observation` values, the WGS 84 Point, the Graphic and the overlay. Change the marker size to see how symbol styling differs from geographic position.

To assemble the debug application from this directory, run `.\gradlew.bat assembleDebug` in Windows PowerShell or `bash gradlew assembleDebug` on macOS/Linux. The included Gradle wrapper downloads version 8.14 on first use. The build resolves its SDK from Esri’s Maven repository. An Android SDK installation is required for this Gradle build.

## Optional native license

Follow the [My Esri steps](../README.md#find-the-esri-native-lite-license). Append the following setting to your existing local `local.properties` beside `settings.gradle.kts`. Preserve any `sdk.dir` value Android Studio generated.

```properties
ARCGIS_LITE_LICENSE=your-200x-lite-string
```

Replace the example value, sync and rebuild. The activity applies the version-matched license through `ArcGISEnvironment` and displays the returned status. Leave the setting absent for developer mode. [Esri Android requirements](https://developers.arcgis.com/kotlin/v200/system-requirements/system-requirements-for-200-8/) · [Apply a license in Kotlin](https://developers.arcgis.com/kotlin/v200/license-and-deployment/use-a-license-in-your-app/)
