// import React from 'react';

// const PropertyInfo = ({ data }) => {
//   if (!data) {
//     return <div>No property data found!</div>;
//   }

//   const cleanFieldName = (field) => {
//     return field
//       .replace(/_/g, ' ')
//       .replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mt-8">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-700">Property Details</h2>

//       {Object.entries(data).map(([key, value]) => (
//         <div key={key} className="mb-4">
//           <strong className="text-gray-600">{cleanFieldName(key)}:</strong>{' '}
//           <span className="text-black">{value !== null ? value : "Not Mentioned"}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PropertyInfo;
import React from 'react';

const PropertyInfo = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-gray-500">No property data found</div>;
  }

  const cleanFieldName = (field) => {
    return field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "Not Mentioned";
    
    // Format boolean values
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    // Format price-related fields
    if (key.includes('price') && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(value);
    }
    
    // Format area
    if (key === 'area' && typeof value === 'number') {
      return `${value.toLocaleString()} sqft`;
    }
    
    return value;
  };

  // Group fields into categories
  const fieldGroups = {
    'Property Information': [
      'property_name',
      'property_type',
      'developer',
      'description'
    ],
    'Location': [
      'country',
      'city',
      'location'
    ],
    'Pricing': [
      'price',
      'average_price_per_sqft',
      'payment_plan',
      'down_payment'
    ],
    'Specifications': [
      'bedrooms',
      'bathroom',
      'area',
      'handover'
    ],
    'Amenities': [
      'has_maid_room',
      'has_air_conditioning',
      'has_balcony_terrace',
      'has_bult_in_wadrobes',
      'has_walk_in_closet',
      'has_parking',
      'has_garden',
      'is_pet_friendly'
    ],
    'Community Facilities': [
      'has_health_care_center',
      'has_kids_play_area',
      'has_laundry',
      'has_sauna',
      'has_spa',
      'has_indoor_pool',
      'has_shared_pool',
      'has_lobby_reception',
      'has_concierge',
      'has_prayer_room',
      'has_tennis_cout',
      'has_running_track',
      'has_outdoor_dining',
      'has_outdoor_gymnasium',
      'has_bbq_area',
      'has_landmark_views'
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">Property Details</h2>
      
      {/* Render description first as full width */}
      {data.description && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-1">Description</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-line">{data.description}</p>
          </div>
        </div>
      )}
      
      {/* Render other fields in groups */}
      {Object.entries(fieldGroups).map(([groupName, fields]) => {
        // Skip description in basic info group since we rendered it separately
        const filteredFields = fields.filter(field => 
          field !== 'description' && data[field] !== undefined
        );
        
        if (filteredFields.length === 0) return null;

        return (
          <div key={groupName} className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-1">{groupName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFields.map((field) => (
                <div key={field} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">{cleanFieldName(field)}</div>
                  <div className="text-gray-800 mt-1 font-medium">
                    {formatValue(field, data[field])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyInfo;