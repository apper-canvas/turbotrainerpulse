import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const AlertTriangleIcon = getIcon('alert-triangle');

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-primary"
      >
        <AlertTriangleIcon size={80} />
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        404 - Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl text-surface-600 dark:text-surface-300 mb-8 max-w-md mx-auto"
      >
        Oops! It seems the page you're looking for has gone for a workout and hasn't returned yet.
      </motion.p>
      
      <motion.a
        href="/"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary px-8 py-3"
      >
        Back to Home
      </motion.a>
    </motion.div>
  );
};

export default NotFound;