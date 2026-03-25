import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { Calendar, AlertCircle } from 'lucide-react';

const MyRegistrationsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/my-registrations/');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (id) => {
    try {
      await api.delete(`/events/${id}/unregister/`);
      fetchRegistrations();
    } catch (err) {
      alert('Unregistration failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white mb-2">My Registrations</h1>
        <p className="text-slate-400 text-lg">Keep track of all the events you're planning to attend.</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 card">
          <Calendar className="mx-auto text-slate-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-300">You haven't registered for any events yet</h2>
          <p className="text-slate-500 mt-2">Discover new events and start growing your network.</p>
          <Link to="/events" className="btn-primary mt-6 inline-flex">
            Discover Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onUnregister={handleUnregister}
              isRegistered={true}
              onPreview={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;
