let purchases = [];
let suppliers = [];

export const getPurchases = () => purchases;

export const getSuppliers = () => suppliers;

export const addSupplier = (supplier) => {
  suppliers.push({
    id: Date.now(),
    ...supplier,
    registrationDate: new Date().toISOString(),
  });
};

export const addPurchase = (purchase) => {
  purchases.push({
    id: Date.now(),
    ...purchase,
    createdAt: new Date().toISOString(),
    history: [],
  });
};

export const updatePurchase = (id, updatedData, responsible) => {
  purchases = purchases.map((purchase) => {
    if (purchase.id === id) {
      const historyEntry = {
        modifiedAt: new Date().toISOString(),
        responsible,
        previousData: purchase,
      };

      return {
        ...purchase,
        ...updatedData,
        history: [...purchase.history, historyEntry],
      };
    }

    return purchase;
  });
};