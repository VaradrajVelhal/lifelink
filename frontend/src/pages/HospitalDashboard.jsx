import { useEffect, useState } from "react";

function HospitalDashboard() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [city, setCity] = useState("");
  const [urgency, setUrgency] = useState("");
  const [requests, setRequests] = useState([]);



  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    window.location.href = "/";
  };
  const matchDonors = (id) => {
    const token = localStorage.getItem("access");

    fetch(`http://127.0.0.1:8000/api/requests/${id}/match/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("MATCHED:", data);
        alert("Donors notified!");
      })
      .catch((err) => console.log(err));
  };
  //SINGLE FUNCTION TO FETCH REQUESTS
  const fetchRequests = () => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/requests/list/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("REQUESTS:", data);
        setRequests(data);
      })
      .catch((err) => console.log(err));
  };

  // LOAD REQUESTS WHEN PAGE OPENS
  useEffect(() => {
    fetchRequests();
  }, []);

  // CREATE REQUEST
  const handleSubmit = () => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/requests/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        blood_group: bloodGroup,
        units: Number(units),
        city: city,
        urgency: urgency,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CREATED:", data);
        alert("Blood request created!");
        fetchRequests(); // refresh list WITHOUT reload
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>LifeLink</h2>
        <button className="btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2 className="text-center mb-4">Hospital Dashboard</h2>

      <div className="card p-4 mb-4">
        <h4>Create Blood Request</h4>

        <input
          className="form-control mb-2"
          placeholder="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Units"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Urgency"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        />

        <button className="btn btn-danger mt-2" onClick={handleSubmit}>
          Create Request
        </button>
      </div>

      <h4>Your Requests</h4>

      {requests.map((req) => (
        <div key={req.id} className="card p-3 mb-3">
          <p>
            <strong>Blood Group:</strong> {req.blood_group}
          </p>
          <p>
            <strong>Units:</strong> {req.units}
          </p>
          <p>
            <strong>City:</strong> {req.city}
          </p>
          <p>
            <strong>Urgency:</strong> {req.urgency}
          </p>

          <button
            className="btn btn-primary"
            onClick={() => matchDonors(req.id)}
          >
            Match Donors
          </button>
        </div>
      ))}
    </div>
  );
}

export default HospitalDashboard;
