import { useState } from "react";
import PurchaseTable from "../../components/purchases/PurchaseTable";
import PurchaseModal from "../../components/purchases/PurchaseModal";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [openModal, setOpenModal] =
    useState(false);

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

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Compras</h2>

        <button
          onClick={() =>
            setOpenModal(true)
          }
        >
          Nueva Compra
        </button>
      </div>

      <PurchaseTable
        purchases={purchases}
      />

      {openModal && (
        <PurchaseModal
          onClose={() =>
            setOpenModal(false)
          }
          onSave={savePurchase}
        />
      )}
    </div>
  );
}