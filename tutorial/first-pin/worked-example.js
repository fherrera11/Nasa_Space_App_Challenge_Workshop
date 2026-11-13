export function placePin(observation, eventsLayer, Point, Graphic, symbol) {
  const [longitude, latitude] = observation.coordinates;
  const point = new Point({ longitude, latitude });
  const pin = new Graphic({ geometry: point, symbol });
  eventsLayer.add(pin);
}
