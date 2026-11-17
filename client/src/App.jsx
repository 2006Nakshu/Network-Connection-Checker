import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = "https://network-connection-checker-backend.onrender.com/api/network";
function App() {
  const [hostname, setHostname] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [state, setState] = useState("Ready");
  // Load all saved history
  const loadHistory = async () => {
    try {
      const response = await axios.get(API_URL);

      setHistory(response.data);
      setAllHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load history when page opens
  useEffect(() => {
    loadHistory();
  }, []);

  // Check Network Connection
  const checkConnection = async () => {
   if (!hostname.trim()) {
  setState("Failed");
  setMessage("Please enter a hostname or IP address.");
  return;
}

// Hostname Validation
const hostnameRegex =
  /^(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(?!$)|$)){4})$/;
if (!hostnameRegex.test(hostname)) {
  setState("Failed");
  setMessage("Invalid Hostname or IP Address");
  return;
}

    try {
      setState("Checking");
      const response = await axios.post(API_URL, {
  hostname,
});

      const data = response.data;

      setMessage(`
Host: ${data.hostname}
Status: ${data.alive ? "🟢 Online" : "🔴 Offline"}
IP Address: ${data.ip}
Response Time: ${data.time} ms
      `);
if (data.alive) {
  setState("Success");
} else {
  setState("Failed");
}
      setHostname("");

      // Reload History
      loadHistory();

    } catch (error) {
      setState("Failed");
      console.log(error);

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage(error.message);
      }
    }
  };

  // Delete Record
  const deleteRecord = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      loadHistory();

    } catch (error) {
      console.log(error);
    }
  };

  // Search Hostname
  const searchHostname = (e) => {
    const value = e.target.value.toLowerCase();

    if (value === "") {
      setHistory(allHistory);
      return;
    }

    const filtered = allHistory.filter((item) =>
      item.hostname.toLowerCase().includes(value)
    );

    setHistory(filtered);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          🌐 Network Connection Checker
        </h2>
        <div className="alert alert-secondary text-center">
  <strong>Current State:</strong> {state}
</div>
        <div className="row mb-5">

  <div className="col-md-4">
    <div className="card bg-primary text-white text-center">
      <div className="card-body">
        <h5>Total Checks</h5>
        <h2>{history.length}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card bg-success text-white text-center">
      <div className="card-body">
        <h5>Online</h5>
        <h2>
          {history.filter(item => item.status === "Online").length}
        </h2>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card bg-danger text-white text-center">
      <div className="card-body">
        <h5>Offline</h5>
        <h2>
          {history.filter(item => item.status === "Offline").length}
        </h2>
      </div>
    </div>
  </div>

</div>

        {/* Search Box */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Hostname..."
            onChange={searchHostname}
          />
        </div>

        {/* Hostname Input */}
        <div className="mb-3">
          <label className="form-label">
            Hostname / IP Address
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter hostname or IP"
            value={hostname}
onChange={(e) => {
  setHostname(e.target.value);
  setState("Ready");
}}          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={checkConnection}
        >
          Check Connection
        </button>

        {message && (
          <div
  className={`alert ${
    message.includes("Online")
      ? "alert-success"
      : message.includes("Offline")
      ? "alert-danger"
      : "alert-info"
  } mt-4`}
  style={{ whiteSpace: "pre-line" }}
>
            {message}
          </div>
        )}

        <hr />

        <h3 className="mt-4">Network Check History</h3>

        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark text-center">
            <tr>
  <th>Hostname</th>
  <th>Status</th>
  <th>IP Address</th>
  <th>Response Time</th>
  <th>Checked Time</th>
  <th>Action</th>
</tr>
          </thead>

          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item._id}>
                  <td className="text-center">{item.hostname}</td>
                  <td className="text-center">
  {item.status === "Online"
    ? "🟢 Online"
    : "🔴 Offline"}
</td>
                  <td className="text-center">{item.ipAddress}</td>
                  <td className="text-center">{item.responseTime} ms</td>

<td className="text-center">
  {new Date(item.checkedAt).toLocaleString()}
</td>

<td className="text-center">
  <button
    className="btn btn-danger btn-sm"
    onClick={() => deleteRecord(item._id)}
  >
    🗑 Delete
  </button>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

<footer className="text-center mt-4 text-muted">
  Developed by Nakshatra V S © 2026
</footer>

</div>
</div>
  );
}

export default App;