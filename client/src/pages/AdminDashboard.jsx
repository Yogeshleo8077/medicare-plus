import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Users, Stethoscope, CalendarCheck, Edit, Trash2, CheckCircle, XCircle, LogOut, LayoutDashboard, Plus, Mail, Phone, Clock, Calendar, Search } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'doctors', 'patients'
  
  // Dashboard Data
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });
  const [appointments, setAppointments] = useState([]);
  
  // Doctors Data
  const [doctors, setDoctors] = useState([]);
  const [doctorForm, setDoctorForm] = useState({
    name: '', department: '', experience: '', qualification: '', availableTime: '', availableDays: '', isFeatured: false, profileImage: null
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
      const formData = new FormData();
      formData.append('name', doctorForm.name);
      formData.append('department', doctorForm.department);
      formData.append('experience', doctorForm.experience);
      formData.append('qualification', doctorForm.qualification);
      formData.append('availableTime', doctorForm.availableTime);
      formData.append('availableDays', typeof doctorForm.availableDays === 'string' ? doctorForm.availableDays.split(',').map(d => d.trim()).join(',') : doctorForm.availableDays);
      formData.append('isFeatured', doctorForm.isFeatured);
      
      if (doctorForm.profileImage instanceof File) {
        formData.append('profileImage', doctorForm.profileImage);
      }

      if (editingDoctorId) {
        await api.put(`/admin/doctors/${editingDoctorId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Doctor updated successfully');
      } else {
        await api.post('/admin/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Doctor added successfully');
      }
      setDoctorForm({ name: '', department: '', experience: '', qualification: '', availableTime: '', availableDays: '', isFeatured: false, profileImage: null });
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
      availableDays: doc.availableDays.join(', '),
      profileImage: null // Reset file input when editing, backend keeps old image if null
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
    <div className="bg-medical-light dark:bg-slate-900 min-h-[calc(100vh-4rem)] py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Command Center</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage doctors, patients, and platform statistics</p>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="flex items-center px-5 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-bold shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 p-1.5 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-sm border border-gray-100 dark:border-slate-700">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
            { id: 'doctors', icon: Stethoscope, label: 'Doctors' },
            { id: 'patients', icon: Users, label: 'Patients' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-medical-dark dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-white' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-blue-50 dark:text-slate-800/50 group-hover:scale-110 transition-transform duration-500">
                  <Stethoscope className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-medical-blue dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Doctors</h3>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalDoctors}</p>
                </div>
              </div>
              
              {/* Stat Card 2 */}
              <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-teal-50 dark:text-slate-800/50 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-medical-teal dark:text-teal-400 flex items-center justify-center mb-4 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium">Registered Patients</h3>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalPatients}</p>
                </div>
              </div>
              
              {/* Stat Card 3 */}
              <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-purple-50 dark:text-slate-800/50 group-hover:scale-110 transition-transform duration-500">
                  <CalendarCheck className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-sm">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Appointments</h3>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalAppointments}</p>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="glass-card rounded-[2rem] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-medical-blue" /> Recent Appointments
                </h3>
              </div>
              
              {appointments.length === 0 ? (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">No appointments found.</div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-slate-700/50">
                  {appointments.map(appt => (
                    <li key={appt._id} className="p-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal text-white flex items-center justify-center font-bold text-xl mr-4 shrink-0 shadow-sm">
                          {appt.patientId?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{appt.patientId?.name}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="text-medical-blue dark:text-teal-400 font-medium mr-2">Dr. {appt.doctorId?.name}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="w-3.5 h-3.5 mr-1" /> {appt.date} 
                            <span className="mx-2">•</span>
                            <Clock className="w-3.5 h-3.5 mr-1" /> {appt.timeSlot}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                          appt.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          appt.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {appt.status}
                        </span>
                        
                        {appt.status === 'pending' && (
                          <div className="flex space-x-2 ml-4 border-l pl-4 border-gray-200 dark:border-slate-700">
                            <button onClick={() => handleStatusChange(appt._id, 'approved')} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-xl transition-colors" title="Approve">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleStatusChange(appt._id, 'cancelled')} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl transition-colors" title="Cancel">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* TAB: DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 md:p-8 rounded-[2rem] sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                  {editingDoctorId ? <Edit className="w-5 h-5 mr-2 text-medical-blue" /> : <Plus className="w-5 h-5 mr-2 text-medical-blue" />}
                  {editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <input type="text" placeholder="Full Name" required value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-blue outline-none transition-all dark:text-white" />
                    <input type="text" placeholder="Department (e.g., Cardiology)" required value={doctorForm.department} onChange={e => setDoctorForm({...doctorForm, department: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-blue outline-none transition-all dark:text-white" />
                    <input type="text" placeholder="Experience (e.g., 5 years)" required value={doctorForm.experience} onChange={e => setDoctorForm({...doctorForm, experience: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-blue outline-none transition-all dark:text-white" />
                    <input type="text" placeholder="Qualifications (e.g., MBBS, MD)" required value={doctorForm.qualification} onChange={e => setDoctorForm({...doctorForm, qualification: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-blue outline-none transition-all dark:text-white" />
                    <input type="text" placeholder="Available Days (Mon, Tue, Wed)" required value={doctorForm.availableDays} onChange={e => setDoctorForm({...doctorForm, availableDays: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-blue outline-none transition-all dark:text-white" />
                    <input type="text" placeholder="Available Time (9 AM - 5 PM)" required value={doctorForm.availableTime} onChange={e => setDoctorForm({...doctorForm, availableTime: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-blue outline-none transition-all dark:text-white" />
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
                    <input type="file" accept="image/*" onChange={e => setDoctorForm({...doctorForm, profileImage: e.target.files[0]})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-medical-blue hover:file:bg-blue-100 transition-all dark:text-gray-400" />
                  </div>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={doctorForm.isFeatured} onChange={e => setDoctorForm({...doctorForm, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-medical-blue focus:ring-medical-blue" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-medical-blue transition-colors">Featured on Home Page</span>
                  </label>
                  
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="flex-1 bg-gradient-to-r from-medical-blue to-medical-teal text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                      {editingDoctorId ? 'Update Doctor' : 'Save Doctor'}
                    </button>
                    {editingDoctorId && (
                      <button type="button" onClick={() => { setEditingDoctorId(null); setDoctorForm({name: '', department: '', experience: '', qualification: '', availableTime: '', availableDays: '', isFeatured: false, profileImage: null})}} className="px-6 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* List */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-[2rem] overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Doctor Directory</h3>
                  <span className="bg-blue-100 text-medical-blue dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-sm font-bold">{doctors.length} Total</span>
                </div>
                
                {doctors.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 dark:text-gray-400">No doctors found.</div>
                ) : (
                  <ul className="divide-y divide-gray-100 dark:divide-slate-700/50 max-h-[800px] overflow-y-auto scrollbar-hide">
                    {doctors.map(doc => (
                      <li key={doc._id} className="p-6 flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mr-4 shadow-sm border border-gray-200 dark:border-slate-700">
                            {doc.profileImage ? (
                              <img src={doc.profileImage} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-medical-blue font-bold text-xl bg-blue-50 dark:bg-slate-700">{doc.name.charAt(0)}</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-medical-blue dark:group-hover:text-teal-400 transition-colors">{doc.name}</p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{doc.department}</p>
                            {doc.isFeatured && <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">Featured</span>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => editDoctor(doc)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-xl transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteDoctor(doc._id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PATIENTS */}
        {activeTab === 'patients' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-card rounded-[2rem] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center"><Users className="w-5 h-5 mr-2 text-medical-blue" /> Registered Patients</h3>
                <span className="bg-teal-100 text-medical-teal dark:bg-teal-900/30 dark:text-teal-400 py-1 px-3 rounded-full text-sm font-bold">{patients.length} Total</span>
              </div>
              
              {patients.length === 0 ? (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">No patients found.</div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-slate-700/50">
                  {patients.map(patient => (
                    <li key={patient._id} className="p-6 sm:px-8 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal text-white flex items-center justify-center font-bold text-xl mr-5 shrink-0 shadow-sm">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{patient.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Joined {new Date(patient.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Mail className="w-4 h-4 mr-2 text-medical-blue dark:text-teal-400" /> {patient.email}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm md:justify-end">
                          <Phone className="w-4 h-4 mr-2 text-medical-blue dark:text-teal-400" /> {patient.phone}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
