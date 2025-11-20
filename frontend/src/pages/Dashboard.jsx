import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      await API.post("/tasks", data);
      setShowForm(false);
      fetchTasks();
    } catch {
      setError("Failed to create task");
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      await API.put(`/tasks/${editingTask.id}`, data);
      setEditingTask(null);
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Welcome */}
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/40">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.username} 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Here's what’s happening today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl">
            <h3 className="text-gray-700 font-semibold text-lg">Total Tasks</h3>
            <p className="text-4xl font-bold text-rose-600 mt-3">{total}</p>
            <p className="text-gray-500 text-sm mt-1">Overview of all tasks</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl">
            <h3 className="text-gray-700 font-semibold text-lg">Completed</h3>
            <p className="text-4xl font-bold text-emerald-600 mt-3">
              {completed}
            </p>
            <p className="text-gray-500 text-sm mt-1">Great progress!</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl">
            <h3 className="text-gray-700 font-semibold text-lg">Pending</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-3">{pending}</p>
            <p className="text-gray-500 text-sm mt-1">Keep going!</p>
          </div>
        </div>

        {/* Task Form */}
        {(showForm || editingTask) && (
          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/40">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={cancelForm}
            />
          </div>
        )}

        {/* Create Task Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl shadow-lg text-white font-medium 
                       bg-gradient-to-r from-rose-500 to-purple-500 
                       hover:opacity-90 transition active:scale-95"
          >
            + Create Task
          </button>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/40">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="text-gray-500 text-center py-20">
              No tasks yet. Create your first one!
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
