import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val local = Properties()
val settingsFile = rootProject.file("local.properties")
if (settingsFile.isFile) settingsFile.inputStream().use { local.load(it) }
val license = local.getProperty("ARCGIS_LITE_LICENSE", "").replace("\\", "\\\\").replace("\"", "\\\"")

android {
    namespace = "org.spaceapps.iceberg"
    compileSdk = 36

    defaultConfig {
        applicationId = "org.spaceapps.iceberg"
        minSdk = 28
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
        buildConfigField("String", "LITE_LICENSE", "\"$license\"")
    }
    buildFeatures { buildConfig = true }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("com.esri:arcgis-maps-kotlin:200.8.0")
    implementation("androidx.activity:activity-ktx:1.10.1")
}
