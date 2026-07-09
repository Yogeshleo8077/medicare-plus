import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
}).required();

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { name, email, phone, password } = data;
      const response = await api.post('/auth/register', { name, email, phone, password });
      toast.success('Registration successful! Please check your email for the OTP.');
      
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-gradient-to-br from-medical-light to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 relative overflow-hidden">
      
      {/* Mobile background decorative blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-medical-teal opacity-20 rounded-full blur-3xl lg:hidden pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-medical-blue opacity-20 rounded-full blur-3xl lg:hidden pointer-events-none"></div>

      {/* Left side - Graphic/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-medical-teal to-medical-blue p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-medical-dark opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
        
        <div className="z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Join <br/>MediCare Plus Today
          </h1>
          <p className="text-xl text-blue-50 leading-relaxed">
            Create an account to start managing your health journey with the best doctors and AI-assisted care.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-[0.02]"></div>
        
        <div className="w-full max-w-md space-y-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl shadow-medical-teal/10 dark:shadow-black/40 border border-white/50 dark:border-slate-700/50 z-10 transition-all">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-medical-dark dark:text-white tracking-tight">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Fill in the details below to get started.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                {...register('name')}
                type="text"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal sm:text-sm transition-all shadow-sm"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal sm:text-sm transition-all shadow-sm"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                {...register('phone')}
                type="text"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal sm:text-sm transition-all shadow-sm"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal sm:text-sm transition-all shadow-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-medical-teal transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? "text" : "password"}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700/50 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal sm:text-sm transition-all shadow-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-medical-teal transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-medical-teal to-medical-blue hover:from-medical-blue hover:to-medical-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-teal transition-all duration-500 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-medical-teal hover:text-medical-blue dark:hover:text-blue-300 transition-colors duration-300">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
