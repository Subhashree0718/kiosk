import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useKioskStore } from '../store/index.js';
import LanguageSelect from '../pages/LanguageSelect.jsx';
import Auth from '../pages/Auth.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import BillPayment from '../pages/BillPayment.jsx';
import ServiceRequest from '../pages/ServiceRequest.jsx';
import ComplaintForm from '../pages/ComplaintForm.jsx';
import StatusTracker from '../pages/StatusTracker.jsx';
import Receipt from '../pages/Receipt.jsx';
import ContactUs from '../pages/ContactUs.jsx';
import DepartmentsPage from '../pages/DepartmentsPage.jsx';
import DepartmentDetail from '../pages/DepartmentDetail.jsx';

function ProtectedRoute({ children }) {
    const { token } = useKioskStore();
    return token ? children : <Navigate to="/login" replace />;
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LanguageSelect />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bill-payment" element={<ProtectedRoute><BillPayment /></ProtectedRoute>} />
            <Route path="/service-request" element={<ProtectedRoute><ServiceRequest /></ProtectedRoute>} />
            <Route path="/complaint" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />
            <Route path="/status" element={<ProtectedRoute><StatusTracker /></ProtectedRoute>} />
            <Route path="/receipt" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:slug" element={<DepartmentDetail />} />
            <Route path="/electricity" element={<DepartmentDetail />} />
            <Route path="/gas" element={<DepartmentDetail />} />
            <Route path="/water" element={<DepartmentDetail />} />
            <Route path="/municipal" element={<DepartmentDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
