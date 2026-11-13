export function placePin(observation, eventsLayer, Point, Graphic, symbol) {
  const [longitude, latitude] = observation.coordinates;
  // 1. Make a Point from longitude and latitude.
  // 2. Make a Graphic using the point and the supplied symbol.
  // 3. Add the graphic to eventsLayer. Save and refresh your map.
}
