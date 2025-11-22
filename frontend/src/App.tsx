import { useState, useRef } from "react";
import { ShoppingCart, Menu, Search, Laptop, Smartphone, Headphones, Watch } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { ProductCard, Product } from "./components/ProductCard";
import { Cart, CartItem } from "./components/Cart";
import { Hero } from "./components/Hero";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";

const products: Product[] = [
  {
    id: 1,
    name: "Laptop Pro 15 Pulgadas",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzYzMzg4MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Laptops",
    rating: 5,
    inStock: true,
  },
  {
    id: 2,
    name: "Auriculares Inalámbricos Premium",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYzMjgxOTc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 5,
    inStock: true,
  },
  {
    id: 3,
    name: "Smartphone Ultra 5G",
    price: 899,
    image: "https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlfGVufDF8fHx8MTc2MzM1MTgyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Smartphones",
    rating: 4,
    inStock: true,
  },
  {
    id: 4,
    name: "Smartwatch Serie 7",
    price: 449,
    originalPrice: 549,
    image: "https://images.unsplash.com/photo-1739287700815-7eef4abaab4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjMzMzk4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
    rating: 5,
    inStock: true,
  },
  {
    id: 5,
    name: "Tablet Pro 12.9 Pulgadas",
    price: 799,
    image: "https://images.unsplash.com/photo-1714071803623-9594e3b77862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzYzMjk3NDA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tablets",
    rating: 4,
    inStock: true,
  },
  {
    id: 6,
    name: "Teclado Mecánico RGB Gaming",
    price: 159,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjMzMTU4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Accesorios",
    rating: 5,
    inStock: true,
  },
  {
    id: 7,
    name: "Mouse Inalámbrico Ergonómico",
    price: 79,
    image: "https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2MzM5NjA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Accesorios",
    rating: 4,
    inStock: false,
  },
  {
    id: 8,
    name: "Cámara Digital 4K",
    price: 1199,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1636569826709-8e07f6104992?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzM3MjA4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cámaras",
    rating: 5,
    inStock: true,
  },
];

const categories = [
  { name: "Todos", icon: null },
  { name: "Laptops", icon: Laptop },
  { name: "Smartphones", icon: Smartphone },
  { name: "Audio", icon: Headphones },
  { name: "Wearables", icon: Watch },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
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
      />
    </div>
  );
}
