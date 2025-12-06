import React, { useEffect, useState } from 'react';
import { getSystemLogs } from '../services/mockData';
import { SystemLog } from '../types';
import { Search, Filter, Download, RefreshCw, AlertTriangle, Info, FileText } from 'lucide-react';

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLoading(true);
    getSystemLogs().then(data => {
        setLogs(data);
        setFilteredLogs(data);
        setLoading(false);
    });
  };

  useEffect(() => {
    let result = logs;
    if (searchTerm) {
        result = result.filter(l => 
            l.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.details.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    if (logType !== 'ALL') {
        result = result.filter(l => l.type === logType);
    }
    setFilteredLogs(result);
  }, [searchTerm, logType, logs]);

  const handleExport = () => {
      alert("Đã xuất file log ra định dạng Excel (Mock - AF3)");
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'ERROR': return <AlertTriangle className="text-red-500" size={18}/>;
          case 'WARNING': return <AlertTriangle className="text-yellow-500" size={18}/>;
          default: return <Info className="text-blue-500" size={18}/>;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Nhật ký hoạt động hệ thống</h1>
        <div className="flex space-x-2">
            <button onClick={loadLogs} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
            </button>
            <button onClick={handleExport} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={18} className="mr-2"/> Xuất log (Excel)
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm kiếm theo User, Hành động, Chi tiết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="INFO">Thông tin (Info)</option>
              <option value="WARNING">Cảnh báo (Warning)</option>
              <option value="ERROR">Lỗi (Error)</option>
            </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Hành động</th>
              <th className="px-6 py-4">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.length > 0 ? filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        {getIcon(log.type)}
                        <span className={`ml-2 font-medium ${log.type === 'ERROR' ? 'text-red-600' : log.type === 'WARNING' ? 'text-yellow-600' : 'text-blue-600'}`}>
                            {log.type}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{log.username}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-600 bg-gray-100 rounded inline-block m-2">{log.action}</td>
                <td className="px-6 py-4 text-gray-700">{log.details}</td>
              </tr>
            )) : (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Không tìm thấy nhật ký nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};