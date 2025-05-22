import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const UserPlusIcon = getIcon('user-plus');
const UsersIcon = getIcon('users');
const CheckCircleIcon = getIcon('check-circle');
const XCircleIcon = getIcon('x-circle');
const EditIcon = getIcon('edit');
const TrashIcon = getIcon('trash');
const PlusIcon = getIcon('plus');
const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');
const DumbbellIcon = getIcon('dumbbell');
const TargetIcon = getIcon('target');

// Initial demo data
const initialClients = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    phone: '(555) 123-4567',
    goals: 'Weight loss, Improve cardio endurance',
    startDate: '2023-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '(555) 987-6543',
    goals: 'Muscle gain, Strength training',
    startDate: '2023-02-03',
    status: 'active'
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@example.com',
    phone: '(555) 246-8135',
    goals: 'General fitness, Flexibility',
    startDate: '2023-03-10',
    status: 'inactive'
  }
];

const MainFeature = () => {
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('trainerpulse-clients');
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Empty form template
  const emptyClientForm = {
    name: '',
    email: '',
    phone: '',
    goals: '',
    status: 'active'
  };

  // Save clients to localStorage when they change
  useEffect(() => {
    localStorage.setItem('trainerpulse-clients', JSON.stringify(clients));
  }, [clients]);

  // Filter clients based on search term and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.goals.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Open modal for adding a new client
  const handleAddClient = () => {
    setCurrentClient(emptyClientForm);
    setIsEditing(false);
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for editing an existing client
  const handleEditClient = (client) => {
    setCurrentClient(client);
    setIsEditing(true);
    setFormErrors({});
    setModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!currentClient.name.trim()) errors.name = 'Name is required';
    if (!currentClient.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(currentClient.email)) {
      errors.email = 'Email is invalid';
    }
    if (!currentClient.phone.trim()) errors.phone = 'Phone is required';
    if (!currentClient.goals.trim()) errors.goals = 'Goals are required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save client (add new or update existing)
  const handleSaveClient = () => {
    if (!validateForm()) return;
    
    if (isEditing) {
      // Update existing client
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === currentClient.id ? currentClient : client
        )
      );
      toast.success(`Client ${currentClient.name} updated successfully!`);
    } else {
      // Add new client
      const newClient = {
        ...currentClient,
        id: Date.now().toString(),
        startDate: new Date().toISOString().split('T')[0]
      };
      setClients(prevClients => [...prevClients, newClient]);
      toast.success(`Client ${newClient.name} added successfully!`);
    }
    
    setModalOpen(false);
  };

  // Delete a client
  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const clientToDelete = clients.find(client => client.id === clientId);
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      toast.info(`Client ${clientToDelete.name} has been deleted`);
    }
  };

  // Toggle client status between active and inactive
  const toggleClientStatus = (clientId) => {
    setClients(prevClients => 
      prevClients.map(client => {
        if (client.id === clientId) {
          const newStatus = client.status === 'active' ? 'inactive' : 'active';
          toast.info(`Client ${client.name} marked as ${newStatus}`);
          return { ...client, status: newStatus };
        }
        return client;
      })
    );
  };

  return (
    <div className="card bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
      {/* Header with search and filters */}
      <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold flex items-center">
          <UsersIcon className="mr-2 h-5 w-5 text-primary" />
          Client Management
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClient}
              className="btn btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Add Client</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Client list */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-100 dark:bg-surface-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider hidden md:table-cell">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider hidden lg:table-cell">
                Goals
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <motion.tr 
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{client.name}</div>
                        <div className="text-sm text-surface-500 dark:text-surface-400 md:hidden">
                          {client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm">{client.email}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">{client.phone}</div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-start text-sm">
                      <TargetIcon className="h-4 w-4 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">{client.goals}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleClientStatus(client.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                      }`}
                    >
                      {client.status === 'active' ? (
                        <>
                          <CheckCircleIcon className="mr-1 h-3.5 w-3.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="mr-1 h-3.5 w-3.5" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClient(client)}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md"
                        aria-label="Edit client"
                      >
                        <EditIcon className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                        aria-label="Delete client"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm text-surface-500 dark:text-surface-400">
                  <div className="flex flex-col items-center justify-center">
                    <UsersIcon className="h-10 w-10 text-surface-400 dark:text-surface-600 mb-2" />
                    <p>No clients found. Try changing your search or filters.</p>
                    <button
                      onClick={handleAddClient}
                      className="mt-4 btn btn-primary"
                    >
                      Add Your First Client
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Client Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 bg-black/25 dark:bg-black/50"
                onClick={() => setModalOpen(false)}
              ></motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="transform rounded-lg bg-white dark:bg-surface-800 p-6 text-left shadow-xl transition-all w-full max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold leading-6 flex items-center">
                    {isEditing ? (
                      <>
                        <EditIcon className="mr-2 h-5 w-5 text-primary" />
                        Edit Client
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="mr-2 h-5 w-5 text-primary" />
                        Add New Client
                      </>
                    )}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Client Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveClient();
                  }}
                  className="space-y-4"
                >
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentClient?.name || ''}
                      onChange={handleInputChange}
                      className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={currentClient?.email || ''}
                      onChange={handleInputChange}
                      className={`input-field ${formErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  
                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={currentClient?.phone || ''}
                      onChange={handleInputChange}
                      className={`input-field ${formErrors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  {/* Goals Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="goals">
                      Fitness Goals
                    </label>
                    <textarea
                      id="goals"
                      name="goals"
                      value={currentClient?.goals || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className={`input-field resize-none ${formErrors.goals ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Weight loss, muscle gain, flexibility, etc."
                    ></textarea>
                    {formErrors.goals && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.goals}</p>
                    )}
                  </div>
                  
                  {/* Status Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={currentClient?.status || 'active'}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  {/* Form Buttons */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      {isEditing ? 'Update Client' : 'Add Client'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;