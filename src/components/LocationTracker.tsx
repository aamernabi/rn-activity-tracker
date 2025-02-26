import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  LatLng,
  LeafletView,
  MapLayerType,
  MapShapeType,
} from 'react-native-leaflet-view';
import {calculateDistanceInMeters} from '../utils/location-utils';

const MIN_DISTANCE_THRESHOLD = 2;

interface LocationTrackerProps {
  onNewDistance: (distance: number) => void;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({onNewDistance}) => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    let watchId: number | null = null;

    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    const startTracking = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission denied');
        return;
      }

      watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCoordinates(prev => [...prev, {lat: latitude, lng: longitude}]);
          setLocation({lat: latitude, lng: longitude});
        },
        error => console.log(error),
        {enableHighAccuracy: true, distanceFilter: 1, interval: 5000},
      );
    };

    startTracking();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    if (coordinates.length > 1) {
      const lastIndex = coordinates.length - 1;
      const distance = calculateDistanceInMeters(
        coordinates[lastIndex - 1],
        coordinates[lastIndex],
      );
      if (distance >= MIN_DISTANCE_THRESHOLD) {
        setTotalDistance(prevDistance => prevDistance + distance);
      }
    }
  }, [coordinates]);

  useEffect(() => onNewDistance(totalDistance), [totalDistance, onNewDistance]);

  return (
    <LeafletView
      mapCenterPosition={location}
      zoom={15}
      mapLayers={[
        {
          baseLayer: true,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          layerType: MapLayerType.TILE_LAYER,
        },
      ]}
      mapMarkers={
        coordinates.length > 0
          ? [
              {
                id: 'currentLocation',
                position: coordinates[coordinates.length - 1],
                icon: '📍',
              },
            ]
          : []
      }
      mapShapes={[
        {
          id: 'route',
          positions: coordinates,
          shapeType: MapShapeType.POLYLINE,
          color: 'green',
        },
      ]}
    />
  );
};

export default LocationTracker;
