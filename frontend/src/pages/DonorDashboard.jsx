import { useEffect, useState } from "react";

function DonorDashboard() {
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    window.location.href = "/";
  };
  const fetchNotifications = () => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/requests/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("NOTIFICATIONS:", data);
        setNotifications(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    const token = localStorage.getItem("access");

    fetch(`http://127.0.0.1:8000/api/requests/notifications/${id}/read/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        // refresh after marking
        fetchNotifications();
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
      <h2 className="text-center mb-4">Donor Dashboard</h2>

      <h4>Your Notifications</h4>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`card p-3 mb-3 ${n.is_read ? "bg-light" : ""}`}
          >
            <p>{n.message}</p>

            {!n.is_read && (
              <button
                className="btn btn-success"
                onClick={() => markAsRead(n.id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DonorDashboard;
