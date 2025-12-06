import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getTransactions, getProducts, getSuppliers } from '../services/mockData';
import { Transaction, Product, TransactionType, Supplier } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, Calendar as CalendarIcon, Filter, AlertTriangle, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REVENUE' | 'STOCK' | 'LOW_STOCK'>('REVENUE');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Date Filters State
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(today); // Month currently displayed in picker
  
  // Manual Input State
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([getTransactions(), getProducts(), getSuppliers()]).then(([t, p, s]) => {
        setTransactions(t);
        setProducts(p);
        setSuppliers(s);
    });

    // Close picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  // Sync Inputs when Date State changes (e.g. via Calendar picker)
  useEffect(() => {
    setStartInput(formatDateForInput(startDate));
    setEndInput(formatDateForInput(endDate));
  }, [startDate, endDate]);

  const handleExport = () => {
      alert("Tính năng xuất file PDF/Excel đang được phát triển (Mock)");
  };

  // --- Date Helpers ---
  const formatDateForInput = (date: Date) => {
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
  };

  const parseDateFromInput = (str: string): Date | null => {
      // Regex check dd/mm/yyyy
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = str.match(regex);
      if (!match) return null;

      const d = parseInt(match[1], 10);
      const m = parseInt(match[2], 10) - 1; // JS month is 0-indexed
      const y = parseInt(match[3], 10);

      const date = new Date(y, m, d);
      // Check if valid date (e.g. not 32/01)
      if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
          return date;
      }
      return null;
  };

  const formatInputDate = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    const char = { 0: '/', 2: '/' };
    let formatted = '';
    
    // Auto-insert slashes logic
    for (let i = 0; i < numbers.length && i < 8; i++) {
        if (i === 2 || i === 4) {
            formatted += '/';
        }
        formatted += numbers[i];
    }
    return formatted;
  };

  const handleManualInputChange = (type: 'START' | 'END', rawValue: string) => {
      // Apply input mask
      const value = formatInputDate(rawValue);

      if (type === 'START') {
          setStartInput(value);
          const date = parseDateFromInput(value);
          if (date) {
             if (date > endDate) setEndDate(date); // Auto adjust end if start > end
             setStartDate(date);
             setPickerMonth(date);
          }
      } else {
          setEndInput(value);
          const date = parseDateFromInput(value);
          if (date) {
             if (date < startDate) setStartDate(date); // Auto adjust start if end < start
             setEndDate(date);
             setPickerMonth(date);
          }
      }
  };

  // --- Calendar Logic ---
  const handleDayClick = (day: Date) => {
    // Reset time to avoid comparison issues
    const clickedDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const currentStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const currentEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    if (currentStart.getTime() === currentEnd.getTime()) {
      // If start and end are same (or only start is selected effectively), this click defines the range
      if (clickedDate < currentStart) {
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
        // setIsPickerOpen(false); // Don't close immediately in this new UI
      }
    } else {
      // Start a new selection
      setStartDate(clickedDate);
      setEndDate(clickedDate);
    }
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + offset, 1);
    setPickerMonth(newMonth);
  };

  const generateCalendarDays = () => {
    const year = pickerMonth.getFullYear();
    const month = pickerMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Mon=0, Sun=6 adjustment

    const days = [];
    // Padding for empty cells before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const isBetween = (target: Date, start: Date, end: Date) => {
    return target > start && target < end;
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'});
  };

  // --- Data Processing ---

  const getDaysArray = (start: Date, end: Date) => {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  // 1. Revenue/Transaction Chart Data
  const revenueData = useMemo(() => {
    const dayList = getDaysArray(startDate, endDate);
    
    return dayList.map(dateObj => {
        const dateStr = dateObj.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'});
        const isoDate = dateObj.toISOString().split('T')[0];

        // 1. Try to find REAL data
        const dayTransactions = transactions.filter(t => t.date.startsWith(isoDate) && t.status === 'COMPLETED');
        
        let importVal = dayTransactions
            .filter(t => t.type === TransactionType.IMPORT)
            .reduce((sum, t) => sum + t.totalValue, 0);

        let exportVal = dayTransactions
            .filter(t => t.type === TransactionType.EXPORT)
            .reduce((sum, t) => sum + t.totalValue, 0);

        // 2. "Always Data" Logic: Mock data generation
        if (importVal === 0) {
            importVal = Math.floor(Math.random() * (35000000 - 5000000 + 1)) + 5000000;
        }
        if (exportVal === 0) {
            exportVal = Math.floor(Math.random() * (25000000 - 2000000 + 1)) + 2000000;
        }

        return {
            date: dateStr,
            import: importVal,
            export: exportVal
        };
    });
  }, [startDate, endDate, transactions]);

  // 2. Low Stock Data
  const lowStockData = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
        <button onClick={handleExport} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} className="mr-2"/> Xuất báo cáo
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200 inline-flex">
          <button 
            onClick={() => setActiveTab('REVENUE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'REVENUE' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Nhập / Xuất theo thời gian
          </button>
          <button 
             onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'STOCK' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Tồn kho sản phẩm
          </button>
          <button 
             onClick={() => setActiveTab('LOW_STOCK')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'LOW_STOCK' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Cảnh báo dưới định mức
          </button>
      </div>

      {/* Unified Date Range Picker */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col xl:flex-row xl:items-center space-y-3 xl:space-y-0 xl:space-x-6 border border-gray-100 z-10 relative">
          <span className="text-gray-600 font-semibold flex items-center"><Filter size={18} className="mr-2 text-accent"/> Thời gian báo cáo:</span>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Calendar Picker Trigger */}
              <div className="relative" ref={pickerRef}>
                <button 
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:border-accent focus:ring-2 focus:ring-accent bg-white min-w-[260px] justify-between"
                >
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon size={18} className="mr-2 text-gray-500" />
                    <span className="font-medium">
                      {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
                    </span>
                  </div>
                  <ChevronLeft size={16} className={`transform transition-transform ${isPickerOpen ? '-rotate-90' : 'rotate-0'} text-gray-400`} />
                </button>

                {isPickerOpen && (
                  <div className="absolute top-12 left-0 bg-white shadow-xl rounded-lg border border-gray-200 p-0 z-50 flex flex-col md:flex-row overflow-hidden md:min-w-[550px]">
                    
                    {/* Left Column: Calendar */}
                    <div className="p-4 w-72 flex-shrink-0">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                          <span className="font-bold text-gray-700 text-sm">Tháng {pickerMonth.getMonth() + 1}, {pickerMonth.getFullYear()}</span>
                          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-2 text-center">
                          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                            <div key={d} className="text-xs font-semibold text-gray-400">{d}</div>
                          ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays().map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`}></div>;

                            const isStart = isSameDay(day, startDate);
                            const isEnd = isSameDay(day, endDate);
                            const inRange = isBetween(day, startDate, endDate);
                            const isToday = isSameDay(day, new Date());

                            let classes = "h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors relative ";
                            
                            if (isStart || isEnd) {
                              classes += "bg-primary text-white z-10";
                            } else if (inRange) {
                              classes += "bg-blue-100 text-blue-800 rounded-none";
                              // Visual trick to connect the bar
                              if (isSameDay(new Date(day.getTime() - 86400000), startDate)) classes += " rounded-l-none"; 
                            } else {
                              classes += "hover:bg-gray-100 text-gray-700";
                            }

                            if (isToday && !isStart && !isEnd && !inRange) classes += " font-bold border border-blue-200 text-blue-600";

                            return (
                              <div key={idx} className="relative p-0 flex items-center justify-center">
                                {/* Background connector for range */}
                                {inRange && <div className="absolute inset-0 bg-blue-100"></div>}
                                {isStart && endDate > startDate && <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-blue-100"></div>}
                                {isEnd && endDate > startDate && <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-100"></div>}

                                <div 
                                  onClick={() => handleDayClick(day)}
                                  className={classes}
                                >
                                  {day.getDate()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px bg-gray-100"></div>

                    {/* Right Column: Manual Input */}
                    <div className="p-5 bg-gray-50 flex-1 flex flex-col justify-center space-y-4">
                        <div className="flex justify-between items-center md:hidden">
                            <span className="font-bold text-gray-700">Nhập thủ công</span>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Từ ngày</label>
                            <input 
                                type="text" 
                                placeholder="dd/mm/yyyy"
                                value={startInput}
                                onChange={(e) => handleManualInputChange('START', e.target.value)}
                                maxLength={10}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none bg-white text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Đến ngày</label>
                            <input 
                                type="text" 
                                placeholder="dd/mm/yyyy"
                                value={endInput}
                                onChange={(e) => handleManualInputChange('END', e.target.value)}
                                maxLength={10}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none bg-white text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        <div className="pt-2 border-t border-gray-200 mt-2">
                             <button 
                                onClick={() => setIsPickerOpen(false)}
                                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors"
                             >
                                Áp dụng & Đóng
                             </button>
                        </div>
                    </div>
                  </div>
                )}
              </div>
          </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          {activeTab === 'REVENUE' && (
              <>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Biểu đồ biến động giá trị Nhập - Xuất</h3>
                </div>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="date" 
                                tick={{fontSize: 12, fill: '#6b7280'}} 
                                tickMargin={10}
                            />
                            <YAxis 
                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                tick={{fontSize: 12, fill: '#6b7280'}}
                            />
                            <Tooltip 
                                formatter={(value: number) => [value.toLocaleString() + ' đ', 'Giá trị']}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}}/>
                            <Line 
                                type="monotone" 
                                dataKey="import" 
                                name="Tổng Nhập Kho" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                dot={{r: 4, strokeWidth: 2}}
                                activeDot={{r: 6}}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="export" 
                                name="Tổng Xuất Kho" 
                                stroke="#22c55e" 
                                strokeWidth={3} 
                                dot={{r: 4, strokeWidth: 2}}
                                activeDot={{r: 6}}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </>
          )}

          {activeTab === 'STOCK' && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Số lượng tồn kho hiện tại</h3>
                <div className="h-80 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={products.slice(0, 15)} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={false} axisLine={false} />
                            <YAxis axisLine={false} tickLine={false}/>
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="stock" name="Tồn kho" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 font-semibold">
                            <tr>
                                <th className="p-3 border-b">Mã</th>
                                <th className="p-3 border-b">Tên sản phẩm</th>
                                <th className="p-3 border-b text-right">Tồn kho</th>
                                <th className="p-3 border-b text-right">Đơn giá</th>
                                <th className="p-3 border-b text-right">Giá trị tồn (ước tính)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-900">{p.code}</td>
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3 text-right font-bold text-blue-600">{p.stock}</td>
                                    <td className="p-3 text-right text-gray-500">{p.price.toLocaleString()}</td>
                                    <td className="p-3 text-right text-gray-800">{(p.stock * p.price).toLocaleString()} đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </>
          )}

          {activeTab === 'LOW_STOCK' && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertTriangle className="mr-2"/> Danh sách sản phẩm cần nhập hàng (Dưới định mức)
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 font-semibold">
                            <tr>
                                <th className="p-4 border-b">Mã SP</th>
                                <th className="p-4 border-b">Tên sản phẩm</th>
                                <th className="p-4 border-b text-center">Tồn hiện tại</th>
                                <th className="p-4 border-b text-center">Tồn tối thiểu</th>
                                <th className="p-4 border-b text-center">Tồn tối đa</th>
                                <th className="p-4 border-b">Nhà cung cấp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockData.length > 0 ? lowStockData.map(p => (
                                <tr key={p.id} className="border-b hover:bg-red-50 transition-colors">
                                    <td className="p-4 font-medium">{p.code}</td>
                                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                                    <td className="p-4 text-center text-red-600 font-bold text-lg">{p.stock}</td>
                                    <td className="p-4 text-center text-gray-600">{p.minStock}</td>
                                    <td className="p-4 text-center text-gray-400">{p.maxStock}</td>
                                    <td className="p-4 text-blue-600">{suppliers.find(s => s.id === p.supplierId)?.name || 'N/A'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="p-10 text-center text-green-600 bg-green-50">
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-green-100 rounded-full mb-3">
                                            <AlertTriangle className="text-green-600" size={24} /> 
                                        </div>
                                        <span>Kho hàng đang ở trạng thái tốt, không có sản phẩm dưới định mức.</span>
                                    </div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
              </>
          )}
      </div>
    </div>
  );
};