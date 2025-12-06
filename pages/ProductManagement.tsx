import React, { useEffect, useState } from 'react';
import { getProducts, getSuppliers, saveProduct, deleteProduct } from '../services/mockData';
import { Product, Supplier } from '../types';
import { Plus, Edit, Trash2, Save, X, Search, AlertTriangle } from 'lucide-react';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredProducts(
        products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, products]);

  const loadData = () => {
    Promise.all([getProducts(), getSuppliers()]).then(([p, s]) => {
      setProducts(p);
      setSuppliers(s);
    });
  };

  const handleAdd = () => {
    setEditingProduct({ status: 'ACTIVE', minStock: 0, maxStock: 100, price: 0 });
    setIsModalOpen(true);
    setError('');
    setMsg('');
  };

  const handleEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
    setError('');
    setMsg('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (e: any) {
        // EF3: Soft delete warning
        alert(e.message);
        loadData(); // Reload to see status change
      }
    }
  };

  const handleSave = async () => {
    try {
      await saveProduct(editingProduct);
      setIsModalOpen(false);
      loadData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-800">
          <Plus size={18} className="mr-2" /> Thêm sản phẩm
        </button>
      </div>

      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200 max-w-md">
         <Search className="text-gray-400 mr-2" size={20}/>
         <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700 bg-white"
         />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Mã</th>
              <th className="px-6 py-4">Tên sản phẩm</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4 text-right">Giá bán</th>
              <th className="px-6 py-4 text-center">Định mức (Min/Max)</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50 ${p.status === 'STOPPED' ? 'opacity-60 bg-gray-50' : ''}`}>
                <td className="px-6 py-4 font-medium text-gray-900">{p.code}</td>
                <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.unit}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">{p.category}</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">{p.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-center text-sm">
                    <span className="text-orange-600">{p.minStock}</span> / <span className="text-blue-600">{p.maxStock || '∞'}</span>
                </td>
                <td className="px-6 py-4 text-center">
                   {p.status === 'STOPPED' ? 
                     <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Ngưng</span> : 
                     <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Kích hoạt</span>}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  {p.status !== 'STOPPED' && (
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingProduct.id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

            <div className="space-y-4">
               {/* Basic Info */}
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm *</label>
                    <input 
                      type="text" 
                      value={editingProduct.code || ''}
                      onChange={e => setEditingProduct({...editingProduct, code: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                    <input 
                      type="text" 
                      value={editingProduct.name || ''}
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính *</label>
                    <input 
                      type="text" 
                      value={editingProduct.unit || ''}
                      onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <input 
                      type="text" 
                      value={editingProduct.category || ''}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán *</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                    />
                  </div>
               </div>

               <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                    <select
                        value={editingProduct.supplierId || ''}
                        onChange={e => setEditingProduct({...editingProduct, supplierId: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none bg-white text-gray-900"
                    >
                        <option value="">-- Chọn NCC --</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
               </div>

               {/* BF4: Thresholds */}
               <div className="border-t pt-4 mt-4">
                   <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                       <AlertTriangle size={16} className="mr-2 text-orange-500"/> Thiết lập ngưỡng cảnh báo (BF4)
                   </h3>
                   <div className="grid grid-cols-2 gap-4 bg-orange-50 p-3 rounded-lg">
                       <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn tối thiểu (Min)</label>
                            <input 
                            type="number" 
                            value={editingProduct.minStock}
                            onChange={e => setEditingProduct({...editingProduct, minStock: Number(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                            />
                       </div>
                       <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn tối đa (Max)</label>
                            <input 
                            type="number" 
                            value={editingProduct.maxStock}
                            onChange={e => setEditingProduct({...editingProduct, maxStock: Number(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none text-gray-900 bg-white"
                            />
                       </div>
                   </div>
               </div>

               <button 
                onClick={handleSave}
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-slate-800 flex justify-center items-center"
              >
                <Save size={18} className="mr-2" /> Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};