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
    <div className="bg-medical-light dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-medical-dark relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-medical-teal/40 to-medical-blue/20 blur-3xl opacity-50"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-medical-blue/40 to-purple-500/20 blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center py-24 md:py-32 relative z-10">
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Your Health, <br/> 
              <span className="gradient-text bg-gradient-to-r from-teal-300 to-blue-400">Our Priority</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg font-light leading-relaxed">
              Experience world-class healthcare with top specialists, seamless appointment booking, and comprehensive patient care in a state-of-the-art environment.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
              <Link to="/doctors" className="inline-block bg-gradient-to-r from-medical-blue to-medical-teal text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 text-center">
                Book Appointment
              </Link>
              <Link to="/login" className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all text-center">
                Patient Login
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center lg:justify-end">
             <div className="w-72 h-72 md:w-[450px] md:h-[450px] relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-medical-teal to-medical-blue rounded-[3rem] rotate-6 opacity-20 group-hover:rotate-12 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] -rotate-3 flex items-center justify-center p-8 shadow-2xl group-hover:rotate-0 transition-all duration-500">
                  <HeartPulse className="w-32 h-32 md:w-48 md:h-48 text-white animate-pulse" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Hospital Building" className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-medical-dark dark:text-white">About MediCare Plus</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                MediCare Plus is a leading healthcare institution dedicated to providing exceptional medical care. With over 20 years of excellence, we have been at the forefront of medical innovation, ensuring our patients receive the best treatments available.
              </p>
              <ul className="space-y-3">
                {['State-of-the-art facilities', 'Award-winning medical team', '24/7 Emergency support', 'Patient-centric approach'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
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
      <section className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-medical-dark dark:text-white">Why Choose Us</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We combine world-class medical expertise with cutting-edge technology to deliver the best patient experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments online 24/7 without waiting on hold.' },
              { icon: Award, title: 'Top Specialists', desc: 'Access to highly qualified and experienced medical professionals.' },
              { icon: Clock, title: 'Save Time', desc: 'Manage your entire family\'s health from one unified dashboard.' },
              { icon: Shield, title: 'Secure Records', desc: 'Your health data is protected with industry-leading security.' }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 rounded-[2rem] text-center transform hover:-translate-y-2 group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-700 dark:to-slate-600 text-medical-blue dark:text-teal-400 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-medical-dark dark:text-white">Our Featured Specialists</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Meet some of our top-rated medical professionals ready to assist you.</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDoctors.map(doctor => (
                <div key={doctor._id} className="glass-card rounded-[2rem] overflow-hidden flex flex-col group">
                  <div className="h-64 bg-gray-100 w-full overflow-hidden relative">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 glass px-4 py-1.5 rounded-full text-sm font-bold text-medical-dark">
                      {doctor.department}
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col bg-white dark:bg-slate-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-medical-blue transition-colors">{doctor.name}</h3>
                    <p className="text-gray-500 dark:text-gray-300 mb-6 font-light line-clamp-2">{doctor.qualification}</p>
                    
                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-slate-700">
                      <Link to={`/doctors/${doctor._id}`} className="block w-full text-center bg-gray-50 dark:bg-slate-700 text-medical-blue dark:text-teal-400 hover:bg-gradient-to-r hover:from-medical-blue hover:to-medical-teal hover:text-white dark:hover:text-white transition-all duration-300 py-3.5 rounded-xl font-semibold shadow-sm hover:shadow-md">
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
      <section className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-medical-dark dark:text-white">What Our Patients Say</h2>
          </div>
          <div className="overflow-hidden relative w-full pb-8">
            {/* Gradient overlays to soften the edges */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-50 dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-50 dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex gap-8 animate-marquee w-max hover:cursor-grab active:cursor-grabbing">
              {[
                { name: "Sarah Johnson", text: "The booking process was incredibly smooth. I didn't have to wait in line, and Dr. Smith was amazing." },
                { name: "Michael Chen", text: "I love the patient dashboard! I can see all my upcoming appointments and history in one place." },
                { name: "Emily Rodriguez", text: "The facilities are top-notch and the staff really cares. Highly recommend MediCare Plus to anyone." },
                { name: "David Wilson", text: "Best medical care I've ever received. The doctors are very professional and empathetic." },
                // Duplicate for seamless loop
                { name: "Sarah Johnson", text: "The booking process was incredibly smooth. I didn't have to wait in line, and Dr. Smith was amazing." },
                { name: "Michael Chen", text: "I love the patient dashboard! I can see all my upcoming appointments and history in one place." },
                { name: "Emily Rodriguez", text: "The facilities are top-notch and the staff really cares. Highly recommend MediCare Plus to anyone." },
                { name: "David Wilson", text: "Best medical care I've ever received. The doctors are very professional and empathetic." },
              ].map((review, i) => (
                <div key={i} className="glass-card p-8 rounded-[2rem] w-80 md:w-[400px] shrink-0">
                  <div className="flex space-x-1 text-yellow-400 mb-6">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 italic font-light leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal text-white flex items-center justify-center font-bold text-xl shadow-md">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-900 dark:text-white">{review.name}</p>
                      <p className="text-sm text-medical-blue dark:text-teal-400">Verified Patient</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
