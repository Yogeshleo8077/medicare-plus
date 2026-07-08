import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState('');

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const url = department ? `/doctors?department=${department}` : '/doctors';
      const res = await api.get(url);
      setDoctors(res.data);
    } catch (error) {
      console.error('Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [department]);

  return (
    <div className="bg-medical-light dark:bg-slate-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Find a <span className="gradient-text">Doctor</span></h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 font-light">Book an appointment with our experienced specialists.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="focus:ring-medical-blue focus:border-medical-blue block w-full pl-10 sm:text-sm border-gray-300 dark:border-slate-700 rounded-md py-2 px-3 border bg-white dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map(doctor => (
              <div key={doctor._id} className="glass-card rounded-[2rem] flex flex-col overflow-hidden group">
                <div className="h-56 bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-slate-700">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-medical-dark dark:text-white shadow-sm">
                      {doctor.department}
                    </div>
                </div>
                <div className="p-6 flex-grow flex flex-col bg-white dark:bg-slate-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-medical-blue transition-colors mb-1">{doctor.name}</h3>
                  <p className="text-gray-500 dark:text-gray-300 font-light text-sm mb-4 line-clamp-2">{doctor.qualification}</p>
                  
                  <div className="mt-auto pt-5 border-t border-gray-50 dark:border-slate-700">
                    <Link to={`/doctors/${doctor._id}`} className="block w-full text-center bg-gray-50 dark:bg-slate-700 text-medical-blue dark:text-teal-400 hover:bg-gradient-to-r hover:from-medical-blue hover:to-medical-teal hover:text-white dark:hover:text-white transition-all duration-300 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                No doctors found in this department.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
