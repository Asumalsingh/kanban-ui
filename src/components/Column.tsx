"ues client";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import { Plus, X } from "lucide-react";

import { Column as ColumnType, useBoard } from "@/contexts/BoardContext";
import TaskCard from "./TaskCard";

type ColumnProps = {
  column: ColumnType;
};

export default function Column({ column }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column._id,
    data: {title: column.title, type: "column"}
  });

  const { loading, createTask } = useBoard();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const handleOpenNewTaskModal = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setShowNewTaskModal(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !column._id) return;

    await createTask(
      column._id,
      newTaskTitle.trim(),
      newTaskDescription.trim()
    );

    setShowNewTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  return (
    <div className="bg-gray-100 rounded-lg w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-12rem)]">
      {/* Column header */}
      <div className="p-3 font-medium text-gray-800 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold truncate">{column.title}</h3>
          <button
            onClick={handleOpenNewTaskModal}
            className="h-6 w-6 rounded hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className="flex flex-col p-2 space-y-3 h-full pb-20"
      >
        {column.tasks?.map((task) => {
          return <TaskCard key={task._id} task={task} columnId={column._id} />;
        })}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block z-50 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateTask}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Task
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewTaskModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="taskTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Title
                    </label>
                    <input
                      type="text"
                      id="taskTitle"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Design new login page"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="taskDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (optional)
                    </label>
                    <textarea
                      id="taskDescription"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      rows={3}
                      className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Add a more detailed description..."
                    ></textarea>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading || !newTaskTitle.trim()}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      loading || !newTaskTitle.trim()
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {loading ? "Adding..." : "Add Task"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTaskModal(false)}
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
    </div>
  );
}
