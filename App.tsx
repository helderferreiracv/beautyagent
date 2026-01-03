
import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/Landing';
import { ToastProvider } from './components/Toast';

// Client Flow
import { ClientServiceSelection } from './pages/client/ServiceSelection';
import { ClientCalendar } from './pages/client/Calendar';
import { ClientTimeSelection } from './pages/client/TimeSelection';
import { ClientProfessionalSelection } from './pages/client/ProfessionalSelection';
import { ClientAuthStep } from './pages/client/ClientAuthStep';
import { ClientOTP } from './pages/client/OTP';
import { ClientConfirmation } from './pages/client/Confirmation';
import { ClientWaitingList } from './pages/client/WaitingList';
import { MyBookings } from './pages/client/MyBookings';
import { ReferralEntry } from './pages/client/ReferralEntry';

// Trial
import { TrialRegister } from './pages/trial/TrialRegister';

// Legal
import { FAQPage } from './pages/legal/FAQ';
import { PrivacyPage } from './pages/legal/Privacy';
import { TermsPage } from './pages/legal/Terms';

// Staff
import { StaffAgenda } from './pages/staff/Agenda';
import { StaffPersonalDashboard } from './pages/staff/PersonalDashboard';

// Owner
import { OwnerDashboard } from './pages/owner/Dashboard';
import { OwnerAgenda } from './pages/owner/Agenda';
import { OwnerReports } from './pages/owner/Reports';
import { OwnerSettings } from './pages/owner/Settings';
import { OwnerServices } from './pages/owner/Services';
import { OwnerStaff } from './pages/owner/Staff';
import { OwnerClients } from './pages/owner/Clients';
import { OwnerLogs } from './pages/owner/Logs';
import { OwnerAbandonedCarts } from './pages/owner/AbandonedCarts';
import { OwnerOnboarding } from './pages/owner/Onboarding';
import { OwnerHelp } from './pages/owner/Help';
import { OwnerMessages } from './pages/owner/Messages';

// Global Admin
import { AdminLogin } from './pages/admin/Login';
import { AdminGlobal } from './pages/admin/Global';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<LandingPage />} />
            <Route path="/features" element={<LandingPage />} />
            <Route path="/trial/register" element={<TrialRegister />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Client Booking Flow */}
            <Route path="/client/booking" element={<ClientServiceSelection />} />
            <Route path="/client/service" element={<ClientServiceSelection />} />
            <Route path="/client/calendar" element={<ClientCalendar />} />
            <Route path="/client/time" element={<ClientTimeSelection />} />
            <Route path="/client/professional" element={<ClientProfessionalSelection />} />
            <Route path="/client/auth" element={<ClientAuthStep />} />
            <Route path="/client/otp" element={<ClientOTP />} />
            <Route path="/client/confirm" element={<ClientConfirmation />} />
            <Route path="/client/waiting" element={<ClientWaitingList />} />
            <Route path="/client/my-bookings" element={<MyBookings />} />
            <Route path="/referral/:staffId" element={<ReferralEntry />} />
            
            {/* Staff Portal */}
            <Route path="/staff/agenda" element={<StaffAgenda />} />
            <Route path="/staff/view/:staffId" element={<StaffPersonalDashboard />} />

            {/* Owner Portal */}
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/onboarding" element={<OwnerOnboarding />} />
            <Route path="/owner/agenda" element={<OwnerAgenda />} />
            <Route path="/owner/services" element={<OwnerServices />} />
            <Route path="/owner/reports" element={<OwnerReports />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
            <Route path="/owner/staff" element={<OwnerStaff />} />
            <Route path="/owner/clients" element={<OwnerClients />} />
            <Route path="/owner/logs" element={<OwnerLogs />} />
            <Route path="/owner/abandoned-carts" element={<OwnerAbandonedCarts />} />
            <Route path="/owner/help" element={<OwnerHelp />} />
            <Route path="/owner/messages" element={<OwnerMessages />} />

            {/* Global Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/global" element={<AdminGlobal />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
};

export default App;
