import { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter, X, ChevronDown, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchMyRegistrations();
  }, [category, status]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = '/events/?';
      if (category) url += `category=${category}&`;
      if (status) url += `status=${status}&`;
      
      const response = await api.get(url);
      setEvents(response.data);
    } catch (err) {
      setError('Could not load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const response = await api.get('/my-registrations/');
      setMyRegistrations(response.data.map(e => e.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.get(`/events/?search=${searchTerm}`);
      setEvents(response.data);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id) => {
    try {
      await api.post(`/events/${id}/register/`);
      fetchEvents();
      fetchMyRegistrations();
    } catch (err) {
      alert(err.response?.data?.detail || 'Registration failed');
    }
  };

  const handleUnregister = async (id) => {
    try {
      await api.delete(`/events/${id}/unregister/`);
      fetchEvents();
      fetchMyRegistrations();
    } catch (err) {
      alert(err.response?.data?.detail || 'Unregistration failed');
    }
  };

  const categories = ['conference', 'workshop', 'seminar', 'social', 'sports', 'other'];
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Discover Events</h1>
        <p className="text-slate-400 text-lg">Find and join the best upcoming events around you.</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              className="input-field pl-12 h-12 bg-dark"
              placeholder="Search by title, description or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[160px]">
              <select 
                className="input-field h-12 appearance-none pl-10 pr-10"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            </div>

            <div className="relative min-w-[160px]">
              <select 
                className="input-field h-12 appearance-none pl-10 pr-10"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <AlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            </div>

            {(category || status || searchTerm) && (
              <button 
                onClick={() => { setCategory(''); setStatus(''); setSearchTerm(''); fetchEvents(); }}
                className="flex items-center text-slate-400 hover:text-white px-2 transition-colors"
                title="Clear filters"
              >
                <X size={20} />
              </button>
            )}
            
            <button 
              onClick={handleSearch}
              className="btn-primary px-8 h-12"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card h-96 animate-pulse p-5">
              <div className="w-1/3 h-6 bg-slate-800 rounded-full mb-6"></div>
              <div className="w-full h-8 bg-slate-800 rounded-lg mb-4"></div>
              <div className="w-full h-4 bg-slate-800 rounded-lg mb-2"></div>
              <div className="w-2/3 h-4 bg-slate-800 rounded-lg mb-12"></div>
              <div className="w-full h-12 bg-slate-800 rounded-lg mt-auto"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 card bg-red-500/5 border-red-500/20">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
          <button onClick={fetchEvents} className="btn-secondary mt-4">Try Again</button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 card">
          <Calendar className="mx-auto text-slate-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-300">No events found</h2>
          <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onRegister={handleRegister}
              onUnregister={handleUnregister}
              isRegistered={myRegistrations.includes(event.id)}
              onPreview={() => {}} // Could open modal here
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListPage;
