import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { TransactionForm } from './pages/TransactionForm';
import { StockCheck } from './pages/StockCheck';
import { TransactionHistory } from './pages/TransactionHistory';
import { Profile } from './pages/Profile';
import { UserManagement } from './pages/UserManagement';
import { ProductManagement } from './pages/ProductManagement';
import { SupplierManagement } from './pages/SupplierManagement';
import { Reports } from './pages/Reports';
import { RoleManagement } from './pages/RoleManagement';
import { SystemLogs } from './pages/SystemLogs';
import { DataManagement } from './pages/DataManagement';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          {/* Staff & Common Routes */}
          <Route path="/inventory" element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          } />

          <Route path="/transaction" element={
            <PrivateRoute>
              <TransactionForm />
            </PrivateRoute>
          } />

          <Route path="/check" element={
            <PrivateRoute>
              <StockCheck />
            </PrivateRoute>
          } />

          <Route path="/history" element={
            <PrivateRoute>
              <TransactionHistory />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* Owner / Admin Management Routes */}
          <Route path="/users" element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          } />

          <Route path="/products" element={
            <PrivateRoute>
              <ProductManagement />
            </PrivateRoute>
          } />

          <Route path="/suppliers" element={
            <PrivateRoute>
              <SupplierManagement />
            </PrivateRoute>
          } />

          <Route path="/reports" element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          } />

          {/* Admin Only Routes */}
          <Route path="/roles" element={
            <PrivateRoute>
              <RoleManagement />
            </PrivateRoute>
          } />

          <Route path="/logs" element={
            <PrivateRoute>
              <SystemLogs />
            </PrivateRoute>
          } />

          <Route path="/data" element={
            <PrivateRoute>
              <DataManagement />
            </PrivateRoute>
          } />

          <Route path="/settings" element={<PrivateRoute><div className="p-8">Tính năng Cấu hình hệ thống (Admin Only - Đang phát triển)</div></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;