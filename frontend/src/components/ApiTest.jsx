import React, { useState, useEffect } from "react";
import axios from "axios";

const ApiTest = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const testBackendConnection = async () => {
      try {
        setLoading(true);
        console.log("backendUrl", backendUrl);
        const response = await axios.get(`${backendUrl}/api/health`);
        setApiResponse(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div className="api-test">
      <h2>Backend Connection Test</h2>
      {loading && <p>Testing connection to backend...</p>}
      {error && <p className="error">Error connecting to backend: {error}</p>}
      {apiResponse && (
        <div className="success">
          <p>Successfully connected to backend!</p>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
