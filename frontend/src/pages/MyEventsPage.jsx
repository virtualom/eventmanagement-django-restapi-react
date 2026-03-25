import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Calendar, Edit2, Users, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get('/my-events/');
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to load my events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const statusColors = {
    upcoming: 'bg-emerald-500/10 text-emerald-500',
    ongoing: 'bg-amber-500/10 text-amber-500',
    completed: 'bg-slate-500/10 text-slate-500',
    cancelled: 'bg-red-500/10 text-red-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">My Hosted Events</h1>
          <p className="text-slate-400 text-lg">Manage the events you're organizing and track attendance.</p>
        </div>
        <Link to="/events/new" className="btn-primary flex items-center space-x-2 px-6 py-3">
          <PlusCircle size={20} />
          <span>New Event</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 card">
          <Calendar className="mx-auto text-slate-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-300">You haven't created any events yet</h2>
          <Link to="/events/new" className="text-primary hover:underline text-sm mt-4 inline-block">
            Create your first event now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="hidden md:grid grid-cols-6 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <div className="col-span-2">Event Title</div>
            <div>Date</div>
            <div>Category</div>
            <div>Attendance</div>
            <div className="text-right">Action</div>
          </div>
          
          {events.map((event) => (
            <div key={event.id} className="card group hover:bg-slate-800/20">
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-6 items-center gap-4">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{event.location}</p>
                </div>
                
                <div className="text-sm text-slate-300">
                  <p className="font-medium">{format(new Date(event.event_date), 'MMM d, yyyy')}</p>
                  <p className="text-slate-500">{format(new Date(event.event_date), 'h:mm a')}</p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase py-1 px-2 rounded-lg bg-dark border border-slate-800">
                    {event.category}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-white font-semibold">
                    <Users size={16} className="text-slate-500" />
                    <span>{event.registered_count} / {event.capacity}</span>
                  </div>
                  <div className="w-24 bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all" 
                      style={{ width: `${(event.registered_count / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex md:justify-end items-center space-x-3">
                  <div className={clsx("badge px-2.5 py-1 rounded text-[10px] uppercase font-bold", statusColors[event.status])}>
                    {event.status}
                  </div>
                  <Link 
                    to={`/events/${event.id}/edit`}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Edit Event"
                  >
                    <Edit2 size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
