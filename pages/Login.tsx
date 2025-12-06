import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, User, Eye, EyeOff } from 'lucide-react';

const LOGO_URL = "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/302421789_494718009340082_8359478105841736995_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE5FqPZT2omjrYgF3pswQTC3lAFfYeOGVzeUAV9h44ZXBYI46zpGlnYOm-okNbChRl9tE6jGkXYbWEphKxJLHXH&_nc_ohc=svBBKQmWEw4Q7kNvwFntw3J&_nc_oc=AdmDQlcY5MU2wNShW0Nm300QAdPeH4l_nRQipbySXA7D7LYAuglkbu_v5ecjEAmubrE&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=v7dbZ2O4-SI7sYSLut5hNw&oh=00_AfirNBwsqKzMKEIXbxNT7M62XM1jbwOKj9TIfvZPRcvM0Q&oe=692DDC9E";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      setIsSubmitting(false);
      return;
    }

    // Simulate mock auth check
    const success = await login(username, password, rememberMe);
    if (success) {
      navigate('/');
    } else {
      // EF1 Implementation
      setError('Sai tên đăng nhập hoặc mật khẩu.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" 
         style={{
           backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(https://images.unsplash.com/photo-1559592413-7cec4d0aa49b?auto=format&fit=crop&q=80)',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md mb-4">
            <img src={LOGO_URL} alt="Cô Na Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide text-center">Cô Na Chợ Hàn</h2>
          <p className="text-accent font-medium text-sm mt-1">Đặc Sản Đà Nẵng</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-danger text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_cona"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Duy trì đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-blue-700">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
             <div><b>Tài khoản thử nghiệm:</b></div>
             <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Chủ cửa hàng: <b>admin_cona</b> / 123</li>
                <li>Nhân viên kho: <b>kho_tvy</b> / 123</li>
                <li>Admin (System): <b>admin_system</b> / 123</li>
             </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md disabled:opacity-70 transform active:scale-[0.98]"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
};