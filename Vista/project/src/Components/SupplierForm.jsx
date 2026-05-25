import React, { useState } from "react";
import { addSupplier } from "../services/purchaseService";

const SupplierForm = () => {
  const [form, setForm] = useState({
    nit: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "Activo",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addSupplier(form);

    alert("Proveedor registrado");

    setForm({
      nit: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      status: "Activo",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Proveedores</h2>

      <input
        type="text"
        name="nit"
        placeholder="NIT"
        value={form.nit}
        onChange={handleChange}
      />

      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Dirección"
        value={form.address}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option>Activo</option>
        <option>Inactivo</option>
      </select>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default SupplierForm;