import React from 'react';

const SectionTitle = ({
  title,
  subtitle,
  center = false,
  className = '',
}) => {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
