import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LayoutDashboard, LogOut, PlusCircle, User, List } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-lighter border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Eventify
            </span>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="nav-link flex items-center space-x-1.5 text-slate-300 hover:text-primary transition-colors">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/events" className="nav-link flex items-center space-x-1.5 text-slate-300 hover:text-primary transition-colors">
                <List size={18} />
                <span>Events</span>
              </Link>
              <Link to="/my-events" className="nav-link flex items-center space-x-1.5 text-slate-300 hover:text-primary transition-colors">
                <PlusCircle size={18} />
                <span>My Events</span>
              </Link>
              <div className="h-6 w-px bg-slate-800 mx-2" />
              <div className="flex items-center space-x-3 bg-dark px-3 py-1.5 rounded-full border border-slate-800">
                <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-xs font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200">{user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white font-medium">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
          
          {/* Mobile menu could go here if needed, but keeping it simple for now */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
