import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_ApplicationStatus() {
  const navigate = useNavigate();

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Tracking', 'Application Status']}>
      <div className="max-w-3xl mx-auto my-12 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">

          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-blue-500 text-5xl">manage_search</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Status</h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left rounded-r-lg">
            <div className="flex items-center gap-3">
              <span className="material-icons text-yellow-500">info</span>
              <p className="text-yellow-700 font-medium">Complete an application and submit to view your application status here.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/electricity/new-service-connection')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">
              Start New Application
            </button>
            <button onClick={() => navigate('/electricity/lt-application-tracking')} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
              Back to Tracking Menu
            </button>
          </div>

        </div>
      </div>
    </GovLayout>
  );
}
