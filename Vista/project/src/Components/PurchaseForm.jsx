import React, { useState } from "react";
import {
  addPurchase,
  getSuppliers,
} from "../services/purchaseService";

const PurchaseForm = () => {
  const suppliers = getSuppliers();

  const [form, setForm] = useState({
    code: "",
    date: "",
    supplier: "",
    products: "",
    quantities: "",
    prices: "",
    paymentMethod: "",
    responsible: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    const quantities = form.quantities
      .split(",")
      .map(Number);

    const prices = form.prices
      .split(",")
      .map(Number);

    let total = 0;

    for (let i = 0; i < quantities.length; i++) {
      total += quantities[i] * prices[i];
    }

    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const total = calculateTotal();

    addPurchase({
      ...form,
      totalValue: total,
    });

    alert("Compra registrada");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Compras</h2>

      <input
        type="text"
        name="code"
        placeholder="Código"
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        onChange={handleChange}
      />

      <select
        name="supplier"
        onChange={handleChange}
      >
        <option>Seleccione proveedor</option>

        {suppliers.map((supplier) => (
          <option
            key={supplier.id}
            value={supplier.name}
          >
            {supplier.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="products"
        placeholder="Productos"
        onChange={handleChange}
      />

      <input
        type="text"
        name="quantities"
        placeholder="Cantidades separadas por coma"
        onChange={handleChange}
      />

      <input
        type="text"
        name="prices"
        placeholder="Precios separados por coma"
        onChange={handleChange}
      />

      <input
        type="text"
        name="paymentMethod"
        placeholder="Método de pago"
        onChange={handleChange}
      />

      <input
        type="text"
        name="responsible"
        placeholder="Responsable"
        onChange={handleChange}
      />

      <button type="submit">
        Registrar Compra
      </button>
    </form>
  );
};

export default PurchaseForm;