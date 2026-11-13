import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const relay = (process.env.EXPO_PUBLIC_PLACES_BASE_URL || '').replace(/\/$/, '');
const demoPlaces = [{ name: 'Example North Library' }, { name: 'Example South Library' }];

export default function App() {
  const [places, setPlaces] = useState(demoPlaces);
  const [mode, setMode] = useState('sample');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function findLibraries() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(relay + '/nearby', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Search failed.');
      setPlaces(result.places);
      setMode('live');
    } catch (failure) {
      setError(failure.message + ' Check the relay address and its terminal.');
    } finally {
      setBusy(false);
    }
  }

  function showSample() {
    setPlaces(demoPlaces);
    setMode('sample');
    setError('');
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Where is the nearest library?</Text>
      <Text style={styles.body}>Search within 1.5 km of San Francisco City Hall. A circle measures straight-line proximity.</Text>
      <Text style={styles.label}>{mode === 'sample' ? 'Practice list · fictional places' : 'Live library results · Google Maps'}</Text>
      <View style={styles.list}>
        {places.length === 0 && <Text>No libraries were returned in this search.</Text>}
        {places.map((place, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.place}>{place.name}</Text>
            {place.mapsUri && <Text accessibilityRole="link" style={styles.link} onPress={() => Linking.openURL(place.mapsUri)}>Open in Google Maps</Text>}
            {(place.attributions || []).map((credit, i) => credit.providerUri
              ? <Text key={i} style={styles.link} accessibilityRole="link" onPress={() => Linking.openURL(credit.providerUri)}>{credit.provider || 'Data provider'}</Text>
              : <Text key={i}>{credit.provider}</Text>)}
          </View>
        ))}
        {mode === 'live' && <Image source={require('./assets/google-maps.png')} accessibilityLabel="Google Maps" style={{ width: 98, height: 18, marginTop: 12 }} />}
      </View>
      {relay ? <Pressable accessibilityRole="button" disabled={busy} style={styles.button} onPress={findLibraries}>
        <Text style={styles.buttonText}>{busy ? 'Searching…' : 'Search Google Places'}</Text>
      </Pressable> : <Text style={styles.body}>For a live search, connect the local relay using the project README.</Text>}
      {mode === 'live' && <Pressable accessibilityRole="button" disabled={busy} onPress={showSample}><Text style={styles.link}>Show practice list</Text></Pressable>}
      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 24, paddingTop: 62, paddingBottom: 40, backgroundColor: '#fff', flexGrow: 1, gap: 14 },
  title: { color: '#123a3e', fontSize: 33, fontWeight: '700' },
  body: { color: '#33494a', fontSize: 17, lineHeight: 25 },
  label: { color: '#12645d', fontSize: 16, fontWeight: '600', marginTop: 10 },
  list: { padding: 16, borderWidth: 1, borderColor: '#c4d4cf', borderRadius: 8 },
  row: { paddingVertical: 9, gap: 5 },
  place: { fontSize: 19, fontWeight: '600' },
  button: { alignSelf: 'flex-start', backgroundColor: '#11685b', padding: 13, borderRadius: 6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#145c7b', textDecorationLine: 'underline', paddingVertical: 3 },
  error: { color: '#8f301e', fontSize: 15 }
});
