import React, { useState, useEffect } from 'react';
import { api } from '../services/mockBackend';
import { Product, CartItem, Order, User } from '../types';
import { 
  Search, ShoppingBag, Heart, User as UserIcon, 
  Menu, X, ChevronRight, Minus, Plus, Trash2, ArrowLeft,
  Package, Truck, CheckCircle, Clock
} from 'lucide-react';

interface Props {
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  setView: (view: string) => void;
}

// Extract specific props for Home since it doesn't need everything
type HomeProps = Pick<Props, 'setView' | 'addToCart' | 'wishlist' | 'toggleWishlist'>;

// --- Components ---

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

const ProductCard = ({ product, onAdd, isWishlisted, onToggleWishlist }: ProductCardProps) => (
  <div className="group relative bg-white pb-4">
    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onToggleWishlist(product.id)} className={`p-3 rounded-full shadow-md transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}>
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <button 
        onClick={() => onAdd(product)}
        className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur text-black py-4 font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100"
      >
        Add to Cart
      </button>
    </div>
    <div className="px-2">
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">${product.price.toFixed(2)}</p>
    </div>
  </div>
);

// --- Pages ---

export const Home = ({ setView, addToCart, wishlist, toggleWishlist }: HomeProps) => {
  const [featured, setFeatured] = useState<Product[]>([]);
  
  useEffect(() => {
    api.getProducts().then(products => setFeatured(products.slice(0, 4)));
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="relative h-[600px] w-full bg-slate-900 text-white overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
          <span className="text-sm uppercase tracking-[0.2em] mb-4 text-gray-300">Urban Edge</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 max-w-2xl leading-tight">
            Jackets for the <br/>Modern Man
          </h1>
          <button onClick={() => setView('shop')} className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors">
            Discovery Now
          </button>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold mb-4">New Arrivals</h2>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span className="text-black font-medium border-b border-black cursor-pointer">All</span>
            <span className="cursor-pointer hover:text-black">Women</span>
            <span className="cursor-pointer hover:text-black">Men</span>
            <span className="cursor-pointer hover:text-black">Shoes</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featured.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAdd={addToCart} 
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
      
      {/* Banner 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-96">
         <div className="relative bg-gray-100 flex items-center justify-center p-12">
           <div className="z-10 text-center">
             <h3 className="text-2xl font-serif font-bold mb-2">Ethereal Elegance</h3>
             <p className="mb-6 text-gray-600">Where Dreams Meet Couture</p>
             <button onClick={() => setView('shop')} className="bg-white px-6 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Shop Now</button>
           </div>
           <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply" />
         </div>
         <div className="relative bg-slate-100 flex items-center justify-center p-12">
           <div className="z-10 text-center">
             <h3 className="text-2xl font-serif font-bold mb-2">Urban Strides</h3>
             <p className="mb-6 text-gray-600">Chic Footwear for City Living</p>
             <button onClick={() => setView('shop')} className="bg-white px-6 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">Shop Now</button>
           </div>
           <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply" />
         </div>
      </div>
    </>
  );
};

export const Shop = ({ addToCart, wishlist, toggleWishlist }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    api.getProducts().then(data => {
      setProducts(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let res = products;
    if (category !== 'All') {
      res = res.filter(p => p.category === category);
    }
    if (search) {
      res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (minPrice !== '') {
        res = res.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
        res = res.filter(p => p.price <= Number(maxPrice));
    }
    setFiltered(res);
  }, [category, search, products, minPrice, maxPrice]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center">Shop All</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">Search</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full border-b border-gray-300 py-2 focus:border-black outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-0 top-2 text-gray-400" size={18} />
            </div>
          </div>

          <div>
             <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">Price Range</h3>
             <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full border border-gray-300 p-2 rounded text-sm focus:border-black outline-none"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full border border-gray-300 p-2 rounded text-sm focus:border-black outline-none"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
             </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {categories.map(c => (
                <li key={c} 
                  className={`cursor-pointer hover:text-black ${category === c ? 'text-black font-medium underline' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filtered.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAdd={addToCart}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
           </div>
           {filtered.length === 0 && (
             <div className="text-center py-20 text-gray-500">No products found matching your criteria.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export const Wishlist = ({ wishlist, addToCart, toggleWishlist, setView }: Pick<Props, 'wishlist' | 'addToCart' | 'toggleWishlist' | 'setView'>) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(all => {
      setProducts(all.filter(p => wishlist.includes(p.id)));
    });
  }, [wishlist]);

  if (wishlist.length === 0) {
     return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Heart size={48} className="text-gray-300 mb-4" />
      <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
      <button onClick={() => setView('shop')} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Start Shopping</button>
    </div>
  );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">My Wishlist ({products.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onAdd={addToCart} 
            isWishlisted={true}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export const Cart = ({ cart, updateCartQty, removeFromCart, user, setView }: Props) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout");
      return; // In real app, redirect to login
    }
    await api.createOrder(user.id, cart.map(i => ({
      productId: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image
    })), total);
    
    alert("Order placed successfully! Track it in your profile.");
    // Clear cart logic would happen here (propogated up)
    window.location.reload(); // Simple refresh for demo to clear cart
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <ShoppingBag size={48} className="text-gray-300 mb-4" />
      <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
      <button onClick={() => setView('shop')} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Start Shopping</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100">
              <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-gray-50" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50"><Minus size={14} /></button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4 border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export const Profile = ({ user }: { user: User }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if(user) {
      api.getUserOrders(user.id).then(setOrders);
    }
  }, [user]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered': return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} /> };
      case 'Shipped': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Truck size={14} /> };
      default: return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} /> };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-gray-100 pb-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={40} className="text-gray-400" />}
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">{user.name}</h1>
          <p className="text-gray-500 flex items-center gap-2">
            <UserIcon size={16} /> {user.email}
          </p>
        </div>
        <div className="md:ml-auto flex gap-4">
           <div className="text-center px-6 py-3 bg-gray-50 rounded-xl">
             <span className="block text-2xl font-bold">{orders.length}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wide">Orders</span>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Package size={20} /> Order History
        </h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <Package size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 font-medium">No orders placed yet.</p>
          </div>
        ) : (
          orders.map(order => {
             const statusStyle = getStatusStyle(order.status);
             return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Order Placed</p>
                      <p className="font-medium text-gray-900">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Total</p>
                      <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Order #</p>
                      <p className="font-mono text-gray-600">{order.id}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.icon}
                    {order.status}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 md:items-center">
                        <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={20}/></div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                           <div>
                             <h4 className="font-medium text-gray-900">{item.name}</h4>
                             <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                           </div>
                           <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};