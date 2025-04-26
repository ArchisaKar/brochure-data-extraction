import React from 'react';

const PropertyInfo = ({ data }) => {
  if (!data) {
    return <div>No property data found!</div>;
  }

  const cleanFieldName = (field) => {
    return field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Property Details</h2>

      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-4">
          <strong className="text-gray-600">{cleanFieldName(key)}:</strong> <text className='text-black-300'> {value !== null ? value : "Not Mentioned"}</text>
        </div>
      ))}
    </div>
  );
};

export default PropertyInfo;
