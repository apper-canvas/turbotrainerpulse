import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginForm.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) newErrors.email = 'Email is invalid';
    
    if (!loginForm.password) newErrors.password = 'Password is required';
    else if (loginForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!signupForm.name) newErrors.name = 'Name is required';
    
    if (!signupForm.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) newErrors.email = 'Email is invalid';
    
    if (!signupForm.password) newErrors.password = 'Password is required';
    else if (signupForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!signupForm.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would handle the API response here
      localStorage.setItem('fittrack_token', 'dummy-token');
      localStorage.setItem('fittrack_user', JSON.stringify({
        id: '1',
        name: 'Demo User',
        email: loginForm.email,
        role: 'trainer'
      }));
      
      toast.success('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would handle the API response here
      localStorage.setItem('fittrack_token', 'dummy-token');
      localStorage.setItem('fittrack_user', JSON.stringify({
        id: '1',
        name: signupForm.name,
        email: signupForm.email,
        role: 'trainer'
      }));
      
      toast.success('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Registration failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const email = prompt('Please enter your email to reset your password:');
    if (email && /\S+@\S+\.\S+/.test(email)) {
      toast.info(`Password reset link sent to ${email}. Please check your inbox.`);
    } else if (email) {
      toast.error('Please enter a valid email address.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <Link to="/" className="absolute top-8 left-8 flex items-center text-primary hover:text-primary-dark">
        <ArrowLeft size={18} className="mr-1" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="card"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2 text-primary">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              {isLogin 
                ? 'Sign in to access your FitTrack Pro account' 
                : 'Join FitTrack Pro to manage your fitness training business'}
            </p>
          </div>
          
          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="yourname@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className={`input-field pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div className="flex justify-end mb-6">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Forgot password?
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type="text"
                    name="name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    className={`input-field pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="yourname@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    className={`input-field pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? 'Creating account...' : (
                  <>
                    Create Account <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-surface-600 dark:text-surface-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleForm}
                className="ml-1 text-primary hover:text-primary-dark font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;