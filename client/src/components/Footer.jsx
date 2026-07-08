import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-medical-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Activity className="h-8 w-8 text-medical-teal" />
              <span className="font-bold text-2xl text-white tracking-tight">MediCare<span className="text-medical-teal">Plus</span></span>
            </Link>
            <p className="text-gray-400 text-sm">
              Providing world-class medical care with state-of-the-art facilities and experienced specialists. Your health is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-medical-teal transition-colors text-sm">Home</Link></li>
              <li><Link to="/doctors" className="text-gray-400 hover:text-medical-teal transition-colors text-sm">Find Doctors</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-medical-teal transition-colors text-sm">Patient Portal</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-medical-teal transition-colors text-sm">Register</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Departments</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Orthopedics</li>
              <li>Pediatrics</li>
              <li>General Medicine</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-medical-teal shrink-0" />
                <span>123 Health Avenue, Medical District<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-medical-teal shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-medical-teal shrink-0" />
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
