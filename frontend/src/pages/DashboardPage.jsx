import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Calendar, 
  PlusCircle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'My Total Events', 
      value: stats?.total_events_created || 0, 
      icon: Calendar, 
      color: 'bg-blue-500',
      description: 'Events you organized'
    },
    { 
      label: 'Upcoming Events', 
      value: stats?.upcoming_events_created || 0, 
      icon: Clock, 
      color: 'bg-amber-500',
      description: 'Created by you'
    },
    { 
      label: 'My Registrations', 
      value: stats?.total_registered || 0, 
      icon: CheckCircle, 
      color: 'bg-emerald-500',
      description: 'Events you are attending'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-slate-400 text-lg">
            Here's what's happening with your events and registrations.
          </p>
        </div>
        <Link to="/events/new" className="btn-primary flex items-center space-x-2 px-6 py-3">
          <PlusCircle size={20} />
          <span>Create New Event</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 ${stat.color} opacity-10 rounded-bl-3xl group-hover:opacity-20 transition-opacity`}>
              <stat.icon size={48} />
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-4 text-white`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <h3 className="text-slate-400 font-medium mb-1">{stat.label}</h3>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Activity className="mr-2 text-primary" size={24} />
              Recent Activity
            </h2>
          </div>
          
          <div className="card divide-y divide-slate-800">
            {stats?.recent_activity?.length > 0 ? (
              stats.recent_activity.map((activity, idx) => (
                <div key={idx} className="p-4 flex items-center space-x-4 hover:bg-slate-800/30 transition-colors">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    activity.type === 'created' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {activity.type === 'created' ? <PlusCircle size={20} /> : <Users size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">
                      You {activity.type === 'created' ? 'created' : 'registered for'}{' '}
                      <span className="font-bold text-white">"{activity.title}"</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <ArrowUpRight className="text-slate-600" size={18} />
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-slate-500 italic">No recent activity found.</p>
                <Link to="/events" className="text-primary hover:underline text-sm mt-2 inline-block">
                  Browse events to get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/events" className="flex items-center p-4 bg-dark-lighter border border-slate-800 rounded-xl hover:border-primary/50 transition-all group">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-white transition-all">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Browse Events</p>
                <p className="text-xs text-slate-500">Discover what's happening</p>
              </div>
            </Link>
            <Link to="/my-events" className="flex items-center p-4 bg-dark-lighter border border-slate-800 rounded-xl hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center mr-3 group-hover:bg-accent group-hover:text-white transition-all">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">My Events</p>
                <p className="text-xs text-slate-500">Manage your hosted events</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
