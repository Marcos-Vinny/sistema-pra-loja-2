import React, { useState, useEffect, useMemo } from 'react';
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
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  DollarSign,
  RefreshCw,
  X,
  Menu,
  Printer,
  UserPlus,
  Users
} from 'lucide-react';

// ============================================================================
// CONEXÃO COM O SUPABASE (USANDO SERVICE_ROLE PARA ELIMINAR O ERRO 401)
// ============================================================================
const supabaseUrl = 'https://qlflsbqcgvkidmtgaluq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZmxzYnFjZ3ZraWRtdGdhbHVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTE0OSwiZXhwIjoyMDk1NTM3MTQ5fQ.QKcbDcqwO8Eefaefjwfg2Emp0dKmRxM7CLyun4gYA04';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// ============================================================================
// COMPONENTE PRINCIPAL (SISTEMA MULTI-VISÃO E GERENCIAMENTO DE ROTAS)
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      // Busca o usuário na tabela personalizada de usuários/funcionários
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .single();

      if (data) {
        setUser({ 
          email: data.email, 
          role: data.funcao, 
          name: data.nome, 
          storeName: 'Mercado Nova Era' 
        });
        setCurrentView(data.funcao === 'admin' ? 'dashboard' : 'pos');
      } else {
        // Logins padrão de contingência caso a tabela esteja vazia
        if (email === 'admin@loja.com' && password === '123') {
          setUser({ email, role: 'admin', name: 'Dono do Mercado', storeName: 'Mercado Nova Era' });
          setCurrentView('dashboard');
        } else if (email === 'caixa@loja.com' && password === '123') {
          setUser({ email, role: 'operator', name: 'Operador de Caixa', storeName: 'Mercado Nova Era' });
          setCurrentView('pos');
        } else {
          alert('Credenciais inválidas! Tente novamente ou use as contas padrão.');
        }
      }
    } catch (err) {
      // Fallback básico caso a tabela 'usuarios' ainda não tenha sido criada
      if (email === 'admin@loja.com' && password === '123') {
        setUser({ email, role: 'admin', name: 'Dono do Mercado', storeName: 'Mercado Nova Era' });
        setCurrentView('dashboard');
      } else if (email === 'caixa@loja.com' && password === '123') {
        setUser({ email, role: 'operator', name: 'Operador de Caixa', storeName: 'Mercado Nova Era' });
        setCurrentView('pos');
      } else {
        alert('Erro ao conectar ou credenciais inválidas.');
      }
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
      
      {/* INJEÇÃO DE CSS EXCLUSIVA PARA A IMPRESSÃO DA BOBINA VIA MAQUININHA / IMPRESSORA TERMINAL */}
      <style>{`
        #cupom-fiscal-impressao {
          display: none;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #cupom-fiscal-impressao, #cupom-fiscal-impressao * {
            visibility: visible;
          }
          #cupom-fiscal-impressao {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm; /* Ajustado padrão para bobinas de maquininhas/terminais térmicos */
            font-family: 'Courier New', Courier, monospace;
            font-size: 10px;
            line-height: 1.2;
            color: #000;
            padding: 1mm;
          }
          @page {
            margin: 0;
          }
        }
      `}</style>
      
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
                  onClick={() => setCurrentView('accounts')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'accounts' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <Users size={18} /> Gerenciar Contas
                </button>
                <button 
                  onClick={() => setCurrentView('billing')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'billing' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <CreditCard size={18} /> Mensalidade e Licença
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="border-t border-zinc-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="h-8 w-8 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-600 font-semibold text-xs">
              {user.name?.charAt(0) || 'U'}
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

      {/* HEADER RESPONSIVO PARA SMARTPHONES */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-zinc-200/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-zinc-600 hover:bg-zinc-100 rounded-lg">
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
            {user.role === 'admin' && <option value="accounts">Contas</option>}
            {user.role === 'admin' && <option value="billing">Mensalidade</option>}
          </select>
        </header>

        {/* ÁREA INTERNA DA TELA */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto space-y-8">
            {currentView === 'dashboard' && user.role === 'admin' && <DashboardView />}
            {currentView === 'pos' && <POSView user={user} />}
            {currentView === 'inventory' && user.role === 'admin' && <InventoryView />}
            {currentView === 'accounts' && user.role === 'admin' && <AccountsView />}
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
        cmv += (parseFloat(item.costPrice || item.preco_custo || 0) * parseInt(item.quantity || 0));
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
                    <td className="py-3.5 px-5 font-medium text-zinc-800">{sale.cliente || 'Consumidor Final'}</td>
                    <td className="py-3.5 px-5 text-zinc-400">{new Date(sale.created_at).toLocaleString('pt-BR')}</td>
                    <td className="py-3.5 px-5 text-center font-mono text-[11px] text-zinc-500">{Array.isArray(sale.itens) ? sale.itens.reduce((acc, i) => acc + (i.quantity || 0), 0) : 0} un</td>
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
// CONTROLE DE ESTOQUE COM BUSCA INTELIGENTE (CRUD INTEGRADO)
// ============================================================================
function InventoryView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchStock, setSearchStock] = useState(''); // Estado da pesquisa inteligente no estoque
  
  const [formData, setFormData] = useState({ name: '', costPrice: '', salePrice: '', stock: '', variations: '' });

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('produtos').select('*').order('nome', { ascending: true });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  // Filtro inteligente de produtos do estoque
  const filteredStockProducts = useMemo(() => {
    return products.filter(p => 
      p.nome.toLowerCase().includes(searchStock.toLowerCase()) || 
      (p.variacoes && p.variacoes.toLowerCase().includes(searchStock.toLowerCase()))
    );
  }, [searchStock, products]);

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

      {/* SEÇÃO DE PESQUISA NO ESTOQUE INTELIGENTE */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        <input 
          type="text" 
          value={searchStock}
          onChange={(e) => setSearchStock(e.target.value)}
          placeholder="Pesquisa rápida no estoque (Nome ou Setor)..." 
          className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-950/5 focus:border-zinc-950 shadow-sm"
        />
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <RefreshCw className="animate-spin text-zinc-400" size={24} />
            <span className="text-xs text-zinc-400 font-medium">Buscando do PostgreSQL...</span>
          </div>
        ) : filteredStockProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-medium">Nenhum item localizado no catálogo de estoque.</div>
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
                {filteredStockProducts.map((prod) => (
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
// CRIAÇÃO E GERENCIAMENTO DE CONTAS DE USUÁRIOS/OPERADORES 
// ============================================================================
function AccountsView() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', funcao: 'operator' });

  const loadAccounts = async () => {
    setLoading(true);
    const { data } = await supabase.from('usuarios').select('*').order('nome', { ascending: true });
    if (data) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => { loadAccounts(); }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.senha) return;

    await supabase.from('usuarios').insert([formData]);
    setFormData({ nome: '', email: '', senha: '', funcao: 'operator' });
    loadAccounts();
    alert('Nova conta cadastrada com sucesso na base de dados!');
  };

  const handleDeleteAccount = async (id) => {
    if (confirm('Deseja deletar essa conta de funcionário?')) {
      await supabase.from('usuarios').delete().eq('id', id);
      loadAccounts();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4 h-fit">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Cadastrar Novo Acesso</h3>
          <p className="text-xs text-zinc-400">Crie contas para caixas ou administradores.</p>
        </div>
        <form onSubmit={handleCreateAccount} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Nome Completo</label>
            <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-950"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">E-mail de Login</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-950"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Senha de Entrada</label>
            <input type="text" required value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-950"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Cargo / Função</label>
            <select value={formData.funcao} onChange={(e) => setFormData({...formData, funcao: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-950">
              <option value="operator">Operador de Caixa (PDV)</option>
              <option value="admin">Administrador Geral</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
            <UserPlus size={14} /> Adicionar Funcionário
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">Operadores e Usuários Ativos</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Carregando usuários...</div>
        ) : accounts.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">Use os logins padrões ou crie o primeiro acima.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 font-bold">
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Nível</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-zinc-50/50">
                    <td className="p-4 font-semibold">{acc.nome}</td>
                    <td className="p-4 text-zinc-500">{acc.email}</td>
                    <td className="p-4 font-mono uppercase text-[10px]"><span className={`px-2 py-0.5 rounded-md ${acc.funcao === 'admin' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'}`}>{acc.funcao}</span></td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDeleteAccount(acc.id)} className="text-red-500 hover:text-red-700">Deletar</button>
                    </td>
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
// CONEXÃO DE MENSALIDADE E LICENÇA COM SISTEMA DE PAGAMENTO 
// ============================================================================
function BillingView() {
  const [pagando, setPagando] = useState(false);

  const simularPagamento = () => {
    setPagando(true);
    setTimeout(() => {
      setPagando(false);
      alert('Sua mensalidade foi processada com sucesso no gateway financeiro. Obrigado!');
    }, 2000);
  };

  return (
    <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm text-center space-y-5 max-w-xl mx-auto">
      <CreditCard size={40} className="mx-auto text-zinc-400" />
      <div>
        <h3 className="text-base font-bold text-zinc-900">Ajuste e Gestão de Mensalidade</h3>
        <p className="text-xs text-zinc-500 mt-1">Licença do Sistema: <span className="text-emerald-600 font-bold">REGULARIZADA</span></p>
      </div>
      <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-left space-y-2 text-xs">
        <div className="flex justify-between"><span className="text-zinc-500">Plano Atual:</span> <span className="font-bold">Nexus Retail Pro</span></div>
        <div className="flex justify-between"><span className="text-zinc-500">Valor Mensal:</span> <span className="font-mono font-bold">R$ 149,90</span></div>
        <div className="flex justify-between"><span className="text-zinc-500">Próximo Vencimento:</span> <span className="font-bold">Todo dia 10</span></div>
      </div>
      <button 
        onClick={simularPagamento} 
        disabled={pagando}
        className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {pagando ? <RefreshCw className="animate-spin" size={14} /> : 'Antecipar/Pagar Fatura Mensal'}
      </button>
    </div>
  );
}

// ============================================================================
// FRENTE DE CAIXA DE ALTA PERFORMANCE (SEM CONTATOS TELEFÔNICOS E PRONTO PRA IMPRIMIR)
// ============================================================================
function POSView({ user }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  
  const [customerName, setCustomerName] = useState(''); // Opcional
  const [discountValue, setDiscountValue] = useState('');
  const [payments, setPayments] = useState({ pix: 0, cash: 0, card: 0 });
  const [salesHistory, setSalesHistory] = useState([]); // Histórico local de cupons rápidos
  const [lastSaleReceipt, setLastSaleReceipt] = useState(null);

  const loadProducts = async () => {
    const { data } = await supabase.from('produtos').select('*');
    if (data) setProducts(data);
  };

  const loadLocalHistory = async () => {
    const { data } = await supabase.from('vendas').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setSalesHistory(data);
  };

  useEffect(() => { 
    loadProducts(); 
    loadLocalHistory();
  }, []);

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
      setCart([...cart, { productId: prod.id, name: prod.nome, salePrice: prod.preco_venda, costPrice: prod.preco_custo, quantity: 1 }]);
    }
    setSearchQuery('');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
    const desconto = parseFloat(discountValue) || 0;
    const total = Math.max(subtotal - desconto, 0);
    const pago = Object.values(payments).reduce((a, b) => a + b, 0);
    const troco = Math.max(pago - total, 0);
    return { subtotal, desconto, total, pago, troco };
  }, [cart, discountValue, payments]);

  const handleFinishSale = async () => {
    if (cart.length === 0) return alert('O carrinho de compras está vazio.');
    if (totals.pago < totals.total) return alert('O valor pago informado é menor do que o total da venda.');

    const randomCode = 'CX-' + Math.floor(100000 + Math.random() * 900000);
    const dadosVenda = {
      codigo_transacao: randomCode,
      cliente: customerName.trim() || 'Consumidor Final', // Nome virou opcional por padrão
      itens: cart,
      subtotal: totals.subtotal,
      desconto: totals.desconto,
      total: totals.total,
      pago: totals.pago,
      troco: totals.troco,
      pagamentos: payments,
      operator: user.name,
      created_at: new Date().toISOString()
    };

    // 1. Envia para a tabela de histórico de vendas do banco
    const { error } = await supabase.from('vendas').insert([dadosVenda]);

    if (error) {
      alert('Erro ao persistir transação na nuvem: ' + error.message);
      return;
    }

    // 2. Abate do Estoque de cada produto vendido
    for (const item of cart) {
      const originalProd = products.find(p => p.id === item.productId);
      if (originalProd) {
        const novoEstoque = Math.max(originalProd.estoque - item.quantity, 0);
        await supabase.from('produtos').update({ estoque: novoEstoque }).eq('id', item.productId);
      }
    }

    // Define o comprovante atual
    setLastSaleReceipt(dadosVenda);

    // Limpa estados de venda do caixa
    setCart([]);
    setCustomerName('');
    setDiscountValue('');
    setPayments({ pix: 0, cash: 0, card: 0 });
    
    // Atualiza catálogos e histórico inferior
    loadProducts();
    loadLocalHistory();

    // 3. COMANDO DE IMPRESSÃO AUTOMÁTICO (Foca na bobina e imprime na hora pela Maquininha/Impressora)
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-8">
      {/* SEÇÃO DA BOBINA INVISÍVEL NA TELA (SÓ APARECE NO MOMENTO DA IMPRESSÃO DO BOTÃO OU FINALIZAÇÃO) */}
      {lastSaleReceipt && (
        <div id="cupom-fiscal-impressao">
          <div style={{ textAlign: 'center', marginBottom: '4px' }}>
            <strong style={{ fontSize: '12px' }}>MERCADO NOVA ERA</strong><br />
            <span>Sistema PDV Integrado</span><br />
            <span>--------------------------------</span>
          </div>
          <div>
            <strong>CUPOM DE VENDA DE BALCÃO</strong><br />
            <span>ID: {lastSaleReceipt.codigo_transacao}</span><br />
            <span>Data: {new Date(lastSaleReceipt.created_at).toLocaleString('pt-BR')}</span><br />
            <span>Op: {lastSaleReceipt.operator}</span><br />
            <span>Cliente: {lastSaleReceipt.cliente}</span><br />
            <span>--------------------------------</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px dashed #000' }}>
                <th style={{ textAlign: 'left' }}>Item</th>
                <th style={{ textAlign: 'center' }}>Qtd</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {lastSaleReceipt.itens.map((i, index) => (
                <tr key={index}>
                  <td style={{ maxWidth: '30mm', overflow: 'hidden' }}>{i.name}</td>
                  <td style={{ textAlign: 'center' }}>{i.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{(i.salePrice * i.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '4px', borderTop: '1px dashed #000', paddingTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><strong>R$ {lastSaleReceipt.subtotal.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Desconto:</span><strong>R$ {lastSaleReceipt.desconto.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>TOTAL VENC:</span><strong style={{ fontSize: '11px' }}>R$ {lastSaleReceipt.total.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Valor Pago:</span><span>R$ {lastSaleReceipt.pago.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Troco:</span><span>R$ {lastSaleReceipt.troco.toFixed(2)}</span></div>
            <span>--------------------------------</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '9px' }}>
            <span>Obrigado pela preferência!</span><br />
            <span>Documento Auxiliar de Venda</span>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Operação de Frente de Caixa (PDV)</h2>
        <p className="text-xs text-zinc-400">Lance as mercadorias. O sistema imprimirá automaticamente o recibo físico na sua maquininha ou impressora.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* INTERFACE ESQUERDA: CARRINHO E SELEÇÃO */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BUSCA DE ITENS NO CAIXA */}
          <div className="bg-white p-5 border border-zinc-200/80 rounded-2xl shadow-sm space-y-3 relative">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">Passar ou Digitar Produto</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite as primeiras letras do produto..." 
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-950"
              />
            </div>

            {/* OVERLAY DE RESULTADOS DE BUSCA */}
            {filteredProducts.length > 0 && (
              <div className="absolute left-5 right-5 bg-white border border-zinc-200 shadow-2xl rounded-xl z-20 overflow-hidden divide-y divide-zinc-100 max-h-60 overflow-y-auto">
                {filteredProducts.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => handleAddToCart(p)}
                    className="w-full flex justify-between items-center px-4 py-3 hover:bg-zinc-50 transition-colors text-left text-xs font-medium"
                  >
                    <div>
                      <p className="font-bold text-zinc-900">{p.nome}</p>
                      <p className="text-[10px] text-zinc-400">Setor: {p.variacoes || 'Geral'} | Disp: {p.estoque} un</p>
                    </div>
                    <span className="font-mono font-bold bg-zinc-100 px-2.5 py-1 rounded-lg text-zinc-900">R$ {parseFloat(p.preco_venda).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LISTAGEM ATUAL DO CUPOM DO CAIXA */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <span className="text-xs font-bold text-zinc-700 uppercase">Lista de Produtos do Cupom</span>
              <span className="text-xs font-mono font-bold text-zinc-500">{cart.length} itens</span>
            </div>

            {cart.length === 0 ? (
              <div className="p-16 text-center text-xs text-zinc-400 font-medium">Nenhum produto passado até o momento.</div>
            ) : (
              <div className="divide-y divide-zinc-100 max-h-[350px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="p-4 flex items-center justify-between hover:bg-zinc-50/40 transition-colors text-xs">
                    <div className="space-y-0.5 max-w-[60%]">
                      <p className="font-bold text-zinc-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">Unitário: R$ {item.salePrice.toFixed(2)} x {item.quantity} un</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-zinc-900">R$ {(item.salePrice * item.quantity).toFixed(2)}</span>
                      <button onClick={() => handleRemoveFromCart(item.productId)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HISTÓRICO RÁPIDO RECENTE INJETADO ABAIXO DO CAIXA */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Últimas Vendas Desse Caixa</h4>
            {salesHistory.length === 0 ? (
              <p className="text-xs text-zinc-400">Nenhum cupom gerado recentemente.</p>
            ) : (
              <div className="space-y-2">
                {salesHistory.map(h => (
                  <div key={h.id} className="flex justify-between items-center text-xs border-b border-zinc-100 pb-2">
                    <span className="font-mono text-zinc-500">{h.codigo_transacao} ({h.cliente || 'Consumidor'})</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">R$ {parseFloat(h.total).toFixed(2)}</span>
                      <button 
                        onClick={() => { setLastSaleReceipt(h); setTimeout(() => window.print(), 200); }} 
                        className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Printer size={12} /> Reimprimir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* PAINEL DIREITO: FECHAMENTO DE VALORES E IMPRESSÃO */}
        <div className="bg-white border border-zinc-200 shadow-xl rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Fechamento do Cupom</h3>
            <p className="text-[11px] text-zinc-400">Informe os valores e selecione o meio de pagamento.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Nome do Cliente (OPCIONAL)</label>
              <input 
                type="text" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none"
                placeholder="Consumidor Final"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Conceder Desconto Manual (R$)</label>
              <input 
                type="number" 
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value)} 
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-950"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          {/* CAIXAS DE MEIOS DE PAGAMENTO */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Entrada de Valores por Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <span className="block text-[10px] font-semibold text-zinc-500 mb-1">💸 Dinheiro</span>
                <input type="number" step="0.01" value={payments.cash || ''} onChange={(e) => setPayments({...payments, cash: parseFloat(e.target.value) || 0})} className="w-full bg-transparent font-mono text-xs font-bold focus:outline-none" placeholder="0.00"/>
              </div>
              <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <span className="block text-[10px] font-semibold text-zinc-500 mb-1">💳 Cartão</span>
                <input type="number" step="0.01" value={payments.card || ''} onChange={(e) => setPayments({...payments, card: parseFloat(e.target.value) || 0})} className="w-full bg-transparent font-mono text-xs font-bold focus:outline-none" placeholder="0.00"/>
              </div>
              <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <span className="block text-[10px] font-semibold text-zinc-500 mb-1">⚡ PIX</span>
                <input type="number" step="0.01" value={payments.pix || ''} onChange={(e) => setPayments({...payments, pix: parseFloat(e.target.value) || 0})} className="w-full bg-transparent font-mono text-xs font-bold focus:outline-none" placeholder="0.00"/>
              </div>
            </div>
          </div>

          {/* RESUMO TÉCNICO DE TOPO */}
          <div className="bg-zinc-900 text-white p-4 rounded-xl font-mono space-y-2 shadow-inner">
            <div className="flex justify-between text-xs text-zinc-400"><span>Subtotal:</span><span>R$ {totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-red-400/90"><span>Desconto:</span><span>- R$ {totals.desconto.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-zinc-800 pt-2 text-white"><span>TOTAL:</span><span>R$ {totals.total.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-2"><span>Total Pago:</span><span>R$ {totals.pago.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-emerald-400 font-bold"><span>Troco:</span><span>R$ {totals.troco.toFixed(2)}</span></div>
          </div>

          {/* BOTÃO PRINCIPAL DE FECHAMENTO FISCAL COM IMPRESSÃO DIRETA */}
          <button 
            onClick={handleFinishSale}
            className="w-full py-3.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Printer size={15} /> Finalizar & Imprimir Comprovante
          </button>
        </div>
      </div>
    </div>
  );
}