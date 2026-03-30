import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
