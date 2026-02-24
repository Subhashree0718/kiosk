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
import WaterDepartment from '../pages/WaterDepartment.jsx';
import WaterComplaints from '../pages/WaterComplaints.jsx';
import WaterTaxCharges from '../pages/WaterTaxCharges.jsx';
import WaterNewConnection from '../pages/WaterNewConnection.jsx';

// ── Electricity Department Portal ────────────────────────────────────────────
import ElectricityDepartment from '../pages/ElectricityDepartment.jsx';

// Category pages
import NewServiceConnection from '../pages/electricity/NewServiceConnection.jsx';
import ShiftingOfServices from '../pages/electricity/ShiftingOfServices.jsx';
import ExistingServices from '../pages/electricity/ExistingServices.jsx';
import LTApplicationTracking from '../pages/electricity/LTApplicationTracking.jsx';
import SolarServiceConnections from '../pages/electricity/SolarServiceConnections.jsx';
import LTSolarServiceTracking from '../pages/electricity/LTSolarServiceTracking.jsx';
import ServicesAndComplaints from '../pages/electricity/ServicesAndComplaints.jsx';
import Payments from '../pages/electricity/Payments.jsx';

// New Service Connection – sub-service app pages
import App_LTServiceConnection from '../pages/electricity/apps/App_LTServiceConnection.jsx';
import App_LTTemporaryConnection from '../pages/electricity/apps/App_LTTemporaryConnection.jsx';
import App_AgricultureLT from '../pages/electricity/apps/App_AgricultureLT.jsx';
import App_LTGroupConnection from '../pages/electricity/apps/App_LTGroupConnection.jsx';
import App_LTOneDayScheme from '../pages/electricity/apps/App_LTOneDayScheme.jsx';
import App_LTRefund from '../pages/electricity/apps/App_LTRefund.jsx';

// Shifting of Services – sub-service app pages
import App_ShiftingGeneralPublic from '../pages/electricity/apps/App_ShiftingGeneralPublic.jsx';
import App_ShiftingGovtOrg from '../pages/electricity/apps/App_ShiftingGovtOrg.jsx';
import App_ShiftingMeters from '../pages/electricity/apps/App_ShiftingMeters.jsx';

// Existing Services – sub-service app pages
import App_TariffChange from '../pages/electricity/apps/App_TariffChange.jsx';
import App_TariffConversion from '../pages/electricity/apps/App_TariffConversion.jsx';
import App_NameTransfer from '../pages/electricity/apps/App_NameTransfer.jsx';
import App_AdditionalLoad from '../pages/electricity/apps/App_AdditionalLoad.jsx';
import App_ReductionOfLoad from '../pages/electricity/apps/App_ReductionOfLoad.jsx';
import App_DynamicReduction from '../pages/electricity/apps/App_DynamicReduction.jsx';

// LT Application Tracking – sub-service app pages
import App_CalculateCharges from '../pages/electricity/apps/App_CalculateCharges.jsx';
import App_ApplicationStatus from '../pages/electricity/apps/App_ApplicationStatus.jsx';
import App_ModifyApplication from '../pages/electricity/apps/App_ModifyApplication.jsx';
import App_EnterGrievance from '../pages/electricity/apps/App_EnterGrievance.jsx';
import App_GrievanceStatus from '../pages/electricity/apps/App_GrievanceStatus.jsx';
import App_GiveFeedback from '../pages/electricity/apps/App_GiveFeedback.jsx';

// Solar Service Connections – sub-service app pages
import App_NationalSolarRooftop from '../pages/electricity/apps/App_NationalSolarRooftop.jsx';
import App_LTSolarServiceConnection from '../pages/electricity/apps/App_LTSolarServiceConnection.jsx';
import App_LTSolarConsumerReadiness from '../pages/electricity/apps/App_LTSolarConsumerReadiness.jsx';
import App_LTSolarAdditionalLoad from '../pages/electricity/apps/App_LTSolarAdditionalLoad.jsx';
import App_LTSolarSchemeChange from '../pages/electricity/apps/App_LTSolarSchemeChange.jsx';
import App_LTSolarToNormal from '../pages/electricity/apps/App_LTSolarToNormal.jsx';
import App_SolarGroundMounted from '../pages/electricity/apps/App_SolarGroundMounted.jsx';

// LT Solar Service Tracking – sub-service app pages
import App_SolarApplicationStatus from '../pages/electricity/apps/App_SolarApplicationStatus.jsx';
import App_SolarModifyApplication from '../pages/electricity/apps/App_SolarModifyApplication.jsx';

// Services & Complaints – sub-service app pages
import App_AadhaarLink from '../pages/electricity/apps/App_AadhaarLink.jsx';
import App_ScheduledPowerShutdown from '../pages/electricity/apps/App_ScheduledPowerShutdown.jsx';
import App_MobileEmailUpdation from '../pages/electricity/apps/App_MobileEmailUpdation.jsx';
import App_GSTUpdation from '../pages/electricity/apps/App_GSTUpdation.jsx';
import App_ConsumerComplaints from '../pages/electricity/apps/App_ConsumerComplaints.jsx';
import App_MisuseOfElectricity from '../pages/electricity/apps/App_MisuseOfElectricity.jsx';

// Payments – sub-service app pages
import App_PayOnline from '../pages/electricity/apps/App_PayOnline.jsx';
import App_EReceipts from '../pages/electricity/apps/App_EReceipts.jsx';
import App_EInvoice from '../pages/electricity/apps/App_EInvoice.jsx';
import App_BillStatus from '../pages/electricity/apps/App_BillStatus.jsx';

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
            <Route path="/gas" element={<DepartmentDetail />} />
            <Route path="/municipal" element={<DepartmentDetail />} />

            {/* ── Water Department Portal ──────────────────────────────── */}
            <Route path="/water" element={<WaterDepartment />} />
            <Route path="/water/complaints" element={<WaterComplaints />} />
            <Route path="/water/tax" element={<WaterTaxCharges />} />
            <Route path="/water/new-connection" element={<WaterNewConnection />} />

            {/* ── Electricity Department Portal ────────────────────────── */}
            <Route path="/electricity" element={<ElectricityDepartment />} />

            {/* Category pages */}
            <Route path="/electricity/new-service-connection" element={<NewServiceConnection />} />
            <Route path="/electricity/shifting-of-services" element={<ShiftingOfServices />} />
            <Route path="/electricity/existing-services" element={<ExistingServices />} />
            <Route path="/electricity/lt-application-tracking" element={<LTApplicationTracking />} />
            <Route path="/electricity/solar-service-connections" element={<SolarServiceConnections />} />
            <Route path="/electricity/lt-solar-service-tracking" element={<LTSolarServiceTracking />} />
            <Route path="/electricity/services-and-complaints" element={<ServicesAndComplaints />} />
            <Route path="/electricity/payments" element={<Payments />} />

            {/* New Service Connection */}
            <Route path="/electricity/new-service-connection/lt-service" element={<App_LTServiceConnection />} />
            <Route path="/electricity/new-service-connection/lt-temporary" element={<App_LTTemporaryConnection />} />
            <Route path="/electricity/new-service-connection/agriculture-lt" element={<App_AgricultureLT />} />
            <Route path="/electricity/new-service-connection/lt-group" element={<App_LTGroupConnection />} />
            <Route path="/electricity/new-service-connection/lt-one-day" element={<App_LTOneDayScheme />} />
            <Route path="/electricity/new-service-connection/lt-refund" element={<App_LTRefund />} />

            {/* Shifting of Services */}
            <Route path="/electricity/shifting-of-services/general-public" element={<App_ShiftingGeneralPublic />} />
            <Route path="/electricity/shifting-of-services/government-org" element={<App_ShiftingGovtOrg />} />
            <Route path="/electricity/shifting-of-services/shift-meters" element={<App_ShiftingMeters />} />

            {/* Existing Services */}
            <Route path="/electricity/existing-services/tariff-change" element={<App_TariffChange />} />
            <Route path="/electricity/existing-services/tariff-conversion" element={<App_TariffConversion />} />
            <Route path="/electricity/existing-services/name-transfer" element={<App_NameTransfer />} />
            <Route path="/electricity/existing-services/additional-load" element={<App_AdditionalLoad />} />
            <Route path="/electricity/existing-services/reduction-of-load" element={<App_ReductionOfLoad />} />
            <Route path="/electricity/existing-services/dynamic-reduction" element={<App_DynamicReduction />} />

            {/* LT Application Tracking */}
            <Route path="/electricity/lt-application-tracking/calculate-charges" element={<App_CalculateCharges />} />
            <Route path="/electricity/lt-application-tracking/application-status" element={<App_ApplicationStatus />} />
            <Route path="/electricity/lt-application-tracking/modify-application" element={<App_ModifyApplication />} />
            <Route path="/electricity/lt-application-tracking/enter-grievance" element={<App_EnterGrievance />} />
            <Route path="/electricity/lt-application-tracking/grievance-status" element={<App_GrievanceStatus />} />
            <Route path="/electricity/lt-application-tracking/give-feedback" element={<App_GiveFeedback />} />

            {/* Solar Service Connections */}
            <Route path="/electricity/solar-service-connections/national-solar-rooftop" element={<App_NationalSolarRooftop />} />
            <Route path="/electricity/solar-service-connections/lt-solar-service" element={<App_LTSolarServiceConnection />} />
            <Route path="/electricity/solar-service-connections/lt-solar-consumer-readiness" element={<App_LTSolarConsumerReadiness />} />
            <Route path="/electricity/solar-service-connections/lt-solar-additional-load" element={<App_LTSolarAdditionalLoad />} />
            <Route path="/electricity/solar-service-connections/lt-solar-scheme-change" element={<App_LTSolarSchemeChange />} />
            <Route path="/electricity/solar-service-connections/lt-solar-to-normal" element={<App_LTSolarToNormal />} />
            <Route path="/electricity/solar-service-connections/online-solar-ground-mounted" element={<App_SolarGroundMounted />} />

            {/* LT Solar Service Tracking */}
            <Route path="/electricity/lt-solar-service-tracking/application-status" element={<App_SolarApplicationStatus />} />
            <Route path="/electricity/lt-solar-service-tracking/modify-application" element={<App_SolarModifyApplication />} />

            {/* Services & Complaints */}
            <Route path="/electricity/services-and-complaints/aadhaar-link" element={<App_AadhaarLink />} />
            <Route path="/electricity/services-and-complaints/scheduled-power-shutdown" element={<App_ScheduledPowerShutdown />} />
            <Route path="/electricity/services-and-complaints/mobile-email-updation" element={<App_MobileEmailUpdation />} />
            <Route path="/electricity/services-and-complaints/gst-updation" element={<App_GSTUpdation />} />
            <Route path="/electricity/services-and-complaints/consumer-complaints" element={<App_ConsumerComplaints />} />
            <Route path="/electricity/services-and-complaints/misuse-of-electricity" element={<App_MisuseOfElectricity />} />

            {/* Payments */}
            <Route path="/electricity/payments/pay-online" element={<App_PayOnline />} />
            <Route path="/electricity/payments/e-receipts" element={<App_EReceipts />} />
            <Route path="/electricity/payments/e-invoice" element={<App_EInvoice />} />
            <Route path="/electricity/payments/bill-status" element={<App_BillStatus />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
