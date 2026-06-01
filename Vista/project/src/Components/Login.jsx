import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
      } else {
        setError(data.message || "Credenciales invalidas");
      }
    } catch (err) {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
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