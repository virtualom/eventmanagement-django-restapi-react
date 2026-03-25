import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  ArrowLeft, 
  Save, 
  Trash2,
  AlertCircle
} from 'lucide-react';

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    category: 'other',
    status: 'upcoming',
    capacity: 50,
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const response = await api.get(`/events/${id}/`);
          const data = response.data;
          // Format date for datetime-local input
          const date = new Date(data.event_date);
          const formattedDate = date.toISOString().slice(0, 16);
          
          setFormData({
            ...data,
            event_date: formattedDate
          });
        } catch (err) {
          setError('Could not load event data.');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await api.put(`/events/${id}/`, formData);
      } else {
        await api.post('/events/', formData);
      }
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save event. Please check all fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${id}/`);
        navigate('/my-events');
      } catch (err) {
        setError('Failed to delete event.');
      }
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {isEdit ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-slate-400 text-lg">
            {isEdit ? 'Update your event details and settings.' : 'Fill in the information to host a new event.'}
          </p>
        </div>
        
        {isEdit && (
          <button 
            onClick={handleDelete}
            className="flex items-center space-x-2 text-red-500 hover:text-red-400 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg transition-all"
          >
            <Trash2 size={18} />
            <span>Delete Event</span>
          </button>
        )}
      </div>

      <div className="card bg-dark-lighter border-slate-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-3 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Event Title</label>
              <input
                type="text"
                name="title"
                required
                className="input-field h-12"
                placeholder="e.g., Annual Tech Summit 2024"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                className="input-field py-3 resize-none"
                placeholder="Tell attendees what your event is about..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Category</label>
              <select
                name="category"
                className="input-field h-12"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Location / Venue</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  name="location"
                  required
                  className="input-field h-12 pl-12"
                  placeholder="e.g., Grand Ballroom, Downtown"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="datetime-local"
                  name="event_date"
                  required
                  className="input-field h-12 pl-12"
                  value={formData.event_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Capacity (Max Seats)</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="number"
                  name="capacity"
                  required
                  min="1"
                  className="input-field h-12 pl-12"
                  placeholder="e.g., 100"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>
            </div>

            {isEdit && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                <select
                  name="status"
                  className="input-field h-12"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-10 py-3 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormPage;
