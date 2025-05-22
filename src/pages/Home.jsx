import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const DumbbellIcon = getIcon('dumbbell');
const UsersIcon = getIcon('users');
const ClipboardListIcon = getIcon('clipboard-list');
const BellIcon = getIcon('bell');

const Home = () => {
  const [activeTab, setActiveTab] = useState('clients');
  
  const handleDemoClick = () => {
    toast.info("This is a demo feature! In a real app, you'd see sample data here.", {
      icon: "🔍",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      id: 'clients',
      icon: UsersIcon,
      title: 'Client Management',
      description: 'Easily organize and track all your clients in one place. Add personal details, fitness goals, and track their progress over time.'
    },
    {
      id: 'workouts',
      icon: DumbbellIcon,
      title: 'Workout Plans',
      description: 'Create personalized workout routines for each client. Schedule sessions, assign exercises, and adjust difficulty based on progress.'
    },
    {
      id: 'progress',
      icon: ClipboardListIcon,
      title: 'Progress Tracking',
      description: 'Log workout results, measurements, and other metrics to visualize progress. Set milestones and celebrate achievements.'
    },
    {
      id: 'reminders',
      icon: BellIcon,
      title: 'Client Reminders',
      description: 'Send automated notifications to clients about upcoming sessions, missed workouts, or achievement of milestones.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary-dark text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
          </svg>
          <defs>
            <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Elevate Your Personal Training Business
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  Manage clients, create workout plans, and track progress all in one powerful platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn px-8 py-3 bg-white text-primary hover:bg-surface-100 focus:ring-white"
                    onClick={handleDemoClick}
                  >
                    Try Demo
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn px-8 py-3 bg-primary-dark hover:bg-primary-dark/90 text-white border border-white/20"
                    onClick={handleDemoClick}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-full max-w-md">
                  <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                      alt="TrainerPulse Dashboard" 
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Floating elements for visual interest */}
                  <div className="absolute -top-4 -right-4 h-16 w-16 bg-secondary rounded-lg shadow-lg flex items-center justify-center">
                    <DumbbellIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-accent rounded-lg shadow-lg flex items-center justify-center">
                    <UsersIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path 
              fill="currentColor" 
              fillOpacity="1" 
              className="text-surface-50 dark:text-surface-900"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,266.7C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface-50 dark:bg-surface-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              All the tools you need to<br/>grow your training business
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-surface-600 dark:text-surface-300 max-w-3xl mx-auto"
            >
              TrainerPulse helps you save time on admin work so you can focus on what matters most - your clients.
            </motion.p>
          </div>

          <div className="flex flex-wrap -mx-4 mb-12">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className={`neu-card flex flex-col items-center text-center transition-all duration-300 hover:translate-y-[-5px] ${
                    activeTab === feature.id ? 'border-2 border-primary' : ''
                  }`}
                  onClick={() => setActiveTab(feature.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-surface-600 dark:text-surface-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Feature Demo */}
      <section className="py-20 bg-surface-100 dark:bg-surface-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Try It Now
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-surface-600 dark:text-surface-300 max-w-3xl mx-auto"
            >
              Experience how easy it is to manage your fitness clients with our interactive demo.
            </motion.p>
          </div>

          <MainFeature />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to transform your training business?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl mb-8 opacity-90"
            >
              Join thousands of personal trainers who have streamlined their workflow with TrainerPulse.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn px-8 py-3 bg-white text-primary hover:bg-surface-100 focus:ring-white text-lg"
              onClick={handleDemoClick}
            >
              Get Started Today
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;