# Nearby libraries with React Native

This Expo app opens with two fictional records. The optional live search looks up as many as five libraries within 1,500 metres of San Francisco City Hall, ranked by distance. The question is about straight-line proximity. A walking route would require a network dataset.

## Open the practice app

1. Install Node.js 22.13+ or 24.3+ and a compatible Expo Go client. Open a terminal in `mobile/places-expo`.
2. Run `npm ci`, then `npm start`. Scan Expo’s development QR with a compatible device on your network, or use the offered Android emulator or iOS simulator. The iOS simulator runs on macOS.
3. Look for **Practice list · fictional places**. This path requires no account, credential or billable API call. The Expo development QR opens your running app and is separate from the classroom repository QR on slide 17.

## Optional live Google Places search

Enable **Places API (New)** in a Google Cloud project with billing enabled and create a restricted key permitted to call that API. A field mask affects the billed SKU. Keep the key in the relay terminal. The client only needs the relay URL. [Google Cloud setup and billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing) · [Google API key guidance](https://developers.google.com/maps/api-security-best-practices)

1. Open a second terminal in this folder. Set `GOOGLE_PLACES_API_KEY` in the relay process environment, then run `npm run relay`. On PowerShell use `$env:GOOGLE_PLACES_API_KEY = 'your-key'`. On macOS/Linux use `export GOOGLE_PLACES_API_KEY='your-key'`. The default listener is `127.0.0.1:4100`.
2. Stop Expo and set `EXPO_PUBLIC_PLACES_BASE_URL` in its terminal. Use `http://127.0.0.1:4100` for an iOS simulator or `http://10.0.2.2:4100` for the standard Android emulator. For example, on PowerShell use `$env:EXPO_PUBLIC_PLACES_BASE_URL = 'http://10.0.2.2:4100'`. On macOS/Linux use `export EXPO_PUBLIC_PLACES_BASE_URL='http://127.0.0.1:4100'`. Run `npm start` again and reload the app.
3. Tap **Search Google Places**. The app labels the live results, displays the Google Maps logo and any supplied third-party attribution, and offers **Open in Google Maps**. An empty response is a valid result. **Show practice list** restores the fictional examples.
4. For a physical device, use a trusted classroom network. Set `PLACES_BIND_HOST` to the computer’s LAN address before starting the relay, then set the Expo URL to that address and port. If a device blocks local HTTP or LAN access, use the emulator or an instructor-managed HTTPS endpoint. Stop the local relay after the demo. This fixed-query classroom relay is intended for local use.

[App.js](App.js) displays the results. [relay.mjs](relay.mjs) sends a POST request to Nearby Search with a fixed center, type, radius and field mask. Try changing the radius on the relay, then restarting it. Compare distance ranking with travel time. Google Places content and its attribution are kept together in a list separate from the Esri demos. The logo is an unmodified Google Maps attribution asset. [Google Nearby Search](https://developers.google.com/maps/documentation/places/web-service/nearby-search) · [Google Maps attribution](https://developers.google.com/maps/documentation/places/web-service/policies) · [Expo SDK reference](https://docs.expo.dev/versions/latest/)
