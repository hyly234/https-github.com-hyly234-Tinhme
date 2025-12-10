import React, { useState, useEffect } from 'react';
import { api } from '../services/mockBackend';
import { Product, Order, OrderStatus, SalesStat, User, UserRole } from '../types';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  TrendingUp, DollarSign, AlertCircle, Check, X,
  Edit, Trash2, Plus, AlertTriangle, Truck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Dashboard Home ---
const AdminDashboardHome = () => {
  const [stats, setStats] = useState<SalesStat[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getSalesReport().then(setStats);
    api.getOrders().then(orders => {
      setTotalRevenue(orders.reduce((acc, curr) => acc + curr.total, 0));
      setPendingOrders(orders.filter(o => o.status === OrderStatus.PENDING).length);
    });
    api.getProducts().then(products => {
        setLowStockProducts(products.filter(p => p.stock < 5));
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sales Growth</p>
            <p className="text-2xl font-bold text-gray-900">+12.5%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales Report</h3>
            <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} /> Low Stock Alert
            </h3>
            <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                    <p className="text-gray-500 text-sm">Inventory looks good.</p>
                ) : (
                    lowStockProducts.map(p => (
                        <div key={p.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                             <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                 <img src={p.image} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                 <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                                 <p className="text-xs text-red-500 font-medium">{p.stock} remaining</p>
                             </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Product Management ---
const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => api.getProducts().then(setProducts);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      loadProducts();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing === 'new') {
      await api.addProduct(editForm as any);
    } else if (isEditing) {
      await api.updateProduct(isEditing, editForm);
    }
    setIsEditing(null);
    setEditForm({});
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button 
          onClick={() => { setIsEditing('new'); setEditForm({}); }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{isEditing === 'new' ? 'New Product' : 'Edit Product'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input 
                placeholder="Product Name" 
                className="w-full border p-2 rounded" 
                value={editForm.name || ''}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Price" 
                  className="w-full border p-2 rounded" 
                  value={editForm.price || ''}
                  onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                  required
                />
                 <input 
                  type="number" placeholder="Stock" 
                  className="w-full border p-2 rounded" 
                  value={editForm.stock || ''}
                  onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                  required
                />
              </div>
              <input 
                placeholder="Category" 
                className="w-full border p-2 rounded" 
                value={editForm.category || ''}
                onChange={e => setEditForm({...editForm, category: e.target.value})}
                required
              />
              <input 
                placeholder="Image URL" 
                className="w-full border p-2 rounded" 
                value={editForm.image || ''}
                onChange={e => setEditForm({...editForm, image: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                className="w-full border p-2 rounded" 
                value={editForm.description || ''}
                onChange={e => setEditForm({...editForm, description: e.target.value})}
              />
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium text-gray-900">{p.name}</span>
                </td>
                <td className="p-4">${p.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${p.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{p.category}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { setIsEditing(p.id); setEditForm(p); }} className="text-blue-600 p-2 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Order Tracking ---
const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => api.getOrders().then(setOrders);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
    loadOrders();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Customer</th>
              <th className="p-4 font-semibold text-gray-600">Total</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-gray-50">
                <td className="p-4 font-mono text-sm">{o.id}</td>
                <td className="p-4 text-gray-600">{o.date}</td>
                <td className="p-4 text-gray-900 font-medium">{o.userId}</td>
                <td className="p-4">${o.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${o.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                      o.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' : 
                      o.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                   {o.status === OrderStatus.PENDING && (
                     <>
                        <button onClick={() => updateStatus(o.id, OrderStatus.SHIPPED)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                            <Truck size={12} /> Mark Shipped
                        </button>
                        <button onClick={() => updateStatus(o.id, OrderStatus.CANCELLED)} className="flex items-center gap-1 border border-red-200 text-red-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                            <X size={12} /> Cancel
                        </button>
                     </>
                   )}
                   {o.status === OrderStatus.SHIPPED && (
                     <button onClick={() => updateStatus(o.id, OrderStatus.DELIVERED)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition-colors">
                        <Check size={12} /> Mark Delivered
                     </button>
                   )}
                   {(o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED) && (
                     <span className="text-xs text-gray-400 italic py-1.5">No actions available</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- User Management ---
const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => api.getUsers().then(setUsers);

    const handleDelete = async (id: string) => {
        if(confirm("Are you sure you want to delete this user?")) {
            await api.deleteUser(id);
            loadUsers();
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">User</th>
                            <th className="p-4 font-semibold text-gray-600">Email</th>
                            <th className="p-4 font-semibold text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover"/> : <Users size={16} />}
                                    </div>
                                    <span className="font-medium text-gray-900">{u.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {u.role !== UserRole.ADMIN && (
                                        <button onClick={() => handleDelete(u.id)} className="text-red-600 p-2 hover:bg-red-50 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-serif font-bold tracking-tight">TinhMe <span className="text-xs font-sans font-normal text-gray-500 block">Admin Panel</span></h1>
        </div>
        <nav className="px-4 space-y-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Package size={20} /> Products
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            <ShoppingCart size={20} /> Orders
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={20} /> Users
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {activeTab === 'dashboard' && <AdminDashboardHome />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'users' && <AdminUsers />}
      </main>
    </div>
  );
};