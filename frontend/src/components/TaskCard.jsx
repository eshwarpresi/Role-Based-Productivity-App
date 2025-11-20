import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { user } = useAuth();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const canEdit = user.role === 'admin' || user.id === task.createdBy;
  const canDelete = user.role === 'admin' || user.id === task.createdBy;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      {/* Title + Status */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 leading-tight">
          {task.title}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-5 leading-relaxed">
        {task.description}
      </p>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <div>
          <span className="font-medium text-gray-700">
            {task.createdByName}
          </span>
          {user.role === 'admin' && (
            <span className="ml-2 text-gray-400">(ID: {task.createdBy})</span>
          )}
        </div>
        <div>{new Date(task.createdAt).toLocaleDateString()}</div>
      </div>

      {/* Buttons */}
      {(canEdit || canDelete) && (
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {canEdit && (
            <button
              onClick={() => onEdit(task)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold shadow hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold shadow hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
