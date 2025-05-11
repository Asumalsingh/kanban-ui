import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";


import { useAuth } from "@/contexts/AuthContext";
import { useBoard } from "@/contexts/BoardContext";

import { Plus, X, Edit2, Trash2 } from "lucide-react";
import Header from "./Header";
import Column from "./Column";

const Board: React.FC = () => {
  const { user } = useAuth();
  const { board, columns, fetchBoard, createColumn, loading, moveTask } = useBoard();

  const [showNewColumnModal, setShowNewColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    if (user) {
      // Fetch board data when the component mounts
      fetchBoard(user?.board?.id);
    }
  }, [user]);

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    await createColumn(newColumnTitle.trim());
    setShowNewColumnModal(false);
    setNewColumnTitle("");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    // active - task tha we are dragging
    // over - columm where we are dragging the task
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const sourceColumnId = active.data.current?.columnId as string;
    const destinationColumnId = over.id as string;
    const order = active.data.current?.order;

    if(sourceColumnId === destinationColumnId) return;

    await moveTask(taskId, sourceColumnId, destinationColumnId, order );
  };

  if (loading && !board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-4 pb-4 h-full">
              {columns.map((column) => (
                <Column key={column._id} column={column} />
              ))}

              {/* Add column button */}
              <div className="bg-gray-100 rounded-lg w-80 flex-shrink-0 flex flex-col h-min">
                <button
                  onClick={() => setShowNewColumnModal(true)}
                  className="flex items-center p-3 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>
          </DndContext>
        </div>
      </main>

      {/* New Column Modal */}
      {showNewColumnModal && (
        <div className="fixed inset-0 overflow-y-auto z-10">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div> */}

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateColumn}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Column
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewColumnModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="columnTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Column Title
                    </label>
                    <input
                      type="text"
                      id="columnTitle"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., To Do, In Progress, Done"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading || !newColumnTitle.trim()}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      loading || !newColumnTitle.trim()
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {loading ? "Adding..." : "Add Column"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewColumnModal(false)}
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
};

export default Board;
