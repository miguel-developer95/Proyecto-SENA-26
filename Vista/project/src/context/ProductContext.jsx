import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: "Arroz Diana",
      categoria: "Granos",
      precioCompra: 3000,
      precioVenta: 4000,
      stock: 50,
    },
    {
      id: 2,
      nombre: "Coca Cola 400ml",
      categoria: "Bebidas",
      precioCompra: 2000,
      precioVenta: 3000,
      stock: 30,
    },
  ]);

  const agregarProducto = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
  };

  const actualizarProducto = (id, datosActualizados) => {
    setProductos(
      productos.map((producto) =>
        producto.id === id
          ? { ...producto, ...datosActualizados }
          : producto
      )
    );
  };

  const eliminarProducto = (id) => {
    setProductos(
      productos.filter((producto) => producto.id !== id)
    );
  };

  const obtenerProducto = (id) => {
    return productos.find(
      (producto) => producto.id === id
    );
  };

  const actualizarStock = (id, cantidad) => {
    setProductos(
      productos.map((producto) =>
        producto.id === id
          ? {
              ...producto,
              stock: producto.stock + cantidad,
            }
          : producto
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        productos,
        agregarProducto,
        actualizarProducto,
        eliminarProducto,
        obtenerProducto,
        actualizarStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}