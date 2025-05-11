"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Board from "@/components/Board";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading. . .</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white border border-gray-200 rounded-md p-4 items-center flex-col flex" >
          <h1 className="text-2xl font-bold">Welcome to Kanban</h1>
          <p className="mt-4">Please log in to continue.</p>
          <Link
            href="/login"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Login here
          </Link>
        </div>
      </div>
    );
  }

  return <Board/>;
}
