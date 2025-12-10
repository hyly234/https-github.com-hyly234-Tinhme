import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, User as UserIcon, Menu, LogOut, LayoutGrid, ShieldCheck } from 'lucide-react';
import { Home, Shop, Cart, Profile, Wishlist } from './components/CustomerViews';
import { AdminLayout } from './components/AdminViews';
import { api } from './services/mockBackend';
import { User, CartItem, Product, UserRole } from './types';

// --- Navbar Component ---
const Navbar = ({ 
  cartCount, 
  setView, 
  user, 
  onLogout 
}: { 
  cartCount: number, 
  setView: (v: string) => void, 
  user: User | null, 
  onLogout: () => void 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Reset admin toggle when modal opens/closes
  useEffect(() => {
    if (!showAuthModal) {
      setIsAdminLogin(false);
      setIsRegister(false);
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [showAuthModal]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
        if(!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }
        await api.signup(name, email);
        const u = await api.login(email);
        localStorage.setItem('currentUser', JSON.stringify(u));
        window.location.reload();
        return;
    }

    // Login Logic
    const u = await api.login(email);
    
    if (u) {
      // Demo Hardcoded password check for initial users
      if (email === 'admin@tinhme.com' && password !== 'admin123') {
          alert('Invalid admin password');
          return;
      }
      if (email === 'user@tinhme.com' && password !== 'user123') {
          alert('Invalid user password');
          return;
      }

      // Check for Admin Privileges if Admin Login selected
      if (isAdminLogin && u.role !== UserRole.ADMIN) {
        alert("Access Denied: This account does not have administrator privileges.");
        return;
      }

      // Allow login
      localStorage.setItem('currentUser', JSON.stringify(u));
      window.location.reload();
    } else {
        alert('User not found. Please sign up.');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="text-2xl font-serif font-bold tracking-tight cursor-pointer" onClick={() => setView('home')}>
            TinhMe
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={() => setView('home')} className="hover:text-black transition-colors">Home</button>
            <button onClick={() => setView('shop')} className="hover:text-black transition-colors">Shop</button>
            <button onClick={() => setView('shop')} className="hover:text-black transition-colors">New Arrivals</button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <button onClick={() => setView('shop')} className="hover:text-black text-gray-500">
              <Search size={20} />
            </button>
            
            {user ? (
              <div className="relative group">
                <button className="hover:text-black text-gray-500 flex items-center gap-2">
                   <UserIcon size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-gray-50 text-xs text-gray-400">Signed in as {user.name}</div>
                  <button onClick={() => setView('profile')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Profile</button>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="hover:text-black text-gray-500">
                <UserIcon size={20} />
              </button>
            )}

            <button onClick={() => setView('wishlist')} className="hover:text-black text-gray-500 relative">
              <Heart size={20} />
            </button>
            <button onClick={() => setView('cart')} className="hover:text-black text-gray-500 relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><Menu className="rotate-45" size={24} /></button>
            
            <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold">
                    {isRegister ? 'Create Account' : (isAdminLogin ? 'Admin Login' : 'Welcome Back')}
                </h2>
                {isAdminLogin && !isRegister && <p className="text-sm text-gray-500 mt-1">Please enter your administrative credentials.</p>}
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isRegister && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded focus:border-black outline-none" placeholder="John Doe" />
                  </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded focus:border-black outline-none" placeholder={isAdminLogin ? "admin@tinhme.com" : "user@example.com"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded focus:border-black outline-none" placeholder="******" />
              </div>
              
              <button type="submit" className={`w-full text-white py-2 rounded font-medium hover:opacity-90 transition-opacity ${isAdminLogin ? 'bg-indigo-600' : 'bg-black'}`}>
                  {isRegister ? 'Sign Up' : (isAdminLogin ? 'Access Dashboard' : 'Sign In')}
              </button>
            </form>
            
            <div className="mt-4 space-y-3 text-center">
                {!isAdminLogin && (
                    <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-blue-600 hover:underline block w-full">
                        {isRegister ? 'Already have an account? Sign In' : 'New here? Create Account'}
                    </button>
                )}
                
                {!isRegister && (
                    <button 
                        onClick={() => setIsAdminLogin(!isAdminLogin)} 
                        className={`text-xs font-medium hover:underline block w-full ${isAdminLogin ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                        {isAdminLogin ? '← Back to Customer Login' : 'Login as Administrator'}
                    </button>
                )}
            </div>

            {!isRegister && (
                <div className="mt-6 text-xs text-gray-500 border-t pt-4">
                  {isAdminLogin ? (
                      <p className="flex items-center justify-center gap-1 text-indigo-600 font-medium"><ShieldCheck size={12}/> Admin Area</p>
                  ) : (
                    <>
                        <p>Demo Admin: admin@tinhme.com / admin123</p>
                        <p>Demo User: user@tinhme.com / user123</p>
                    </>
                  )}
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-6">TinhMe</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Elevating your style with curated fashion pieces for the modern lifestyle. Quality meets comfort.
        </p>
      </div>
      <div>
        <h3 className="font-bold mb-6">Shop</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          <li>New Arrivals</li>
          <li>Men</li>
          <li>Women</li>
          <li>Accessories</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-6">Support</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          <li>Order Status</li>
          <li>Shipping & Returns</li>
          <li>FAQ</li>
          <li>Contact Us</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-6">Stay Connected</h3>
        <div className="flex gap-4">
           <input type="email" placeholder="Enter your email" className="bg-gray-800 border-none px-4 py-2 text-sm w-full focus:ring-1 focus:ring-gray-600" />
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  useEffect(() => {
    // Check for persisted user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert("Added to cart");
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setView('home');
  };

  // If Admin Logged In
  if (user?.role === UserRole.ADMIN) {
    return (
      <div className="font-sans text-gray-900">
        {/* Admin Header just for context switch */}
        <div className="bg-black text-white px-4 py-2 text-sm flex justify-between items-center">
          <span className="flex items-center gap-2"><ShieldCheck size={14}/> Admin Console</span>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-gray-300"><LogOut size={14}/> Logout</button>
        </div>
        <AdminLayout />
      </div>
    );
  }

  // Customer View
  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      <Navbar 
        cartCount={cart.reduce((a,c) => a + c.quantity, 0)} 
        setView={setView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {view === 'home' && <Home setView={setView} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
        {view === 'shop' && <Shop addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} user={user} cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} setView={setView} />}
        {view === 'cart' && <Cart cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} user={user} setView={setView} wishlist={[]} addToCart={()=>{}} toggleWishlist={()=>{}} />}
        {view === 'profile' && user && <Profile user={user} />}
        {view === 'wishlist' && <Wishlist wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} setView={setView} />}
      </main>

      <Footer />
    </div>
  );
}