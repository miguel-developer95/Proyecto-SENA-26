import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./Components/Login";
import Dashboard from "./Pages/Dashboard";
import Administracion from "./Components/Administracion";

function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />
          <Route
            path="/administracion"
            element={
              <RutaProtegida>
                <Administracion />
              </RutaProtegida>
            }
          />  
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;