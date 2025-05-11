import React, { useState } from "react";
import { Edit2, Trash2, X } from "lucide-react";

import { useBoard } from "@/contexts/BoardContext";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    labels?: string[];
    order?: number;
  };
  columnId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  columnId,
}: TaskCardProps) => {
  const { loading, updateTask, deleteTask } = useBoard();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: {columnId, type: "task", order: task?.order},
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const [editingTask, setEditingTask] = useState<any | null>(task);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    await updateTask(editingTask._id, {
      title: editingTask.title,
      description: editingTask.description,
    });

    setShowEditTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id);
    }
  };

  const handelEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditTaskModal(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="cursor-grab  bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
          <div className="flex space-x-1">
            <button
              type="button"
              onMouseDown={handelEditClick}
              className="text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors"
              title="Edit task"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={handleDeleteTask}
              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-3">
            {task.description}
          </p>
        )}

        {task.labels && task.labels.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {task.labels.map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 overflow-y-auto z-10">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateTask}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Task
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowEditTaskModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="editTaskTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Title
                    </label>
                    <input
                      type="text"
                      id="editTaskTitle"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                      className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Design new login page"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="editTaskDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (optional)
                    </label>
                    <textarea
                      id="editTaskDescription"
                      value={editingTask.description || ""}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Add a more detailed description..."
                    ></textarea>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading || !editingTask.title.trim()}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      loading || !editingTask.title.trim()
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditTaskModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
