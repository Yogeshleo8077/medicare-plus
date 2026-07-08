import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({});
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
          <div className="bg-white p-6 rounded-lg shadow col-span-1">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
            </div>
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
