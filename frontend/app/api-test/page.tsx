"use client";
import { useState, useEffect } from "react";

export default function ApiTestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get the backend URL from environment variables or use default
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await fetch(`${backendUrl}/api/health`);

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching API data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h2 className="text-lg font-semibold mb-2">Request Info</h2>
        <p className="mb-1">
          Endpoint:{" "}
          <code className="bg-gray-200 px-1 rounded">
            {process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}
            /api/api-test
          </code>
        </p>
        <p>
          Method: <code className="bg-gray-200 px-1 rounded">GET</code>
        </p>
      </div>

      {loading && (
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <p className="text-blue-600">Loading data from API...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <div className="mt-4">
            <h3 className="font-medium mb-1">Troubleshooting:</h3>
            <ul className="list-disc pl-5">
              <li>
                Make sure your backend server is running at{" "}
                {process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}
              </li>
              <li>
                Check that your API endpoint /api/api-test exists and is
                properly configured
              </li>
              <li>Verify CORS is configured correctly on your backend</li>
              <li>
                Check your network tab in developer tools for more details
              </li>
            </ul>
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <div className="bg-green-50 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold text-green-600 mb-2">Success</h2>
          <div className="overflow-auto">
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Reload Test
        </button>
      </div>
    </div>
  );
}
