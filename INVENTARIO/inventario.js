import React, { useState } from 'react';
import { Trash2, Edit3, PlusCircle, LayoutList } from 'lucide-react';

const InventoryApp = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Producto Ejemplo', quantity: 10, price: 1500 }
  ]);
  const [formData, setFormData] = useState({ id: null, name: '', quantity: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);

  // RF 1.1 & 1.2: Registrar y Modificar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setProducts(products.map(p => p.id === formData.id ? formData : p));
      setIsEditing(false);
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setFormData({ id: null, name: '', quantity: '', price: '' });
  };

  // RF 1.3: Eliminar
  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Preparar edición
  const editProduct = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <LayoutList /> Gestión de Inventario
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario (RF 1.1 y 1.2) */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Editar Producto' : 'Registrar Producto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" placeholder="Nombre del producto"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="number" placeholder="Cantidad"
              className="w-full p-2 border rounded"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2">
              <PlusCircle size={20}/> {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        </div>

        {/* Tabla (RF 1.3 y 1.4) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b">Producto</th>
                <th className="p-4 border-b text-center">Stock</th>
                <th className="p-4 border-b text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b font-medium">{product.name}</td>
                  <td className="p-4 border-b text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${product.quantity < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {product.quantity} uds
                    </span>
                  </td>
                  <td className="p-4 border-b text-right space-x-2">
                    <button onClick={() => editProduct(product)} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                      <Edit3 size={18}/>
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-8 text-center text-gray-500">No hay productos registrados.</p>}
        </div>
      </div>
    </div>
  );
};

export default InventoryApp;