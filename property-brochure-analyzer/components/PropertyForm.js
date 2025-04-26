"use client";
import { useState } from 'react';

export default function PropertyUploader({ setLoading, setError, onUploadSuccess }) {
  const [brochureFile, setBrochureFile] = useState(null);
  const [floorPlanFile, setFloorPlanFile] = useState(null);

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrochureFile(file);
    }
  };

  const handleFloorPlanChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFloorPlanFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!brochureFile) {
      setError("Please upload a property brochure");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('brochure', brochureFile);
    
    if (floorPlanFile) {
      formData.append('floor_plan', floorPlanFile);
    }
    
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      onUploadSuccess(data);
    } catch (error) {
      setError(`Error processing files: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-500 pl-[35%]">Upload Property Documents</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Property Brochure (Required)
          </label>
          <div className="border border-dashed border-gray-400 p-4 rounded">
            <input
              type="file"
              onChange={handleBrochureChange}
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Accept PDF, DOCX, or image files
            </p>
          </div>
          {brochureFile && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {brochureFile.name}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Floor Plan (Optional)
          </label>
          <div className="border border-dashed border-gray-400 p-4 rounded">
            <input
              type="file"
              onChange={handleFloorPlanChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Accept PDF or image files
            </p>
          </div>
          {floorPlanFile && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {floorPlanFile.name}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Analyze Property
        </button>
      </form>
    </div>
  );
}