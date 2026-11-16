import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Edit3, Trash2, AlertCircle } from 'lucide-react';

const priorityColors = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-slate-100 text-slate-700 border-slate-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200'
};

const statusStyles = {
  pending: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    label: 'Pending'
  },
  'in-progress': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'In progress'
  },
  completed: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Completed'
  }
};

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div
      className={`group bg-white rounded-xl p-4 border transition-colors ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/60'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle complete button & Title */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <button
            onClick={() => onToggleStatus(task)}
            className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 hover:text-slate-500" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-sm font-medium tracking-tight break-words ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`mt-1 text-xs line-clamp-2 leading-relaxed break-words ${
                  isCompleted ? 'text-slate-400 line-through' : 'text-slate-500'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Edit task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Pills */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
        {/* Status */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${
            statusStyles[task.status]?.badge || 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <Clock className="w-3 h-3" />
          {statusStyles[task.status]?.label || task.status}
        </span>

        {/* Priority */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium border ${
            priorityColors[task.priority] || priorityColors.medium
          }`}
        >
          {task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Medium'}
        </span>

        {/* Due Date */}
        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${
              isOverdue()
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            {isOverdue() ? (
              <AlertCircle className="w-3 h-3 text-rose-500" />
            ) : (
              <Calendar className="w-3 h-3" />
            )}
            {isOverdue() ? 'Overdue: ' : 'Due: '}
            {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
