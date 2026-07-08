import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'doctors', 'patients'
  
  // Dashboard Data
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });
  const [appointments, setAppointments] = useState([]);
  
  // Doctors Data
  const [doctors, setDoctors] = useState([]);
  const [doctorForm, setDoctorForm] = useState({
    name: '', department: '', experience: '', qualification: '', availableTime: '', availableDays: '', isFeatured: false, profileImage: ''
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // Patients Data
  const [patients, setPatients] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [statsRes, apptsRes] = await Promise.all([api.get('/admin/stats'), api.get('/admin/appointments')]);
        setStats(statsRes.data);
        setAppointments(apptsRes.data);
      } else if (activeTab === 'doctors') {
        const docsRes = await api.get('/doctors'); // public endpoint is fine, or create admin one
        setDoctors(docsRes.data);
      } else if (activeTab === 'patients') {
        const patientsRes = await api.get('/admin/patients');
        setPatients(patientsRes.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Appointment Handlers ---
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchData(); 
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // --- Doctor Handlers ---
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split available days by comma
      const payload = {
        ...doctorForm,
        availableDays: typeof doctorForm.availableDays === 'string' ? doctorForm.availableDays.split(',').map(d => d.trim()) : doctorForm.availableDays
      };

      if (editingDoctorId) {
        await api.put(`/admin/doctors/${editingDoctorId}`, payload);
        toast.success('Doctor updated successfully');
      } else {
        await api.post('/admin/doctors', payload);
        toast.success('Doctor added successfully');
      }
      setDoctorForm({ name: '', department: '', experience: '', qualification: '', availableTime: '', availableDays: '', isFeatured: false, profileImage: '' });
      setEditingDoctorId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save doctor');
    }
  };

  const editDoctor = (doc) => {
    setEditingDoctorId(doc._id);
    setDoctorForm({
      ...doc,
      availableDays: doc.availableDays.join(', ')
    });
  };

  const deleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        toast.success('Doctor deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  if (isLoading && !stats.totalDoctors && doctors.length === 0 && patients.length === 0) {
     return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-4 border-b">
          {['dashboard', 'doctors', 'patients'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 capitalize font-medium ${activeTab === tab ? 'text-medical-blue border-b-2 border-medical-blue' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
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

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6"><h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3></div>
              <ul className="divide-y divide-gray-200">
                {appointments.map(appt => (
                  <li key={appt._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-medical-blue">Patient: {appt.patientId?.name}</p>
                      <p className="text-sm text-gray-500">Dr. {appt.doctorId?.name} | {appt.date} at {appt.timeSlot}</p>
                      <p className="mt-1 text-sm text-gray-500">Status: <span className="font-semibold capitalize">{appt.status}</span></p>
                    </div>
                    {appt.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleStatusChange(appt._id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Approve</button>
                        <button onClick={() => handleStatusChange(appt._id, 'cancelled')} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Cancel</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB: DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow h-fit">
              <h3 className="text-lg font-medium mb-4">{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <input type="text" placeholder="Name" required value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Department" required value={doctorForm.department} onChange={e => setDoctorForm({...doctorForm, department: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Experience (e.g., 5 years)" required value={doctorForm.experience} onChange={e => setDoctorForm({...doctorForm, experience: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Qualification" required value={doctorForm.qualification} onChange={e => setDoctorForm({...doctorForm, qualification: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Available Days (comma separated)" required value={doctorForm.availableDays} onChange={e => setDoctorForm({...doctorForm, availableDays: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Available Time (e.g., 9 AM - 5 PM)" required value={doctorForm.availableTime} onChange={e => setDoctorForm({...doctorForm, availableTime: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Profile Image URL" value={doctorForm.profileImage} onChange={e => setDoctorForm({...doctorForm, profileImage: e.target.value})} className="w-full p-2 border rounded" />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={doctorForm.isFeatured} onChange={e => setDoctorForm({...doctorForm, isFeatured: e.target.checked})} />
                  <span>Featured Doctor</span>
                </label>
                <div className="flex space-x-2">
                  <button type="submit" className="w-full bg-medical-blue text-white p-2 rounded hover:bg-medical-teal">{editingDoctorId ? 'Update' : 'Add'}</button>
                  {editingDoctorId && <button type="button" onClick={() => { setEditingDoctorId(null); setDoctorForm({name: '', department: '', experience: '', qualification: '', availableTime: '', availableDays: '', isFeatured: false, profileImage: ''})}} className="w-full bg-gray-300 p-2 rounded">Cancel</button>}
                </div>
              </form>
            </div>
            
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
               <ul className="divide-y divide-gray-200 max-h-[800px] overflow-y-auto">
                {doctors.map(doc => (
                  <li key={doc._id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.department}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => editDoctor(doc)} className="text-medical-blue hover:underline text-sm">Edit</button>
                      <button onClick={() => deleteDoctor(doc._id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </li>
                ))}
               </ul>
            </div>
          </div>
        )}

        {/* TAB: PATIENTS */}
        {activeTab === 'patients' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6"><h3 className="text-lg font-medium text-gray-900">Registered Patients</h3></div>
            <ul className="divide-y divide-gray-200">
              {patients.map(patient => (
                <li key={patient._id} className="p-4 sm:px-6">
                  <p className="font-medium text-medical-dark">{patient.name}</p>
                  <p className="text-sm text-gray-500">{patient.email} | {patient.phone}</p>
                  <p className="text-xs text-gray-400 mt-1">Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
              {patients.length === 0 && <li className="p-4 text-center text-gray-500">No patients found</li>}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
