"use client";
import { useState, useRef } from 'react';

// Simple SVG icons as components
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function PropertyUploader({ setLoading, setError, onUploadSuccess }) {
  const [brochureFile, setBrochureFile] = useState(null);
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [dragActive, setDragActive] = useState({ brochure: false, floorPlan: false });
  
  const brochureInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0], type);
    }
  };

  const handleFileChange = (file, type) => {
    if (type === 'brochure') {
      setBrochureFile(file);
    } else {
      setFloorPlanFile(file);
    }
  };

  const onButtonClick = (inputRef) => {
    inputRef.current.click();
  };

  const removeFile = (type) => {
    if (type === 'brochure') {
      setBrochureFile(null);
    } else {
      setFloorPlanFile(null);
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Upload Property Documents</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          {/* Brochure Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Property Brochure <span className="text-red-500">*</span>
            </label>
            <div 
              className={`relative border-2 ${dragActive.brochure ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'} 
                          rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50`}
              onDragEnter={(e) => handleDrag(e, 'brochure')}
              onDragLeave={(e) => handleDrag(e, 'brochure')}
              onDragOver={(e) => handleDrag(e, 'brochure')}
              onDrop={(e) => handleDrop(e, 'brochure')}
              onClick={() => onButtonClick(brochureInputRef)}
            >
              <input
                ref={brochureInputRef}
                type="file"
                onChange={(e) => handleFileChange(e.target.files[0], 'brochure')}
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />
              
              {brochureFile ? (
                <div className="w-full">
                  <div className="flex items-center p-2 bg-blue-50 rounded-md">
                    <span className="text-blue-600 mr-2">
                      <FileIcon />
                    </span>
                    <div className="flex-grow truncate text-sm text-black">
                      {brochureFile.name}
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile('brochure');
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <XIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-blue-500 mb-2">
                    <UploadIcon />
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Drag & drop your brochure here or <span className="text-blue-500 font-medium">browse files</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOCX, JPG, PNG (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Floor Plan Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Floor Plan <span className="text-red-500">*</span>
            </label>
            <div 
              className={`relative border-2 ${dragActive.floorPlan ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'} 
                          rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50`}
              onDragEnter={(e) => handleDrag(e, 'floorPlan')}
              onDragLeave={(e) => handleDrag(e, 'floorPlan')}
              onDragOver={(e) => handleDrag(e, 'floorPlan')}
              onDrop={(e) => handleDrop(e, 'floorPlan')}
              onClick={() => onButtonClick(floorPlanInputRef)}
            >
              <input
                ref={floorPlanInputRef}
                type="file"
                onChange={(e) => handleFileChange(e.target.files[0], 'floorPlan')}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              
              {floorPlanFile ? (
                <div className="w-full">
                  <div className="flex items-center p-2 bg-blue-50 rounded-md">
                    <span className="text-blue-600 mr-2">
                      <FileIcon />
                    </span>
                    <div className="flex-grow truncate text-sm text-black">
                      {floorPlanFile.name}
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile('floorPlan');
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <XIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-blue-500 mb-2">
                    <UploadIcon />
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Drag & drop your floor plan here or <span className="text-blue-500 font-medium">browse files</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="mr-2">
              <UploadIcon />
            </span>
            Analyze Property
          </button>
        </div>
      </form>
    </div>
  );
}