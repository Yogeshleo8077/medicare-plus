import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Dashboard = () => {
  const { user, login, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const upcomingAppts = appointments.filter(a => ['pending', 'approved'].includes(a.status) && new Date(a.date) >= new Date(new Date().setHours(0,0,0,0)));
  const pastAppts = appointments.filter(a => ['completed', 'cancelled'].includes(a.status) || new Date(a.date) < new Date(new Date().setHours(0,0,0,0)));

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow col-span-1 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Profile</h2>
              <button onClick={() => setIsEditing(!isEditing)} className="text-medical-blue text-sm hover:underline">
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600">Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-2 border rounded mt-1" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Phone</label>
                  <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-2 border rounded mt-1" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Email (Cannot be changed)</label>
                  <input type="text" value={profile.email} disabled className="w-full p-2 border rounded mt-1 bg-gray-100 text-gray-500" />
                </div>
                <button type="submit" className="w-full bg-medical-blue text-white py-2 rounded hover:bg-medical-teal">Save Changes</button>
              </form>
            ) : (
              <div className="space-y-3">
                <p><span className="text-gray-500 text-sm block">Name</span><span className="font-medium text-gray-900">{profile.name}</span></p>
                <p><span className="text-gray-500 text-sm block">Email</span><span className="font-medium text-gray-900">{profile.email}</span></p>
                <p><span className="text-gray-500 text-sm block">Phone</span><span className="font-medium text-gray-900">{profile.phone}</span></p>
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              {upcomingAppts.length === 0 ? (
                <p className="text-gray-500">No upcoming appointments.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {upcomingAppts.map(appt => (
                    <li key={appt._id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-medical-dark">Dr. {appt.doctorId?.name}</p>
                        <p className="text-sm text-gray-500">{appt.date} at {appt.timeSlot}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {appt.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
              {pastAppts.length === 0 ? (
                <p className="text-gray-500">No past appointments.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {pastAppts.map(appt => (
                    <li key={appt._id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Dr. {appt.doctorId?.name}</p>
                        <p className="text-sm text-gray-500">{appt.date} at {appt.timeSlot}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {appt.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
