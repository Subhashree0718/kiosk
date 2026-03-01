import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_PayOnline() {
  const navigate = useNavigate();

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Payments', 'Quick Pay']}>
      <div className="max-w-3xl mx-auto my-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">

          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-green-500 text-5xl">check_circle</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">Quick Pay</h2>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 inline-flex items-center gap-3 mb-8">
            <span className="material-icons text-green-600 text-3xl">payments</span>
            <p className="text-green-800 font-semibold text-lg">No pending payments at this time.</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/electricity/payments')}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Back to Payments
            </button>
          </div>

        </div>
      </div>
    </GovLayout>
  );
}
