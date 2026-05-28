import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  LogOut, 
  Search, 
  Plus, 
  Trash2, 
  User, 
  ShoppingCart, 
  Percent, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  CheckCircle, 
  X,
  Smartphone,
  Printer
} from 'lucide-react';

// ============================================================================
// 1. CAMADA DE SERVIÇO / ABSTRAÇÃO DO BANCO DE DADOS (DatabaseService)
// ============================================================================
const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Camiseta Minimalist Off-White', costPrice: 35.00, salePrice: 89.90, stock: 15, variations: 'P, M, G / Algodão' },
  { id: '2', name: 'Calça Alfaiataria Grafite', costPrice: 65.00, salePrice: 179.90, stock: 2, variations: '38, 40, 42 / Linho' },
  { id: '3', name: 'Blazer Estruturado Preto', costPrice: 110.00, salePrice: 299.90, stock: 5, variations: 'M, G / Sarja' },
  { id: '4', name: 'Boné Strapback Sarja', costPrice: 18.00, salePrice: 59.90, stock: 1, variations: 'Único / Preto' },
];

const DEFAULT_SALES = [
  {
    id: 'TRX-9821',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    customer: 'Carlos Silva',
    items: [{ productId: '1', name: 'Camiseta Minimalist Off-White', quantity: 2, salePrice: 89.90, costPrice: 35.00 }],
    subtotal: 179.80,
    discount: 10.00,
    total: 169.80,
    payments: { pix: 169.80, cash: 0, card: 0 },
    change: 0
  },
  {
    id: 'TRX-9822',
    date: new Date().toISOString(),
    customer: 'Ana Costa',
    items: [{ productId: '3', name: 'Blazer Estruturado Preto', quantity: 1, salePrice: 299.90, costPrice: 110.00 }],
    subtotal: 299.90,
    discount: 0,
    total: 299.90,
    payments: { pix: 0, cash: 0, card: 299.90 },
    change: 0
  }
];

const DatabaseService = {
  init() {
    if (!localStorage.getItem('saas_products')) {
      localStorage.setItem('saas_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem('saas_sales')) {
      localStorage.setItem('saas_sales', JSON.stringify(DEFAULT_SALES));
    }
    if (!localStorage.getItem('saas_billing')) {
      localStorage.setItem('saas_billing', JSON.stringify({ status: 'Ativo', amount: 99.90, nextDueDate: '15/06/2026' }));
    }
  },

  getProducts() {
    this.init();
    return JSON.parse(localStorage.getItem('saas_products'));
  },

  saveProducts(products) {
    localStorage.setItem('saas_products', JSON.stringify(products));
    return products;
  },

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = { ...product, id: String(Date.now()) };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(updatedProduct) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveProducts(products);
    }
    return updatedProduct;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return true;
  },

  getSales() {
    this.init();
    return JSON.parse(localStorage.getItem('saas_sales'));
  },

  addSale(saleData) {
    const sales = this.getSales();
    const products = this.getProducts();

    saleData.items.forEach(item => {
      const targetProd = products.find(p => p.id === item.productId);
      if (targetProd) {
        targetProd.stock = Math.max(0, targetProd.stock - item.quantity);
      }
    });

    this.saveProducts(products);

    const finalSale = {
      ...saleData,
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString()
    };
    
    sales.push(finalSale);
    localStorage.setItem('saas_sales', JSON.stringify(sales));
    return finalSale;
  },

  getBilling() {
    this.init();
    return JSON.parse(localStorage.getItem('saas_billing'));
  }
};

// ============================================================================
// 2. COMPONENTE PRINCIPAL DE ENTRADA (MOCK AUTH ROUTING)
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (email, password) => {
    if (email === 'admin@loja.com' && password === '123') {
      setUser({ email, role: 'admin', name: 'Dono da Loja' });
      setCurrentView('dashboard');
    } else if (email === 'caixa@loja.com' && password === '123') {
      setUser({ email, role: 'operator', name: 'Operador de Caixa' });
      setCurrentView('pos');
    } else {
      alert('Credenciais inválidas! Use admin@loja.com ou caixa@loja.com com a senha 123');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 font-sans antialiased text-zinc-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200/80 p-5 justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight">Nexus Retail</h1>
              <p className="text-xs text-zinc-400 capitalize">{user.role === 'admin' ? 'Painel Admin' : 'Operador'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {user.role === 'admin' && (
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
            )}
            <button 
              onClick={() => setCurrentView('pos')} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'pos' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <ShoppingBag size={18} /> Ponto de Venda (PDV)
            </button>
            {user.role === 'admin' && (
              <>
                <button 
                  onClick={() => setCurrentView('inventory')} 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'inventory' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <Package size={18} /> Estoque & Grade
                </button>
                <button 
                  onClick={() => setCurrentView('billing')} 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'billing' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <CreditCard size={18} /> Assinatura SaaS
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="border-t border-zinc-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <User size={16} />
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-zinc-700 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50/50 transition-colors"
          >
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Menu Mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-zinc-950 flex items-center justify-center text-white font-bold text-sm">N</div>
            <span className="font-semibold text-sm">Nexus</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={currentView} 
              onChange={(e) => setCurrentView(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium py-1 px-2.5 text-zinc-700 focus:outline-none"
            >
              {user.role === 'admin' && <option value="dashboard">Dashboard</option>}
              <option value="pos">PDV (Caixa)</option>
              {user.role === 'admin' && <option value="inventory">Estoque</option>}
              {user.role === 'admin' && <option value="billing">Assinatura</option>}
            </select>
            <button onClick={handleLogout} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && user.role === 'admin' && <DashboardView />}
          {currentView === 'pos' && <POSView user={user} />}
          {currentView === 'inventory' && user.role === 'admin' && <InventoryView />}
          {currentView === 'billing' && user.role === 'admin' && <BillingView />}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// 3. SUBCOMPONENTE: TELA DE LOGIN
// ============================================================================
function LoginView({ onLogin }) {
  const [email, setEmail] = useState('admin@loja.com');
  const [password, setPassword] = useState('123');

  const submit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200/80 shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-black text-2xl shadow-sm">
            N
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Acesse sua plataforma</h2>
          <p className="text-xs text-zinc-400">Insira suas credenciais de produção para acessar o ERP.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">E-mail Corporativo</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Senha de Acesso</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-zinc-950 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 active:bg-zinc-900 transition-colors shadow-sm"
          >
            Entrar no Painel
          </button>
        </form>

        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-2 text-xs text-zinc-500">
          <p className="font-semibold text-zinc-700">Acessos Rápidos para Testes:</p>
          <div className="flex justify-between items-center bg-white p-1.5 rounded border border-zinc-200/60">
            <span>👑 Dono (Admin):</span>
            <button type="button" onClick={() => { setEmail('admin@loja.com'); setPassword('123'); }} className="text-indigo-600 font-medium hover:underline">Carregar</button>
          </div>
          <div className="flex justify-between items-center bg-white p-1.5 rounded border border-zinc-200/60">
            <span>💼 Caixa (Operador):</span>
            <button type="button" onClick={() => { setEmail('caixa@loja.com'); setPassword('123'); }} className="text-indigo-600 font-medium hover:underline">Carregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. SUBCOMPONENTE: DASHBOARD DO ADMINISTRADOR
// ============================================================================
function DashboardView() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setSales(DatabaseService.getSales());
    setProducts(DatabaseService.getProducts());
  }, []);

  const metrics = useMemo(() => {
    let faturamento = 0;
    let cmv = 0;
    sales.forEach(sale => {
      faturamento += sale.total;
      sale.items.forEach(item => {
        cmv += (item.costPrice || 0) * item.quantity;
      });
    });

    const lucroLiquido = faturamento - cmv;
    const ticketMedio = sales.length > 0 ? faturamento / sales.length : 0;

    return { faturamento, cmv, lucroLiquido, ticketMedio };
  }, [sales]);

  const criticalStockItems = useMemo(() => {
    return products.filter(p => p.stock < 3);
  }, [products]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Visão Geral do Negócio</h2>
        <p className="text-xs text-zinc-400">Dados consolidados extraídos diretamente das vendas executadas no PDV.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Faturamento Bruto</span>
            <DollarSign size={16} />
          </div>
          <p className="text-2xl font-semibold text-zinc-900">R$ {metrics.faturamento.toFixed(2)}</p>
          <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
            <TrendingUp size={10} /> +12% vs. semana anterior
          </p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">CMV Acumulado</span>
            <Layers size={16} />
          </div>
          <p className="text-2xl font-semibold text-zinc-600">R$ {metrics.cmv.toFixed(2)}</p>
          <p className="text-[10px] text-zinc-400">Custo das Mercadorias Vendidas</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Lucro Líquido Real</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">R$ {metrics.lucroLiquido.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-600 font-medium">Margem saudável baseada em custo bruto</p>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Ticket Médio</span>
            <ShoppingCart size={16} />
          </div>
          <p className="text-2xl font-semibold text-zinc-900">R$ {metrics.ticketMedio.toFixed(2)}</p>
          <p className="text-[10px] text-zinc-400">Total dividido por {sales.length} transações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900 mb-1">Faturamento Diário Recente</h3>
            <p className="text-xs text-zinc-400 mb-6">Gráfico analítico de transações liquidadas.</p>
          </div>
          <div className="flex items-end gap-3 h-44 px-2 pt-4 border-b border-zinc-100">
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-100 rounded-t-md h-12 hover:bg-zinc-200 transition-all cursor-pointer"></div>
              <span className="text-[10px] font-medium text-zinc-400">Seg</span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-100 rounded-t-md h-20 hover:bg-zinc-200 transition-all cursor-pointer"></div>
              <span className="text-[10px] font-medium text-zinc-400">Ter</span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-100 rounded-t-md h-32 hover:bg-zinc-200 transition-all cursor-pointer"></div>
              <span className="text-[10px] font-medium text-zinc-400">Qua</span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-950 rounded-t-md h-40 shadow-sm"></div>
              <span className="text-[10px] font-semibold text-zinc-800">Hoje</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <AlertTriangle size={16} />
              <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Alerta de Ruptura de Estoque</h3>
            </div>
            <p className="text-xs text-zinc-400">Produtos prioritários com menos de 3 unidades.</p>
          </div>

          <div className="divide-y divide-zinc-100 overflow-y-auto max-h-52 pr-1 space-y-2">
            {criticalStockItems.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">Nenhum item com estoque crítico!</p>
            ) : (
              criticalStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center pt-2 first:pt-0">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-zinc-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{item.variations}</p>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap">
                    {item.stock} un
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. SUBCOMPONENTE: CONTROLE DE ESTOQUE COM GRADE (CRUD)
// ============================================================================
function InventoryView() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', costPrice: '', salePrice: '', stock: '', variations: ''
  });

  const loadProducts = () => setProducts(DatabaseService.getProducts());

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', costPrice: '', salePrice: '', stock: '', variations: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      stock: product.stock,
      variations: product.variations
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsedData = {
      name: formData.name,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      stock: parseInt(formData.stock) || 0,
      variations: formData.variations
    };

    if (editingProduct) {
      DatabaseService.updateProduct({ ...parsedData, id: editingProduct.id });
    } else {
      DatabaseService.addProduct(parsedData);
    }
    
    setIsModalOpen(false);
    loadProducts();
  };

  const handleDelete = (id) => {
    if (confirm('Deseja realmente remover permanentemente este produto do catálogo?')) {
      DatabaseService.deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Catálogo de Produtos & Grade</h2>
          <p className="text-xs text-zinc-400">Gerenciamento completo das mercadorias, custos operacionais e variações de tamanho/cor.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-zinc-950 text-white flex items-center justify-center gap-2 text-xs font-medium py-2 px-4 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} /> Cadastrar Novo Item
        </button>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/70 border-b border-zinc-200/80 text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Nome do Produto</th>
                <th className="py-3 px-4">Grade / Variações</th>
                <th className="py-3 px-4 text-right">Preço de Custo</th>
                <th className="py-3 px-4 text-right">Preço de Venda</th>
                <th className="py-3 px-4 text-center">Disponível</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900">{product.name}</td>
                  <td className="py-3 px-4 text-zinc-500 max-w-xs truncate">{product.variations || 'Sem variação'}</td>
                  <td className="py-3 px-4 text-right font-mono text-zinc-400">R$ {product.costPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-zinc-900">R$ {product.salePrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${product.stock <= 3 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-zinc-100 text-zinc-700'}`}>
                      {product.stock} un
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:underline font-medium">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 shadow-2xl rounded-xl w-full max-w-lg p-6 space-y-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
              <X size={18} />
            </button>
            
            <div>
              <h3 className="text-base font-semibold text-zinc-900">{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
              <p className="text-xs text-zinc-400">Insira as informações comerciais exatas da mercadoria.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Nome Comercial</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none"
                  placeholder="Ex: Tênis Runner Confort Pro"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Preço Custo (R$)</label>
                  <input 
                    type="number" step="0.01" required value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Preço Venda (R$)</label>
                  <input 
                    type="number" step="0.01" required value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Estoque Inicial</label>
                  <input 
                    type="number" required value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Grade e Variações</label>
                <input 
                  type="text" value={formData.variations}
                  onChange={(e) => setFormData({...formData, variations: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none"
                  placeholder="Ex: Cores: Preto, Branco / Tamanhos: P, M, G"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-medium hover:bg-zinc-800"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. SUBCOMPONENTE: FRENTE DE CAIXA (PDV PROFISSIONAL)
// ============================================================================
function POSView({ user }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('R$');
  const [payments, setPayments] = useState({ pix: 0, cash: 0, card: 0 });
  const [activeReceipt, setActiveReceipt] = useState(null);

  const searchInputRef = useRef(null);

  useEffect(() => {
    setProducts(DatabaseService.getProducts());

    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.stock > 0);
  }, [searchQuery, products]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('Limite máximo de estoque atingido.');
        return;
      }
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, salePrice: product.salePrice, costPrice: product.costPrice, quantity: 1 }]);
    }
    setSearchQuery('');
  };

  const updateCartQuantity = (productId, delta) => {
    const item = cart.find(i => i.productId === productId);
    const targetProduct = products.find(p => p.id === productId);
    if (!item || !targetProduct) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.productId !== productId));
    } else if (newQty > targetProduct.stock) {
      alert('Quantidade superior ao estoque disponível!');
    } else {
      setCart(cart.map(i => i.productId === productId ? { ...i, quantity: newQty } : i));
    }
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + (curr.salePrice * curr.quantity), 0);
  }, [cart]);

  const calculatedDiscount = useMemo(() => {
    const val = parseFloat(discountValue) || 0;
    if (discountType === 'R$') return val;
    return (subtotal * val) / 100;
  }, [discountValue, discountType, subtotal]);

  const totalDue = useMemo(() => {
    return Math.max(0, subtotal - calculatedDiscount);
  }, [subtotal, calculatedDiscount]);

  const totalPaid = useMemo(() => {
    return (parseFloat(payments.pix) || 0) + (parseFloat(payments.cash) || 0) + (parseFloat(payments.card) || 0);
  }, [payments]);

  const changeDue = useMemo(() => {
    return Math.max(0, totalPaid - totalDue);
  }, [totalPaid, totalDue]);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('O carrinho de compras está vazio.');
    if (totalPaid < totalDue) return alert(`Pagamento insuficiente! Faltam R$ ${(totalDue - totalPaid).toFixed(2)}`);

    const saleRecord = {
      customer: customerName || 'Consumidor Final',
      items: cart,
      subtotal,
      discount: calculatedDiscount,
      total: totalDue,
      payments: { ...payments },
      change: changeDue
    };

    const completedSale = DatabaseService.addSale(saleRecord);
    setActiveReceipt(completedSale);

    setCart([]);
    setCustomerName('');
    setDiscountValue('');
    setPayments({ pix: 0, cash: 0, card: 0 });
    setProducts(DatabaseService.getProducts());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Balcão de Vendas (PDV)</h2>
          <p className="text-xs text-zinc-400">Pressione <kbd className="bg-zinc-200 px-1 py-0.5 rounded font-mono font-bold text-zinc-700 text-[10px]">/</kbd> para buscar.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-400" size={18} />
          <input 
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200/80 rounded-xl text-sm placeholder-zinc-400 focus:outline-none shadow-sm"
            placeholder="Digite o nome do produto para buscar..."
          />

          {searchQuery && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-xl z-10 divide-y divide-zinc-100 max-h-60 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-xs text-zinc-400 text-center">Nenhum produto em estoque encontrado.</div>
              ) : (
                filteredProducts.map(prod => (
                  <button 
                    key={prod.id} type="button"
                    onClick={() => addToCart(prod)}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex justify-between items-center text-xs transition-colors"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{prod.name}</p>
                      <p className="text-[10px] text-zinc-400">{prod.variations}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-zinc-900">R$ {prod.salePrice.toFixed(2)}</p>
                      <p className="text-[9px] text-zinc-400">{prod.stock} disponíveis</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Produtos Rápidos em Estoque</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {products.slice(0, 4).map(prod => (
              <button 
                key={prod.id} type="button"
                disabled={prod.stock === 0}
                onClick={() => addToCart(prod)}
                className="p-3 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/50 rounded-lg text-left text-xs transition-all flex flex-col justify-between h-20 disabled:opacity-50"
              >
                <span className="font-medium text-zinc-800 line-clamp-1">{prod.name}</span>
                <div className="flex justify-between items-end w-full mt-2">
                  <span className="font-mono font-bold text-zinc-900">R$ {prod.salePrice.toFixed(2)}</span>
                  <span className="text-[10px] text-zinc-400">{prod.stock} un</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-xl shadow-md overflow-hidden flex flex-col">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-xs text-zinc-700">
            <ShoppingCart size={16} /> Carrinho Atual ({cart.reduce((a,c) => a+c.quantity, 0)} itens)
          </div>
          <button type="button" onClick={() => setCart([])} className="text-[11px] text-red-600 hover:underline">Limpar</button>
        </div>

        <div className="p-4 divide-y divide-zinc-100 overflow-y-auto max-h-52 min-h-32">
          {cart.length === 0 ? (
            <div className="text-center text-xs text-zinc-400 py-8">Carrinho vazio. Adicione itens acima.</div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="py-2.5 flex justify-between items-center text-xs first:pt-0">
                <div className="min-w-0 pr-3">
                  <p className="font-medium text-zinc-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">R$ {item.salePrice.toFixed(2)} / un</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center border border-zinc-200 rounded-md overflow-hidden bg-zinc-50">
                    <button type="button" onClick={() => updateCartQuantity(item.productId, -1)} className="px-2 py-0.5 hover:bg-zinc-200 text-zinc-600">-</button>
                    <span className="px-2 text-xs font-mono font-medium">{item.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(item.productId, 1)} className="px-2 py-0.5 hover:bg-zinc-200 text-zinc-600">+</button>
                  </div>
                  <span className="font-mono font-semibold w-16 text-right">R$ {(item.salePrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-zinc-500 mb-1">Identificação do Cliente</label>
            <input 
              type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md focus:outline-none"
              placeholder="Consumidor Final"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-500 mb-1">Aplicar Desconto</label>
              <div className="flex border border-zinc-200 rounded-md overflow-hidden bg-white">
                <input 
                  type="number" step="0.01" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-2 py-1 focus:outline-none font-mono text-right" placeholder="0"
                />
                <select 
                  value={discountType} onChange={(e) => setDiscountType(e.target.value)}
                  className="bg-zinc-100 px-1 border-l border-zinc-200 font-medium focus:outline-none"
                >
                  <option value="R$">R$</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
            <div className="text-right flex flex-col justify-end">
              <span className="text-zinc-400 text-[10px]">Subtotal: R$ {subtotal.toFixed(2)}</span>
              <span className="text-zinc-900 font-semibold text-sm">Total: R$ {totalDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100 space-y-2 text-xs">
          <span className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Multi-meios de Pagamento</span>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">⚡ PIX (R$)</label>
              <input 
                type="number" step="0.01" value={payments.pix || ''}
                onChange={(e) => setPayments({...payments, pix: parseFloat(e.target.value) || 0})}
                className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded font-mono text-xs" placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">💵 Dinheiro (R$)</label>
              <input 
                type="number" step="0.01" value={payments.cash || ''}
                onChange={(e) => setPayments({...payments, cash: parseFloat(e.target.value) || 0})}
                className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded font-mono text-xs" placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">💳 Cartão (R$)</label>
              <input 
                type="number" step="0.01" value={payments.card || ''}
                onChange={(e) => setPayments({...payments, card: parseFloat(e.target.value) || 0})}
                className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded font-mono text-xs" placeholder="0.00"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center font-medium">
            <span className="text-zinc-500">Total Pago: R$ {totalPaid.toFixed(2)}</span>
            {changeDue > 0 ? (
              <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono">Troco: R$ {changeDue.toFixed(2)}</span>
            ) : (
              totalPaid < totalDue && <span className="text-red-500 text-[11px]">Faltam R$ {(totalDue - totalPaid).toFixed(2)}</span>
            )}
          </div>
        </div>

        <button 
          type="submit"
          disabled={cart.length === 0}
          className="w-full py-3 bg-zinc-950 text-white font-medium text-xs hover:bg-zinc-800 transition-colors disabled:opacity-50 tracking-wide uppercase"
        >
          Concluir Venda e Baixar Estoque
        </button>
      </form>

      {activeReceipt && (
        <ReceiptModal receipt={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}

// ============================================================================
// 7. SUBCOMPONENTE: MODAL DE RECIBO ESTILO REFEIÇÃO/CUPOM TÉRMICO
// ============================================================================
function ReceiptModal({ receipt, onClose }) {
  const generateWhatsAppLink = () => {
    let msg = `*COMPROVANTE DE COMPRA - NEXUS RETAIL*\n`;
    msg += `--------------------------------------\n`;
    msg += `Ref: ${receipt.id}\n`;
    msg += `Cliente: ${receipt.customer}\n`;
    msg += `Data: ${new Date(receipt.date).toLocaleDateString('pt-BR')}\n\n`;
    msg += `*ITENS:*\n`;
    receipt.items.forEach(i => {
      msg += `- ${i.quantity}x ${i.name} | R$ ${(i.salePrice * i.quantity).toFixed(2)}\n`;
    });
    msg += `\n--------------------------------------\n`;
    msg += `*Subtotal:* R$ ${receipt.subtotal.toFixed(2)}\n`;
    msg += `*Desconto:* R$ ${receipt.discount.toFixed(2)}\n`;
    msg += `*TOTAL LIQUIDADO:* R$ ${receipt.total.toFixed(2)}\n`;
    msg += `--------------------------------------\n`;
    msg += `Obrigado pela preferência! Volte sempre.`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 w-full max-w-sm p-5 rounded-2xl shadow-2xl relative space-y-4">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
          <X size={18} />
        </button>

        <div className="text-center border-b border-dashed border-zinc-300 pb-3 space-y-1">
          <h3 className="font-mono font-bold text-zinc-900 tracking-tight text-sm uppercase">NEXUS RETAIL S/A</h3>
          <p className="font-mono text-[10px] text-zinc-400">Soluções Omnichannel Integradas</p>
          <span className="inline-block bg-zinc-100 text-zinc-800 font-mono text-[10px] px-2 py-0.5 rounded mt-1 font-bold">
            {receipt.id}
          </span>
        </div>

        <div className="font-mono text-[11px] text-zinc-600 space-y-1">
          <p><span className="text-zinc-400">DATA:</span> {new Date(receipt.date).toLocaleString('pt-BR')}</p>
          <p><span className="text-zinc-400">CLIENTE:</span> {receipt.customer}</p>
        </div>

        <div className="border-t border-b border-dashed border-zinc-300 py-2 font-mono text-[11px] space-y-1">
          <div className="flex justify-between font-bold text-[10px] text-zinc-400 uppercase">
            <span>Item / Qtd</span>
            <span>Total</span>
          </div>
          {receipt.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-zinc-800">
              <span className="truncate pr-2">{item.quantity}x {item.name}</span>
              <span className="whitespace-nowrap">R$ {(item.salePrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="font-mono text-xs text-zinc-800 space-y-1 text-right">
          <p className="text-[11px] text-zinc-400">Subtotal: R$ {receipt.subtotal.toFixed(2)}</p>
          <p className="text-[11px] text-zinc-400">Desconto: R$ {receipt.discount.toFixed(2)}</p>
          <p className="font-bold text-sm text-zinc-900">Total Pago: R$ {receipt.total.toFixed(2)}</p>
          <p className="text-[10px] text-zinc-500">Troco Devolvido: R$ {receipt.change.toFixed(2)}</p>
        </div>

        <div className="pt-2 grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 border border-zinc-200 rounded-lg text-xs font-medium py-2 px-3 text-zinc-700 hover:bg-zinc-50"
          >
            <Printer size={13} /> Imprimir A4/80mm
          </button>
          <a 
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium py-2 px-3 hover:bg-emerald-700 text-center shadow-sm"
          >
            <Smartphone size={13} /> Disparar WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. SUBCOMPONENTE: PAINEL DE COBRANÇA DO SAAS (BILLING RESTRICTED)
// ============================================================================
function BillingView() {
  const [billing, setBilling] = useState(null);
  const [showPixModal, setShowPixModal] = useState(false);

  useEffect(() => {
    setBilling(DatabaseService.getBilling());
  }, []);

  if (!billing) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Assinatura do seu Sistema SaaS</h2>
        <p className="text-xs text-zinc-400">Monitore o status do seu plano contratado, vencimentos de faturas e controle os gateways de pagamento do ERP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-zinc-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Plano Atual Contratado</span>
              <h3 className="text-base font-bold text-zinc-900">Nexus Retail — Licença Enterprise Pro</h3>
            </div>
            <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle size={12} /> {billing.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-100 py-4 text-xs">
            <div>
              <p className="text-zinc-400">Valor Mensalidade</p>
              <p className="text-base font-semibold text-zinc-900">R$ {billing.amount.toFixed(2)}/mês</p>
            </div>
            <div>
              <p className="text-zinc-400">Próximo Vencimento</p>
              <p className="text-base font-semibold text-zinc-900 font-mono">{billing.nextDueDate}</p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button 
              type="button"
              onClick={() => setShowPixModal(true)}
              className="bg-zinc-950 text-white font-medium text-xs py-2 px-4 rounded-lg hover:bg-zinc-800 shadow-sm"
            >
              Antecipar Mensalidade via PIX
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 text-zinc-100 p-5 rounded-xl flex flex-col justify-between shadow-md">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">Segurança Financeira</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">Sua conta utiliza infraestrutura de faturamento criptografada ponta a ponta via Stripe Connect e Asaas Gateways.</p>
          </div>
          <div className="text-[10px] text-zinc-500 pt-4 border-t border-zinc-800">
            ID de Assinatura: sub_8912HJKASH9123
          </div>
        </div>
      </div>

      {showPixModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 shadow-2xl rounded-xl w-full max-w-sm p-6 space-y-4 text-center relative">
            <button onClick={() => setShowPixModal(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900">Gateway de Pagamento Integrado</h3>
              <p className="text-xs text-zinc-400">Efetue o escaneamento do código Pix Dinâmico abaixo.</p>
            </div>

            <div className="mx-auto h-40 w-40 bg-zinc-100 border border-zinc-200 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="grid grid-cols-4 gap-2 w-full h-full opacity-80 filter blur-[1px]">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`rounded ${i % 3 === 0 ? 'bg-zinc-900' : 'bg-transparent'} ${i % 5 === 0 ? 'bg-zinc-950' : ''}`} />
                ))}
              </div>
              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-2 text-center">
                <Percent className="text-zinc-900 animate-pulse mb-1" size={24} />
                <span className="text-[10px] font-mono font-bold text-zinc-800">MOCK_GATEWAY_QR_CODE</span>
              </div>
            </div>

            <div className="bg-zinc-50 p-2.5 rounded border border-zinc-100 text-left font-mono text-[10px] text-zinc-500 break-all select-all cursor-pointer">
              00020101021226830014br.gov.bcb.pix2561api.asaas.com/v3/qr/code/signature/saas_production_mvp_key_9990
            </div>

            <p className="text-[10px] text-zinc-400">Após a confirmação da liquidação no banco, o sistema renovará automaticamente o plano por mais 30 dias.</p>
          </div>
        </div>
      )}
    </div>
  );
}