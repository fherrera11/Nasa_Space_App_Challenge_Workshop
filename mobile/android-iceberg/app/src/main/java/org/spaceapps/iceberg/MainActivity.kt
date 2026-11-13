package org.spaceapps.iceberg

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.ComponentActivity
import com.arcgismaps.ArcGISEnvironment
import com.arcgismaps.Color
import com.arcgismaps.LicenseKey
import com.arcgismaps.geometry.Point
import com.arcgismaps.geometry.SpatialReference
import com.arcgismaps.mapping.ArcGISMap
import com.arcgismaps.mapping.Basemap
import com.arcgismaps.mapping.Viewpoint
import com.arcgismaps.mapping.layers.ArcGISTiledLayer
import com.arcgismaps.mapping.symbology.SimpleMarkerSymbol
import com.arcgismaps.mapping.symbology.SimpleMarkerSymbolStyle
import com.arcgismaps.mapping.view.Graphic
import com.arcgismaps.mapping.view.GraphicsOverlay
import com.arcgismaps.mapping.view.MapView

private data class Observation(val date: String, val longitude: Double, val latitude: Double)
private val march6 = Observation("6 March 2026", -33.43, -48.60)
private val march13 = Observation("13 March 2026", -31.79, -48.95)
private const val tileService = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"

// Native licensing applies to the process. A new Activity after rotation reuses this result.
private val licenseStatus: String by lazy {
    if (BuildConfig.LITE_LICENSE.isBlank()) return@lazy "Developer mode"
    val key = LicenseKey.create(BuildConfig.LITE_LICENSE) ?: return@lazy "Check the 200.x Lite string"
    val result = runCatching { ArcGISEnvironment.setLicense(key) }.getOrNull()
    result?.let { "License status · ${it.licenseStatus}" } ?: "Check the 200.x Lite string"
}

class MainActivity : ComponentActivity() {
    private var showingLatest = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ArcGISEnvironment.applicationContext = applicationContext
        val licenseLabel = licenseStatus
        showingLatest = savedInstanceState?.getBoolean("latest", true) ?: true
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            val inset = (16 * resources.displayMetrics.density).toInt()
            setPadding(inset, inset, inset, inset)
            fitsSystemWindows = true
        }
        layout.addView(TextView(this).apply { text = "Iceberg A-23A"; textSize = 27f })
        val detail = TextView(this).apply { textSize = 17f }
        layout.addView(detail)
        val overlay = GraphicsOverlay()
        val view = MapView(this)
        lifecycle.addObserver(view)
        view.map = ArcGISMap(Basemap(ArcGISTiledLayer(tileService)))
        view.setViewpoint(Viewpoint(-48.8, -32.6, 4_000_000.0))
        view.graphicsOverlays.add(overlay)
        layout.addView(view, LinearLayout.LayoutParams(MATCH_PARENT, 0, 1f))
        val toggle = Button(this)
        layout.addView(toggle)
        fun drawObservation() {
            val observation = if (showingLatest) march13 else march6
            val point = Point(observation.longitude, observation.latitude, SpatialReference.wgs84())
            val symbol = SimpleMarkerSymbol(SimpleMarkerSymbolStyle.Circle, Color.fromRgba(220, 85, 28, 255), 14f)
            overlay.graphics.clear()
            overlay.graphics.add(Graphic(point, symbol))
            detail.text = "Archived EONET · ${observation.date}\n${-observation.longitude}° west, ${-observation.latitude}° south"
            toggle.text = if (showingLatest) "Show 6 March" else "Show 13 March"
        }
        toggle.setOnClickListener { showingLatest = !showingLatest; drawObservation() }
        layout.addView(Button(this).apply {
            text = "NASA event record"
            setOnClickListener { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://eonet.gsfc.nasa.gov/api/v3/events/EONET_2734"))) }
        })
        layout.addView(TextView(this).apply { text = licenseLabel })
        setContentView(layout)
        drawObservation()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putBoolean("latest", showingLatest)
        super.onSaveInstanceState(outState)
    }
}
