import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  setError("");

  if (!formData.email || !formData.password) {
    setError("Por favor completa todos los campos.");
    return;
  }

  // Credenciales estáticas
  const emailCorrecto = "admin@tentaciones.com";
  const passwordCorrecta = "123456";

  if (
    formData.email === emailCorrecto &&
    formData.password === passwordCorrecta
  ) {
    login({ email: formData.email, rol: "admin" });
    
    // Aquí después podrás navegar al dashboard
    // navigate("/dashboard");
  } else {
    setError("Correo o contraseña incorrectos.");
  }
};

  return (
    <div className="login-wrap">
      <div className="login-card">

        <div className="brand">
          <div className="brand-icon">T</div>
          <span className="brand-name">Tentaciones Marlly</span>
        </div>

        <p className="login-heading">Bienvenido de nuevo</p>
        <p className="login-sub">Ingresa tus credenciales para continuar</p>

        {error && (
          <div className="error-msg">
            <span>{error}</span>
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Correo electronico</label>
          <div className="input-wrap">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Contrasena</label>
          <div className="input-wrap">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        <hr className="divider" />
        <p className="footer-text">Sistema de registro e inventario - SENA 2026</p>

      </div>
    </div>
  );
}

export default Login;