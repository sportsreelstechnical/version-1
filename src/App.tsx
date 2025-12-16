import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import RoleSelection from './pages/RoleSelection';
import ClubSignup from './pages/auth/ClubSignup';
import ClubSignupMultiStep from './pages/auth/ClubSignupMultiStep';
import ScoutSignup from './pages/auth/ScoutSignup';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import PlayerManagement from './pages/PlayerManagement';
import MatchesUpload from './pages/MatchesUpload';
import PlayerTransfers from './pages/PlayerTransfers';
import ExploreTalent from './pages/ExploreTalent';
import AIScouting from './pages/AIScouting';
import ClubProfile from './pages/ClubProfile';
import ClubHistory from './pages/ClubHistory';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Support from './pages/Support';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClubs from './pages/admin/AdminClubs';
import AdminScouts from './pages/admin/AdminScouts';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSupport from './pages/admin/AdminSupport';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminUser = localStorage.getItem('adminUser');
  
  if (!adminUser) {
    return <Navigate to="/admin/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/signup/club" element={<ClubSignupMultiStep />} />
      <Route path="/signup/club-old" element={<ClubSignup />} />
      <Route path="/signup/scout" element={<ScoutSignup />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/clubs" element={
        <AdminProtectedRoute>
          <AdminClubs />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/scouts" element={
        <AdminProtectedRoute>
          <AdminScouts />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <AdminProtectedRoute>
          <AdminPayments />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/support" element={
        <AdminProtectedRoute>
          <AdminSupport />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <AdminProtectedRoute>
          <AdminUsers />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/subscriptions" element={
        <AdminProtectedRoute>
          <AdminSubscriptions />
        </AdminProtectedRoute>
      } />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/players" element={
        <ProtectedRoute>
          <PlayerManagement />
        </ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute>
          <MatchesUpload />
        </ProtectedRoute>
      } />
      <Route path="/transfers" element={
        <ProtectedRoute>
          <PlayerTransfers />
        </ProtectedRoute>
      } />
      <Route path="/ai-scouting" element={
        <ProtectedRoute>
          <AIScouting />
        </ProtectedRoute>
      } />
      <Route path="/explore" element={
        <ProtectedRoute>
          <ExploreTalent />
        </ProtectedRoute>
      } />
      <Route path="/club-profile" element={
        <ProtectedRoute>
          <ClubProfile />
        </ProtectedRoute>
      } />
      <Route path="/club-history" element={
        <ProtectedRoute>
          <ClubHistory />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/support" element={
        <ProtectedRoute>
          <Support />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;