import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/mockData';
import { Transaction, TransactionType } from '../types';
import { Search, Filter, FileText, Calendar } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('ALL');

  useEffect(() => {
    getTransactions().then(data => {
      setTransactions(data);
      setFilteredTransactions(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = transactions;

    // Filter by Search Term (Partner Name or User Name)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(t => 
        (t.partnerName && t.partnerName.toLowerCase().includes(lowerTerm)) ||
        t.performerName.toLowerCase().includes(lowerTerm) ||
        t.id.toLowerCase().includes(lowerTerm)
      );
    }

    // Filter by Type
    if (filterType !== 'ALL') {
      result = result.filter(t => t.type === filterType);
    }

    // Filter by Date (Simple mock logic for 'recent' vs 'all')
    // AF3 mentions default view if no filter. Here 'ALL' is default.
    if (dateRange === '7DAYS') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter(t => new Date(t.date) >= sevenDaysAgo);
    }

    setFilteredTransactions(result);
  }, [searchTerm, filterType, dateRange, transactions]);

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case TransactionType.IMPORT:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Nhập Kho</span>;
      case TransactionType.EXPORT:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Xuất Kho</span>;
      case TransactionType.CHECK:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Kiểm Kê</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'DRAFT' 
      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">Nháp</span>
      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">Hoàn thành</span>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lịch sử nhập xuất</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm mã phiếu, đối tác, người lập..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none w-full"
          />
        </div>
        
        <div className="flex gap-4">
           <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
            >
              <option value="ALL">Tất cả loại</option>
              <option value={TransactionType.IMPORT}>Nhập kho</option>
              <option value={TransactionType.EXPORT}>Xuất kho</option>
              <option value={TransactionType.CHECK}>Kiểm kê</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-gray-500" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
            >
              <option value="ALL">Toàn bộ thời gian</option>
              <option value="7DAYS">7 ngày gần nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 text-sm font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Mã phiếu</th>
                <th className="px-6 py-4">Ngày lập</th>
                <th className="px-6 py-4">Loại phiếu</th>
                <th className="px-6 py-4">Đối tác / Ghi chú</th>
                <th className="px-6 py-4">Người lập</th>
                <th className="px-6 py-4 text-right">Tổng giá trị</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">Không tìm thấy phiếu nào.</td></tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-800">{t.id}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(t.date).toLocaleDateString('vi-VN')} {new Date(t.date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(t.type)}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm truncate max-w-xs" title={t.partnerName}>
                      {t.partnerName || (t.type === TransactionType.CHECK ? 'Kiểm kê định kỳ' : '-')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{t.performerName}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800">
                      {t.totalValue > 0 ? t.totalValue.toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};