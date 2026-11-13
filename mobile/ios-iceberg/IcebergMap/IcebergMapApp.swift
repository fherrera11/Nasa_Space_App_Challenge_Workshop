import SwiftUI
import ArcGIS

@main
struct IcebergMapApp: App {
    private let licenseMessage: String

    init() {
        let text = Bundle.main.object(forInfoDictionaryKey: "WorkshopArcGISLicense") as? String ?? ""
        if text.isEmpty {
            licenseMessage = "Developer mode"
        } else if let key = LicenseKey(text) {
            do {
                let result = try ArcGISEnvironment.setLicense(with: key)
                licenseMessage = "License status · \(result.licenseStatus)"
            } catch {
                licenseMessage = "License was not accepted. Check the 200.x Lite string."
            }
        } else {
            licenseMessage = "License format not recognized. Check the 200.x Lite string."
        }
    }

    var body: some Scene {
        WindowGroup { IcebergView(licenseMessage: licenseMessage) }
    }
}
