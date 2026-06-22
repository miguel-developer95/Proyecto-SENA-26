import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Bienvenido al sistema Ke-rico</h1>
      <p>Usuario: <strong>{usuario?.email}</strong></p>
      <p>Rol: <strong>{usuario?.rol}</strong></p>
      <button onClick={handleLogout}>Cerrar sesion</button>
    </div>
  );
}

export default Dashboard;