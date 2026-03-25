import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventListPage from './pages/EventListPage';
import EventFormPage from './pages/EventFormPage';
import MyEventsPage from './pages/MyEventsPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="pt-4">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/new" element={<EventFormPage />} />
            <Route path="/events/:id/edit" element={<EventFormPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/my-registrations" element={<MyRegistrationsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
