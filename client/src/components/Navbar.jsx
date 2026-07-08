import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Activity } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-medical-blue" />
              <span className="font-bold text-xl text-medical-dark tracking-tight">MediCare<span className="text-medical-teal">Plus</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-medical-blue transition-colors font-medium">Home</Link>
            <Link to="/doctors" className="text-gray-600 hover:text-medical-blue transition-colors font-medium">Find Doctors</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                  className="text-gray-600 hover:text-medical-blue font-medium"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-medical-dark text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-medical-blue font-medium hover:text-medical-dark transition-colors">Log In</Link>
                <Link to="/register" className="px-4 py-2 rounded-md bg-medical-blue text-white hover:bg-medical-teal transition-colors text-sm font-medium shadow-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Home</Link>
            <Link to="/doctors" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Find Doctors</Link>
            
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Log In</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-medical-blue hover:bg-blue-50">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
