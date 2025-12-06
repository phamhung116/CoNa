import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/mockData';
import { Product } from '../types';
import { Search, Filter } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by Text (Name or Code)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.code.toLowerCase().includes(lowerTerm)
      );
    }

    // Filter by Status
    if (filterStatus === 'LOW') {
      result = result.filter(p => p.stock <= p.minStock && p.stock > 0);
    } else if (filterStatus === 'OUT') {
      result = result.filter(p => p.stock === 0);
    }

    setFilteredProducts(result);
  }, [searchTerm, filterStatus, products]);

  const getStatusBadge = (p: Product) => {
    if (p.stock === 0) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Hết hàng</span>;
    if (p.stock <= p.minStock) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Sắp hết</span>;
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Đủ hàng</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách tồn kho</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none w-full md:w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="LOW">Cảnh báo thấp</option>
              <option value="OUT">Đã hết hàng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 border-b">Mã SP</th>
                <th className="px-6 py-4 border-b">Tên sản phẩm</th>
                <th className="px-6 py-4 border-b">Danh mục</th>
                <th className="px-6 py-4 border-b">Đơn vị</th>
                <th className="px-6 py-4 border-b text-right">Giá bán</th>
                <th className="px-6 py-4 border-b text-center">Tồn kho</th>
                <th className="px-6 py-4 border-b text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{product.price.toLocaleString()} đ</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">{product.stock}</td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(product)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};