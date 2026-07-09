import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, List, Map, Navigation } from 'lucide-react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const fetchDoctors = async (lat, lng) => {
    setIsLoading(true);
    try {
      let url = department ? `/doctors?department=${department}` : '/doctors';
      if (lat && lng) {
        url += `${department ? '&' : '?'}lat=${lat}&lng=${lng}`;
      }
      const res = await api.get(url);
      setDoctors(res.data);
    } catch (error) {
      console.error('Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchDoctors(userLocation.lat, userLocation.lng);
    } else {
      fetchDoctors();
    }
  }, [department, userLocation]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        alert('Unable to retrieve your location');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="bg-medical-light dark:bg-slate-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Find a <span className="gradient-text">Doctor</span></h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 font-light">Book an appointment with our experienced specialists.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full md:w-auto">
            <div className="relative rounded-md shadow-sm w-full sm:w-48 md:w-64">
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
            
            <div className="flex w-full sm:w-auto bg-gray-100 dark:bg-slate-800 rounded-lg p-1 justify-center">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-medical-blue' : 'text-gray-500'}`}>
                <List className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('map')} className={`p-2 rounded-md ${viewMode === 'map' ? 'bg-white shadow-sm text-medical-blue' : 'text-gray-500'}`}>
                <Map className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-50 text-medical-blue font-bold rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-spin' : ''}`} /> 
              {isLocating ? 'Locating...' : 'Near Me'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div></div>
        ) : (
          <>
            {viewMode === 'list' ? (
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
                    No doctors found.
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 relative z-0">
                <MapContainer 
                  center={userLocation ? [userLocation.lat, userLocation.lng] : (doctors.length > 0 && doctors[0].location ? [doctors[0].location.coordinates[1], doctors[0].location.coordinates[0]] : [28.6139, 77.2090])} 
                  zoom={12} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>
                        <strong>You are here!</strong>
                      </Popup>
                    </Marker>
                  )}

                  {/* Doctor Markers */}
                  {doctors.map(doctor => {
                    if (doctor.location && doctor.location.coordinates) {
                      return (
                        <Marker 
                          key={doctor._id} 
                          position={[doctor.location.coordinates[1], doctor.location.coordinates[0]]}
                        >
                          <Popup>
                            <div className="text-center p-1">
                              <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{doctor.department}</p>
                              <Link to={`/doctors/${doctor._id}`} className="bg-medical-blue text-white px-3 py-1 rounded text-sm hover:bg-medical-teal">
                                Book Now
                              </Link>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Doctors;
