import {useCallback, useState} from 'react';

const useDistanceTracker = () => {
  const [distance, setDistance] = useState(0);

  const handleNewDistance = useCallback(
    (newDistance: number) => setDistance(prev => prev + newDistance),
    [],
  );

  return {distance, handleNewDistance};
};

export default useDistanceTracker;
