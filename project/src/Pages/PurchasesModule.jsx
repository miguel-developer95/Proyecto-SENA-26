import React from "react";

import SupplierForm from "../components/SupplierForm";
import PurchaseForm from "../components/PurchaseForm";
import PurchaseHistory from "../components/PurchaseHistory";

const PurchasesModule = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Módulo de Compras</h1>

      <SupplierForm />

      <hr />

      <PurchaseForm />

      <hr />

      <PurchaseHistory />
    </div>
  );
};

export default PurchasesModule;