import React from 'react';
import ErrorView from './ErrorView';

const NoInternetView = () => {
  return (
    <ErrorView
      title="No Internet Connection"
      message="Please check your connection and try again."
    />
  );
};

export default NoInternetView;
