import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_EnterGrievance() {
  const navigate = useNavigate();

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Tracking', 'Enter Grievance']}>
      <div className="max-w-3xl mx-auto my-12 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-red-500 text-5xl">report_problem</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Grievance</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left rounded-r-lg">
            <div className="flex items-center gap-3">
              <span className="material-icons text-yellow-500">info</span>
              <p className="text-yellow-700 font-medium">Complete an application and submit to view your application status here.</p>
            </div>
          </div>
          <button onClick={() => navigate('/electricity/lt-application-tracking')} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
            Back to Menu
          </button>
        </div>
      </div>
    </GovLayout>
  );
}
