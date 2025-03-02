// pages/search.js
"use client";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch search history on component mount
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  // Function to fetch search history from API
  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/api/search/history`);

      if (!response.ok) {
        throw new Error(`Failed to fetch search history: ${response.status}`);
      }

      const data = await response.json();
      setSearchHistory(data);
    } catch (err) {
      console.error("Error fetching search history:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save search to API
  const saveSearch = async (searchTerm) => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/api/search/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save search: ${response.status}`);
      }

      // Refresh search history after saving
      fetchSearchHistory();
    } catch (err) {
      console.error("Error saving search:", err);
      setError(err.message);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    // Add to tags
    setTags([...tags, searchText]);

    // Save to API
    saveSearch(searchText);

    // Reset input
    setSearchText("");
  };

  // Remove tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Use search from history
  const useHistoryItem = (searchTerm) => {
    setTags([...tags, searchTerm]);
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter search term..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 p-3 rounded-md text-red-600 mb-4">
          Error: {error}
        </div>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Current Search Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={`tag-${index}`}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search History Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Search History</h2>

        {isLoading ? (
          <p className="text-gray-500">Loading search history...</p>
        ) : searchHistory.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={`history-${index}`}
                onClick={() => useHistoryItem(item.searchTerm)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors"
              >
                {item.searchTerm}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No search history found.</p>
        )}
      </div>
    </div>
  );
}
