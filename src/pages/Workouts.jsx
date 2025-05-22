import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Icons
const DumbbellIcon = getIcon('dumbbell');
const ClipboardListIcon = getIcon('clipboard-list');
const UsersIcon = getIcon('users');
const PlusIcon = getIcon('plus');
const EditIcon = getIcon('edit');
const TrashIcon = getIcon('trash');
const XIcon = getIcon('x');
const CheckIcon = getIcon('check');
const SearchIcon = getIcon('search');
const ClockIcon = getIcon('clock');
const CalendarIcon = getIcon('calendar');
const ZapIcon = getIcon('zap');
const LayersIcon = getIcon('layers');
const ArrowRightIcon = getIcon('arrow-right');
const RepeatIcon = getIcon('repeat');
const FilterIcon = getIcon('filter');
const ActivityIcon = getIcon('activity');
const UserIcon = getIcon('user');

// Sample exercise categories with icons
const exerciseCategories = [
  { id: 'strength', name: 'Strength', icon: DumbbellIcon },
  { id: 'cardio', name: 'Cardio', icon: ActivityIcon },
  { id: 'flexibility', name: 'Flexibility', icon: ZapIcon },
  { id: 'balance', name: 'Balance', icon: LayersIcon },
  { id: 'recovery', name: 'Recovery', icon: RepeatIcon }
];

// Initial sample workout plans
const initialWorkoutPlans = [
  {
    id: '1',
    name: 'Beginner Strength Training',
    description: 'A simple strength workout for beginners focusing on the major muscle groups.',
    category: 'strength',
    difficulty: 'beginner',
    duration: 45,
    exercises: [
      { id: 'ex1', name: 'Bodyweight Squats', sets: 3, reps: 15, rest: 60, notes: 'Keep chest up, weight in heels' },
      { id: 'ex2', name: 'Push-ups (or Modified Push-ups)', sets: 3, reps: 10, rest: 60, notes: 'Keep core engaged' },
      { id: 'ex3', name: 'Dumbbell Rows', sets: 3, reps: 12, rest: 60, notes: '10-15 lb dumbbells' },
      { id: 'ex4', name: 'Plank', sets: 3, duration: 30, rest: 60, notes: 'Hold for 30 seconds' }
    ],
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'HIIT Cardio Blast',
    description: 'High-intensity interval training to boost cardiovascular fitness and burn calories.',
    category: 'cardio',
    difficulty: 'intermediate',
    duration: 30,
    exercises: [
      { id: 'ex1', name: 'Jumping Jacks', duration: 45, rest: 15, notes: 'Full range of motion' },
      { id: 'ex2', name: 'Mountain Climbers', duration: 45, rest: 15, notes: 'Keep hips stable' },
      { id: 'ex3', name: 'Burpees', duration: 45, rest: 15, notes: 'Modify as needed' },
      { id: 'ex4', name: 'High Knees', duration: 45, rest: 15, notes: 'Bring knees above hip level' },
      { id: 'ex5', name: 'Rest', duration: 60, rest: 0, notes: 'Complete recovery' }
    ],
    createdAt: '2023-02-03'
  }
];

// Initial sample workout assignments
const initialWorkoutAssignments = [
  {
    id: 'a1',
    workoutPlanId: '1',
    clientId: '1',
    clientName: 'Emma Wilson',
    assignedDate: '2023-05-10',
    dueDate: '2023-05-12',
    status: 'completed',
    completedDate: '2023-05-12',
    notes: 'First time with weights - went well!',
    feedback: 'Felt challenging but doable. My legs are sore!'
  },
  {
    id: 'a2',
    workoutPlanId: '2',
    clientId: '2',
    clientName: 'Michael Chen',
    assignedDate: '2023-05-15',
    dueDate: '2023-05-17',
    status: 'assigned',
    completedDate: null,
    notes: 'Focus on proper form for burpees',
    feedback: ''
  }
];

const Workouts = () => {
  // State management
  const [activeTab, setActiveTab] = useState('plans');
  const [workoutPlans, setWorkoutPlans] = useState(() => {
    const savedWorkouts = localStorage.getItem('trainerpulse-workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : initialWorkoutPlans;
  });
  
  const [workoutAssignments, setWorkoutAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem('trainerpulse-workout-assignments');
    return savedAssignments ? JSON.parse(savedAssignments) : initialWorkoutAssignments;
  });
  
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('trainerpulse-clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('workout'); // workout, exercise, assign
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formErrors, setFormErrors] = useState({});
  
  // Empty form templates
  const emptyWorkoutForm = {
    name: '',
    description: '',
    category: 'strength',
    difficulty: 'beginner',
    duration: 30,
    exercises: []
  };
  
  const emptyExerciseForm = {
    name: '',
    sets: 3,
    reps: 10,
    duration: 0,
    rest: 60,
    notes: ''
  };
  
  const emptyAssignmentForm = {
    workoutPlanId: '',
    clientId: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    notes: ''
  };

  // Save data to localStorage when they change
  useEffect(() => {
    localStorage.setItem('trainerpulse-workouts', JSON.stringify(workoutPlans));
  }, [workoutPlans]);
  
  useEffect(() => {
    localStorage.setItem('trainerpulse-workout-assignments', JSON.stringify(workoutAssignments));
  }, [workoutAssignments]);

  // Filter workout plans based on search term and category filter
  const filteredWorkoutPlans = workoutPlans.filter(plan => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterCategory === 'all' || 
      plan.category === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  // Filter workout assignments based on search term
  const filteredWorkoutAssignments = workoutAssignments.filter(assignment => {
    const matchingWorkout = workoutPlans.find(plan => plan.id === assignment.workoutPlanId);
    
    return assignment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (matchingWorkout && matchingWorkout.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Get workout name by ID
  const getWorkoutNameById = (id) => {
    const workout = workoutPlans.find(plan => plan.id === id);
    return workout ? workout.name : 'Unknown Workout';
  };

  // Open modal for adding a new workout plan
  const handleAddWorkout = () => {
    setCurrentWorkout(emptyWorkoutForm);
    setIsEditing(false);
    setModalType('workout');
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for editing an existing workout plan
  const handleEditWorkout = (workout) => {
    setCurrentWorkout({...workout});
    setIsEditing(true);
    setModalType('workout');
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for adding a new exercise to a workout plan
  const handleAddExercise = () => {
    setCurrentExercise({...emptyExerciseForm, id: Date.now().toString()});
    setIsEditing(false);
    setModalType('exercise');
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for editing an existing exercise
  const handleEditExercise = (exercise, index) => {
    setCurrentExercise({...exercise, index});
    setIsEditing(true);
    setModalType('exercise');
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for assigning a workout to a client
  const handleAssignWorkout = (workout) => {
    setCurrentWorkout(workout);
    setCurrentAssignment({...emptyAssignmentForm, workoutPlanId: workout.id});
    setModalType('assign');
    setFormErrors({});
    setModalOpen(true);
  };

  // Handle form input changes for workout
  const handleWorkoutInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for exercise
  const handleExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'notes' ? value : parseInt(value, 10) || 0
    }));
  };

  // Handle form input changes for assignment
  const handleAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAssignment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate workout form
  const validateWorkoutForm = () => {
    const errors = {};
    if (!currentWorkout.name.trim()) errors.name = 'Workout name is required';
    if (!currentWorkout.description.trim()) errors.description = 'Description is required';
    if (currentWorkout.duration <= 0) errors.duration = 'Duration must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate exercise form
  const validateExerciseForm = () => {
    const errors = {};
    if (!currentExercise.name.trim()) errors.name = 'Exercise name is required';
    
    // Check that either reps or duration is set (but not necessarily both)
    if (currentExercise.reps <= 0 && currentExercise.duration <= 0) {
      errors.reps = 'Either reps or duration must be specified';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate assignment form
  const validateAssignmentForm = () => {
    const errors = {};
    if (!currentAssignment.clientId) errors.clientId = 'Client selection is required';
    if (!currentAssignment.dueDate) errors.dueDate = 'Due date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save workout plan (add new or update existing)
  const handleSaveWorkout = () => {
    if (!validateWorkoutForm()) return;
    
    if (isEditing) {
      // Update existing workout plan
      setWorkoutPlans(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === currentWorkout.id ? currentWorkout : workout
        )
      );
      toast.success(`Workout plan "${currentWorkout.name}" updated successfully!`);
    } else {
      // Add new workout plan
      const newWorkout = {
        ...currentWorkout,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        exercises: []
      };
      setWorkoutPlans(prevWorkouts => [...prevWorkouts, newWorkout]);
      toast.success(`Workout plan "${newWorkout.name}" created successfully!`);
    }
    
    setModalOpen(false);
  };

  // Save exercise to current workout
  const handleSaveExercise = () => {
    if (!validateExerciseForm()) return;
    
    const updatedWorkout = {...currentWorkout};
    
    if (isEditing) {
      // Update existing exercise
      const { index, ...exerciseData } = currentExercise;
      updatedWorkout.exercises[index] = exerciseData;
      toast.success(`Exercise "${exerciseData.name}" updated successfully!`);
    } else {
      // Add new exercise
      updatedWorkout.exercises.push(currentExercise);
      toast.success(`Exercise "${currentExercise.name}" added successfully!`);
    }
    
    setCurrentWorkout(updatedWorkout);
    setModalOpen(false);
  };

  // Save workout assignment
  const handleSaveAssignment = () => {
    if (!validateAssignmentForm()) return;
    
    // Find client name for the assignment
    const client = clients.find(c => c.id === currentAssignment.clientId);
    const clientName = client ? client.name : 'Unknown Client';
    
    // Create new assignment
    const newAssignment = {
      ...currentAssignment,
      id: Date.now().toString(),
      clientName,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'assigned',
      completedDate: null,
      feedback: ''
    };
    
    setWorkoutAssignments(prev => [...prev, newAssignment]);
    toast.success(`Workout "${getWorkoutNameById(currentAssignment.workoutPlanId)}" assigned to ${clientName}!`);
    setModalOpen(false);
  };

  // Delete a workout plan
  const handleDeleteWorkout = (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout plan? This will also delete any assignments related to this workout.')) {
      const workoutToDelete = workoutPlans.find(workout => workout.id === workoutId);
      
      // Delete the workout plan
      setWorkoutPlans(prevWorkouts => prevWorkouts.filter(workout => workout.id !== workoutId));
      
      // Delete any assignments associated with this workout
      setWorkoutAssignments(prevAssignments => 
        prevAssignments.filter(assignment => assignment.workoutPlanId !== workoutId)
      );
      
      toast.info(`Workout plan "${workoutToDelete.name}" has been deleted`);
    }
  };

  // Delete an exercise from current workout
  const handleDeleteExercise = (index) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      const updatedWorkout = {...currentWorkout};
      const exerciseName = updatedWorkout.exercises[index].name;
      
      updatedWorkout.exercises.splice(index, 1);
      setCurrentWorkout(updatedWorkout);
      
      toast.info(`Exercise "${exerciseName}" has been removed from the workout`);
    }
  };

  // Update assignment status
  const handleUpdateAssignmentStatus = (assignmentId, newStatus) => {
    setWorkoutAssignments(prevAssignments => 
      prevAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          const updated = { 
            ...assignment, 
            status: newStatus,
            completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
          };
          
          toast.success(`Workout status updated to ${newStatus}`);
          return updated;
        }
        return assignment;
      })
    );
  };

  // Delete a workout assignment
  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this workout assignment?')) {
      const assignmentToDelete = workoutAssignments.find(assignment => assignment.id === assignmentId);
      
      setWorkoutAssignments(prevAssignments => 
        prevAssignments.filter(assignment => assignment.id !== assignmentId)
      );
      
      toast.info(`Workout assignment for ${assignmentToDelete.clientName} has been deleted`);
    }
  };

  // Get difficulty badge style
  const getDifficultyBadgeStyle = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'missed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <DumbbellIcon className="mr-3 h-8 w-8 text-primary" />
          Workouts
        </h1>
        <p className="text-surface-600 dark:text-surface-300">
          Create and manage workout plans for your clients
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-3 font-medium text-sm flex items-center ${
            activeTab === 'plans'
              ? 'border-b-2 border-primary text-primary'
              : 'text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary'
          }`}
        >
          <ClipboardListIcon className="mr-2 h-4 w-4" />
          My Workout Plans
        </button>
        <button
          onClick={() => setActiveTab('assigned')}
          className={`px-4 py-3 font-medium text-sm flex items-center ${
            activeTab === 'assigned'
              ? 'border-b-2 border-primary text-primary'
              : 'text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary'
          }`}
        >
          <UsersIcon className="mr-2 h-4 w-4" />
          Assigned Workouts
        </button>
      </div>

      {/* Workout Plans Tab */}
      {activeTab === 'plans' && (
        <div className="card bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
          {/* Header with search and filters */}
          <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-semibold flex items-center">
              <ClipboardListIcon className="mr-2 h-5 w-5 text-primary" />
              Workout Plans
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {exerciseCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddWorkout}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">New Workout</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Workout Plan Cards */}
          <div className="p-4 md:p-6">
            {filteredWorkoutPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkoutPlans.map((workout) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{workout.name}</h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadgeStyle(workout.difficulty)}`}>
                            {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                          </span>
                          
                          <span className="flex items-center text-surface-500 dark:text-surface-400 text-xs">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {workout.duration} min
                          </span>
                          
                          <span className="flex items-center text-surface-500 dark:text-surface-400 text-xs">
                            <LayersIcon className="h-3 w-3 mr-1" />
                            {workout.exercises.length} exercises
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditWorkout(workout)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md"
                          aria-label="Edit workout"
                        >
                          <EditIcon className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                          aria-label="Delete workout"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-surface-600 dark:text-surface-300 text-sm mb-4 line-clamp-2">
                        {workout.description}
                      </p>
                      
                      <div className="mb-4">
                        <h5 className="font-semibold text-sm mb-2 flex items-center">
                          <DumbbellIcon className="h-4 w-4 mr-1 text-primary" />
                          Exercises
                        </h5>
                        <div className="max-h-40 overflow-y-auto">
                          {workout.exercises.length > 0 ? (
                            <ul className="space-y-1.5">
                              {workout.exercises.map((exercise, index) => (
                                <li key={exercise.id} className="text-sm flex justify-between items-center py-1 border-b border-surface-100 dark:border-surface-700">
                                  <div className="flex-1">
                                    <div className="font-medium">{exercise.name}</div>
                                    <div className="text-xs text-surface-500 dark:text-surface-400">
                                      {exercise.sets && exercise.reps ? `${exercise.sets} sets × ${exercise.reps} reps` : 
                                      exercise.duration ? `Duration: ${exercise.duration}s` : ''}
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleEditExercise(exercise, index)}
                                    className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md"
                                  >
                                    <EditIcon className="h-3.5 w-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-surface-500 dark:text-surface-400 italic">
                              No exercises added yet
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleAssignWorkout(workout)}
                          className="btn btn-primary btn-sm flex items-center"
                        >
                          <UsersIcon className="h-3.5 w-3.5 mr-1" />
                          Assign to Client
                        </button>
                        
                        <button
                          onClick={() => {
                            setCurrentWorkout(workout);
                            handleAddExercise();
                          }}
                          className="btn btn-outline btn-sm flex items-center"
                        >
                          <PlusIcon className="h-3.5 w-3.5 mr-1" />
                          Add Exercise
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-700">
                    <ClipboardListIcon className="h-10 w-10 text-surface-500 dark:text-surface-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No workout plans found</h3>
                <p className="text-surface-600 dark:text-surface-300 mb-6">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Try changing your search or filter criteria' 
                    : 'Create your first workout plan to get started'}
                </p>
                <button
                  onClick={handleAddWorkout}
                  className="btn btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Workout Plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assigned Workouts Tab */}
      {activeTab === 'assigned' && (
        <div className="card bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
          {/* Header with search */}
          <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-semibold flex items-center">
              <UsersIcon className="mr-2 h-5 w-5 text-primary" />
              Assigned Workouts
            </h3>
            
            <div className="relative flex-grow sm:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search client or workout..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Assigned Workouts List */}
          <div className="overflow-x-auto">
            {filteredWorkoutAssignments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-surface-100 dark:bg-surface-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider">
                      Workout
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-300 tracking-wider hidden md:table-cell">
                      Due Date
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
                  {filteredWorkoutAssignments.map((assignment) => (
                    <motion.tr 
                      key={assignment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {assignment.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">{assignment.clientName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium">{getWorkoutNameById(assignment.workoutPlanId)}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-surface-500 dark:text-surface-400" />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(assignment.status)}`}>
                          {assignment.status === 'assigned' && 'Assigned'}
                          {assignment.status === 'in_progress' && 'In Progress'}
                          {assignment.status === 'completed' && 'Completed'}
                          {assignment.status === 'missed' && 'Missed'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <select
                            value={assignment.status}
                            onChange={(e) => handleUpdateAssignmentStatus(assignment.id, e.target.value)}
                            className="p-1 text-xs rounded border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
                          >
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="missed">Missed</option>
                          </select>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                            aria-label="Delete assignment"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-700">
                    <UsersIcon className="h-10 w-10 text-surface-500 dark:text-surface-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No assigned workouts found</h3>
                <p className="text-surface-600 dark:text-surface-300 mb-6">
                  {searchTerm
                    ? 'Try changing your search criteria' 
                    : 'Create a workout and assign it to a client to get started'}
                </p>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="btn btn-primary inline-flex items-center"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Go to Workout Plans
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
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
                {/* Workout Form */}
                {modalType === 'workout' && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold leading-6">
                        {isEditing ? 'Edit Workout Plan' : 'Create New Workout Plan'}
                      </h3>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveWorkout();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                          Workout Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={currentWorkout?.name || ''}
                          onChange={handleWorkoutInputChange}
                          className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                          placeholder="e.g., Full Body Strength"
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="description">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={currentWorkout?.description || ''}
                          onChange={handleWorkoutInputChange}
                          rows="3"
                          className={`input-field resize-none ${formErrors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                          placeholder="Brief description of the workout"
                        ></textarea>
                        {formErrors.description && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="category">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={currentWorkout?.category || 'strength'}
                            onChange={handleWorkoutInputChange}
                            className="input-field"
                          >
                            {exerciseCategories.map(category => (
                              <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="difficulty">
                            Difficulty
                          </label>
                          <select
                            id="difficulty"
                            name="difficulty"
                            value={currentWorkout?.difficulty || 'beginner'}
                            onChange={handleWorkoutInputChange}
                            className="input-field"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="duration">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="duration"
                          name="duration"
                          value={currentWorkout?.duration || 30}
                          onChange={handleWorkoutInputChange}
                          min="1"
                          max="240"
                          className={`input-field ${formErrors.duration ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.duration && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.duration}</p>
                        )}
                      </div>
                      
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
                          className="btn btn-primary"
                        >
                          {isEditing ? 'Update Workout' : 'Create Workout'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
                
                {/* Exercise Form */}
                {modalType === 'exercise' && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold leading-6">
                        {isEditing ? 'Edit Exercise' : 'Add Exercise'}
                      </h3>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveExercise();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="exerciseName">
                          Exercise Name
                        </label>
                        <input
                          type="text"
                          id="exerciseName"
                          name="name"
                          value={currentExercise?.name || ''}
                          onChange={handleExerciseInputChange}
                          className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                          placeholder="e.g., Squat, Push-up, Plank"
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="sets">
                            Sets
                          </label>
                          <input
                            type="number"
                            id="sets"
                            name="sets"
                            value={currentExercise?.sets || 0}
                            onChange={handleExerciseInputChange}
                            min="0"
                            max="20"
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="reps">
                            Reps
                          </label>
                          <input
                            type="number"
                            id="reps"
                            name="reps"
                            value={currentExercise?.reps || 0}
                            onChange={handleExerciseInputChange}
                            min="0"
                            max="100"
                            className={`input-field ${formErrors.reps ? 'border-red-500 dark:border-red-500' : ''}`}
                          />
                          {formErrors.reps && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.reps}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="rest">
                            Rest (sec)
                          </label>
                          <input
                            type="number"
                            id="rest"
                            name="rest"
                            value={currentExercise?.rest || 0}
                            onChange={handleExerciseInputChange}
                            min="0"
                            max="300"
                            className="input-field"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="duration">
                          Duration (sec, for timed exercises)
                        </label>
                        <input
                          type="number"
                          id="duration"
                          name="duration"
                          value={currentExercise?.duration || 0}
                          onChange={handleExerciseInputChange}
                          min="0"
                          max="600"
                          className="input-field"
                          placeholder="0 (use for timed exercises only)"
                        />
                        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                          For timed exercises like planks. Leave at 0 if using sets and reps.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="notes">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={currentExercise?.notes || ''}
                          onChange={handleExerciseInputChange}
                          rows="2"
                          className="input-field resize-none"
                          placeholder="Form cues, modifications, etc."
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end space-x-3 mt-6">
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(currentExercise.index)}
                            className="btn border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          {isEditing ? 'Update' : 'Add'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
                
                {/* Assign Workout Form */}
                {modalType === 'assign' && (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold leading-6">
                        Assign Workout to Client
                      </h3>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-4 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                      <p className="font-medium text-primary">
                        {currentWorkout?.name}
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                        {currentWorkout?.exercises.length} exercises · {currentWorkout?.duration} min
                      </p>
                    </div>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveAssignment();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="clientId">
                          Select Client
                        </label>
                        <select
                          id="clientId"
                          name="clientId"
                          value={currentAssignment?.clientId || ''}
                          onChange={handleAssignmentInputChange}
                          className={`input-field ${formErrors.clientId ? 'border-red-500 dark:border-red-500' : ''}`}
                        >
                          <option value="">-- Select a client --</option>
                          {clients.filter(c => c.status === 'active').map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                        {formErrors.clientId && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.clientId}</p>
                        )}
                        {clients.length === 0 && (
                          <p className="mt-1 text-sm text-yellow-500">
                            You don't have any active clients. Add clients first.
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="dueDate">
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          value={currentAssignment?.dueDate || ''}
                          onChange={handleAssignmentInputChange}
                          className={`input-field ${formErrors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {formErrors.dueDate && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.dueDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="notes">
                          Notes for Client
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={currentAssignment?.notes || ''}
                          onChange={handleAssignmentInputChange}
                          rows="3"
                          className="input-field resize-none"
                          placeholder="Any specific instructions or focus areas for this workout"
                        ></textarea>
                      </div>
                      
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
                          className="btn btn-primary"
                          disabled={clients.length === 0}
                        >
                          <UsersIcon className="h-4 w-4 mr-1" />
                          Assign Workout
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workouts;
