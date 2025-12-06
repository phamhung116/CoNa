export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER', // Chủ cửa hàng
  STAFF = 'STAFF', // Nhân viên kho
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  avatar?: string;
  email?: string;
  phone?: string;
  isLocked?: boolean; // BF1: Khóa tài khoản
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number; 
  minStock: number; // Ngưỡng cảnh báo tối thiểu
  maxStock?: number; // Ngưỡng tồn tối đa (BF4)
  supplierId: string;
  status: 'ACTIVE' | 'STOPPED'; // AF2: Ngưng sử dụng (Soft delete)
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address?: string;
  taxCode?: string;
  status: 'ACTIVE' | 'STOPPED'; // AF2: Ngưng sử dụng
}

export enum TransactionType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  CHECK = 'CHECK', // Kiểm kê
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number; 
  systemQuantity?: number; 
  price: number; 
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  performerId: string;
  performerName: string;
  partnerName?: string;
  items: TransactionItem[];
  totalValue: number;
  note?: string;
  status: 'COMPLETED' | 'DRAFT';
}

// --- Admin New Types ---

export interface RoleDefinition {
  id: string;
  name: string; // Tên nhóm quyền
  code: Role | string; // Mã quyền (Map với Enum hoặc custom)
  description: string;
  permissions: string[]; // Danh sách quyền chi tiết (Mock)
  isSystem: boolean; // Không thể xóa nếu là system default
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
}

export interface BackupFile {
  id: string;
  fileName: string;
  createdAt: string;
  size: string;
  type: 'AUTO' | 'MANUAL'; // AF2: Sao lưu tự động vs Thủ công
  status: 'SUCCESS' | 'FAILED';
}