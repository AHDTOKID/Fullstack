import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedbackPage from './pages/FeedbackPage';
import DashboardPage from './pages/DashboardPage';
import AcademicRecordsPage from './pages/AcademicRecordsPage';
import TimetablePage from './pages/TimetablePage';
import FeeManagementPage from './pages/FeeManagementPage';
import ClassManagementPage from './pages/ClassManagementPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-secondary font-headline text-sm uppercase tracking-widest">Loading…</span>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/academic-records" element={<PrivateRoute><AcademicRecordsPage /></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute><TimetablePage /></PrivateRoute>} />
        <Route path="/fees" element={<PrivateRoute><FeeManagementPage /></PrivateRoute>} />
        <Route path="/classes" element={<PrivateRoute><ClassManagementPage /></PrivateRoute>} />
        <Route path="/feedback" element={<PrivateRoute><FeedbackPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
