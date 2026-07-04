import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Arroz x 500g",  categoria: "Granos",      codigoBarras: "770100001", precioCompra: 1800,  precioVenta: 2500,  stock: 120, stockMinimo: 20, descontinuado: false },
    { id: 2, nombre: "Aceite 1L",     categoria: "Aceites",     codigoBarras: "770100002", precioCompra: 8500,  precioVenta: 12000, stock: 15,  stockMinimo: 10, descontinuado: false },
    { id: 3, nombre: "Sal x 500g",    categoria: "Condimentos", codigoBarras: "770100003", precioCompra: 1200,  precioVenta: 1800,  stock: 4,   stockMinimo: 10, descontinuado: false },
    { id: 4, nombre: "Gaseosa 1.5L",  categoria: "Bebidas",     codigoBarras: "770100004", precioCompra: 2800,  precioVenta: 3700,  stock: 48,  stockMinimo: 12, descontinuado: false },
    { id: 5, nombre: "Leche 900ml",   categoria: "Lacteos",     codigoBarras: "770100005", precioCompra: 3200,  precioVenta: 4200,  stock: 22,  stockMinimo: 8,  descontinuado: false },
    { id: 6, nombre: "Azucar x 1kg",  categoria: "Granos",      codigoBarras: "770100006", precioCompra: 2900,  precioVenta: 3800,  stock: 9,   stockMinimo: 15, descontinuado: false },
  ]);

  const agregarProducto = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
  };

  const actualizarProducto = (id, datosActualizados) => {
    setProductos(productos.map((p) =>
      p.id === id ? { ...p, ...datosActualizados } : p
    ));
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const obtenerProducto = (id) => {
    return productos.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider value={{ productos, agregarProducto, actualizarProducto, eliminarProducto, obtenerProducto }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}