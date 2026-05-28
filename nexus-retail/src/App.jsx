import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
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
  Printer,
  ChevronRight,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';


// ============================================================================
// CONEXÃO DIRETA COM O SUPABASE
// ============================================================================
const supabaseUrl = "https://qlflsbqcgvkidmtgaluq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZmxzYnFjZ3ZraWRtdGdhbHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjExNDksImV4cCI6MjA5NTUzNzE0OX0.QzyD2kCZ4SDQzOgF565QMlbjB671DX7ZjneV9y61Liw";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// COMPONENTE PRINCIPAL (SISTEMA MULTI-VISÃO E GERENCIAMENTO DE ROTAS)
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (email, password) => {
    if (email === 'admin@loja.com' && password === '123') {
      setUser({ email, role: 'admin', name: 'Dono do Mercado', storeName: 'Mercado Nova Era' });
      setCurrentView('dashboard');
    } else if (email === 'caixa@loja.com' && password === '123') {
      setUser({ email, role: 'operator', name: 'Operador de Caixa', storeName: 'Mercado Nova Era' });
      setCurrentView('pos');
    } else {
      alert('Credenciais inválidas! Use as contas de testes prontas abaixo.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 font-sans antialiased text-zinc-900 overflow-hidden">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200/80 p-5 justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-black text-xl shadow-sm tracking-tight">
              N
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-zinc-900">{user.storeName}</h1>
              <p className="text-[11px] text-zinc-400 font-medium capitalize">{user.role === 'admin' ? 'Gestão Admin' : 'Frente de Caixa'}</p>
            </div>
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          <nav className="space-y-1">
            {user.role === 'admin' && (
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-zinc-950 text-white shadow-sm shadow-zinc-950/10' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
              >
                <LayoutDashboard size={18} /> Painel de Controle
              </button>
            )}
            <button 
              onClick={() => setCurrentView('pos')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'pos' ? (user.role !== 'admin' ? 'bg-zinc-950 text-white shadow-sm' : 'bg-zinc-100 text-zinc-900') : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <ShoppingBag size={18} /> Frente de Caixa (PDV)
            </button>
            {user.role === 'admin' && (
              <>
                <button 
                  onClick={() => setCurrentView('inventory')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'inventory' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <Package size={18} /> Estoque Inteligente
                </button>
                <button 
                  onClick={() => setCurrentView('billing')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'billing' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <CreditCard size={18} /> Assinatura e Licença
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="border-t border-zinc-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="h-8 w-8 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-600 font-semibold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-zinc-800 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/60 transition-colors"
          >
            <LogOut size={18} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* HEADER E SIDEBAR RESPONSIVO PARA SMARTPHONES */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-zinc-200/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="p-1 text-zinc-600 hover:bg-zinc-100 rounded-lg">
              <Menu size={20} />
            </button>
            <span className="font-bold text-sm tracking-tight">{user.storeName}</span>
          </div>
          <select 
            value={currentView} 
            onChange={(e) => setCurrentView(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold py-1.5 px-3 text-zinc-700 focus:outline-none"
          >
            {user.role === 'admin' && <option value="dashboard">Painel</option>}
            <option value="pos">PDV (Caixa)</option>
            {user.role === 'admin' && <option value="inventory">Estoque</option>}
            {user.role === 'admin' && <option value="billing">Assinatura</option>}
          </select>
        </header>

        {/* ÁREA INTERNA DA TELA */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto space-y-8">
            {currentView === 'dashboard' && user.role === 'admin' && <DashboardView />}
            {currentView === 'pos' && <POSView user={user} />}
            {currentView === 'inventory' && user.role === 'admin' && <InventoryView />}
            {currentView === 'billing' && user.role === 'admin' && <BillingView />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TELA DE LOGIN ESTILIZADA
// ============================================================================
function LoginView({ onLogin }) {
  const [email, setEmail] = useState('admin@loja.com');
  const [password, setPassword] = useState('123');

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-black text-2xl shadow-sm">N</div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Acesse sua plataforma</h2>
          <p className="text-xs text-zinc-400">Insira suas credenciais corporativas para acessar o ERP.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">E-mail Corporativo</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950/5 focus:border-zinc-950 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Senha de Acesso</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950/5 focus:border-zinc-950 transition-all"/>
          </div>
          <button type="submit" className="w-full py-3 bg-zinc-950 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm mt-2">Entrar no Painel</button>
        </form>

        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-2 text-xs text-zinc-500">
          <p className="font-bold text-zinc-700">Acessos Rápidos para Testes:</p>
          <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-zinc-200/60">
            <span>👑 Dono (Admin):</span>
            <button type="button" onClick={() => { setEmail('admin@loja.com'); setPassword('123'); }} className="text-zinc-950 font-bold hover:underline">Carregar</button>
          </div>
          <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-zinc-200/60">
            <span>💼 Caixa (Operador):</span>
            <button type="button" onClick={() => { setEmail('caixa@loja.com'); setPassword('123'); }} className="text-zinc-950 font-bold hover:underline">Carregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DASHBOARD ROBUSTO (MÉTRICAS E HISTÓRICO REAL NA NUVEM)
// ============================================================================
function DashboardView() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    const { data: sData } = await supabase.from('vendas').select('*').order('created_at', { ascending: false });
    const { data: pData } = await supabase.from('produtos').select('*');
    if (sData) setSales(sData);
    if (pData) setProducts(pData);
    setLoading(false);
  };

  useEffect(() => { loadDashboardData(); }, []);

  const metrics = useMemo(() => {
    let faturamento = 0;
    let cmv = 0;
    sales.forEach(sale => {
      faturamento += parseFloat(sale.total || 0);
      const items = Array.isArray(sale.itens) ? sale.itens : [];
      items.forEach(item => {
        cmv += (parseFloat(item.costPrice || 0) * parseInt(item.quantity || 0));
      });
    });

    const lucro = faturamento - cmv;
    const margemLucro = faturamento > 0 ? (lucro / faturamento) * 100 : 0;
    const ticketMedio = sales.length > 0 ? faturamento / sales.length : 0;

    const estoqueBaixo = products.filter(p => p.estoque <= 5).length;

    return { faturamento, cmv, lucro, margemLucro, ticketMedio, totalVendas: sales.length, estoqueBaixo };
  }, [sales, products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="animate-spin text-zinc-400" size={32} />
        <p className="text-xs text-zinc-500 font-medium">Sincronizando com o banco de dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Painel de Controle Executivo</h2>
          <p className="text-xs text-zinc-400">Análise de rentabilidade e movimentações financeiras em tempo real na nuvem.</p>
        </div>
        <button onClick={loadDashboardData} className="self-start flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-all">
          <RefreshCw size={14} /> Atualizar Relatórios
        </button>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Bruto</span>
            <DollarSign size={16} />
          </div>
          <p className="text-2xl font-bold text-zinc-900 font-mono">R$ {metrics.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="text-[11px] text-zinc-400">Total de <span className="font-bold text-zinc-700">{metrics.totalVendas}</span> cupons emitidos</div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Custo de Mercadoria (CMV)</span>
            <Layers size={16} />
          </div>
          <p className="text-2xl font-bold text-zinc-700 font-mono">R$ {metrics.cmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="text-[11px] text-zinc-400">Investimento real em estoque vendido</div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm space-y-3 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Real</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-mono">R$ {metrics.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="text-[11px] text-emerald-600 font-medium">Margem líquida de {metrics.margemLucro.toFixed(1)}%</div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Ticket Médio por Cliente</span>
            <ShoppingCart size={16} />
          </div>
          <p className="text-2xl font-bold text-zinc-900 font-mono">R$ {metrics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="text-[11px] text-zinc-400">Média gasta por transação comercial</div>
        </div>
      </div>

      {/* ESTOQUE CRÍTICO */}
      {metrics.estoqueBaixo > 0 && (
        <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Atenção: Alerta de Estoque Crítico</h4>
            <p className="text-[11px] text-amber-700/90 mt-0.5">Existem {metrics.estoqueBaixo} produtos com menos de 5 unidades na prateleira. Acesse o controle de estoque para repor.</p>
          </div>
        </div>
      )}

      {/* HISTÓRICO DE EMISSÃO DE CUPONS DE VENDA */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Últimos Cupons Emitidos (Tempo Real)</h3>
            <p className="text-[11px] text-zinc-400">Registro histórico de todas as transações computadas nos PDVs.</p>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400 font-medium">Nenhuma venda efetuada no banco de dados até o momento.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-zinc-200/60 text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-5">ID Transação</th>
                  <th className="py-3.5 px-5">Cliente</th>
                  <th className="py-3.5 px-5">Data/Hora</th>
                  <th className="py-3.5 px-5 text-center">Itens</th>
                  <th className="py-3.5 px-5 text-right">Faturamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-zinc-900">{sale.codigo_transacao}</td>
                    <td className="py-3.5 px-5 font-medium text-zinc-800">{sale.cliente}</td>
                    <td className="py-3.5 px-5 text-zinc-400">{new Date(sale.created_at).toLocaleString('pt-BR')}</td>
                    <td className="py-3.5 px-5 text-center font-mono text-[11px] text-zinc-500">{Array.isArray(sale.itens) ? sale.itens.reduce((acc, i) => acc + i.quantity, 0) : 0} un</td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-zinc-900">R$ {parseFloat(sale.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CONTROLE DE ESTOQUE COMPLETO (CRUD TOTALMENTE CONECTADO NA NUVEM)
// ============================================================================
function InventoryView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', costPrice: '', salePrice: '', stock: '', variations: '' });

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('produtos').select('*').order('nome', { ascending: true });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      nome: formData.name,
      preco_custo: parseFloat(formData.costPrice) || 0,
      preco_venda: parseFloat(formData.salePrice) || 0,
      estoque: parseInt(formData.stock) || 0,
      variacoes: formData.variations
    };

    if (editingProduct) {
      await supabase.from('produtos').update(payload).eq('id', editingProduct.id);
    } else {
      await supabase.from('produtos').insert([payload]);
    }

    setIsModalOpen(false);
    loadProducts();
  };

  const handleDeleteProduct = async (id, nome) => {
    if (confirm(`Deseja remover permanentemente o produto "${nome}" do banco de dados na nuvem?`)) {
      await supabase.from('produtos').delete().eq('id', id);
      loadProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Almoxarifado e Catálogo Geral</h2>
          <p className="text-xs text-zinc-400">Qualquer produto inserido ou alterado aqui sincroniza instantaneamente nos caixas abertos.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ name: '', costPrice: '', salePrice: '', stock: '', variations: '' }); setIsModalOpen(true); }} 
          className="self-start bg-zinc-950 text-white flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-zinc-800 shadow-sm transition-all"
        >
          <Plus size={15} /> Cadastrar Novo Item
        </button>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <RefreshCw className="animate-spin text-zinc-400" size={24} />
            <span className="text-xs text-zinc-400 font-medium">Buscando do PostgreSQL...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-medium">Nenhum item em catálogo. Clique no botão acima para cadastrar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-zinc-200/60 text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-5">Descrição do Produto</th>
                  <th className="py-3.5 px-5">Categoria/Setor</th>
                  <th className="py-3.5 px-5 text-right">Preço de Custo</th>
                  <th className="py-3.5 px-5 text-right">Preço de Venda</th>
                  <th className="py-3.5 px-5 text-center">Nível de Estoque</th>
                  <th className="py-3.5 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-zinc-900">{prod.nome}</td>
                    <td className="py-3.5 px-5 font-medium text-zinc-400">{prod.variacoes || 'Geral'}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-zinc-400">R$ {parseFloat(prod.preco_custo).toFixed(2)}</td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-zinc-900">R$ {parseFloat(prod.preco_venda).toFixed(2)}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${prod.estoque <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-zinc-100 text-zinc-700'}`}>
                        {prod.estoque} un
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => { setEditingProduct(prod); setFormData({ name: prod.nome, costPrice: prod.preco_custo, salePrice: prod.preco_venda, stock: prod.estoque, variations: prod.variacoes }); setIsModalOpen(true); }} 
                          className="text-zinc-900 font-bold hover:underline"
                        >
                          Editar
                        </button>
                        <button onClick={() => handleDeleteProduct(prod.id, prod.nome)} className="text-red-500 hover:text-red-700 transition-colors p-1">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
              <X size={18} />
            </button>
            
            <div>
              <h3 className="text-base font-bold text-zinc-900">{editingProduct ? 'Modificar Ficha de Produto' : 'Cadastrar Produto Comercial'}</h3>
              <p className="text-xs text-zinc-400">Preencha os valores tributários e físicos para a venda.</p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Identificação / Nome do Produto</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-950" placeholder="Ex: Detergente Líquido Neutro 500ml"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Preço de Custo (R$)</label>
                  <input type="number" step="0.01" required value={formData.costPrice} onChange={(e) => setFormData({...formData, costPrice: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-950"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Preço de Venda (R$)</label>
                  <input type="number" step="0.01" required value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-950"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Estoque Inicial</label>
                  <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-950"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Setor de Gôndola / Categoria</label>
                <input type="text" value={formData.variations} onChange={(e) => setFormData({...formData, variations: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-950" placeholder="Ex: Limpeza / Corredor 4"/>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 shadow-sm shadow-zinc-950/10">Gravar na Nuvem</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FRENTE DE CAIXA DE ALTA PERFORMANCE (SINCRO COM O POSTGRESQL E BAIXA NO ESTOQUE)
// ============================================================================
function POSView({ user }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  
  const [customerName, setCustomerName] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [payments, setPayments] = useState({ pix: 0, cash: 0, card: 0 });
  const [activeReceipt, setActiveReceipt] = useState(null);

  const loadProducts = async () => {
    const { data } = await supabase.from('produtos').select('*');
    if (data) setProducts(data);
  };

  useEffect(() => { loadProducts(); }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => p.nome.toLowerCase().includes(searchQuery.toLowerCase()) && p.estoque > 0);
  }, [searchQuery, products]);

  const handleAddToCart = (prod) => {
    const existing = cart.find(item => item.productId === prod.id);
    if (existing) {
      if (existing.quantity >= prod.estoque) {
        alert(`Impossível adicionar. O estoque total deste produto na nuvem é de apenas ${prod.estoque} unidades.`);
        return;
      }
      setCart(cart.map(item => item.productId === prod.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { 
        productId: prod.id, 
        name: prod.nome, 
        salePrice: parseFloat(prod.preco_venda), 
        costPrice: parseFloat(prod.preco_custo), 
        quantity: 1 
      }]);
    }
    setSearchQuery('');
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(i => i.productId !== productId));
      return;
    }
    const dbProd = products.find(p => p.id === productId);
    if (dbProd && newQty > dbProd.estoque) {
      alert(`Quantidade indisponível. Estoque máximo na nuvem: ${dbProd.estoque} un.`);
      return;
    }
    setCart(cart.map(i => i.productId === productId ? { ...i, quantity: newQty } : i));
  };

  // CÁLCULOS TOTAIS DO OPERACIONAL
  const subtotal = cart.reduce((acc, c) => acc + (c.salePrice * c.quantity), 0);
  const discount = parseFloat(discountValue) || 0;
  const totalDue = Math.max(0, subtotal - discount);
  const totalPaid = (parseFloat(payments.pix) || 0) + (parseFloat(payments.cash) || 0) + (parseFloat(payments.card) || 0);
  const changeDue = Math.max(0, totalPaid - totalDue);

  const handleFinalizeSale = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Operação Recusada: O carrinho está completamente vazio.');
    if (totalPaid < totalDue) return alert('Erro de Caixa: O montante pago informado é inferior ao total do cupom fiscal.');

    const transactionCode = `CUP-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Inserir a venda no Supabase
    const { error: saleError } = await supabase.from('vendas').insert([{
      codigo_transacao: transactionCode,
      cliente: customerName.trim() || 'Consumidor Final',
      subtotal,
      desconto: discount,
      total: totalDue,
      pagamento_pix: parseFloat(payments.pix) || 0,
      pagamento_dinheiro: parseFloat(payments.cash) || 0,
      pagamento_cartao: parseFloat(payments.card) || 0,
      troco: changeDue,
      itens: cart
    }]);

    if (saleError) {
      alert('Erro crítico ao salvar transação na nuvem. Verifique a rede.');
      return;
    }

    // 2. Dar baixa automatizada linha por linha de cada produto no estoque
    for (const item of cart) {
      const dbProduct = products.find(p => p.id === item.productId);
      if (dbProduct) {
        const stockCalculated = Math.max(0, dbProduct.estoque - item.quantity);
        await supabase.from('produtos').update({ estoque: stockCalculated }).eq('id', item.productId);
      }
    }

    // 3. Montar o Cupom e Limpar Estados
    setActiveReceipt({
      id: transactionCode,
      date: new Date(),
      customer: customerName.trim() || 'Consumidor Final',
      items: cart,
      subtotal,
      discount,
      total: totalDue,
      paid: totalPaid,
      change: changeDue,
      operator: user.name
    });

    setCart([]);
    setCustomerName('');
    setDiscountValue('');
    setPayments({ pix: 0, cash: 0, card: 0 });
    loadProducts(); // Recarrega os dados físicos atualizados de estoque
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* SELETOR E PESQUISA DE ITENS */}
      <div className="lg:col-span-7 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Módulo Frente de Caixa (PDV)</h2>
          <p className="text-xs text-zinc-400">Pesquise por nome de produto para lançar no cupom de checkout.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200/80 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:border-zinc-900 transition-all" 
            placeholder="Digite o nome da mercadoria..."
          />
          
          {searchQuery && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-zinc-200/80 rounded-2xl shadow-2xl z-10 divide-y divide-zinc-100 max-h-64 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <p className="p-4 text-center text-xs text-zinc-400 font-medium">Nenhum produto correspondente em estoque na nuvem.</p>
              ) : (
                filteredProducts.map((p) => (
                  <button 
                    key={p.id} 
                    type="button" 
                    onClick={() => handleAddToCart(p)} 
                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex justify-between items-center text-xs group transition-colors"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 group-hover:text-zinc-950">{p.nome}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">{p.variacoes || 'Geral'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-zinc-900 font-mono">R$ {parseFloat(p.preco_venda).toFixed(2)}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">Qtd em Loja: <span className="font-bold text-zinc-700">{p.estoque} un</span></p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* FEED INFORMATIVO DO CAIXA */}
        <div className="bg-zinc-100 border border-zinc-200/40 p-4 rounded-2xl text-[11px] text-zinc-500 font-medium">
          ⚙️ Terminal de Atendimento Conectado à API Geral. Modificações de estoque são compartilhadas entre múltiplos caixas abertos.
        </div>
      </div>

      {/* CESTO DE COMPRAS E CONCLUSÃO DA VENDA */}
      <form onSubmit={handleFinalizeSale} className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
          <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingCart size={14} /> Cupom Atual
          </span>
          <button type="button" onClick={() => setCart([])} className="text-xs font-bold text-red-500 hover:underline">Zerar</button>
        </div>

        {/* ITENS LANÇADOS NO CAIXA */}
        <div className="p-4 divide-y divide-zinc-100 overflow-y-auto max-h-60 min-h-[140px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 text-xs py-8 font-medium">
              Caixa aguardando lançamento de mercadorias...
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="py-2.5 flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-zinc-900">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-mono font-medium">R$ {item.salePrice.toFixed(2)} /un</span>
                    <div className="flex items-center border border-zinc-200 rounded bg-white overflow-hidden scale-90 origin-left">
                      <button type="button" onClick={() => handleUpdateQty(item.productId, item.quantity - 1)} className="px-1.5 py-px bg-zinc-50 hover:bg-zinc-100 font-bold border-r border-zinc-200">-</button>
                      <span className="px-2 font-mono text-[10px] font-bold text-zinc-700">{item.quantity}</span>
                      <button type="button" onClick={() => handleUpdateQty(item.productId, item.quantity + 1)} className="px-1.5 py-px bg-zinc-50 hover:bg-zinc-100 font-bold border-l border-zinc-200">+</button>
                    </div>
                  </div>
                </div>
                <span className="font-mono font-bold text-zinc-900">R$ {(item.salePrice * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {/* INPUTS DE CLIENTE E DESCONTO */}
        <div className="p-4 bg-zinc-50/70 border-t border-zinc-200 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Cliente Vinculado</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium focus:outline-none focus:border-zinc-500" placeholder="Consumidor Final"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Abatimento / Desconto (R$)</label>
              <input type="number" step="0.01" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono font-bold text-red-600 focus:outline-none focus:border-zinc-500" placeholder="0.00"/>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 font-bold text-zinc-700 text-xs border-t border-dashed border-zinc-200">
            <span>VALOR LÍQUIDO DO PROCESSO:</span>
            <span className="text-zinc-950 font-black text-lg font-mono">R$ {totalDue.toFixed(2)}</span>
          </div>
        </div>

        {/* SISTEMA DE DISCRIMINAÇÃO FINANCEIRA POR FORMA DE PAGAMENTO */}
        <div className="p-4 border-t border-zinc-200/80 space-y-2.5 text-xs bg-white">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Discriminar Recebimento de Caixas</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-50 p-1.5 rounded-xl border border-zinc-200/60">
              <span className="block text-[9px] font-bold text-zinc-400 mb-1">⚡ PIX</span>
              <input type="number" step="0.01" value={payments.pix || ''} onChange={(e) => setPayments({...payments, pix: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-md font-mono text-xs font-bold p-1 text-zinc-800"/>
            </div>
            <div className="bg-zinc-50 p-1.5 rounded-xl border border-zinc-200/60">
              <span className="block text-[9px] font-bold text-zinc-400 mb-1">💵 DINHEIRO</span>
              <input type="number" step="0.01" value={payments.cash || ''} onChange={(e) => setPayments({...payments, cash: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-md font-mono text-xs font-bold p-1 text-zinc-800"/>
            </div>
            <div className="bg-zinc-50 p-1.5 rounded-xl border border-zinc-200/60">
              <span className="block text-[9px] font-bold text-zinc-400 mb-1">💳 CARTÃO</span>
              <input type="number" step="0.01" value={payments.card || ''} onChange={(e) => setPayments({...payments, card: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-md font-mono text-xs font-bold p-1 text-zinc-800"/>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-bold pt-1.5">
            <span className="text-zinc-400">Total Pago: R$ {totalPaid.toFixed(2)}</span>
            {changeDue > 0 && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-mono border border-emerald-100">Troco: R$ {changeDue.toFixed(2)}</span>}
          </div>
        </div>

        <button type="submit" className="w-full py-3.5 bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors uppercase tracking-widest">
          Autenticar Cupom na Nuvem
        </button>
      </form>

      {/* IMPRESSÃO DO RECIBO / MODAL DE SUCESSO */}
      {activeReceipt && <ReceiptModal receipt={activeReceipt} onClose={() => setActiveReceipt(null)} />}
    </div>
  );
}

// ============================================================================
// MODAL DE CUPOM TÉRMICO IDENTADO (PADRÃO FISCAL COM COMANDO DE IMPRESSÃO)
// ============================================================================
function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 w-full max-w-xs p-5 rounded-2xl shadow-2xl relative space-y-4 font-mono text-[11px] text-zinc-800 animate-in fade-in zoom-in-95 duration-100">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 p-1 hover:bg-zinc-50 rounded-lg print:hidden">
          <X size={16} />
        </button>

        <div className="text-center border-b border-dashed border-zinc-300 pb-3 space-y-1">
          <h3 className="font-black text-xs text-zinc-900 tracking-tight uppercase">MERCADO NOVA ERA LTDA</h3>
          <p className="text-[9px] text-zinc-400 uppercase">SaaS Cloud Retail ERP Platform</p>
          <span className="bg-zinc-950 text-white px-2 py-0.5 rounded font-bold text-[9px] tracking-wider mt-1.5 inline-block">{receipt.id}</span>
        </div>

        <div className="space-y-0.5 text-[10px] text-zinc-500">
          <p>Operador: {receipt.operator}</p>
          <p>Cliente: {receipt.customer}</p>
          <p>Data: {new Date(receipt.date).toLocaleString('pt-BR')}</p>
        </div>

        <div className="border-t border-b border-dashed border-zinc-300 py-2 space-y-1.5">
          {receipt.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <span className="max-w-[180px] truncate">{item.quantity}x {item.name}</span>
              <span className="font-bold text-zinc-900">R$ {(item.salePrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-right border-b border-dashed border-zinc-300 pb-2">
          <div className="text-[10px] text-zinc-400">Subtotal: R$ {receipt.subtotal.toFixed(2)}</div>
          {receipt.discount > 0 && <div className="text-[10px] text-red-500">Abatimento: -R$ {receipt.discount.toFixed(2)}</div>}
          <div className="font-black text-sm text-zinc-900 mt-0.5">TOTAL COMPUTA: R$ {receipt.total.toFixed(2)}</div>
        </div>

        <div className="text-[10px] text-zinc-400 space-y-0.5">
          <p>Meios de Pagamento Computados:</p>
          <div className="flex justify-between text-zinc-500 font-medium">
            <span>Dinheiro/Valores Físicos:</span>
            <span>R$ {receipt.paid.toFixed(2)}</span>
          </div>
          {receipt.change > 0 && (
            <div className="flex justify-between text-zinc-800 font-bold">
              <span>Troco Devolvido:</span>
              <span>R$ {receipt.change.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="text-center text-[9px] text-zinc-400/90 pt-1 border-t border-dashed border-zinc-200">
          Obrigado pela preferência!<br />Volte Sempre.
        </div>

        <button 
          onClick={() => window.print()} 
          className="w-full py-2.5 bg-zinc-100 rounded-xl font-sans font-bold text-xs text-zinc-700 hover:bg-zinc-200 flex items-center justify-center gap-2 transition-all print:hidden shadow-sm"
        >
          <Printer size={15}/> Imprimir Cupom Térmico
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// PAINEL DE COBRANÇA E ASSINATURA SAAS
// ============================================================================
function BillingView() {
  return (
    <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-5">
      <div>
        <h3 className="text-base font-bold text-zinc-900">Gerenciamento de Licença e Servidores</h3>
        <p className="text-xs text-zinc-400">Dados técnicos sobre o provisionamento do ecossistema do cliente.</p>
      </div>
      
      <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-3 font-mono text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-emerald-600">CONEXÃO DO PROVEDOR ATIVA (SOCIUS-DB)</span>
        </div>
        <p>Motor de Nuvem: <span className="font-bold text-zinc-800">Supabase REST v1 Client</span></p>
        <p>Hospedagem Regional: <span className="font-bold text-zinc-800">AWS sa-east-1 (São Paulo)</span></p>
        <p>Tipo de Assinatura: <span className="font-bold text-zinc-800">Plano Lite Corporativo</span></p>
      </div>
    </div>
  );
}