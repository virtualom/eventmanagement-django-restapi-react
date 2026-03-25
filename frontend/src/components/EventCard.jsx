import { format } from 'date-fns';
import { Calendar, MapPin, Users, Tag, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const EventCard = ({ event, onRegister, onUnregister, isRegistered, isOrganizer, onPreview }) => {
  const { title, description, event_date, location, category, status, capacity, registered_count } = event;

  const categoryColors = {
    conference: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    workshop: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    seminar: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    social: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    sports: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    other: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  const statusColors = {
    upcoming: 'bg-emerald-500/10 text-emerald-500',
    ongoing: 'bg-amber-500/10 text-amber-500',
    completed: 'bg-slate-500/10 text-slate-500',
    cancelled: 'bg-red-500/10 text-red-500',
  };

  const fillPercentage = Math.min(100, (registered_count / capacity) * 100);
  const isFull = registered_count >= capacity;

  return (
    <div className="card flex flex-col h-full bg-dark-lighter border border-slate-800 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={clsx("badge px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border", categoryColors[category])}>
            {category}
          </span>
          <span className={clsx("badge px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase", statusColors[status])}>
            {status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

        <div className="space-y-2.5 mb-6">
          <div className="flex items-center text-slate-300 text-sm">
            <Calendar size={16} className="mr-2 text-primary" />
            <span>{format(new Date(event_date), 'MMM d, yyyy • h:mm a')}</span>
          </div>
          <div className="flex items-center text-slate-300 text-sm">
            <MapPin size={16} className="mr-2 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center">
              <Users size={14} className="mr-1" />
              {registered_count} / {capacity} Seats
            </span>
            <span>{Math.round(fillPercentage)}% Filled</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={clsx(
                "h-full transition-all duration-500 rounded-full",
                isFull ? "bg-red-500" : fillPercentage > 80 ? "bg-amber-500" : "bg-primary"
              )}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-slate-800/30 border-t border-slate-800/50 flex items-center justify-between">
        <button 
          onClick={() => onPreview(event)}
          className="text-sm font-medium text-slate-300 hover:text-white flex items-center group/btn"
        >
          Details
          <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {isOrganizer ? (
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">My Event</span>
        ) : isRegistered ? (
          <button 
            onClick={() => onUnregister(event.id)}
            className="text-sm py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-semibold transition-colors"
          >
            Unregister
          </button>
        ) : (
          <button 
            onClick={() => onRegister(event.id)}
            disabled={isFull || status !== 'upcoming'}
            className="btn-primary py-1.5 px-4 text-sm"
          >
            {isFull ? 'Full' : status !== 'upcoming' ? 'Closed' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
