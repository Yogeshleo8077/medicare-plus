import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error('Please enter both OTP and new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-gradient-to-br from-medical-light to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 relative overflow-hidden">
      
      {/* Mobile background decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-gray-500 opacity-10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-medical-blue opacity-10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>

      {/* Left side - Graphic/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-medical-blue opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
        
        <div className="z-10 max-w-lg">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Secure Password <br/>Recovery
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Don't worry if you forgot your password. We'll help you get back to managing your health in no time.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-[0.02]"></div>
        
        <div className="w-full max-w-md space-y-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-white/50 dark:border-slate-700/50 z-10 transition-all my-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-medical-dark dark:text-white tracking-tight">
              {step === 1 ? 'Reset Password' : 'Verify & Reset'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {step === 1 
                ? "Enter your email address to receive an OTP."
                : `We've sent a 6-digit OTP to ${email}`
              }
            </p>
          </div>

          {step === 1 ? (
            <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue sm:text-sm transition-all shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-gray-800 to-slate-900 hover:from-slate-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-all duration-500 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">One Time Password (OTP)</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue sm:text-sm tracking-widest text-center text-2xl font-bold transition-all shadow-sm"
                    placeholder="••••••"
                    maxLength="6"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none rounded-xl relative block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue sm:text-sm transition-all shadow-sm pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-medical-blue dark:hover:text-medical-teal transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-teal hover:to-medical-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue transition-all duration-500 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Entered wrong email? Try again
                </button>
              </div>
            </form>
          )}
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-gray-900 dark:text-white hover:underline transition-colors duration-300">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
