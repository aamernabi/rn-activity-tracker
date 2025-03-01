import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, NativeModules} from 'react-native';
import {
  LatLng,
  LeafletView,
  MapLayerType,
  MapShapeType,
} from 'react-native-leaflet-view';
import {calculateDistanceInMeters} from '../utils/location-utils';

const TrackingModule = NativeModules.TrackingModule;

const MIN_DISTANCE_THRESHOLD = 2;

interface LocationTrackerProps {
  onNewDistance: (distance: number) => void;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({onNewDistance}) => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const attachListener = () => {
      DeviceEventEmitter.addListener('onLocationUpdate', position => {
        const {latitude, longitude} = position;
        setCoordinates(prev => [...prev, {lat: latitude, lng: longitude}]);
        setLocation({lat: latitude, lng: longitude});
      });
    };
    const startTracking = async () => {
      const isServiceRunning = await TrackingModule.isTrackingServiceRunning();
      if (!isServiceRunning) {
        await TrackingModule.startTrackingService();
      }

      DeviceEventEmitter.removeAllListeners('onLocationUpdate');
      attachListener();
    };

    startTracking();

    return () => {};
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
