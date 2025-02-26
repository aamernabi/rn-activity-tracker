import {LatLng} from 'react-native-leaflet-view';

const calculateDistance = (prev: LatLng, current: LatLng) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(current.latitude - prev.latitude);
  const dLon = toRad(current.longitude - prev.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(prev.latitude)) *
      Math.cos(toRad(current.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateDistanceInMeters = (start: LatLng, end: LatLng): number => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRadians(end.lat - start.lat);
  const dLon = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export {calculateDistance, calculateDistanceInMeters};
