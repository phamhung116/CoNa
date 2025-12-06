import React, { useEffect, useState } from 'react';
import { getUsers, saveUser, toggleUserLock } from '../services/mockData';
import { User, Role } from '../types';
import { Plus, Edit, Lock, Unlock, Save, X } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> & { password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    getUsers().then(setUsers);
  };

  const handleAdd = () => {
    setEditingUser({ role: Role.STAFF, isLocked: false });
    setIsModalOpen(true);
    setError('');
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
    setError('');
  };

  const handleLock = async (id: string) => {
    await toggleUserLock(id);
    loadUsers();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveUser(editingUser);
      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý phân quyền nhân viên</h1>
        <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-800">
          <Plus size={18} className="mr-2" /> Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Nhân viên</th>
              <th className="px-6 py-4">Liên hệ</th>
              <th className="px-6 py-4">Vai trò (Role)</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>{user.email}</div>
                  <div>{user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' :
                    user.role === Role.OWNER ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                   {user.isLocked ? (
                       <span className="text-red-500 text-sm flex items-center justify-center"><Lock size={14} className="mr-1"/> Đã khóa</span>
                   ) : (
                       <span className="text-green-500 text-sm flex items-center justify-center">Hoạt động</span>
                   )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  {user.role !== Role.ADMIN && user.role !== Role.OWNER && (
                    <button onClick={() => handleLock(user.id)} className={`${user.isLocked ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} p-2 rounded-lg hover:opacity-80`}>
                        {user.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingUser.id ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập *</label>
                  <input 
                    type="text" 
                    disabled={!!editingUser.id}
                    value={editingUser.username || ''} 
                    onChange={e => setEditingUser({...editingUser, username: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu {editingUser.id && '(Để trống nếu ko đổi)'}</label>
                  <input 
                    type="password" 
                    value={editingUser.password || ''} 
                    onChange={e => setEditingUser({...editingUser, password: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input 
                  type="text" 
                  value={editingUser.fullName || ''} 
                  onChange={e => setEditingUser({...editingUser, fullName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={editingUser.email || ''} 
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={editingUser.phone || ''} 
                      onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò (Role)</label>
                <select 
                    value={editingUser.role} 
                    onChange={e => setEditingUser({...editingUser, role: e.target.value as Role})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none bg-white"
                >
                    <option value={Role.STAFF}>Nhân viên kho</option>
                    <option value={Role.OWNER}>Chủ cửa hàng</option>
                    <option value={Role.ADMIN}>Quản trị viên</option>
                </select>
              </div>

              <button 
                onClick={handleSave}
                disabled={isLoading}
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