"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

interface TodoItem {
  id?: string | number;
  todo: string;
  checked: boolean;
  created_timestamp: string;
}

export default function TodoPage() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/client-api/todo");
      setTodoList(response.data.result);
    } catch (err: unknown) {
      console.error("Error fetching todo list:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch todo list"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodoStatus = async (id: string | number, checked: boolean) => {
    try {
      const response = await fetch("/client-api/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, checked }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.status}`);
      }

      fetchTodoList();
    } catch (err: unknown) {
      console.error("Error updating todo:", err);
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const saveTodo = async (todo: string) => {
    try {
      const response = await fetch("/client-api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save todo: ${response.status}`);
      }

      fetchTodoList();
    } catch (err: unknown) {
      console.error("Error saving todo:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch todo list"
      );
    }
  };

  const handleTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!todo.trim()) return;
    saveTodo(todo);
    setTodo("");
  };

  const handleCheckboxChange = (
    id: string | number,
    newCheckedState: boolean
  ) => {
    updateTodoStatus(id, newCheckedState);
  };

  const activeTodos = todoList.filter((todo) => !todo.checked);
  const archivedTodos = todoList.filter((todo) => todo.checked);

  return (
    <div className="flex flex-col container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>
      <form onSubmit={handleTodo} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder=""
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
          >
            save
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 p-3 rounded-md text-red-600 mb-4">
          Error: {error}
        </div>
      )}

      <div>
        {isLoading ? (
          <p className="text-gray-500">Loading..</p>
        ) : activeTodos.length > 0 ? (
          <div className="flex flex-col gap-2">
            {activeTodos.map((item) => (
              <div
                key={item.id || Math.random().toString()}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(item.id!, true)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="flex-grow">{item.todo}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Todo found.</p>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={() => setIsArchiveOpen(!isArchiveOpen)}
          className="flex items-center justify-between w-full p-3 bg-gray-200 rounded-md mb-2 focus:outline-none"
        >
          <span className="font-medium">Archive ({archivedTodos.length})</span>
          <span
            className="transform transition-transform duration-200"
            style={{
              transform: isArchiveOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>

        {isArchiveOpen && archivedTodos.length > 0 && (
          <div className="flex flex-col gap-2 pl-2 mt-2 border-l-2 border-gray-300">
            {archivedTodos.map((item) => (
              <div
                key={item.id || Math.random().toString()}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(item.id!, false)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="flex-grow text-gray-500">{item.todo}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
