import React from 'react';

const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin`} />
  );
};

export default Spinner;
