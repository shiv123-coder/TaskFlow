import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Search,
  CheckCircle,
  Clock,
  ListTodo,
  CheckSquare,
  BarChart2,
  Server
} from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const { showToast } = useToast();

  const fetchTasks = async () => {
    const timer = setTimeout(() => {
      setColdStartNotice(true);
    }, 2200);

    try {
      setLoading(true);
      const res = await api.get('/tasks');
      clearTimeout(timer);
      setColdStartNotice(false);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      clearTimeout(timer);
      setColdStartNotice(false);
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (formData) => {
    if (taskToEdit) {
      const res = await api.put(`/tasks/${taskToEdit._id}`, formData);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskToEdit._id ? res.data.data : t))
        );
        showToast('Task updated successfully', 'success');
      }
    } else {
      const res = await api.post('/tasks', formData);
      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
        showToast('Task created successfully', 'success');
      }
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    showToast(
      newStatus === 'completed' ? 'Task marked as completed' : 'Task marked as pending',
      'info'
    );

    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showToast('Failed to update status on server', 'error');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast('Task deleted', 'info');
      try {
        await api.delete(`/tasks/${id}`);
      } catch (err) {
        console.error('Failed to delete task:', err);
        showToast('Failed to delete task on server', 'error');
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

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
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
        {/* Cloud Wake-Up Notice */}
        {coldStartNotice && (
          <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-slate-700 text-xs">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>
                Connecting to cloud server. Free-tier instances may require up to 40 seconds on initial wake-up.
              </span>
            </div>
          </div>
        )}

        {/* Header & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your tasks, track deadlines, and update progress.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            New task
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total tasks</span>
              <ListTodo className="w-4 h-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{totalTasks}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Completed</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{completedTasks}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>In progress</span>
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{inProgressTasks}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Completion</span>
              <BarChart2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-slate-900 tabular-nums">{completionRate}%</p>
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 bg-white"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="all">All priorities</option>
                <option value="high">High priority</option>
                <option value="medium">Medium priority</option>
                <option value="low">Low priority</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="dueDate_asc">Due date (earliest)</option>
                <option value="dueDate_desc">Due date (latest)</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({totalTasks})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pending ({pendingTasks})
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'in-progress'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              In progress ({inProgressTasks})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
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
                  className="bg-white rounded-xl p-4 border border-slate-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    <div className="pt-3 border-t border-slate-100 flex gap-2">
                      <div className="h-4 bg-slate-100 rounded w-16"></div>
                      <div className="h-4 bg-slate-100 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-sm mx-auto my-8">
              <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No tasks found</h3>
              <p className="mt-1 text-xs text-slate-500">
                {search || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search query or filter options.'
                  : 'Get started by creating your first task.'}
              </p>
              <button
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create task
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
