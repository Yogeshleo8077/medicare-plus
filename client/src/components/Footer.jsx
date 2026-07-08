import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-300 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-7 w-7 text-teal-400 group-hover:animate-pulse" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">MediCare<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Plus</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Providing world-class medical care with state-of-the-art facilities and experienced specialists. Your health is our priority.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all hover:-translate-y-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-medical-blue to-medical-teal rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-all text-sm flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-teal-400"/> Home</Link></li>
              <li><Link to="/doctors" className="text-gray-400 hover:text-teal-400 transition-all text-sm flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-teal-400"/> Find Doctors</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-teal-400 transition-all text-sm flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-teal-400"/> Patient Portal</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-teal-400 transition-all text-sm flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-teal-400"/> Register</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Departments
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-medical-blue to-medical-teal rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></div> Cardiology</li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></div> Neurology</li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></div> Orthopedics</li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></div> Pediatrics</li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></div> General Medicine</li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-medical-blue to-medical-teal rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
              <li className="flex items-start group">
                <div className="p-2 rounded-lg bg-slate-900 group-hover:bg-medical-blue transition-colors mr-3 shrink-0"><MapPin className="h-4 w-4 text-teal-400 group-hover:text-white" /></div>
                <span className="pt-1">123 Health Ave, Medical District<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center group">
                <div className="p-2 rounded-lg bg-slate-900 group-hover:bg-medical-blue transition-colors mr-3 shrink-0"><Phone className="h-4 w-4 text-teal-400 group-hover:text-white" /></div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center group">
                <div className="p-2 rounded-lg bg-slate-900 group-hover:bg-medical-blue transition-colors mr-3 shrink-0"><Mail className="h-4 w-4 text-teal-400 group-hover:text-white" /></div>
                <span>support@medicareplus.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MediCare Plus. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
