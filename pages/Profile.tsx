import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/mockData';
import { User, Role } from '../types';
import { UserCircle, Save, Lock } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' as 'success' | 'error' | '' });

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = async () => {
    if (!formData.fullName) {
      setMsg({ text: 'Họ tên không được để trống', type: 'error' });
      return;
    }
    try {
      const updatedUser = await updateUser({ ...user, ...formData });
      // Force update context - simplistic approach for mock
      // In real app, context would have an update method
      setMsg({ text: 'Cập nhật thông tin thành công', type: 'success' });
      setIsEditing(false);
    } catch (e) {
      setMsg({ text: 'Lỗi khi cập nhật thông tin', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMsg({ text: 'Vui lòng điền đầy đủ thông tin mật khẩu', type: 'error' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setMsg({ text: 'Mật khẩu mới không khớp', type: 'error' });
      return;
    }
    
    try {
      // Mock password update
      await updateUser(user, passwords.new);
      setMsg({ text: 'Đổi mật khẩu thành công', type: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e) {
      setMsg({ text: 'Lỗi khi đổi mật khẩu', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý tài khoản cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2 font-semibold">
            {user.role === Role.ADMIN ? 'Quản trị viên' : user.role === Role.OWNER ? 'Chủ cửa hàng' : 'Nhân viên kho'}
          </span>
          <p className="text-gray-500 mt-2 text-sm">@{user.username}</p>
        </div>

        {/* Edit Details */}
        <div className="col-span-2 space-y-6">
          {msg.text && (
            <div className={`p-4 rounded-lg ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center"><UserCircle className="mr-2" size={20}/> Thông tin cá nhân</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-accent hover:underline"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  name="fullName"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Chưa cập nhật"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    type="text" 
                    name="phone"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Chưa cập nhật"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 mt-4">
                  <button 
                    onClick={() => { setIsEditing(false); setFormData({ fullName: user.fullName, email: user.email, phone: user.phone }); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSaveInfo}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 flex items-center"
                  >
                    <Save size={16} className="mr-2" /> Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center"><Lock className="mr-2" size={20}/> Đổi mật khẩu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  name="current"
                  value={passwords.current}
                  onChange={handlePassChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    name="new"
                    value={passwords.new}
                    onChange={handlePassChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePassChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};