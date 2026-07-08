import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, apptsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/appointments')
      ]);
      setStats(statsRes.data);
      setAppointments(apptsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchData(); // refresh list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-medical-blue">
            <h3 className="text-lg font-medium text-gray-500">Total Doctors</h3>
            <p className="text-3xl font-bold text-medical-dark">{stats.totalDoctors}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-medical-teal">
            <h3 className="text-lg font-medium text-gray-500">Total Patients</h3>
            <p className="text-3xl font-bold text-medical-dark">{stats.totalPatients}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-purple-500">
            <h3 className="text-lg font-medium text-gray-500">Total Appointments</h3>
            <p className="text-3xl font-bold text-medical-dark">{stats.totalAppointments}</p>
          </div>
        </div>

        {/* Manage Appointments */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Appointments</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {appointments.map(appt => (
              <li key={appt._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medical-blue truncate">
                    Patient: {appt.patientId?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Dr. {appt.doctorId?.name} | {appt.date} at {appt.timeSlot}
                  </p>
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    Status: <span className="ml-1 font-semibold capitalize">{appt.status}</span>
                  </p>
                </div>
                {appt.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(appt._id, 'approved')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(appt._id, 'cancelled')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
            {appointments.length === 0 && (
              <li className="px-4 py-4 text-center text-gray-500">No appointments found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
