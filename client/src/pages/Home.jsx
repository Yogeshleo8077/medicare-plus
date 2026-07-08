import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Award, Users, Star, CheckCircle, Shield, HeartPulse } from 'lucide-react';
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
      <section className="bg-gradient-to-r from-medical-blue to-medical-teal text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Your Health, <br/> Our Priority
            </h1>
            <p className="text-lg md:text-xl text-blue-50 max-w-lg">
              Experience world-class healthcare with top specialists, seamless appointment booking, and comprehensive patient care.
            </p>
            <div className="pt-4 flex space-x-4 justify-center md:justify-start">
              <Link to="/doctors" className="inline-block bg-white text-medical-blue font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1">
                Book Appointment
              </Link>
              <Link to="/login" className="inline-block bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                Patient Login
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
             <div className="w-80 h-80 md:w-96 md:h-96 bg-white/20 rounded-full flex items-center justify-center p-8 backdrop-blur-sm border border-white/30 shadow-2xl relative">
                <HeartPulse className="w-40 h-40 text-white animate-pulse" />
             </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Hospital Building" className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-medical-dark">About MediCare Plus</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                MediCare Plus is a leading healthcare institution dedicated to providing exceptional medical care. With over 20 years of excellence, we have been at the forefront of medical innovation, ensuring our patients receive the best treatments available.
              </p>
              <ul className="space-y-3">
                {['State-of-the-art facilities', 'Award-winning medical team', '24/7 Emergency support', 'Patient-centric approach'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-medical-teal mr-3" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Features */}
      <section className="py-20 bg-gray-50">
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
              { icon: Shield, title: 'Secure Records', desc: 'Your health data is protected with industry-leading security.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl text-center shadow-sm hover:shadow-lg transition-shadow border border-gray-100 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-medical-blue mb-4 shadow-sm">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 bg-white">
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
                <div key={doctor._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col group">
                  <div className="h-56 bg-gray-200 w-full overflow-hidden relative">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-medical-teal shadow">
                      {doctor.department}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{doctor.qualification}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link to={`/doctors/${doctor._id}`} className="block w-full text-center bg-gray-50 text-medical-blue hover:bg-medical-blue hover:text-white transition-colors py-2.5 rounded-lg font-semibold">
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {featuredDoctors.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300">
                  No featured doctors found. Admin needs to flag doctors as featured.
                </div>
              )}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/doctors" className="inline-flex items-center text-medical-blue font-semibold hover:text-medical-teal">
              View All Doctors <Users className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-medical-dark">What Our Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", text: "The booking process was incredibly smooth. I didn't have to wait in line, and Dr. Smith was amazing." },
              { name: "Michael Chen", text: "I love the patient dashboard! I can see all my upcoming appointments and history in one place." },
              { name: "Emily Rodriguez", text: "The facilities are top-notch and the staff really cares. Highly recommend MediCare Plus to anyone." }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex space-x-1 text-yellow-400 mb-4">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-medical-blue text-white flex items-center justify-center font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
