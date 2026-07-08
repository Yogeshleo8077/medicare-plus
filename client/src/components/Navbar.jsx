import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Activity, Sun, Moon, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-7 w-7 text-medical-blue dark:text-teal-400 group-hover:animate-pulse" />
              </div>
              <span className="font-extrabold text-2xl text-medical-dark dark:text-white tracking-tight">MediCare<span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-medical-teal">Plus</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative text-gray-600 dark:text-gray-300 hover:text-medical-blue dark:hover:text-teal-400 transition-colors font-medium group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-blue dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/doctors" className="relative text-gray-600 dark:text-gray-300 hover:text-medical-blue dark:hover:text-teal-400 transition-colors font-medium group">
              Find Doctors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-blue dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-medical-blue dark:hover:text-teal-400 transition-colors font-medium group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-medical-blue to-medical-teal text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{user.name ? user.name.split(' ')[0] : 'Dashboard'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-medical-blue dark:hover:border-teal-400 hover:text-medical-blue dark:hover:text-teal-400 transition-all text-sm font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 font-bold hover:text-medical-blue dark:hover:text-teal-400 transition-colors">Log In</Link>
                <Link to="/register" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-medical-blue to-medical-teal text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 text-sm font-bold">Sign Up</Link>
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
        <div className="md:hidden glass border-t border-gray-100 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-blue hover:bg-gray-50 dark:hover:bg-slate-800">Home</Link>
            <Link to="/doctors" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-blue hover:bg-gray-50 dark:hover:bg-slate-800">Find Doctors</Link>
            
            <button 
              onClick={toggleTheme} 
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <><Sun className="w-5 h-5 mr-3 text-yellow-400" /> Light Mode</> : <><Moon className="w-5 h-5 mr-3" /> Dark Mode</>}
            </button>

            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-blue hover:bg-gray-50 dark:hover:bg-slate-800">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-blue hover:bg-gray-50 dark:hover:bg-slate-800">Log In</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-medical-blue hover:bg-blue-50 dark:hover:bg-slate-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
