import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import PurchaseTable from "../../components/purchases/PurchaseTable";
import PurchaseModal from "../../components/purchases/PurchaseModal";

export default function PurchasesPage() {
  const { usuario } = useAuth();

  const [purchases, setPurchases] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const savePurchase = (purchase) => {
    setPurchases((prev) => [
      ...prev,
      {
        ...purchase,
        id: Date.now(),
        createdAt: new Date(),
      },
    ]);

    setOpenModal(false);
  };

  // 🔐 CONTROL DE ACCESO
  if (!usuario) {
    return <h2>Debes iniciar sesión</h2>;
  }

  if (usuario.rol !== "admin") {
    return <h2>No tienes permisos para acceder a Compras</h2>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Compras</h2>

        <button onClick={() => setOpenModal(true)}>
          Nueva Compra
        </button>
      </div>

      <PurchaseTable purchases={purchases} />

      {openModal && (
        <PurchaseModal
          onClose={() => setOpenModal(false)}
          onSave={savePurchase}
        />
      )}
    </div>
  );
}