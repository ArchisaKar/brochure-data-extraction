"use client";
import { useState } from 'react';
import Head from 'next/head';
import PropertyUploader from '../../components/PropertyForm';
import PropertyInfo from '../../components/PropertyInfo';

export default function Home() {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (data) => {
    setPropertyData(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Property Analyzer</title>
        <meta name="description" content="Upload and analyze property brochures and floor plans" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-500">Property Analyzer</h1>
        
        <div className="max-w-4xl mx-auto">
          <PropertyUploader 
            setLoading={setLoading} 
            setError={setError}
            onUploadSuccess={handleUploadSuccess}
          />

          {loading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2">Analyzing your documents...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4">
              <p>{error}</p>
            </div>
          )}

          {/* 🆕 Render PropertyInfo if data is available */}
          {propertyData && !loading && !error && (
            <PropertyInfo data={propertyData} />
          )}
        </div>
      </main>
    </div>
  );
}
