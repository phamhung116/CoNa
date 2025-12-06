import { Product, Role, Supplier, Transaction, TransactionType, User, RoleDefinition, SystemLog, BackupFile } from '../types';

// --- Mock Data ---

export const MOCK_USERS: (User & { password?: string })[] = [
  { 
    id: 'u1', 
    username: 'admin_cona', 
    fullName: 'Nguyễn Thị Na (Cô Na)', 
    role: Role.OWNER, 
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Na&background=random', 
    email: 'cona.dacsan@gmail.com', 
    phone: '0905123456',
    password: '123',
    isLocked: false
  },
  { 
    id: 'u2', 
    username: 'kho_tvy', 
    fullName: 'Huỳnh Thị Thúy Vy', 
    role: Role.STAFF, 
    avatar: 'https://ui-avatars.com/api/?name=Huynh+Thi+Thuy+Vy&background=random', 
    email: 'tvy.kho@cona.vn', 
    phone: '0905777888',
    password: '123',
    isLocked: false
  },
  { 
    id: 'u3', 
    username: 'admin_system', 
    fullName: 'Quản Trị Viên Hệ Thống', 
    role: Role.ADMIN, 
    avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=random', 
    email: 'admin@system.vn', 
    phone: '0900000000',
    password: '123',
    isLocked: false
  },
];

export let MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Lò Chả Bò Bà Lộc', contact: '02363822822', address: 'Lê Duẩn, Đà Nẵng', status: 'ACTIVE' },
  { id: 's2', name: 'Hải Sản Khô Cô Liên', contact: '0905111222', address: 'Chợ Hàn, Đà Nẵng', status: 'ACTIVE' },
  { id: 's3', name: 'Bánh Khô Mè Bà Liễu', contact: '02363678999', address: 'Cẩm Lệ, Đà Nẵng', status: 'ACTIVE' },
  { id: 's4', name: 'Cơ sở Tré Bà Đệ', contact: '02363777444', address: 'Hải Châu, Đà Nẵng', status: 'ACTIVE' },
];

// Initial Products
let products: Product[] = [
  { id: 'p1', code: 'DS001', name: 'Chả Bò Đà Nẵng (Loại 1)', category: 'Thực phẩm tươi', unit: 'Kg', price: 320000, stock: 50, minStock: 10, maxStock: 200, supplierId: 's1', status: 'ACTIVE' },
  { id: 'p2', code: 'DS002', name: 'Mực Rim Me (Hũ 500g)', category: 'Đồ khô', unit: 'Hũ', price: 145000, stock: 120, minStock: 20, maxStock: 500, supplierId: 's2', status: 'ACTIVE' },
  { id: 'p3', code: 'DS003', name: 'Cá Bò Da Tẩm Gia Vị', category: 'Đồ khô', unit: 'Gói 500g', price: 180000, stock: 8, minStock: 15, maxStock: 100, supplierId: 's2', status: 'ACTIVE' }, 
  { id: 'p4', code: 'DS004', name: 'Tré Bà Đệ (Hộp 10 cái)', category: 'Thực phẩm tươi', unit: 'Hộp', price: 90000, stock: 0, minStock: 5, maxStock: 50, supplierId: 's4', status: 'ACTIVE' }, 
  { id: 'p5', code: 'DS005', name: 'Bánh Khô Mè Cẩm Lệ', category: 'Bánh kẹo', unit: 'Hộp', price: 45000, stock: 200, minStock: 30, maxStock: 300, supplierId: 's3', status: 'ACTIVE' },
  { id: 'p6', code: 'DS006', name: 'Nước Mắm Nam Ô (Chai 500ml)', category: 'Gia vị', unit: 'Chai', price: 75000, stock: 45, minStock: 12, maxStock: 100, supplierId: 's2', status: 'ACTIVE' },
];

let transactions: Transaction[] = [
  {
    id: 't1',
    type: TransactionType.IMPORT,
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    performerId: 'u2',
    performerName: 'Huỳnh Thị Thúy Vy',
    partnerName: 'Lò Chả Bò Bà Lộc',
    items: [{ productId: 'p1', productName: 'Chả Bò Đà Nẵng (Loại 1)', quantity: 20, price: 280000 }],
    totalValue: 5600000,
    status: 'COMPLETED'
  }
];

// --- Admin Mock Data ---

let roles: RoleDefinition[] = [
  { id: 'r1', name: 'Quản trị hệ thống', code: Role.ADMIN, description: 'Toàn quyền hệ thống', permissions: ['all'], isSystem: true },
  { id: 'r2', name: 'Chủ cửa hàng', code: Role.OWNER, description: 'Quản lý hoạt động kinh doanh', permissions: ['product.*', 'report.*', 'user.view'], isSystem: true },
  { id: 'r3', name: 'Nhân viên kho', code: Role.STAFF, description: 'Thực hiện nghiệp vụ kho', permissions: ['inventory.*'], isSystem: true },
];

let systemLogs: SystemLog[] = [
  { id: 'l1', timestamp: new Date().toISOString(), userId: 'u3', username: 'admin_system', action: 'LOGIN', details: 'Đăng nhập thành công IP 192.168.1.1', type: 'INFO' },
  { id: 'l2', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: 'u2', username: 'kho_tvy', action: 'CREATE_TRANSACTION', details: 'Tạo phiếu nhập kho t1', type: 'INFO' },
  { id: 'l3', timestamp: new Date(Date.now() - 7200000).toISOString(), userId: 'system', username: 'SYSTEM', action: 'AUTO_BACKUP', details: 'Sao lưu tự động thành công', type: 'INFO' },
  { id: 'l4', timestamp: new Date(Date.now() - 86400000).toISOString(), userId: 'u1', username: 'admin_cona', action: 'UPDATE_PRODUCT', details: 'Cập nhật giá sản phẩm DS001', type: 'INFO' },
];

let backupFiles: BackupFile[] = [
  { id: 'bk1', fileName: 'backup_auto_20240520.sql', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), size: '2.5 MB', type: 'AUTO', status: 'SUCCESS' },
  { id: 'bk2', fileName: 'backup_manual_20240521.sql', createdAt: new Date(Date.now() - 86400000).toISOString(), size: '2.6 MB', type: 'MANUAL', status: 'SUCCESS' },
  { id: 'bk3', fileName: 'backup_auto_20240522.sql', createdAt: new Date().toISOString(), size: '2.6 MB', type: 'AUTO', status: 'SUCCESS' },
];

// --- Basic Getters ---

export const getProducts = (): Promise<Product[]> => {
  // Only return active products for standard lists, unless specified
  return new Promise((resolve) => setTimeout(() => resolve([...products]), 300));
};

export const getSuppliers = (): Promise<Supplier[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_SUPPLIERS]), 200));
};

export const getTransactions = (): Promise<Transaction[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 300));
};

export const getUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
      const safeUsers = MOCK_USERS.map(({ password, ...u }) => u);
      setTimeout(() => resolve(safeUsers), 200);
  });
}

// --- Management Methods (Owner/Admin) ---

// 1. Product Management
export const saveProduct = (product: Partial<Product>): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // EF1: Validate required fields
            if (!product.name || !product.code || !product.unit || product.price === undefined) {
                reject(new Error("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Mã, Đơn vị, Giá)."));
                return;
            }

            // EF2: Check duplicate code (Case Insensitive)
            const isDuplicate = products.some(p => 
                p.code.toLowerCase() === product.code?.toLowerCase() && 
                p.id !== product.id
            );
            
            if (isDuplicate) {
                reject(new Error(`Mã sản phẩm '${product.code}' đã tồn tại.`));
                return;
            }

            if (product.id) {
                // Update
                const index = products.findIndex(p => p.id === product.id);
                if (index !== -1) {
                    products[index] = { ...products[index], ...product } as Product;
                }
            } else {
                // Create
                const newProduct: Product = {
                    id: `p${Date.now()}`,
                    stock: 0, // New products start with 0 stock
                    minStock: 0,
                    status: 'ACTIVE',
                    supplierId: product.supplierId || '',
                    category: product.category || 'Khác',
                    ...product
                } as Product;
                products.push(newProduct);
            }
            
            addLog('UPDATE_PRODUCT', `Cập nhật sản phẩm ${product.code}`);
            resolve();
        }, 400);
    });
};

export const deleteProduct = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // EF3: Check constraints
            const hasTransactions = transactions.some(t => t.items.some(i => i.productId === id));
            
            const index = products.findIndex(p => p.id === id);
            if (index === -1) return resolve();

            if (hasTransactions) {
                // Soft delete (AF2)
                products[index].status = 'STOPPED';
                addLog('DELETE_PRODUCT', `Ngưng sử dụng sản phẩm ${products[index].code}`);
                reject(new Error("Sản phẩm đã phát sinh giao dịch, không thể xóa hẳn. Đã chuyển sang trạng thái 'Ngưng sử dụng'."));
            } else {
                // Hard delete
                addLog('DELETE_PRODUCT', `Xóa sản phẩm ${products[index].code}`);
                products.splice(index, 1);
                resolve();
            }
        }, 400);
    });
}

// 2. Supplier Management
export const saveSupplier = (supplier: Partial<Supplier>): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!supplier.name || !supplier.contact) {
                reject(new Error("Tên và liên hệ là bắt buộc."));
                return;
            }

            if (supplier.id) {
                 const index = MOCK_SUPPLIERS.findIndex(s => s.id === supplier.id);
                 if (index !== -1) MOCK_SUPPLIERS[index] = { ...MOCK_SUPPLIERS[index], ...supplier } as Supplier;
            } else {
                const newSupplier = {
                    id: `s${Date.now()}`,
                    status: 'ACTIVE',
                    ...supplier
                } as Supplier;
                MOCK_SUPPLIERS.push(newSupplier);
            }
            addLog('UPDATE_SUPPLIER', `Cập nhật NCC ${supplier.name}`);
            resolve();
        }, 400);
    });
}

export const deleteSupplier = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // EF3 constraint
            const isUsedInProducts = products.some(p => p.supplierId === id);
            const index = MOCK_SUPPLIERS.findIndex(s => s.id === id);
            
            if (isUsedInProducts) {
                if (index !== -1) {
                    MOCK_SUPPLIERS[index].status = 'STOPPED';
                    addLog('DELETE_SUPPLIER', `Ngưng hợp tác NCC ${MOCK_SUPPLIERS[index].name}`);
                }
                reject(new Error("NCC đang cung cấp sản phẩm trong kho. Đã chuyển sang trạng thái 'Ngưng hợp tác'."));
            } else {
                if (index !== -1) {
                    addLog('DELETE_SUPPLIER', `Xóa NCC ${MOCK_SUPPLIERS[index].name}`);
                    MOCK_SUPPLIERS.splice(index, 1);
                }
                resolve();
            }
        }, 400);
    })
}

// 3. User Management
export const saveUser = (user: Partial<User> & { password?: string }): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // EF1
            if (!user.username || !user.fullName || !user.role) {
                reject(new Error("Thiếu thông tin bắt buộc (Username, Tên, Vai trò)."));
                return;
            }

            // EF2: Check duplicate username
            if (!user.id && MOCK_USERS.some(u => u.username === user.username)) {
                reject(new Error("Tên đăng nhập đã tồn tại."));
                return;
            }

            if (user.id) {
                const index = MOCK_USERS.findIndex(u => u.id === user.id);
                if (index !== -1) {
                    const { password, ...rest } = user;
                    MOCK_USERS[index] = { ...MOCK_USERS[index], ...rest };
                    if (password) MOCK_USERS[index].password = password;
                    addLog('UPDATE_USER', `Cập nhật user ${user.username}`);
                }
            } else {
                MOCK_USERS.push({
                    id: `u${Date.now()}`,
                    isLocked: false,
                    avatar: `https://ui-avatars.com/api/?name=${user.fullName}&background=random`,
                    password: user.password || '123456',
                    ...user
                } as any);
                addLog('CREATE_USER', `Tạo user mới ${user.username}`);
            }
            resolve();
        }, 400);
    });
}

export const toggleUserLock = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = MOCK_USERS.findIndex(u => u.id === id);
            if (index !== -1) {
                MOCK_USERS[index].isLocked = !MOCK_USERS[index].isLocked;
                addLog('LOCK_USER', `${MOCK_USERS[index].isLocked ? 'Khóa' : 'Mở khóa'} user ${MOCK_USERS[index].username}`);
                resolve(MOCK_USERS[index].isLocked!);
            }
            resolve(false);
        }, 300);
    });
}


// --- Transaction & Auth ---

export const updateUser = (user: User, newPassword?: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === user.id);
      if (index !== -1) {
        const currentUser = MOCK_USERS[index];
        MOCK_USERS[index] = { 
          ...currentUser, 
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        };
        
        if (newPassword) {
          MOCK_USERS[index].password = newPassword;
        }
        
        addLog('UPDATE_PROFILE', `User ${currentUser.username} cập nhật thông tin cá nhân`);
        const { password, ...safeUser } = MOCK_USERS[index];
        resolve(safeUser as User);
      } else {
        reject(new Error("User not found"));
      }
    }, 500);
  });
};

export const saveTransaction = (transaction: Transaction): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (transaction.status === 'COMPLETED' && transaction.type === TransactionType.EXPORT) {
        for (const item of transaction.items) {
          const product = products.find(p => p.id === item.productId);
          if (!product) {
            reject(new Error(`Sản phẩm ID ${item.productId} không tồn tại.`));
            return;
          }
          if (product.stock < item.quantity) {
            reject(new Error(`Không đủ tồn kho cho sản phẩm "${product.name}". Tồn hiện tại: ${product.stock}, Yêu cầu: ${item.quantity}`));
            return;
          }
        }
      }

      if (transaction.status === 'COMPLETED') {
        products = products.map(p => {
          const item = transaction.items.find(t => t.productId === p.id);
          if (item) {
            if (transaction.type === TransactionType.IMPORT) {
              return { ...p, stock: p.stock + item.quantity };
            } else if (transaction.type === TransactionType.EXPORT) {
              return { ...p, stock: p.stock - item.quantity };
            } else if (transaction.type === TransactionType.CHECK) {
              return { ...p, stock: item.quantity };
            }
          }
          return p;
        });
      }

      transactions.unshift(transaction);
      addLog('CREATE_TRANSACTION', `Tạo giao dịch ${transaction.type} ${transaction.status}`);
      resolve();
    }, 500);
  });
};

export const loginMock = (username: string, password?: string): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.username === username);
            // Check password and Lock status (EF1 impl implicitly)
            if (user && user.password === password) {
                if (user.isLocked) {
                    // Ideally throw error, but here return null to simulate fail
                    resolve(null); 
                    return;
                }
                addLog('LOGIN', `User ${username} đăng nhập thành công`);
                const { password: _, ...safeUser } = user;
                resolve(safeUser as User);
            } else {
                resolve(null);
            }
        }, 500);
    });
}

// --- Admin Services ---

// 1. Role Management (BF1)
export const getRoles = (): Promise<RoleDefinition[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...roles]), 200));
};

export const saveRole = (role: RoleDefinition): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // EF1: Check duplicate name
            if (roles.some(r => r.name === role.name && r.id !== role.id)) {
                reject(new Error('Tên nhóm quyền đã tồn tại.'));
                return;
            }
            
            if (role.id) {
                const index = roles.findIndex(r => r.id === role.id);
                if (index !== -1) roles[index] = role;
                addLog('UPDATE_ROLE', `Cập nhật nhóm quyền ${role.name}`);
            } else {
                role.id = `r${Date.now()}`;
                roles.push(role);
                addLog('CREATE_ROLE', `Tạo nhóm quyền mới ${role.name}`);
            }
            resolve();
        }, 300);
    });
};

export const deleteRole = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const role = roles.find(r => r.id === id);
            if (!role) return resolve();

            // EF2: Check if role is in use
            const isUsed = MOCK_USERS.some(u => u.role === role.code); // Simplified check assuming code matches
            if (isUsed) {
                reject(new Error('Nhóm quyền đang được sử dụng bởi user. Vui lòng chuyển user sang nhóm khác trước khi xóa.'));
                return;
            }

            // Cannot delete system roles
            if (role.isSystem) {
                reject(new Error('Không thể xóa nhóm quyền hệ thống.'));
                return;
            }

            roles = roles.filter(r => r.id !== id);
            addLog('DELETE_ROLE', `Xóa nhóm quyền ${role.name}`);
            resolve();
        }, 300);
    });
};

// 2. System Logs (BF3)
export const getSystemLogs = (): Promise<SystemLog[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...systemLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())), 200));
};

// Helper to add logs internally
const addLog = (action: string, details: string, type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') => {
    const userJson = localStorage.getItem('wms_user') || sessionStorage.getItem('wms_user');
    const currentUser = userJson ? JSON.parse(userJson) : { id: 'system', username: 'SYSTEM' };
    
    systemLogs.unshift({
        id: `l${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        username: currentUser.username,
        action,
        details,
        type
    });
};

// 3. Data Management (BF4)
export const getBackups = (): Promise<BackupFile[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...backupFiles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())), 200));
};

export const createBackup = (): Promise<BackupFile> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newBackup: BackupFile = {
                id: `bk${Date.now()}`,
                fileName: `backup_manual_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.sql`,
                createdAt: new Date().toISOString(),
                size: '2.7 MB',
                type: 'MANUAL',
                status: 'SUCCESS'
            };
            backupFiles.unshift(newBackup);
            addLog('BACKUP_DATA', 'Sao lưu dữ liệu thủ công thành công');
            resolve(newBackup);
        }, 1500); // Simulate delay
    });
};

export const restoreBackup = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // EF5: Randomly fail to simulate error
            if (Math.random() > 0.8) {
                addLog('RESTORE_DATA', `Phục hồi dữ liệu thất bại từ file ID ${id}`, 'ERROR');
                reject(new Error('File backup lỗi hoặc không đúng định dạng.'));
            } else {
                addLog('RESTORE_DATA', `Phục hồi dữ liệu thành công từ file ID ${id}`);
                resolve();
            }
        }, 2000);
    });
};