"use client"
import React from "react";
import { KanbanSquare, LogOut } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useBoard } from "@/contexts/BoardContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { board } = useBoard();
  return (
     <header className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <KanbanSquare className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {board?.title || 'Loading board...'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-gray-700 mr-4 hidden md:inline">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
  );
}
