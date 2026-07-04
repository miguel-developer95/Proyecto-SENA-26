import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./Components/Login";
import Dashboard from "./Pages/Dashboard";
import Administracion from "./Components/Administracion";
import Inventario from "./Components/Inventario";
import Compra from "./Components/Compra";
import Venta from "./Components/Venta";

function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
            <Route path="/administracion" element={<RutaProtegida><Administracion /></RutaProtegida>} />
            <Route path="/inventario" element={<RutaProtegida><Inventario /></RutaProtegida>} />
            <Route path="/compras" element={<RutaProtegida><Compra /></RutaProtegida>} />
            <Route path="/ventas" element={<RutaProtegida><Venta /></RutaProtegida>} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;