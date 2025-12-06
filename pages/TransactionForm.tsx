import React, { useEffect, useState } from 'react';
import { getProducts, getSuppliers, saveTransaction } from '../services/mockData';
import { Product, Supplier, TransactionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Save, RefreshCw, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RowItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  currentStock?: number;
}

export const TransactionForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<TransactionType>(TransactionType.IMPORT);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Form State
  const [partnerName, setPartnerName] = useState(''); // Supplier or Customer Name
  const [rows, setRows] = useState<RowItem[]>([{ id: 1, productId: '', quantity: 1, price: 0 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    Promise.all([getProducts(), getSuppliers()]).then(([p, s]) => {
      setProducts(p);
      setSuppliers(s);
    });
  }, []);

  // Reset form when switching mode
  const handleModeChange = (newMode: TransactionType) => {
    setMode(newMode);
    setRows([{ id: Date.now(), productId: '', quantity: 1, price: 0 }]);
    setPartnerName('');
    setError('');
    setSuccessMsg('');
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), productId: '', quantity: 1, price: 0 }]);
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const handleRowChange = (id: number, field: keyof RowItem, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-fill price and stock if product changes
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedRow.price = product.price;
            updatedRow.currentStock = product.stock;
          }
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const calculateTotal = () => {
    return rows.reduce((sum, row) => sum + (row.quantity * row.price), 0);
  };

  const handleSubmit = async (status: 'COMPLETED' | 'DRAFT') => {
    setError('');
    setSuccessMsg('');
    
    // Basic Validation (EF2)
    if (!partnerName) {
      setError('Vui lòng nhập tên Nhà cung cấp hoặc Khách hàng');
      return;
    }
    
    // Filter valid rows
    const validRows = rows.filter(r => r.productId && r.quantity > 0);
    
    if (validRows.length === 0) {
      setError('Vui lòng chọn ít nhất một sản phẩm hợp lệ');
      return;
    }

    // EF2: Check for invalid data in rows
    const invalidRow = rows.find(r => r.productId && (r.quantity <= 0 || r.price < 0));
    if (invalidRow) {
      setError('Dữ liệu không hợp lệ: Số lượng phải > 0 và Đơn giá không được âm.');
      return;
    }

    // Check stock for Export (Only if COMPLETED)
    if (mode === TransactionType.EXPORT && status === 'COMPLETED') {
      for (const row of validRows) {
        if (row.currentStock !== undefined && row.quantity > row.currentStock) {
          setError(`Sản phẩm có ID ${row.productId} không đủ tồn kho để xuất.`); // EF3
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      await saveTransaction({
        id: `t-${Date.now()}`,
        type: mode,
        date: new Date().toISOString(),
        performerId: user?.id || 'unknown',
        performerName: user?.fullName || 'Unknown',
        partnerName,
        totalValue: calculateTotal(),
        status: status,
        items: validRows.map(r => {
          const p = products.find(prod => prod.id === r.productId);
          return {
            productId: r.productId,
            productName: p?.name || 'Unknown',
            quantity: Number(r.quantity),
            price: Number(r.price)
          };
        })
      });

      setSuccessMsg(status === 'DRAFT' ? 'Đã lưu nháp thành công!' : 'Giao dịch thành công!');
      
      // Navigate logic
      setTimeout(() => {
        navigate(status === 'DRAFT' ? '/history' : '/inventory');
      }, 1500);

    } catch (err: any) {
      // EF3 & EF4 handling
      setError(err.message || 'Thao tác không thành công. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === TransactionType.IMPORT ? 'Tạo Phiếu Nhập Kho' : 'Tạo Phiếu Xuất Kho'}
        </h1>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => handleModeChange(TransactionType.IMPORT)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === TransactionType.IMPORT ? 'bg-accent text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Nhập kho
          </button>
          <button
            onClick={() => handleModeChange(TransactionType.EXPORT)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === TransactionType.EXPORT ? 'bg-accent text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Xuất kho
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === TransactionType.IMPORT ? 'Nhà cung cấp' : 'Khách hàng / Người nhận'} <span className="text-red-500">*</span>
            </label>
            {mode === TransactionType.IMPORT ? (
              <select
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">-- Chọn NCC --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Nhập tên khách hàng..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày lập phiếu</label>
            <input
              type="text"
              disabled
              value={new Date().toLocaleDateString('vi-VN')}
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-500"
            />
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Sản phẩm</th>
                {mode === TransactionType.EXPORT && <th className="px-4 py-3 text-center">Tồn kho</th>}
                <th className="px-4 py-3 w-32">Số lượng</th>
                <th className="px-4 py-3 w-40">Đơn giá</th>
                <th className="px-4 py-3 w-40 text-right">Thành tiền</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.productId}
                      onChange={(e) => handleRowChange(row.id, 'productId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-accent outline-none"
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                  </td>
                  {mode === TransactionType.EXPORT && (
                    <td className={`px-4 py-3 text-center font-medium ${row.currentStock !== undefined && row.quantity > row.currentStock ? 'text-red-600' : 'text-gray-600'}`}>
                      {row.currentStock ?? '-'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => handleRowChange(row.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-center outline-none focus:ring-1 focus:ring-accent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleRowChange(row.id, 'price', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-right outline-none focus:ring-1 focus:ring-accent"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {(row.quantity * row.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold text-gray-800">
              <tr>
                <td colSpan={mode === TransactionType.EXPORT ? 5 : 4} className="px-4 py-3 text-right">Tổng cộng:</td>
                <td className="px-4 py-3 text-right text-accent text-lg">{calculateTotal().toLocaleString()} đ</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="flex items-center text-accent hover:text-blue-700 font-medium text-sm transition-colors"
        >
          <Plus size={16} className="mr-1" /> Thêm dòng sản phẩm
        </button>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            {successMsg}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          
          {/* Alternative Flow AF1: Save Draft */}
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-70"
          >
            <FileEdit className="mr-2" size={18} />
            Lưu Nháp
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('COMPLETED')}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Lưu Phiếu
          </button>
        </div>
      </div>
    </div>
  );
};