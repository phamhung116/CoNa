import React, { useEffect, useState } from 'react';
import { getProducts, saveTransaction } from '../services/mockData';
import { Product, TransactionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { ClipboardCheck, Save, Filter } from 'lucide-react';

interface CheckItem {
  productId: string;
  productName: string;
  category: string; // Added for AF2 filtering
  systemStock: number;
  actualStock: number;
}

export const StockCheck: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<CheckItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // AF2: Partial Check Logic
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      
      // Extract categories
      const uniqueCats = Array.from(new Set(data.map(p => p.category)));
      setCategories(uniqueCats);

      // Initialize check items
      const checkItems = data.map(p => ({
        productId: p.id,
        productName: p.name,
        category: p.category,
        systemStock: p.stock,
        actualStock: p.stock // Default to matching
      }));
      setItems(checkItems);
      setFilteredItems(checkItems);
      setLoading(false);
    });
  }, []);

  // Handle AF2 Filter
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(i => i.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const handleStockChange = (productId: string, val: string) => {
    const numVal = parseInt(val);
    if (isNaN(numVal) || numVal < 0) return;
    
    // Update main items array state
    const updatedItems = items.map(item => 
      item.productId === productId ? { ...item, actualStock: numVal } : item
    );
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSuccess(false);

    // Find differences within the filtered scope (Partial check saves only what is checked)
    // But usually in a real system, a partial check updates those specific items.
    
    try {
        await saveTransaction({
            id: `chk-${Date.now()}`,
            type: TransactionType.CHECK,
            date: new Date().toISOString(),
            performerId: user?.id || 'unknown',
            performerName: user?.fullName || 'Unknown',
            totalValue: 0,
            status: 'COMPLETED',
            items: filteredItems.map(i => ({
                productId: i.productId,
                productName: i.productName,
                quantity: i.actualStock, // The logic in mockData updates stock to this value
                systemQuantity: i.systemStock,
                price: 0
            }))
        });
        setSuccess(true);
    } catch (e) {
        alert("Lỗi khi lưu phiếu kiểm kê");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Kiểm kê kho hàng</h1>
        <div className="text-sm text-gray-500">
          Ngày: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* AF2: Filter Area for Partial Check */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <span className="text-gray-600 font-medium flex items-center">
          <Filter size={18} className="mr-2" />
          Phạm vi kiểm kê:
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white min-w-[200px]"
        >
          <option value="ALL">Toàn bộ kho</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 italic ml-auto">
          (Chọn nhóm hàng để thực hiện kiểm kê một phần)
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
                <tr>
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-6 py-4">Nhóm hàng</th>
                    <th className="px-6 py-4 text-center">Tồn hệ thống</th>
                    <th className="px-6 py-4 text-center w-40">Thực tế</th>
                    <th className="px-6 py-4 text-center">Chênh lệch</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredItems.length > 0 ? filteredItems.map((item) => {
                    const diff = item.actualStock - item.systemStock;
                    return (
                        <tr key={item.productId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-800">{item.productName}</td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{item.category}</td>
                            <td className="px-6 py-4 text-center text-gray-600">{item.systemStock}</td>
                            <td className="px-6 py-4">
                                <input 
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-center font-bold focus:ring-2 focus:ring-accent outline-none"
                                    value={item.actualStock}
                                    onChange={(e) => handleStockChange(item.productId, e.target.value)}
                                    min="0"
                                />
                            </td>
                            <td className={`px-6 py-4 text-center font-bold ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-green-500' : 'text-gray-300'}`}>
                                {diff > 0 ? `+${diff}` : diff}
                            </td>
                        </tr>
                    );
                }) : (
                   <tr><td colSpan={5} className="p-8 text-center text-gray-500">Không có sản phẩm nào trong nhóm này.</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {success && (
          <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
              Đã lưu phiếu kiểm kê và cập nhật tồn kho thành công!
          </div>
      )}

      <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || filteredItems.length === 0}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50"
          >
            <ClipboardCheck className="mr-2" />
            Hoàn tất & Điều chỉnh kho
          </button>
      </div>
    </div>
  );
};