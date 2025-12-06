import React, { useEffect, useState } from 'react';
import { getRoles, saveRole, deleteRole } from '../services/mockData';
import { RoleDefinition, Role } from '../types';
import { Plus, Edit, Trash2, Save, X, Shield } from 'lucide-react';

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<RoleDefinition>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    getRoles().then(setRoles);
  };

  const handleAdd = () => {
    setEditingRole({ isSystem: false, permissions: [] });
    setIsModalOpen(true);
    setError('');
  };

  const handleEdit = (role: RoleDefinition) => {
    setEditingRole({ ...role });
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhóm quyền này?')) {
      try {
        await deleteRole(id);
        loadRoles();
      } catch (e: any) {
        alert(e.message); // EF2: Error message for in-use roles
      }
    }
  };

  const handleSave = async () => {
    if (!editingRole.name || !editingRole.code) {
        setError('Tên và mã nhóm quyền là bắt buộc.');
        return;
    }
    setLoading(true);
    try {
      await saveRole(editingRole as RoleDefinition);
      setIsModalOpen(false);
      loadRoles();
    } catch (e: any) {
      setError(e.message); // EF1: Duplicate name
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý nhóm quyền hệ thống</h1>
        <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-800">
          <Plus size={18} className="mr-2" /> Thêm nhóm quyền
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Tên nhóm quyền</th>
              <th className="px-6 py-4">Mã hệ thống</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4 text-center">Loại</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map(role => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                    <Shield size={16} className="mr-2 text-blue-500"/>
                    {role.name}
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{role.code}</td>
                <td className="px-6 py-4 text-gray-600">{role.description}</td>
                <td className="px-6 py-4 text-center">
                   {role.isSystem ? (
                       <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">Hệ thống</span>
                   ) : (
                       <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Tùy chỉnh</span>
                   )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(role)} className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  {!role.isSystem && (
                    <button onClick={() => handleDelete(role.id)} className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg">
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
              <h2 className="text-xl font-bold text-gray-800">{editingRole.id ? 'Sửa nhóm quyền' : 'Tạo nhóm quyền mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm quyền *</label>
                    <input 
                      type="text" 
                      value={editingRole.name || ''}
                      onChange={e => setEditingRole({...editingRole, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã hệ thống (Code) *</label>
                    <input 
                      type="text" 
                      disabled={editingRole.isSystem}
                      value={editingRole.code || ''}
                      onChange={e => setEditingRole({...editingRole, code: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none disabled:bg-gray-100"
                      placeholder="VD: SALES, MANAGER..."
                    />
                    {editingRole.isSystem && <p className="text-xs text-gray-400 mt-1">Mã hệ thống không thể thay đổi.</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea 
                      rows={3}
                      value={editingRole.description || ''}
                      onChange={e => setEditingRole({...editingRole, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
                </div>
                
                {/* Mock Permission Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quyền chi tiết (Mock)</label>
                    <div className="p-3 border border-gray-200 rounded bg-gray-50 text-sm text-gray-500">
                        Trong hệ thống thực tế, đây sẽ là danh sách checkbox các quyền truy cập (Ví dụ: xem_báo_cáo, xóa_user...).
                    </div>
                </div>

                <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-slate-800 flex justify-center items-center disabled:opacity-70"
              >
                <Save size={18} className="mr-2" /> Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};