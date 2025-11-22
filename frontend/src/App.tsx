import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Menu, Search, Laptop, Smartphone, Headphones, Watch } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { ProductCard, Product } from "./components/ProductCard";
import { Cart, CartItem } from "./components/Cart";
import { Hero } from "./components/Hero";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
// Se elimina el wrapper Radix Dialog en esta pantalla; usamos un modal portal sencillo.

// Los productos ahora se obtienen desde el backend en tiempo de ejecución

const categories = [
  { name: "Todos", icon: null },
  { name: "Laptops", icon: Laptop },
  { name: "Smartphones", icon: Smartphone },
  { name: "Audio", icon: Headphones },
  { name: "Wearables", icon: Watch },
];

export default function App() {
  const [cartItems, setCartItems] = useState([] as CartItem[]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const productsRef = useRef(null as HTMLDivElement | null);

  const [products, setProducts] = useState([] as Product[]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null as string | null);

  const getImageForCategory = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    switch (c) {
      case 'laptops':
        return 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?auto=format&fit=crop&w=1080&q=80';
      case 'smartphones':
        return 'https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?auto=format&fit=crop&w=1080&q=80';
      case 'audio':
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1080&q=80';
      case 'wearables':
        return 'https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?auto=format&fit=crop&w=1080&q=80';
      default:
        return 'https://images.unsplash.com/photo-1636569826709-8e07f6104992?auto=format&fit=crop&w=1080&q=80';
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/productos');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const mapped: Product[] = (data || []).map((p: any) => {
          const rawCat = (p.categoria ?? p.category) || 'Otros';
          const cat = String(rawCat);
          return {
            id: p.id,
            name: p.nombre ?? p.name ?? 'Sin nombre',
            price: p.precio ?? p.price ?? 0,
            originalPrice: p.originalPrice ?? undefined,
            image: p.image ?? getImageForCategory(p.categoria ?? p.category),
            category: cat.charAt(0).toUpperCase() + cat.slice(1),
            stock: p.stock ?? 0,
            rating: p.rating ?? 4,
            inStock: (p.stock ?? 0) > 0,
          } as Product;
        });

        setProducts(mapped);
      } catch (err) {
        console.error('Error fetching productos:', err);
        setFetchError('Error cargando productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Formulario para crear / editar
  const [editingId, setEditingId] = useState(null as number | null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formPrecio, setFormPrecio] = useState('' as number | '');
  const [formStock, setFormStock] = useState('' as number | '');
  const [formCategoria, setFormCategoria] = useState('laptops');

  const resetForm = () => {
    setEditingId(null);
    setFormNombre('');
    setFormDescripcion('');
    setFormPrecio('');
    setFormStock('');
    setFormCategoria('laptops');
    setModalOpen(false);
  };

  const openEdit = (p: Product) => {
    console.log('openEdit called', p);
    setEditingId(p.id as number);
    setFormNombre(p.name || '');
    setFormDescripcion((p as any).descripcion ?? '');
    setFormPrecio(p.price ?? 0);
    setFormStock((p as any).stock ?? (p.inStock ? 1 : 0));
    setFormCategoria(((p.category || 'laptops') + '').toLowerCase());
    setModalOpen(true);
  };

  // Forzar pointer-events en el body cuando el modal esté abierto
  useEffect(() => {
    const prev = document.body.style.pointerEvents;
    if (modalOpen) {
      try {
        document.body.style.pointerEvents = 'auto';
      } catch (e) {
        // ignore
      }
    } else {
      try {
        document.body.style.pointerEvents = prev || '';
      } catch (e) {
        // ignore
      }
    }
    return () => {
      try {
        document.body.style.pointerEvents = prev || '';
      } catch (e) {}
    };
  }, [modalOpen]);

  const handleSubmitProduct = async (e: any) => {
    e?.preventDefault?.();
    const payload = {
      nombre: formNombre,
      descripcion: formDescripcion,
      precio: Number(formPrecio) || 0,
      stock: Number(formStock) || 0,
      categoria: (formCategoria || 'laptops').toLowerCase(),
    };

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:3001/api/productos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error actualizando');
        const updated = await res.json();
        setProducts((prev: Product[]) => prev.map((p) => (p.id === updated.id ? (() => {
          const rawCat = (updated.categoria ?? updated.category) || '';
          const cat = String(rawCat);
          return {
            id: updated.id,
            name: updated.nombre ?? updated.name,
            price: updated.precio ?? updated.price,
            image: updated.image ?? getImageForCategory(updated.categoria),
            stock: updated.stock ?? 0,
            category: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '',
            rating: updated.rating ?? 4,
            inStock: (updated.stock ?? 0) > 0,
          } as Product;
        })() : p)));
      } else {
        const res = await fetch('http://localhost:3001/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error creando');
        const created = await res.json();
        const rawCat = (created.categoria ?? created.category) || '';
        const cat = String(rawCat);
        const mapped = {
          id: created.id,
          name: created.nombre ?? created.name,
          price: created.precio ?? created.price,
          image: created.image ?? getImageForCategory(created.categoria),
          stock: created.stock ?? 0,
          category: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '',
          rating: created.rating ?? 4,
          inStock: (created.stock ?? 0) > 0,
        } as Product;
        setProducts((prev: Product[]) => [mapped, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error creando/actualizando producto');
    }
  };

  const handleDelete = async (id: number) => {
    console.log('handleDelete called', id);
    if (!confirm('¿Eliminar producto?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando');
      setProducts((prev: Product[]) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error eliminando producto');
    }
  };

  const handleIncrease = async (id: number, cantidad = 1) => {
    console.log('handleIncrease called', id, cantidad);
    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}/aumentar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad }),
      });
      if (!res.ok) throw new Error('Error aumentando');
      const updated = await res.json();
      setProducts((prev: Product[]) => prev.map((p) => (p.id === updated.id ? (() => {
        const rawCat = (updated.categoria ?? updated.category) || '';
        const cat = String(rawCat);
        return {
          id: updated.id,
          name: updated.nombre ?? updated.name,
          price: updated.precio ?? updated.price,
          image: updated.image ?? getImageForCategory(updated.categoria),
          stock: updated.stock ?? 0,
          category: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '',
          rating: updated.rating ?? 4,
          inStock: (updated.stock ?? 0) > 0,
        } as Product;
      })() : p)));
    } catch (err) {
      console.error(err);
      alert('Error aumentando stock');
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev: CartItem[]) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const max = product.stock ?? 0;
        if (existing.quantity >= max) {
          alert('No puedes agregar más unidades: límite de stock alcanzado');
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if ((product.stock ?? 0) <= 0) {
        alert('Producto sin stock');
        return prev;
      }
      return [...prev, { ...(product as any), quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev: CartItem[]) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const max = item.stock ?? 0;
        if (quantity > max) {
          alert('No puedes establecer una cantidad mayor al stock disponible');
          return { ...item, quantity: max };
        }
        return { ...item, quantity };
      })
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev: CartItem[]) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = async (items: CartItem[]) => {
    if (!items || items.length === 0) {
      alert('Carrito vacío');
      return;
    }

    try {
      const payload = { items: items.map((it) => ({ id: it.id, cantidad: it.quantity })) };
      const res = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data && data.productId) {
          alert('Error: Stock insuficiente para el producto id ' + data.productId);
          // Refrescar productos para sincronizar cantidades reales
          const r = await fetch('http://localhost:3001/api/productos');
          const latest = await r.json();
          const mapped: Product[] = (latest || []).map((p: any) => {
            const rawCat = (p.categoria ?? p.category) || 'Otros';
            const cat = String(rawCat);
            return {
              id: p.id,
              name: p.nombre ?? p.name ?? 'Sin nombre',
              price: p.precio ?? p.price ?? 0,
              originalPrice: p.originalPrice ?? undefined,
              image: p.image ?? getImageForCategory(p.categoria ?? p.category),
              category: cat.charAt(0).toUpperCase() + cat.slice(1),
              stock: p.stock ?? 0,
              rating: p.rating ?? 4,
              inStock: (p.stock ?? 0) > 0,
            } as Product;
          });
          setProducts(mapped);
        } else {
          alert('Error procesando el pago');
        }
        return;
      }

      // Respuesta OK: actualizar stocks locales
      if (data && Array.isArray(data.products)) {
        setProducts((prev) => prev.map((p) => {
          const upd = data.products.find((u: any) => u.id === p.id);
          if (upd) {
            const rawCat = (upd.categoria ?? upd.category) || '';
            const cat = String(rawCat);
            return {
              id: upd.id,
              name: upd.nombre ?? upd.name ?? p.name,
              price: upd.precio ?? upd.price ?? p.price,
              image: upd.image ?? p.image,
              stock: upd.stock ?? 0,
              category: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : p.category,
              rating: upd.rating ?? p.rating,
              inStock: (upd.stock ?? 0) > 0,
            } as Product;
          }
          return p;
        }));
      }

      // Vaciar carrito y cerrar
      setCartItems([]);
      setIsCartOpen(false);
      alert('Pago procesado correctamente. Gracias por tu compra');
    } catch (err) {
      console.error('Checkout error', err);
      alert('Error procesando el pago');
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h2 className="text-primary">TechStore</h2>
              
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                  Inicio
                </a>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                  Productos
                </a>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                  Ofertas
                </a>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                  Contacto
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onShopNow={scrollToProducts} />

      {/* Products Section */}
      <section ref={productsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="mb-6">Nuestros Productos</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full sm:w-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.name} value={category.name} className="gap-2">
                  {category.icon && <category.icon className="w-4 h-4" />}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Botón para abrir modal de crear producto (usando portal modal) */}
        <div className="mb-6 flex justify-end">
          <button type="button" onClick={() => setModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded">Agregar producto</button>
        </div>

        {/* Fallback modal (portal) por si Radix falla: */}
        {modalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
            <div className="bg-white w-[640px] max-w-[calc(100%-2rem)] p-6 rounded shadow-lg relative" style={{ zIndex: 100000 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingId ? 'Editar producto' : 'Agregar producto'}</h3>
                <button onClick={() => { resetForm(); }} className="text-gray-600">Cerrar</button>
              </div>
              <form onSubmit={(e) => { handleSubmitProduct(e); }} className="grid grid-cols-1 gap-3">
                <input className="border p-2 rounded" placeholder="Nombre" value={formNombre} onChange={(e: any) => setFormNombre(e.target.value)} required />
                <select className="border p-2 rounded" value={formCategoria} onChange={(e: any) => setFormCategoria(e.target.value)}>
                  <option value="laptops">laptops</option>
                  <option value="smartphones">smartphones</option>
                  <option value="audio">audio</option>
                  <option value="wearables">wearables</option>
                </select>
                <input className="border p-2 rounded" placeholder="Precio" type="number" value={formPrecio as any} onChange={(e: any) => setFormPrecio(e.target.value === '' ? '' : Number(e.target.value))} required />
                <input className="border p-2 rounded" placeholder="Stock" type="number" value={formStock as any} onChange={(e: any) => setFormStock(e.target.value === '' ? '' : Number(e.target.value))} />
                <textarea className="border p-2 rounded" placeholder="Descripción" value={formDescripcion} onChange={(e: any) => setFormDescripcion(e.target.value)} />
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
                  <button type="button" onClick={() => resetForm()} className="px-4 py-2 border rounded">Cancelar</button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>Cargando productos...</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-12 text-red-500">
            <p>{fetchError}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />

                <div className="mt-2 flex gap-2 justify-center">
                  <button type="button" onClick={() => openEdit(product)} className="px-3 py-1 border rounded text-sm">Editar</button>
                  <button type="button" onClick={() => handleDelete(product.id as number)} className="px-3 py-1 border rounded text-sm text-red-600">Eliminar</button>
                  <button type="button" onClick={() => handleIncrease(product.id as number, 1)} className="px-3 py-1 border rounded text-sm">+Stock</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4 text-white">TechStore</h3>
              <p className="text-gray-400">
                Tu tienda de confianza para tecnología de última generación.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 text-white">Categorías</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Laptops</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smartphones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Audio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accesorios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-white">Ayuda</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Envíos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantía</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-white">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contacto@techstore.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Lun - Vie: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 TechStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        
      />
    </div>
  );
}
 