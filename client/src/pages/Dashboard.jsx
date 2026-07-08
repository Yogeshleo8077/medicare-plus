import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Calendar, Clock, LogOut, CheckCircle, Clock3, XCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalData, setCancelModalData] = useState({ isOpen: false, appointmentId: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, apptsRes] = await Promise.all([
          api.get('/patients/me'),
          api.get('/patients/me/appointments')
        ]);
        setProfile(profileRes.data);
        setAppointments(apptsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/patients/me', { name: profile.name, phone: profile.phone });
      toast.success('Profile updated successfully');
      setProfile(res.data);
      setIsEditing(false);
      
      // Update local storage user context
      login({ ...user, name: res.data.name });
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const openCancelModal = (id) => setCancelModalData({ isOpen: true, appointmentId: id });
  const closeCancelModal = () => setCancelModalData({ isOpen: false, appointmentId: null });

  const confirmCancel = async () => {
    const id = cancelModalData.appointmentId;
    if (!id) return;
    
    try {
      await api.patch(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled successfully');
      setAppointments(appointments.map(a => 
        a._id === id ? { ...a, status: 'cancelled' } : a
      ));
      closeCancelModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
      closeCancelModal();
    }
  };

  const upcomingAppts = appointments.filter(a => ['pending', 'approved'].includes(a.status) && new Date(a.date) >= new Date(new Date().setHours(0,0,0,0)));
  const pastAppts = appointments.filter(a => ['completed', 'cancelled'].includes(a.status) || new Date(a.date) < new Date(new Date().setHours(0,0,0,0)));

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-medical-light dark:bg-slate-900 min-h-[calc(100vh-4rem)] py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Patient Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your health profile and appointments</p>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="flex items-center px-5 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-bold shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Section (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 md:p-8 rounded-[2rem] sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-medical-blue dark:text-teal-400" /> My Profile
                </h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="text-sm font-semibold text-medical-blue dark:text-teal-400 hover:text-medical-teal transition-colors px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal text-white flex items-center justify-center font-bold text-4xl shadow-lg mb-4">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
                </div>
                {!isEditing && <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">{profile.name}</h3>}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-blue outline-none transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-blue outline-none transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative opacity-60 cursor-not-allowed">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" value={profile.email} disabled className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-500 cursor-not-allowed" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-medical-blue to-medical-teal text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <Mail className="w-5 h-5 text-medical-blue dark:text-teal-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <Phone className="w-5 h-5 text-medical-blue dark:text-teal-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{profile.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Appointments */}
            <div className="glass-card p-6 md:p-8 rounded-[2rem]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                <Calendar className="w-5 h-5 mr-2 text-medical-blue dark:text-teal-400" /> Upcoming Appointments
              </h2>
              
              {upcomingAppts.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                  <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No upcoming appointments scheduled.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppts.map(appt => (
                    <div key={appt._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-medical-blue dark:text-teal-400 font-bold mr-4 shrink-0 group-hover:scale-110 transition-transform">
                          {appt.doctorId?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">Dr. {appt.doctorId?.name}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="w-4 h-4 mr-1" /> {appt.date}
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4 mr-1" /> {appt.timeSlot}
                          </div>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto flex justify-end items-center space-x-3">
                        {appt.status === 'approved' ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" /> Approved
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Clock3 className="w-4 h-4 mr-1" /> Pending
                            </span>
                            <button
                              onClick={() => openCancelModal(appt._id)}
                              className="inline-flex items-center p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Appointment History */}
            <div className="glass-card p-6 md:p-8 rounded-[2rem]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                <Clock className="w-5 h-5 mr-2 text-gray-400" /> Appointment History
              </h2>
              
              {pastAppts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No past appointments found.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {pastAppts.map(appt => (
                    <div key={appt._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-300">Dr. {appt.doctorId?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{appt.date} at {appt.timeSlot}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        {appt.status === 'cancelled' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                            <XCircle className="w-3 h-3 mr-1" /> Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Cancel Appointment?</h3>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={confirmCancel}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-sm shadow-red-500/20 transition-colors"
                >
                  Yes, Cancel Appointment
                </button>
                <button
                  onClick={closeCancelModal}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
                >
                  No, Keep it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
