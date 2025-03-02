// pages/search.js
"use client";
import axios from "axios";
import { useState, useEffect } from "react";
interface SearchHistoryItem {
  id?: string | number;
  command: string;
}

export default function TodoPage() {
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/todo");
      setSearchHistory(response.data.result);
    } catch (err: unknown) {
      console.error("Error fetching search history:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch search history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save search to API
  const saveSearch = async (command: string) => {
    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save search: ${response.status}`);
      }

      fetchSearchHistory();
    } catch (err: unknown) {
      console.error("Error saving search:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch search history"
      );
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    // Save to API
    saveSearch(searchText);

    // Reset input
    setSearchText("");
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Todo.."
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 p-3 rounded-md text-red-600 mb-4">
          Error: {error}
        </div>
      )}

      {/* List Section */}
      <div>
        {isLoading ? (
          <p className="text-gray-500">Loading..</p>
        ) : searchHistory.length > 0 ? (
          <div className="flex flex-col gap-2">
            {searchHistory.map((item) => (
              <div
                key={item.id || Math.random().toString()}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded-md"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="flex-grow">{item.command}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No search history found.</p>
        )}
      </div>
    </div>
  );
}
