import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  ListTodo,
  CheckSquare,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Save (Create or Edit)
  const handleSaveTask = async (formData) => {
    if (taskToEdit) {
      // Update
      const res = await api.put(`/tasks/${taskToEdit._id}`, formData);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskToEdit._id ? res.data.data : t))
        );
      }
    } else {
      // Create
      const res = await api.post('/tasks', formData);
      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
      }
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      // Revert if error
      fetchTasks();
    }
  };

  // Handle Delete
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Optimistic delete
      setTasks((prev) => prev.filter((t) => t._id !== id));
      try {
        await api.delete(`/tasks/${id}`);
      } catch (err) {
        console.error('Failed to delete task:', err);
        fetchTasks();
      }
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

        // Status filter
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

        // Priority filter
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'dueDate_asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'dueDate_desc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        return 0;
      });
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header & New Task button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Task Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your tasks, track progress, and boost your daily productivity.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Task
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Tasks
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ListTodo className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-800">{totalTasks}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{completedTasks}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                In Progress
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-700">{inProgressTasks}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completion
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-800">{completionRate}%</p>
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks by title or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate_asc">Due Date (Soonest)</option>
                <option value="dueDate_desc">Due Date (Latest)</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({totalTasks})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending ({pendingTasks})
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'in-progress'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              In Progress ({inProgressTasks})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Completed ({completedTasks})
            </button>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  <div className="pt-3 flex gap-2">
                    <div className="h-5 bg-slate-200 rounded-full w-16"></div>
                    <div className="h-5 bg-slate-200 rounded-full w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {search || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search query or filters.'
                  : 'Get started by creating your first task!'}
              </p>
              <button
                onClick={openCreateModal}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Create Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Task Modal Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
