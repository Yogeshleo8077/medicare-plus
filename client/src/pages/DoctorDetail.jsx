import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Award } from 'lucide-react';
import api from '../services/api';

const DoctorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Mock available times since PRD simplified it to a string for schema, we'll split it or mock it
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch (error) {
        toast.error('Failed to fetch doctor details');
        navigate('/doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  useEffect(() => {
    if (selectedDate && id) {
      const fetchBookedSlots = async () => {
        try {
          const res = await api.get(`/doctors/${id}/booked-slots?date=${selectedDate}`);
          setBookedSlots(res.data);
          setSelectedTimeSlot((prev) => res.data.includes(prev) ? '' : prev);
        } catch (error) {
          console.error("Failed to fetch booked slots", error);
        }
      };
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate, id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to book an appointment');
      navigate('/login', { state: { from: `/doctors/${id}` } });
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select both date and time slot');
      return;
    }

    setIsBooking(true);
    try {
      await api.post('/appointments', {
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedTimeSlot
      });
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('This time slot is already booked. Please select another.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to book appointment');
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div></div>;
  if (!doctor) return null;

  // Get next 14 days for date picker
  const today = new Date();
  const dateOptions = Array.from({length: 14}).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  return (
    <div className="bg-medical-light dark:bg-slate-900 transition-colors duration-300 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="md:flex">
            {/* Doctor Info */}
            <div className="md:w-1/2 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden mb-6">
                   {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                        {doctor.name.charAt(0)}
                      </div>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{doctor.name}</h1>
                <p className="text-medical-teal dark:text-teal-400 font-semibold text-lg mb-6">{doctor.department}</p>
                
                <div className="space-y-4 w-full">
                  <div className="flex items-start text-gray-600 dark:text-gray-300">
                    <Award className="w-5 h-5 mr-3 text-medical-blue dark:text-teal-400 shrink-0 mt-0.5" />
                    <span><strong className="block text-gray-900 dark:text-white">Qualification</strong> {doctor.qualification}</span>
                  </div>
                  <div className="flex items-start text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-medical-blue dark:text-teal-400 shrink-0 mt-0.5" />
                    <span><strong className="block text-gray-900 dark:text-white">Experience</strong> {doctor.experience}</span>
                  </div>
                  <div className="flex items-start text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-medical-blue dark:text-teal-400 shrink-0 mt-0.5" />
                    <span><strong className="block text-gray-900 dark:text-white">Available Days</strong> {doctor.availableDays?.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:w-1/2 p-6 md:p-12 bg-gray-50 dark:bg-slate-900/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book Appointment</h2>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-medical-blue focus:border-medical-blue sm:text-sm rounded-lg border bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="" disabled>Choose a date...</option>
                    {dateOptions.map(date => (
                      <option key={date} value={date}>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Time Slot</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map(time => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                      <button
                        key={time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          isBooked
                            ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                            : selectedTimeSlot === time 
                              ? 'bg-medical-blue border-medical-blue text-white shadow-md' 
                              : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-medical-blue dark:hover:border-teal-400 hover:text-medical-blue dark:hover:text-teal-400'
                        }`}
                      >
                        {time} {isBooked && <span className="text-[10px] block font-normal leading-none mt-1">Booked</span>}
                      </button>
                    )})}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isBooking || !selectedDate || !selectedTimeSlot}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-medical-teal hover:bg-medical-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-teal disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isBooking ? 'Processing Booking...' : 'Confirm Booking'}
                  </button>
                  {!user && (
                    <p className="text-sm text-center text-gray-500 mt-3">
                      You will be asked to log in first.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
