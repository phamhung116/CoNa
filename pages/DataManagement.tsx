import React, { useEffect, useState } from 'react';
import { getBackups, createBackup, restoreBackup } from '../services/mockData';
import { BackupFile } from '../types';
import { Database, Download, Upload, Clock, RefreshCw, FileArchive } from 'lucide-react';

export const DataManagement: React.FC = () => {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    setLoading(true);
    getBackups().then(data => {
        setBackups(data);
        setLoading(false);
    });
  };

  const handleCreateBackup = async () => {
      setProcessing(true);
      setMessage({ text: 'Đang tạo bản sao lưu...', type: 'info' });
      try {
          await createBackup();
          setMessage({ text: 'Tạo sao lưu thành công!', type: 'success' });
          loadBackups();
      } catch (e) {
          setMessage({ text: 'Lỗi khi tạo sao lưu', type: 'error' });
      } finally {
          setProcessing(false);
      }
  };

  const handleRestore = async (id: string) => {
      if (!window.confirm('CẢNH BÁO: Phục hồi dữ liệu sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc chắn không?')) return;
      
      setProcessing(true);
      setMessage({ text: 'Đang phục hồi dữ liệu (giả lập)...', type: 'info' });
      
      try {
          await restoreBackup(id);
          setMessage({ text: 'Phục hồi dữ liệu thành công!', type: 'success' });
      } catch (e: any) {
          // EF5: Error simulation
          setMessage({ text: e.message, type: 'error' });
      } finally {
          setProcessing(false);
      }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý dữ liệu hệ thống</h1>

      {/* Actions Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 border-blue-100 bg-blue-50">
              <div className="flex items-center mb-3 text-blue-800 font-semibold">
                  <Database className="mr-2"/> Sao lưu dữ liệu (Backup)
              </div>
              <p className="text-sm text-gray-600 mb-4">
                  Tạo bản sao lưu toàn bộ cơ sở dữ liệu. Hệ thống cũng tự động sao lưu hàng ngày lúc 00:00 (AF2).
              </p>
              <button 
                onClick={handleCreateBackup} 
                disabled={processing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full flex justify-center items-center disabled:opacity-50"
              >
                  {processing ? <RefreshCw className="animate-spin mr-2"/> : <Download className="mr-2"/>} 
                  Sao lưu ngay
              </button>
          </div>

          <div className="border rounded-lg p-4 border-orange-100 bg-orange-50">
              <div className="flex items-center mb-3 text-orange-800 font-semibold">
                  <Upload className="mr-2"/> Phục hồi dữ liệu (Restore)
              </div>
              <p className="text-sm text-gray-600 mb-4">
                  Khôi phục hệ thống về trạng thái cũ từ file backup. Hành động này không thể hoàn tác.
              </p>
              <div className="w-full bg-white border border-orange-200 rounded-lg p-2 text-center text-gray-400 text-sm cursor-not-allowed">
                  Chọn file backup từ danh sách bên dưới để phục hồi
              </div>
          </div>
      </div>

      {message.text && (
          <div className={`p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {message.text}
          </div>
      )}

      {/* Backup List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-700 flex items-center"><Clock size={18} className="mr-2"/> Lịch sử sao lưu</h3>
            <button onClick={loadBackups} className="text-gray-500 hover:text-gray-700"><RefreshCw size={18}/></button>
        </div>
        <table className="w-full text-left">
          <thead className="text-gray-500 text-sm font-medium border-b">
            <tr>
              <th className="px-6 py-3">Tên File</th>
              <th className="px-6 py-3">Thời gian tạo</th>
              <th className="px-6 py-3">Dung lượng</th>
              <th className="px-6 py-3 text-center">Loại</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải...</td></tr>
            ) : backups.map(bk => (
              <tr key={bk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800 flex items-center">
                    <FileArchive className="mr-2 text-gray-400" size={16}/>
                    {bk.fileName}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{new Date(bk.createdAt).toLocaleString('vi-VN')}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{bk.size}</td>
                <td className="px-6 py-4 text-center">
                   <span className={`px-2 py-1 text-xs rounded-full ${bk.type === 'AUTO' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                       {bk.type === 'AUTO' ? 'Tự động' : 'Thủ công'}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleRestore(bk.id)}
                    disabled={processing}
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium border border-orange-200 px-3 py-1 rounded hover:bg-orange-50 disabled:opacity-50"
                  >
                    Phục hồi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};