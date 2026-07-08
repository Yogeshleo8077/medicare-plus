import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Award, Users } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/doctors?featured=true');
        setFeaturedDoctors(res.data);
      } catch (error) {
        console.error('Failed to fetch featured doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-medical-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-blue to-medical-teal text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Modern Healthcare, <br/> Designed for You
            </h1>
            <p className="text-lg md:text-xl text-blue-50">
              Book appointments with top specialists, manage your health records, and experience care that puts you first.
            </p>
            <div className="pt-4">
              <Link to="/doctors" className="inline-block bg-white text-medical-blue font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1">
                Find a Doctor
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
             <div className="w-72 h-72 md:w-96 md:h-96 bg-white/20 rounded-full flex items-center justify-center p-8 backdrop-blur-sm border border-white/30 shadow-2xl">
                <ActivityIcon className="w-full h-full text-white opacity-80" />
             </div>
          </div>
        </div>
      </section>

      {/* Services / Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-medical-dark">Why Choose Us</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">We combine world-class medical expertise with cutting-edge technology to deliver the best patient experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments online 24/7 without waiting on hold.' },
              { icon: Award, title: 'Top Specialists', desc: 'Access to highly qualified and experienced medical professionals.' },
              { icon: Clock, title: 'Save Time', desc: 'Manage your entire family\'s health from one unified dashboard.' },
              { icon: Users, title: 'Patient First', desc: 'Dedicated support team ensuring your care journey is smooth.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-medical-light rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-medical-blue mb-4 shadow-sm">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-medical-dark">Our Featured Specialists</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Meet some of our top-rated medical professionals ready to assist you.</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDoctors.map(doctor => (
                <div key={doctor._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                  <div className="h-48 bg-gray-200 w-full object-cover flex items-center justify-center">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-medical-teal font-medium mb-3">{doctor.department}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.qualification}</p>
                    <div className="mt-auto">
                      <Link to={`/doctors/${doctor._id}`} className="block w-full text-center bg-medical-light text-medical-blue hover:bg-medical-blue hover:text-white border border-medical-blue/20 transition-colors py-2 rounded-lg font-medium">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {featuredDoctors.length === 0 && (
                <div className="col-span-3 text-center text-gray-500">No featured doctors found.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Simple icon for hero
function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

export default Home;
