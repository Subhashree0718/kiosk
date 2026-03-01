import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_SolarGroundMounted() {
  const navigate = useNavigate();

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'Ground Mounted']}>
      <div className="max-w-3xl mx-auto my-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">

          <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-yellow-500 text-5xl">landscape</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Online Solar – Ground Mounted</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 inline-flex items-start gap-3 mb-8 text-left max-w-lg">
            <span className="material-icons text-blue-500 mt-0.5">open_in_new</span>
            <div>
              <p className="text-blue-800 font-semibold">This service is handled via the National Portal.</p>
              <p className="text-blue-600 text-sm mt-1">Ground-mounted solar applications are processed through the Ministry of New and Renewable Energy (MNRE) national portal.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://solarrooftop.gov.in" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2">
              Visit National Portal <span className="material-icons text-sm">open_in_new</span>
            </a>
            <button onClick={() => navigate('/electricity/solar-service-connections')} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
              Back to Solar Services
            </button>
          </div>

        </div>
      </div>
    </GovLayout>
  );
}
