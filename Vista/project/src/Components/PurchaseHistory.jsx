import React from "react";
import { getPurchases } from "../services/purchaseService";

const PurchaseHistory = () => {
  const purchases = getPurchases();

  return (
    <div>
      <h2>Historial de Compras</h2>

      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          style={{
            border: "1px solid gray",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <p><strong>Código:</strong> {purchase.code}</p>

          <p><strong>Fecha:</strong> {purchase.date}</p>

          <p><strong>Proveedor:</strong> {purchase.supplier}</p>

          <p><strong>Productos:</strong> {purchase.products}</p>

          <p><strong>Total:</strong> ${purchase.totalValue}</p>

          <p><strong>Responsable:</strong> {purchase.responsible}</p>
        </div>
      ))}
    </div>
  );
};

export default PurchaseHistory;