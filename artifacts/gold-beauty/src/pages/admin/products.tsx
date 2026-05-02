import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, Edit, Trash2, LayoutGrid, List } from 'lucide-react';
import { products, categories } from '@/data/products';

export default function AdminProducts() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState('All');
  
  const filteredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your store's inventory and product details.</p>
        </div>
        <Button className="bg-primary hover:bg-accent text-white flex items-center gap-2">
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'All' ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          {categories.map(c => (
            <button 
              key={c.name}
              onClick={() => setActiveTab(c.name)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                activeTab === c.name ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-gray-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-md p-1 border border-border hidden sm:flex">
          <button 
            onClick={() => setView('table')}
            className={`p-1.5 rounded-sm transition-colors ${view === 'table' ? 'bg-gray-100 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-sm transition-colors ${view === 'grid' ? 'bg-gray-100 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex gap-4 bg-gray-50/50 rounded-t-xl">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search products..." className="pl-9 bg-white" />
            </div>
            <Button variant="outline" className="bg-white flex items-center gap-2">
              <Filter size={16} />
              Filters
            </Button>
          </div>

          {view === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">Image</th>
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock Status</th>
                    <th className="px-6 py-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredProducts.map((product, i) => {
                    const isLowStock = i % 4 === 0;
                    const isOut = i % 7 === 0;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="w-12 h-12 rounded-md bg-[#FAF8F4] overflow-hidden border border-border">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                        <td className="px-6 py-4 font-medium">LKR {product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isOut ? 'bg-red-50 text-red-700' :
                            isLowStock ? 'bg-amber-50 text-amber-700' :
                            'bg-green-50 text-green-700'
                          }`}>
                            {isOut ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
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
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white rounded-full shadow-sm text-muted-foreground hover:text-primary transition-colors">
                        <Edit size={14} />
                      </button>
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
    </motion.div>
  );
}
