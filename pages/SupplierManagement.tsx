import React, { useEffect, useState } from 'react';
import { getSuppliers, saveSupplier, deleteSupplier } from '../services/mockData';
import { Supplier } from '../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getSuppliers().then(setSuppliers);
  };

  const handleAdd = () => {
    setEditingSupplier({ status: 'ACTIVE' });
    setIsModalOpen(true);
    setError('');
  };

  const handleEdit = (s: Supplier) => {
    setEditingSupplier({ ...s });
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      try {
        await deleteSupplier(id);
        loadData();
      } catch (e: any) {
        alert(e.message); // EF3 warning
        loadData();
      }
    }
  };

  const handleSave = async () => {
    try {
      await saveSupplier(editingSupplier);
      setIsModalOpen(false);
      loadData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhà cung cấp</h1>
        <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-800">
          <Plus size={18} className="mr-2" /> Thêm NCC
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Tên NCC</th>
              <th className="px-6 py-4">Liên hệ</th>
              <th className="px-6 py-4">Địa chỉ</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suppliers.map(s => (
              <tr key={s.id} className={`hover:bg-gray-50 ${s.status === 'STOPPED' ? 'opacity-60 bg-gray-50' : ''}`}>
                <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4">{s.contact}</td>
                <td className="px-6 py-4 text-gray-600">{s.address}</td>
                <td className="px-6 py-4 text-center">
                   {s.status === 'STOPPED' ? 
                     <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Ngưng hợp tác</span> : 
                     <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Đang hợp tác</span>}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  {s.status !== 'STOPPED' && (
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingSupplier.id ? 'Cập nhật NCC' : 'Thêm NCC mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà cung cấp *</label>
                    <input 
                      type="text" 
                      value={editingSupplier.name || ''}
                      onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại / Liên hệ *</label>
                    <input 
                      type="text" 
                      value={editingSupplier.contact || ''}
                      onChange={e => setEditingSupplier({...editingSupplier, contact: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input 
                      type="text" 
                      value={editingSupplier.address || ''}
                      onChange={e => setEditingSupplier({...editingSupplier, address: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
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