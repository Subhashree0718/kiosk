import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_EInvoice() {
  const navigate = useNavigate();

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Payments', 'e-Invoice']}>
      <div className="max-w-3xl mx-auto my-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">

          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-purple-400 text-5xl">description</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">e-Invoice Download</h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left rounded-r-lg">
            <div className="flex items-center gap-3">
              <span className="material-icons text-yellow-500">info</span>
              <p className="text-yellow-700 font-medium">Make payments to view your receipts / invoice / status here.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/electricity/payments/pay-online')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Go to Quick Pay
            </button>
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
