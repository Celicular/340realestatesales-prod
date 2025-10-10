import React from 'react';
import DataStructureTest from '../components/debug/DataStructureTest';

const DebugPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Debug - Data Structure Test</h1>
      <DataStructureTest />
    </div>
  );
};

export default DebugPage;