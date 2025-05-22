import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Sun, Moon, Menu, X, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('fittrack_token') !== null;
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('fittrack_token') !== null);
  }, [location.pathname]);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navLinks = [
    { name: "Home", path: "/" }
  ];
  
  if (isAuthenticated) {
    navLinks.push(...[{ name: "Dashboard", path: "/dashboard" }, { name: "Clients", path: "/clients" }, { name: "Workouts", path: "/workouts" }]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-primary">
                    TrainerPulse
                  </span>
                </a>
              </div>
              
              {/* Desktop navigation */}
              <nav className="hidden md:ml-10 md:flex space-x-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.path}
                    href={link.path} 
                    className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary"
                  aria-label="Logout"
                >
                  <LogOut size={18} className="mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <a
                  href="/login"
                  className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Login / Signup
                </a>
              )}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-surface-200 dark:border-surface-800">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary dark:hover:text-primary"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                © 2023 TrainerPulse. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;