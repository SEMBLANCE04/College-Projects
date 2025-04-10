import React from 'react';

const Loader = ({ fullScreen, size = 'default', color = 'primary' }) => {
  const getLoaderSize = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4 border-2';
      case 'large':
        return 'w-12 h-12 border-4';
      default:
        return 'w-8 h-8 border-3';
    }
  };

  const getLoaderColor = () => {
    switch (color) {
      case 'white':
        return 'border-white border-t-transparent';
      case 'secondary':
        return 'border-secondary-500 border-t-transparent';
      case 'accent':
        return 'border-accent-500 border-t-transparent';
      default:
        return 'border-primary-500 border-t-transparent';
    }
  };

  const loaderClasses = `${getLoaderSize()} ${getLoaderColor()} rounded-full animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className={loaderClasses}></div>
      </div>
    );
  }

  return <div className={loaderClasses}></div>;
};

export default Loader;
