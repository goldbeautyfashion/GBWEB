import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, LayoutGrid, List, X, Save, Package } from 'lucide-react';
import { products as initialProducts, Product } from '@/data/products';
import { toast } from 'sonner';

function EditProductModal({ product, onClose, onSave }: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const isNew = !product;
  const [form, setForm] = useState<Omit<Product, 'id' | 'benefits' | 'rating'>>({
    name: product?.name ?? '',
    price: product?.price ?? 0,
    category: product?.category ?? '',
    image: product?.image ?? '',
    description: product?.description ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || form.price <= 0) e.price = 'Valid price is required';
    if (!form.category.trim()) e.category = 'Category is required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const saved: Product = {
      id: product?.id ?? `custom-${Date.now()}`,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: form.image || '/images/prod-1.png',
      description: form.description,
      benefits: product?.benefits ?? [],
      rating: product?.rating ?? 4.5,
    };
    onSave(saved);
    onClose();
    toast.success(isNew ? `"${saved.name}" added successfully` : `"${saved.name}" updated`);
  };

  const Field = ({ label, id, type = 'text' }: { label: string; id: keyof typeof form; type?: string }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{label}</label>
      {id === 'description' ? (
        <textarea
          value={form[id] as string}
          onChange={e => { setForm(p => ({ ...p, [id]: e.target.value })); setErrors(p => ({ ...p, [id]: '' })); }}
          rows={3}
          className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[id] as string | number}
          onChange={e => { setForm(p => ({ ...p, [id]: type === 'number' ? Number(e.target.value) : e.target.value })); setErrors(p => ({ ...p, [id]: '' })); }}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${errors[id] ? 'border-destructive' : 'border-border'}`}
        />
      )}
      {errors[id] && <p className="text-destructive text-xs">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{isNew ? 'Add Product' : 'Edit Product'}</h3>
            {product && <p className="text-xs text-muted-foreground mt-0.5">ID: {product.id}</p>}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          {!isNew && form.image && (
            <div className="w-20 h-20 border border-border bg-[#FAF8F4] p-1 mx-auto">
              <img src={form.image} alt={form.name} className="w-full h-full object-cover" />
            </div>
          )}
          <Field label="Product Name" id="name" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (LKR)" id="price" type="number" />
            <Field label="Category" id="category" />
          </div>
          <Field label="Description" id="description" />
          <Field label="Image Path" id="image" />
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-accent text-white">
            <Save size={15} className="mr-2" /> {isNew ? 'Add Product' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirmModal({ product, onClose, onConfirm }: { product: Product; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-border p-6 space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">Delete Product?</h3>
          <p className="text-sm text-muted-foreground mt-1">Are you sure you want to remove <span className="font-medium text-foreground">"{product.name}"</span>? This action cannot be undone.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }} className="flex-1">Delete</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null | 'new'>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const uniqueCategories = [...new Set(productList.map(p => p.category))].sort();

  const filteredProducts = productList.filter(p => {
    const matchesCategory = activeTab === 'All' || p.category === activeTab;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveProduct = (saved: Product) => {
    setProductList(prev => {
      const exists = prev.find(p => p.id === saved.id);
      return exists ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    toast.success('Product removed from list');
  };

  const stockStatus = (i: number) => {
    if (i % 7 === 0) return { label: 'Out of Stock', cls: 'bg-red-50 text-red-700' };
    if (i % 4 === 0) return { label: 'Low Stock', cls: 'bg-amber-50 text-amber-700' };
    return { label: 'In Stock', cls: 'bg-green-50 text-green-700' };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{productList.length} products in your store.</p>
        </div>
        <Button onClick={() => setEditingProduct('new')} className="bg-primary hover:bg-accent text-white flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('All')} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === 'All' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-gray-50'}`}>
            All ({productList.length})
          </button>
          {uniqueCategories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === cat ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white rounded-md p-1 border border-border sm:flex hidden">
          <button onClick={() => setView('table')} className={`p-1.5 rounded-sm transition-colors ${view === 'table' ? 'bg-gray-100 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}><List size={18} /></button>
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-sm transition-colors ${view === 'grid' ? 'bg-gray-100 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}><LayoutGrid size={18} /></button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex gap-4 bg-gray-50/50 rounded-t-xl">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search products..." className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground bg-white">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>No products found.</p>
            </div>
          ) : view === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">Image</th>
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredProducts.map((product, i) => {
                    const stock = stockStatus(i);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="w-12 h-12 rounded-md bg-[#FAF8F4] overflow-hidden border border-border">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/FAF8F4/A77F1B?text=GB`; }} />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                        <td className="px-6 py-4 font-medium text-primary">LKR {product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stock.cls}`}>{stock.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setEditingProduct(product)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => setDeletingProduct(product)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-[#FAF8F4] relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/200x200/FAF8F4/A77F1B?text=GB`; }} />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(product)} className="p-2 bg-white rounded-full shadow-sm text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
                      <button onClick={() => setDeletingProduct(product)} className="p-2 bg-white rounded-full shadow-sm text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
                    <h3 className="font-medium text-foreground truncate mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">LKR {product.price.toLocaleString()}</span>
                      <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">In Stock</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {editingProduct !== null && (
          <EditProductModal
            product={editingProduct === 'new' ? null : editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
          />
        )}
        {deletingProduct && (
          <DeleteConfirmModal
            product={deletingProduct}
            onClose={() => setDeletingProduct(null)}
            onConfirm={() => handleDeleteProduct(deletingProduct.id)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
