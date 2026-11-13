import SwiftUI
import ArcGIS

private struct Observation {
    let date: String
    let longitude: Double
    let latitude: Double

    // Two dated points from the workshop copy of EONET_2734, in UTC.
    static let march6 = Observation(date: "6 March 2026", longitude: -33.43, latitude: -48.60)
    static let march13 = Observation(date: "13 March 2026", longitude: -31.79, latitude: -48.95)
}

@MainActor
private final class IcebergModel: ObservableObject {
    let map: ArcGIS.Map
    let overlay = GraphicsOverlay()
    @Published private(set) var showingLatest = true

    var observation: Observation { showingLatest ? .march13 : .march6 }

    init() {
        let url = URL(string: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer")!
        map = ArcGIS.Map(basemap: Basemap(baseLayer: ArcGISTiledLayer(url: url)))
        map.initialViewpoint = Viewpoint(latitude: -48.8, longitude: -32.6, scale: 4_000_000)
        drawObservation()
    }

    func switchDate() {
        showingLatest.toggle()
        drawObservation()
    }

    private func drawObservation() {
        let point = Point(x: observation.longitude, y: observation.latitude, spatialReference: .wgs84)
        let symbol = SimpleMarkerSymbol(style: .circle, color: .systemOrange, size: 14)
        overlay.removeAllGraphics()
        overlay.addGraphic(Graphic(geometry: point, symbol: symbol))
    }
}

struct IcebergView: View {
    let licenseMessage: String
    @StateObject private var model = IcebergModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Iceberg A-23A").font(.largeTitle.bold())
            Text("Archived EONET observation · " + model.observation.date)
            MapView(map: model.map, graphicsOverlays: [model.overlay])
                .accessibilityLabel("South Atlantic map with one dated iceberg location")
            Text(String(format: "%.2f° west, %.2f° south", -model.observation.longitude, -model.observation.latitude))
                .monospacedDigit()
            Button(model.showingLatest ? "Show 6 March" : "Show 13 March") { model.switchDate() }
                .buttonStyle(.borderedProminent)
            HStack {
                Link("NASA event record", destination: URL(string: "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_2734")!)
                Spacer()
                Text(licenseMessage).font(.caption)
            }
        }
        .padding()
    }
}
