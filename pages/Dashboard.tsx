import React, { useEffect, useState } from 'react';
import { getProducts, getTransactions, getUsers, getSystemLogs, getBackups } from '../services/mockData';
import { Product, Transaction, TransactionType, Role, User, SystemLog, BackupFile } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Package, Users, FileText, Database, Shield } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Business State
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // System State
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      // Load System Data
      Promise.all([getUsers(), getSystemLogs(), getBackups()]).then(([u, l, b]) => {
        setUsers(u);
        setLogs(l);
        setBackups(b);
        setLoading(false);
      });
    } else {
      // Load Business Data
      Promise.all([getProducts(), getTransactions()]).then(([p, t]) => {
        setProducts(p);
        setTransactions(t);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  // --- ADMIN DASHBOARD ---
  if (user?.role === Role.ADMIN) {
    const errorLogs = logs.filter(l => l.type === 'ERROR').length;
    const warningLogs = logs.filter(l => l.type === 'WARNING').length;
    const lastBackup = backups.length > 0 ? backups[0] : null;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Hệ Thống</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng User</p>
                  <p className="text-2xl font-bold text-primary">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Users size={24} />
                </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Log lỗi (Error)</p>
                  <p className="text-2xl font-bold text-danger">{errorLogs}</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-full">
                  <AlertTriangle size={24} />
                </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng Nhật ký</p>
                  <p className="text-2xl font-bold text-purple-600">{logs.length}</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                  <FileText size={24} />
                </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Backup gần nhất</p>
                  <p className="text-sm font-bold text-green-600 truncate">
                      {lastBackup ? new Date(lastBackup.createdAt).toLocaleDateString('vi-VN') : 'Chưa có'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-full">
                  <Database size={24} />
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="text-lg font-semibold mb-4 flex items-center"><Shield className="mr-2" size={18}/> Nhật ký bảo mật gần đây</h3>
                 <div className="space-y-3">
                     {logs.slice(0, 5).map(log => (
                         <div key={log.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                             <div className={`mt-1 w-2 h-2 rounded-full mr-3 flex-shrink-0 ${log.type === 'ERROR' ? 'bg-red-500' : log.type === 'WARNING' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                             <div>
                                 <p className="text-sm font-medium text-gray-800">{log.action} <span className="text-gray-400 font-normal">- {log.username}</span></p>
                                 <p className="text-xs text-gray-500">{log.details}</p>
                                 <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString('vi-VN')}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="text-lg font-semibold mb-4">Trạng thái hệ thống</h3>
                 <div className="space-y-4">
                     <div>
                         <div className="flex justify-between text-sm mb-1">
                             <span>Dung lượng lưu trữ (Giả lập)</span>
                             <span>45%</span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                             <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                         </div>
                     </div>
                     <div>
                         <div className="flex justify-between text-sm mb-1">
                             <span>CPU Load (Giả lập)</span>
                             <span>12%</span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                             <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    );
  }

  // --- BUSINESS DASHBOARD (Owner / Staff) ---
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const importValue = transactions
    .filter(t => t.type === TransactionType.IMPORT)
    .reduce((sum, t) => sum + t.totalValue, 0);
  
  // Data for Charts
  const categoryData = products.reduce((acc, curr) => {
    const existing = acc.find(i => i.name === curr.category);
    if (existing) {
      existing.value += curr.stock;
    } else {
      acc.push({ name: curr.category, value: curr.stock });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
          {user?.role === Role.OWNER ? 'Tổng quan kinh doanh' : 'Tổng quan kho hàng'}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng tồn kho</p>
              <p className="text-2xl font-bold text-primary">{totalStock}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cảnh báo hết hàng</p>
              <p className="text-2xl font-bold text-danger">{lowStockProducts.length}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-full">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Giá trị nhập (Tổng)</p>
              <p className="text-xl font-bold text-success">{(importValue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Cảnh báo tồn kho thấp</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {lowStockProducts.slice(0, 3).map(p => (
                    <li key={p.id}>
                      {p.name} (Mã: {p.code}) - Còn: <strong>{p.stock}</strong> {p.unit} (Định mức: {p.minStock})
                    </li>
                  ))}
                  {lowStockProducts.length > 3 && <li>...và {lowStockProducts.length - 3} sản phẩm khác</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Tỷ lệ tồn kho theo danh mục</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Tồn kho sản phẩm chủ lực</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={products.slice(0, 5)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} style={{fontSize: '12px'}} />
                <Tooltip />
                <Bar dataKey="stock" fill="#3b82f6" name="Số lượng tồn" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};