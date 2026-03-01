import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

const InfoBox = ({ navigate }) => (
  <div className="max-w-3xl mx-auto my-12 text-center">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">

      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-icons text-blue-400 text-5xl">receipt_long</span>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left rounded-r-lg">
        <div className="flex items-center gap-3">
          <span className="material-icons text-yellow-500">info</span>
          <p className="text-yellow-700 font-medium">Make payments to view your receipts / invoice / status here.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/electricity/payments/pay-online')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md"
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
);

export default function App_EReceipts() {
  const navigate = useNavigate();
  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Payments', 'e-Receipts']}>
      <InfoBox navigate={navigate} />
    </GovLayout>
  );
}
