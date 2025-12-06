import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  ClipboardCheck, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Box,
  History,
  UserCircle,
  Truck,
  BarChart2,
  Shield,
  FileText,
  Database
} from 'lucide-react';

const LOGO_URL = "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/302421789_494718009340082_8359478105841736995_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE5FqPZT2omjrYgF3pswQTC3lAFfYeOGVzeUAV9h44ZXBYI46zpGlnYOm-okNbChRl9tE6jGkXYbWEphKxJLHXH&_nc_ohc=svBBKQmWEw4Q7kNvwFntw3J&_nc_oc=AdmDQlcY5MU2wNShW0Nm300QAdPeH4l_nRQipbySXA7D7LYAuglkbu_v5ecjEAmubrE&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=v7dbZ2O4-SI7sYSLut5hNw&oh=00_AfirNBwsqKzMKEIXbxNT7M62XM1jbwOKj9TIfvZPRcvM0Q&oe=692DDC9E";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!user) return <>{children}</>;

  const navItems = [
    { label: 'Tổng quan', path: '/', icon: <LayoutDashboard size={20} />, roles: [Role.ADMIN, Role.OWNER, Role.STAFF] },
    
    // --- Business Operations (Owner & Staff) ---
    // Owner inherits all Staff functions
    { label: 'Xem tồn kho', path: '/inventory', icon: <Package size={20} />, roles: [Role.OWNER, Role.STAFF] },
    { label: 'Nhập / Xuất', path: '/transaction', icon: <ArrowRightLeft size={20} />, roles: [Role.OWNER, Role.STAFF] },
    { label: 'Kiểm kê', path: '/check', icon: <ClipboardCheck size={20} />, roles: [Role.OWNER, Role.STAFF] },
    { label: 'Lịch sử phiếu', path: '/history', icon: <History size={20} />, roles: [Role.OWNER, Role.STAFF] },
    
    // --- Owner Management (Owner Only) ---
    { label: 'QL Sản phẩm', path: '/products', icon: <Box size={20} />, roles: [Role.OWNER] },
    { label: 'QL Nhà cung cấp', path: '/suppliers', icon: <Truck size={20} />, roles: [Role.OWNER] },
    { label: 'Báo cáo kinh doanh', path: '/reports', icon: <BarChart2 size={20} />, roles: [Role.OWNER] },
    
    // --- User Management (Shared but Contextually Different) ---
    // Owner manages employees, Admin manages system users
    { label: 'Quản lý nhân sự', path: '/users', icon: <Users size={20} />, roles: [Role.OWNER, Role.ADMIN] },
    
    // --- Admin System Functions (Admin Only) ---
    // Admin does NOT see business operations
    { label: 'Quản lý quyền', path: '/roles', icon: <Shield size={20} />, roles: [Role.ADMIN] },
    { label: 'Nhật ký hệ thống', path: '/logs', icon: <FileText size={20} />, roles: [Role.ADMIN] },
    { label: 'Dữ liệu hệ thống', path: '/data', icon: <Database size={20} />, roles: [Role.ADMIN] },

    // --- Common ---
    { label: 'Tài khoản', path: '/profile', icon: <UserCircle size={20} />, roles: [Role.ADMIN, Role.OWNER, Role.STAFF] },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col items-center justify-center h-32 border-b border-gray-700 bg-slate-900 py-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-400 mb-2">
             <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-wide text-white uppercase leading-tight">Cô Na Chợ Hàn</h1>
            <span className="text-xs text-yellow-400 font-medium">Đặc Sản Đà Nẵng</span>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-12rem)]">
          <div className="mb-6 px-4 py-3 bg-slate-800 rounded-lg flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
               <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
                <p className="font-semibold truncate text-sm">{user.fullName}</p>
                <p className="text-xs text-yellow-400 truncate">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'OWNER' ? 'Chủ cửa hàng' : 'Nhân viên kho'}
                </p>
            </div>
          </div>

          {navItems.map((item) => (
            item.roles.includes(user.role) && (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-yellow-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-primary">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-primary">Cô Na Chợ Hàn</span>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-yellow-400">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};