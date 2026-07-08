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
    <div className="bg-medical-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
            <p className="mt-2 text-sm text-gray-500">Book an appointment with our experienced specialists.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="focus:ring-medical-blue focus:border-medical-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white"
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
              <div key={doctor._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col overflow-hidden">
                <div className="h-48 bg-gray-100 relative">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{doctor.name}</h3>
                  <p className="text-medical-teal font-medium text-sm mb-2">{doctor.department}</p>
                  <p className="text-xs text-gray-500 mb-4 flex-grow">{doctor.experience} experience</p>
                  
                  <Link to={`/doctors/${doctor._id}`} className="mt-auto block w-full text-center bg-medical-blue text-white hover:bg-medical-teal transition-colors py-2 rounded-lg font-medium text-sm">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
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
