import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./Components/Login";
import Dashboard from "./Pages/Dashboard";
import Administracion from "./Components/Administracion";
import Compra from "./Components/Compra";
import Inventario from "./Components/Inventario";
import Venta from "./Components/Venta";

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
          <Route 
            path="/compras" 
            element={
            <RutaProtegida>
              <Compra />
            </RutaProtegida>
            } 
          />
          <Route 
            path="/inventario" 
            element={
            <RutaProtegida>
              <Inventario />
            </RutaProtegida>
            } 
          />
          <Route 
            path="/venta" 
            element={
            <RutaProtegida>
              <Venta />
            </RutaProtegida>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;