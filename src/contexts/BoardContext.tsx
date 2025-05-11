"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  order: number;
  dueDate?: Date;
  labels?: string[];
  createdAt: Date;
}

export interface Column {
  _id: string;
  title: string;
  boardId: string;
  order: number;
  tasks: Task[];
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
}

interface BoardContextType {
  board: Board | null;
  columns: Column[];
  loading: boolean;
  error: string | null;
  fetchBoard: (boardId?: string) => Promise<void>;
  createColumn: (title: string) => Promise<void>;
  createTask: (
    columnId: string,
    title: string,
    description?: string
  ) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newOrder: number
  ) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchBoard = async (boardId?: string) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const url = boardId ? `/board/${boardId}` : "/board";
      const res = await axios.get(url);

      setBoard(res.data.board);
      setColumns(res.data.columns);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch board data");
    } finally {
      setLoading(false);
    }
  };

  const createColumn = async (title: string) => {
    if (!token || !board) return;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/column", {
        title,
        boardId: board._id,
      });

      setColumns([...columns, { ...res.data.column, tasks: [] }]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create column");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (
    columnId: string,
    title: string,
    description?: string
  ) => {
    if (!token || !board) return;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/task", {
        title,
        description,
        columnId,
        boardId: board._id,
      });

      const newTask = res.data.task;

      setColumns((prevColumns) => {
        return prevColumns.map((col) => {
          if (col._id === columnId) {
            return {
              ...col,
              tasks: [...col.tasks, newTask],
            };
          }
          return col;
        });
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!token || !board) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axios.patch(`/task/${taskId}`, updates);
      const updatedTask = res.data.task;

      // Update state
      setColumns((prevColumns) => {
        return prevColumns.map((col) => {
          if (col._id === updatedTask.columnId) {
            return {
              ...col,
              tasks: col.tasks.map((task) =>
                task._id === taskId ? updatedTask : task
              ),
            };
          }
          return col;
        });
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!token || !board) return;

    try {
      setLoading(true);
      setError(null);

      const columnId = columns.find((col) =>
        col.tasks.some((task) => task._id === taskId)
      )?._id;

      await axios.delete(`/task/${taskId}`);

      // Update state
      setColumns((prevColumns) => {
        return prevColumns.map((col) => {
          if (col.tasks.some((task) => task._id === taskId)) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task._id !== taskId),
            };
          }
          return col;
        });
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string
  ) => {
    if (!token || !board) return;

    try {
      // Find the task to be moved
      const allTasksInColumn = columns
        .find((col) => col._id === sourceColumnId)?.tasks;

      const taskToMove = columns
        .find((col) => col._id === sourceColumnId)
        ?.tasks.find((task) => task._id === taskId);

      if (!taskToMove) return;

      // Update local state
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col) => {
          // Remove task from source column
          if (col._id === sourceColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task._id !== taskId),
            };
          }
          // Add task to destination column with new order
          if (col._id === destinationColumnId) {
            // Adjust orders for tasks in the destination column
            const updatedTasks = [...col.tasks];

            // Moving to a different column Insert the task at the new position
            const newOrder = updatedTasks.length;
            updatedTasks.push({
              ...taskToMove,
              order: newOrder,
              columnId: destinationColumnId,
            });

            return {
              ...col,
              tasks: updatedTasks,
            };
          }
          return col;
        });

        return newColumns;
      });

      // Make API call to update the task
      await axios.patch(`/task/${taskId}`, {
        columnId: destinationColumnId,
        order: allTasksInColumn?.length
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to move task");
      // Revert optimistic update by re-fetching the board
      fetchBoard(board._id);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        board,
        columns,
        loading,
        error,
        fetchBoard,
        createColumn,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
