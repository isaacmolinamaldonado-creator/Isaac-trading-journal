import React, { useState, useMemo } from 'react';
import { Download, Plus, TrendingUp, DollarSign, Percent, BarChart3, Trash2, ExternalLink, Image, Edit2, Eye, Filter, X, AlertCircle, CheckCircle, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

export default function TradingJournalV41() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  // Cargar todos los trades desde Supabase
useEffect(() => {
  loadAllTrades();
}, []);

const loadAllTrades = async () => {
  try {
    setLoading(true);
    
    const { data: tradesData, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    if (tradesData && tradesData.length > 0) {
      setTrades(tradesData);
    }
  } catch (error) {
    console.error('Error cargando trades:', error);
  } finally {
    setLoading(false);
  }
};

// Guardar trade en Supabase
const saveTrade = async (trade) => {
  console.log('🔵 saveTrade llamado con:', trade);
  try {
    const tradeData = {
      fecha: trade.fecha || '',
      ticker: trade.ticker || '',
      direccion: trade.direccion || '',
      estrategia: trade.estrategia || '',
      precio_entrada_1: parseFloat(trade.precioEntrada1) || null,
      precio_entrada_2: parseFloat(trade.precioEntrada2) || null,
      precio_entrada_3: parseFloat(trade.precioEntrada3) || null,
      cantidad_entrada_1: parseFloat(trade.cantidadEntrada1) || null,
      cantidad_entrada_2: parseFloat(trade.cantidadEntrada2) || null,
      cantidad_entrada_3: parseFloat(trade.cantidadEntrada3) || null,
      precio_salida_1: parseFloat(trade.precioSalida1) || null,
      precio_salida_2: parseFloat(trade.precioSalida2) || null,
      precio_salida_3: parseFloat(trade.precioSalida3) || null,
      cantidad_salida_1: parseFloat(trade.cantidadSalida1) || null,
      cantidad_salida_2: parseFloat(trade.cantidadSalida2) || null,
      cantidad_salida_3: parseFloat(trade.cantidadSalida3) || null,
      resultado: parseFloat(trade.resultado) || null,
      porcentaje_ganancia: parseFloat(trade.porcentajeGanancia) || null,
      drawdown_max: parseFloat(trade.drawdownMax) || null,
      comisiones: parseFloat(trade.comisiones) || null,
      rr_ratio: parseFloat(trade.rrRatio) || null,
      duracion_minutos: parseInt(trade.duracionMinutos) || null,
      motivo_entrada: trade.motivoEntrada || '',
      confluencias: trade.confluencias || {},
      critirea: trade.critirea || false,
      red_flags: trade.redFlags || '',
      tags: trade.tags || [],
      hora_entrada: trade.horaEntrada || '',
      volumen: trade.volumen || '',
      screenshot: trade.screenshot || '',
      link_tradingview: trade.linkTradingView || '',
      notas: trade.notas || '',
      emociones: trade.emociones || '',
      errores: trade.errores || '',
      confluencias_cumplidas: parseInt(trade.confluenciasCumplidas) || null,
      total_confluencias: parseInt(trade.totalConfluencias) || null,
      timestamp: parseInt(trade.timestamp) || Date.now()
    };

    if (trade.id && typeof trade.id === 'string' && trade.id.length > 20) {
      const { error } = await supabase
        .from('trades')
        .update(tradeData)
        .eq('id', trade.id);
      
      if (error) throw error;
      console.log('✅ Trade actualizado en Supabase');
    } else {
      const { data, error } = await supabase
        .from('trades')
        .insert([tradeData])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        setTrades(trades.map(t => 
          t.timestamp === trade.timestamp ? {...trade, id: data[0].id} : t
        ));
        console.log('✅ Trade guardado en Supabase con ID:', data[0].id);
      }
    }
  } catch (error) {
    console.error('❌ Error guardando trade:', error);
    alert('Error al guardar trade: ' + error.message);
  }
};
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingTrade, setViewingTrade] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    estrategia: 'todas',
    direccion: 'todas',
    resultado: 'todos',
    fechaDesde: '',
    fechaHasta: ''
  });

  const [currentTrade, setCurrentTrade] = useState({
    fecha: '',
    ticker: '',
    direccion: 'SHORT',
    estrategia: 'El Águila',
    precioEntrada1: '',
    precioEntrada2: '',
    precioEntrada3: '',
    cantidadEntrada1: '',
    cantidadEntrada2: '',
    cantidadEntrada3: '',
    precioSalida1: '',
    precioSalida2: '',
    precioSalida3: '',
    cantidadSalida1: '',
    cantidadSalida2: '',
    cantidadSalida3: '',
    resultado: '',
    porcentajeGanancia: '',
    drawdownMax: '',
    comisiones: '',
    rrRatio: '',
    duracionMinutos: '',
    motivoEntrada: '',
    confluencias: {},
    critirea: false,
    redFlags: '',
    tags: [],
    horaEntrada: '',
    volumen: '',
    screenshot: '',
    linkTradingView: '',
    notas: '',
    emociones: '',
    errores: ''
  });

  const tagsPredefinidos = [
    'pump&dump', 'biotech', 'FDA', 'earnings', 'gap-up', 'gap-down',
    'high-volume', 'low-float', 'catalyst', 'technical', 'fomo',
    'mistake', 'perfect-setup', 'news', 'partnership', 'offering',
    'squeeze', 'halted', 'premarket-runner', 'afterhours'
  ];

  // Estrategias que USAN CRITIREA
  const estrategiasConCritirea = [
    'Falling Wedge',
    'Bullish Pennant', 
    'Support & Resistance',
    "Tiger's Candle",
    'Breakout Re-Test'
  ];

  const confluenciasPorEstrategia = {
    'El Águila': [
      { id: 'aguila_1', label: '✅ Arriba de máximos pre-market', key: 'aguila_1' },
      { id: 'aguila_2', label: '✅ Subida >30% en el día', key: 'aguila_2' },
      { id: 'aguila_3', label: '✅ Espacio para caer >25%', key: 'aguila_3' },
      { id: 'aguila_4', label: '✅ Market Cap <3B', key: 'aguila_4' },
      { id: 'aguila_5', label: '✅ No >10% arriba de VWAP', key: 'aguila_5' },
      { id: 'aguila_6', label: '✅ Volumen <100M', key: 'aguila_6' }
    ],
    'El Seguro': [
      { id: 'seguro_1', label: '✅ Vela cerró bajo VWAP con fuerza', key: 'seguro_1' },
      { id: 'seguro_2', label: '✅ Top 5 gainers del día', key: 'seguro_2' },
      { id: 'seguro_3', label: '✅ Espacio para caer >20%', key: 'seguro_3' },
      { id: 'seguro_4', label: '✅ Cuerpo de vela grande (cierre fuerte)', key: 'seguro_4' }
    ],
    'Falling Wedge': [
      { id: 'fw_1', label: '✅ C.1 DEMAND ZONE', key: 'fw_1' },
      { id: 'fw_2', label: '✅ C.2 STRONG BOTTOM WICKS', key: 'fw_2' },
      { id: 'fw_3', label: '✅ C.3 SUPPORT/PSYCHOLOGICAL SUPPORT', key: 'fw_3' },
      { id: 'fw_4', label: '✅ C.4 LOW VOLUME PULLBACK', key: 'fw_4' }
    ],
    'Bullish Pennant': [
      { id: 'bp_1', label: '✅ C.1 DEMAND ZONE', key: 'bp_1' },
      { id: 'bp_2', label: '✅ C.2 STRONG BOTTOM WICKS', key: 'bp_2' },
      { id: 'bp_3', label: '✅ C.3 SUPPORT/PSYCHOLOGICAL SUPPORT', key: 'bp_3' },
      { id: 'bp_4', label: '✅ C.4 LOW VOLUME PULLBACK', key: 'bp_4' }
    ],
    'Support & Resistance': [
      { id: 'sr_1', label: '✅ Tendencia identificada claramente', key: 'sr_1' },
      { id: 'sr_2', label: '✅ Zona de S/R bien definida', key: 'sr_2' },
      { id: 'sr_3', label: '✅ Precio tocó/llegó a la zona', key: 'sr_3' }
    ],
    "Tiger's Candle": [
      { id: 'tiger_1', label: '✅ Vela anterior identificada (5min)', key: 'tiger_1' },
      { id: 'tiger_2', label: '✅ HIGH marcado correctamente', key: 'tiger_2' },
      { id: 'tiger_3', label: '✅ LOW no fue roto antes del HIGH', key: 'tiger_3' },
      { id: 'tiger_4', label: '✅ Arriba de VWAP (ideal)', key: 'tiger_4' }
    ],
    'Breakout Re-Test': [
      { id: 'brt_1', label: '✅ Vela con volumen rompe resistencia', key: 'brt_1' },
      { id: 'brt_2', label: '✅ Vela cierra ARRIBA de resistencia', key: 'brt_2' },
      { id: 'brt_3', label: '✅ Precio retesta la resistencia rota', key: 'brt_3' },
      { id: 'brt_4', label: '✅ Confirmación de rebote en retest', key: 'brt_4' }
    ]
  };

  const calcularEstadisticas = () => {
    if (tradesFiltrados.length === 0) return null;
    
    const tradesGanadores = tradesFiltrados.filter(t => parseFloat(t.resultado) > 0);
    const tradesPerdedores = tradesFiltrados.filter(t => parseFloat(t.resultado) < 0);
    const winRate = (tradesGanadores.length / tradesFiltrados.length * 100).toFixed(1);
    const totalProfit = tradesFiltrados.reduce((acc, t) => acc + parseFloat(t.resultado || 0), 0);
    const avgWin = tradesGanadores.length > 0 
      ? (tradesGanadores.reduce((acc, t) => acc + parseFloat(t.resultado), 0) / tradesGanadores.length).toFixed(2)
      : 0;
    const avgLoss = tradesPerdedores.length > 0
      ? (tradesPerdedores.reduce((acc, t) => acc + parseFloat(t.resultado), 0) / tradesPerdedores.length).toFixed(2)
      : 0;
    const profitFactor = Math.abs(avgLoss) > 0 ? (avgWin / Math.abs(avgLoss)).toFixed(2) : 'N/A';

    const estatsPorEstrategia = {};
    tradesFiltrados.forEach(trade => {
      if (!estatsPorEstrategia[trade.estrategia]) {
        estatsPorEstrategia[trade.estrategia] = {
          total: 0,
          ganadores: 0,
          perdedores: 0,
          profit: 0
        };
      }
      estatsPorEstrategia[trade.estrategia].total++;
      if (parseFloat(trade.resultado) > 0) {
        estatsPorEstrategia[trade.estrategia].ganadores++;
      } else if (parseFloat(trade.resultado) < 0) {
        estatsPorEstrategia[trade.estrategia].perdedores++;
      }
      estatsPorEstrategia[trade.estrategia].profit += parseFloat(trade.resultado);
    });

    return {
      totalTrades: tradesFiltrados.length,
      winRate,
      totalProfit: totalProfit.toFixed(2),
      tradesGanadores: tradesGanadores.length,
      tradesPerdedores: tradesPerdedores.length,
      avgWin,
      avgLoss,
      profitFactor,
      estatsPorEstrategia
    };
  };

  const tradesFiltrados = useMemo(() => {
    return trades.filter(trade => {
      if (filters.estrategia !== 'todas' && trade.estrategia !== filters.estrategia) return false;
      if (filters.direccion !== 'todas' && trade.direccion !== filters.direccion) return false;
      if (filters.resultado === 'ganadores' && parseFloat(trade.resultado) <= 0) return false;
      if (filters.resultado === 'perdedores' && parseFloat(trade.resultado) >= 0) return false;
      if (filters.fechaDesde && trade.fecha < filters.fechaDesde) return false;
      if (filters.fechaHasta && trade.fecha > filters.fechaHasta) return false;
      return true;
    });
  }, [trades, filters]);

  const stats = calcularEstadisticas();

const agregarTrade = async () => {
    const precioPromedioEntrada = calcularPrecioPromedio();
    const cantidadTotalEntrada = parseFloat(currentTrade.cantidadEntrada1 || 0) + 
                          parseFloat(currentTrade.cantidadEntrada2 || 0) + 
                          parseFloat(currentTrade.cantidadEntrada3 || 0);
    
    const precioPromedioSalida = calcularPrecioPromedioSalida();
    const cantidadTotalSalida = parseFloat(currentTrade.cantidadSalida1 || 0) + 
                          parseFloat(currentTrade.cantidadSalida2 || 0) + 
                          parseFloat(currentTrade.cantidadSalida3 || 0);
    
    let resultado = 0;
    let porcentajeGanancia = 0;
    
    if (currentTrade.direccion === 'SHORT') {
      resultado = (precioPromedioEntrada - precioPromedioSalida) * cantidadTotalSalida;
      porcentajeGanancia = ((precioPromedioEntrada - precioPromedioSalida) / precioPromedioEntrada * 100).toFixed(2);
    } else {
      resultado = (precioPromedioSalida - precioPromedioEntrada) * cantidadTotalSalida;
      porcentajeGanancia = ((precioPromedioSalida - precioPromedioEntrada) / precioPromedioEntrada * 100).toFixed(2);
    }
    
    resultado = resultado - parseFloat(currentTrade.comisiones || 0);

    let confluenciasCumplidas = Object.values(currentTrade.confluencias).filter(v => v === true).length;
    const totalConfluencias = confluenciasPorEstrategia[currentTrade.estrategia]?.length || 0;
    
    // Si la estrategia usa CRITIREA, sumarla al contador
    let totalConfluenciasConCritirea = totalConfluencias;
    if (estrategiasConCritirea.includes(currentTrade.estrategia)) {
      totalConfluenciasConCritirea += 1; // +1 por la CRITIREA
      if (currentTrade.critirea) {
        confluenciasCumplidas += 1;
      }
    }

    const nuevoTrade = {
      ...currentTrade,
      resultado: resultado.toFixed(2),
      porcentajeGanancia,
      precioPromedioEntrada: precioPromedioEntrada.toFixed(2),
      precioPromedioSalida: precioPromedioSalida.toFixed(2),
      cantidadTotalEntrada: cantidadTotalEntrada.toFixed(0),
      cantidadTotalSalida: cantidadTotalSalida.toFixed(0),
      confluenciasCumplidas,
      totalConfluencias: totalConfluenciasConCritirea,
      timestamp: new Date().toISOString()
    };

    if (editingIndex !== null) {
      const nuevosTrades = [...trades];
      nuevosTrades[editingIndex] = nuevoTrade;
      setTrades(nuevosTrades);
      await saveTrade(nuevoTrade);
      setEditingIndex(null);
    } else {
      setTrades([...trades, nuevoTrade]);
      await saveTrade(nuevoTrade);
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentTrade({
      fecha: '',
      ticker: '',
      direccion: 'SHORT',
      estrategia: 'El Águila',
      precioEntrada1: '',
      precioEntrada2: '',
      precioEntrada3: '',
      cantidadEntrada1: '',
      cantidadEntrada2: '',
      cantidadEntrada3: '',
      precioSalida1: '',
      precioSalida2: '',
      precioSalida3: '',
      cantidadSalida1: '',
      cantidadSalida2: '',
      cantidadSalida3: '',
      resultado: '',
      porcentajeGanancia: '',
      drawdownMax: '',
      comisiones: '',
      rrRatio: '',
      duracionMinutos: '',
      motivoEntrada: '',
      confluencias: {},
      critirea: false,
      redFlags: '',
      tags: [],
      horaEntrada: '',
      volumen: '',
      screenshot: '',
      linkTradingView: '',
      notas: '',
      emociones: '',
      errores: ''
    });
    setShowForm(false);
    setEditingIndex(null);
  };

const eliminarTrade = async (index) => {
    const trade = trades[index];
    if (window.confirm(`¿Estás seguro de eliminar el trade de ${trade.ticker} (${trade.fecha})?\n\nEsta acción no se puede deshacer.`)) {
      try {
        // Eliminar de Supabase solo si tiene ID de Supabase
        if (trade.id && typeof trade.id === 'string' && trade.id.length > 20) {
          const { error } = await supabase
            .from('trades')
            .delete()
            .eq('id', trade.id);

          if (error) throw error;
        }

        // Eliminar localmente
        const nuevosTrades = [...trades];
        nuevosTrades.splice(index, 1);
        setTrades(nuevosTrades);
      } catch (error) {
        console.error('Error eliminando trade:', error);
        alert('Error al eliminar trade');
      }
    }
  };

  const editarTrade = (index) => {
    const trade = trades[index];
    setCurrentTrade({...trade});
    setEditingIndex(index);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const verDetalle = (trade) => {
    setViewingTrade(trade);
  };

  const calcularPrecioPromedio = () => {
    const p1 = parseFloat(currentTrade.precioEntrada1 || 0);
    const p2 = parseFloat(currentTrade.precioEntrada2 || 0);
    const p3 = parseFloat(currentTrade.precioEntrada3 || 0);
    const c1 = parseFloat(currentTrade.cantidadEntrada1 || 0);
    const c2 = parseFloat(currentTrade.cantidadEntrada2 || 0);
    const c3 = parseFloat(currentTrade.cantidadEntrada3 || 0);

    const totalCosto = (p1 * c1) + (p2 * c2) + (p3 * c3);
    const totalCantidad = c1 + c2 + c3;

    return totalCantidad > 0 ? totalCosto / totalCantidad : 0;
  };

  const calcularPrecioPromedioSalida = () => {
    const p1 = parseFloat(currentTrade.precioSalida1 || 0);
    const p2 = parseFloat(currentTrade.precioSalida2 || 0);
    const p3 = parseFloat(currentTrade.precioSalida3 || 0);
    const c1 = parseFloat(currentTrade.cantidadSalida1 || 0);
    const c2 = parseFloat(currentTrade.cantidadSalida2 || 0);
    const c3 = parseFloat(currentTrade.cantidadSalida3 || 0);

    const totalCosto = (p1 * c1) + (p2 * c2) + (p3 * c3);
    const totalCantidad = c1 + c2 + c3;

    return totalCantidad > 0 ? totalCosto / totalCantidad : 0;
  };

  const handleConfluenciaChange = (key) => {
    setCurrentTrade({
      ...currentTrade,
      confluencias: {
        ...currentTrade.confluencias,
        [key]: !currentTrade.confluencias[key]
      }
    });
  };

  const agregarTag = (tag) => {
    if (!currentTrade.tags.includes(tag)) {
      setCurrentTrade({
        ...currentTrade,
        tags: [...currentTrade.tags, tag]
      });
    }
  };

  const eliminarTag = (tagToRemove) => {
    setCurrentTrade({
      ...currentTrade,
      tags: currentTrade.tags.filter(t => t !== tagToRemove)
    });
  };

  const exportarCSV = () => {
    if (tradesFiltrados.length === 0) return;
    
    const headers = Object.keys(tradesFiltrados[0]).join(',');
    const rows = tradesFiltrados.map(t => Object.values(t).map(val => 
      typeof val === 'object' ? JSON.stringify(val) : val
    ).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_journal_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const limpiarFiltros = () => {
    setFilters({
      estrategia: 'todas',
      direccion: 'todas',
      resultado: 'todos',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  const confluenciasActuales = confluenciasPorEstrategia[currentTrade.estrategia] || [];
  const usaCritirea = estrategiasConCritirea.includes(currentTrade.estrategia);
  
  let confluenciasCumplidasForm = Object.values(currentTrade.confluencias).filter(v => v === true).length;
  let totalConfluenciasForm = confluenciasActuales.length;
  
  if (usaCritirea) {
    totalConfluenciasForm += 1;
    if (currentTrade.critirea) {
      confluenciasCumplidasForm += 1;
    }
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              📊 Trading Journal Pro V4.1
            </h1>
            <p className="text-slate-400">Sistema Isaac Molina - Ultimate Professional Edition</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showFilters ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Filter size={20} />
              Filtros
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              <Plus size={20} />
              {editingIndex !== null ? 'Editando' : 'Nuevo Trade'}
            </button>
            {trades.length > 0 && (
              <button
                onClick={exportarCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
              >
                <Download size={20} />
                Exportar
              </button>
            )}
          </div>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter size={20} className="text-purple-400" />
                Filtros
              </h3>
              <button
                onClick={limpiarFiltros}
                className="text-sm text-slate-400 hover:text-white transition"
              >
                Limpiar filtros
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Estrategia</label>
                <select
                  value={filters.estrategia}
                  onChange={(e) => setFilters({...filters, estrategia: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="todas">Todas</option>
                  <option value="El Águila">El Águila</option>
                  <option value="El Seguro">El Seguro</option>
                  <option value="Falling Wedge">Falling Wedge</option>
                  <option value="Bullish Pennant">Bullish Pennant</option>
                  <option value="Support & Resistance">Support & Resistance</option>
                  <option value="Tiger's Candle">Tiger's Candle</option>
                  <option value="Breakout Re-Test">Breakout Re-Test</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Dirección</label>
                <select
                  value={filters.direccion}
                  onChange={(e) => setFilters({...filters, direccion: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="todas">Todas</option>
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Resultado</label>
                <select
                  value={filters.resultado}
                  onChange={(e) => setFilters({...filters, resultado: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="ganadores">Ganadores</option>
                  <option value="perdedores">Perdedores</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Desde</label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => setFilters({...filters, fechaDesde: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Hasta</label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => setFilters({...filters, fechaHasta: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-400">
              Mostrando {tradesFiltrados.length} de {trades.length} trades
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Total Trades</span>
                  <BarChart3 size={20} className="text-blue-400" />
                </div>
                <p className="text-2xl font-bold">{stats.totalTrades}</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Win Rate</span>
                  <Percent size={20} className="text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-400">{stats.winRate}%</p>
                <p className="text-xs text-slate-400 mt-1">
                  {stats.tradesGanadores}W / {stats.tradesPerdedores}L
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Profit Total</span>
                  <DollarSign size={20} className={stats.totalProfit >= 0 ? "text-green-400" : "text-red-400"} />
                </div>
                <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${stats.totalProfit}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Profit Factor</span>
                  <TrendingUp size={20} className="text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">{stats.profitFactor}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Avg Win: ${stats.avgWin}
                </p>
              </div>
            </div>

            {/* Estadísticas por Estrategia */}
            {Object.keys(stats.estatsPorEstrategia).length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-400" />
                  Performance por Estrategia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.estatsPorEstrategia).map(([estrategia, datos]) => {
                    const wr = datos.total > 0 ? ((datos.ganadores / datos.total) * 100).toFixed(1) : 0;
                    return (
                      <div key={estrategia} className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-blue-400">{estrategia}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-slate-300">Total: {datos.total} trades</p>
                          <p className="text-green-400">✓ Ganadores: {datos.ganadores}</p>
                          <p className="text-red-400">✗ Perdedores: {datos.perdedores}</p>
                          <p className="text-yellow-400">Win Rate: {wr}%</p>
                          <p className={`font-semibold ${datos.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            P&L: ${datos.profit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editingIndex !== null ? (
                  <>
                    <Edit2 size={24} className="text-yellow-400" />
                    Editar Trade
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-blue-400" />
                    Registrar Nuevo Trade
                  </>
                )}
              </h2>
              {editingIndex !== null && (
                <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-sm">
                  Modo edición
                </span>
              )}
            </div>
            
            {/* Info Básica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Fecha *</label>
                <input
                  type="date"
                  value={currentTrade.fecha}
                  onChange={(e) => setCurrentTrade({...currentTrade, fecha: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Ticker *</label>
                <input
                  type="text"
                  placeholder="$XXXX"
                  value={currentTrade.ticker}
                  onChange={(e) => setCurrentTrade({...currentTrade, ticker: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Dirección *</label>
                <select
                  value={currentTrade.direccion}
                  onChange={(e) => setCurrentTrade({...currentTrade, direccion: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  <option>SHORT</option>
                  <option>LONG</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-1">Estrategia *</label>
              <select
                value={currentTrade.estrategia}
                onChange={(e) => setCurrentTrade({...currentTrade, estrategia: e.target.value, confluencias: {}, critirea: false})}
                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option>El Águila</option>
                <option>El Seguro</option>
                <option>Falling Wedge</option>
                <option>Bullish Pennant</option>
                <option>Support & Resistance</option>
                <option>Tiger's Candle</option>
                <option>Breakout Re-Test</option>
              </select>
            </div>

            {/* Tags */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 text-purple-400">🏷️ TAGS</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {currentTrade.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => eliminarTag(tag)}
                      className="hover:text-red-400 transition"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {currentTrade.tags.length === 0 && (
                  <span className="text-slate-500 text-sm italic">No hay tags seleccionados</span>
                )}
              </div>

              <div className="border-t border-slate-700 pt-3">
                <p className="text-xs text-slate-400 mb-2">Tags sugeridos:</p>
                <div className="flex flex-wrap gap-2">
                  {tagsPredefinidos.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => agregarTag(tag)}
                      disabled={currentTrade.tags.includes(tag)}
                      className={`px-2 py-1 rounded text-xs transition ${
                        currentTrade.tags.includes(tag)
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 text-slate-300 hover:bg-purple-900/50 hover:text-purple-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CRITIREA GENERAL + Confluencias */}
            {(usaCritirea || confluenciasActuales.length > 0) && (
              <div className="bg-slate-900 rounded-lg p-4 mb-6 border-2 border-yellow-500/30">
                <h3 className="font-semibold mb-4 text-yellow-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Award size={20} />
                    CONFLUENCIAS - {currentTrade.estrategia}
                  </span>
                  <span className="text-sm">
                    {confluenciasCumplidasForm}/{totalConfluenciasForm}
                  </span>
                </h3>

                {/* CRITIREA GENERAL */}
                {usaCritirea && (
                  <div className="mb-4 p-4 bg-blue-900/20 border-2 border-blue-500/50 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentTrade.critirea || false}
                        onChange={(e) => setCurrentTrade({...currentTrade, critirea: e.target.checked})}
                        className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-blue-400 flex items-center gap-2">
                          <CheckCircle size={18} />
                          CRITIREA GENERAL CUMPLIDA
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          (Uptrend, Arriba VWAP, Alto Volumen, Arriba Pre-Market High, Patrón Alcista)
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Confluencias Específicas */}
                {confluenciasActuales.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {confluenciasActuales.map((conf) => (
                      <label key={conf.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={currentTrade.confluencias[conf.key] || false}
                          onChange={() => handleConfluenciaChange(conf.key)}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-sm">{conf.label}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {/* Alertas */}
                {confluenciasCumplidasForm < totalConfluenciasForm * 0.5 && (
                  <div className="p-3 bg-red-900/30 border border-red-700 rounded flex items-start gap-2">
                    <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-400 font-semibold">⚠️ Pocas confluencias</p>
                      <p className="text-xs text-red-300 mt-1">
                        Solo {confluenciasCumplidasForm}/{totalConfluenciasForm} confluencias. Considera esperar mejor setup.
                      </p>
                    </div>
                  </div>
                )}
                
                {confluenciasCumplidasForm >= totalConfluenciasForm * 0.5 && confluenciasCumplidasForm < totalConfluenciasForm && (
                  <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded">
                    <p className="text-sm text-yellow-400">
                      ✓ Setup aceptable: {confluenciasCumplidasForm}/{totalConfluenciasForm}
                    </p>
                  </div>
                )}
                
                {confluenciasCumplidasForm === totalConfluenciasForm && totalConfluenciasForm > 0 && (
                  <div className="p-3 bg-green-900/30 border border-green-700 rounded flex items-center gap-2">
                    <Award size={20} className="text-green-400" />
                    <p className="text-sm text-green-400 font-semibold">
                      ¡SETUP PERFECTO! Todas las confluencias cumplidas
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Entradas */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4 text-blue-400">
                📥 ENTRADAS {currentTrade.direccion === 'SHORT' ? '(SHORT)' : '(LONG)'}
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Entrada 1 - Precio *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={currentTrade.precioEntrada1}
                      onChange={(e) => setCurrentTrade({...currentTrade, precioEntrada1: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cantidad *</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={currentTrade.cantidadEntrada1}
                      onChange={(e) => setCurrentTrade({...currentTrade, cantidadEntrada1: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Entrada 2 - Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={currentTrade.precioEntrada2}
                      onChange={(e) => setCurrentTrade({...currentTrade, precioEntrada2: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cantidad</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={currentTrade.cantidadEntrada2}
                      onChange={(e) => setCurrentTrade({...currentTrade, cantidadEntrada2: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Entrada 3 - Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={currentTrade.precioEntrada3}
                      onChange={(e) => setCurrentTrade({...currentTrade, precioEntrada3: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cantidad</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={currentTrade.cantidadEntrada3}
                      onChange={(e) => setCurrentTrade({...currentTrade, cantidadEntrada3: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {(currentTrade.precioEntrada1 && currentTrade.cantidadEntrada1) && (
                <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
                  <p className="text-sm">
                    <span className="text-slate-400">Precio Promedio Entrada:</span>{' '}
                    <span className="font-bold text-blue-400">${calcularPrecioPromedio().toFixed(2)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Salidas */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4 text-green-400">📤 SALIDAS</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Salida 1 - Precio *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={currentTrade.precioSalida1}
                      onChange={(e) => setCurrentTrade({...currentTrade, precioSalida1: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cantidad *</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={currentTrade.cantidadSalida1}
                      onChange={(e) => setCurrentTrade({...currentTrade, cantidadSalida1: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Salida 2 - Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={currentTrade.precioSalida2}
                      onChange={(e) => setCurrentTrade({...currentTrade, precioSalida2: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cantidad</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={currentTrade.cantidadSalida2}
                      onChange={(e) => setCurrentTrade({...currentTrade, cantidadSalida2: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Salida 3 - Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={currentTrade.precioSalida3}
                      onChange={(e) => setCurrentTrade({...currentTrade, precioSalida3: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cantidad</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={currentTrade.cantidadSalida3}
                      onChange={(e) => setCurrentTrade({...currentTrade, cantidadSalida3: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {(currentTrade.precioSalida1 && currentTrade.cantidadSalida1) && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded">
                  <p className="text-sm">
                    <span className="text-slate-400">Precio Promedio Salida:</span>{' '}
                    <span className="font-bold text-green-400">${calcularPrecioPromedioSalida().toFixed(2)}</span>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Hora Entrada/Salida</label>
                  <input
                    type="text"
                    placeholder="10:15 - 11:30"
                    value={currentTrade.horaEntrada}
                    onChange={(e) => setCurrentTrade({...currentTrade, horaEntrada: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={currentTrade.duracionMinutos}
                    onChange={(e) => setCurrentTrade({...currentTrade, duracionMinutos: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Screenshots y Links */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4 text-purple-400">📸 GRÁFICOS</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <Image size={16} />
                    Screenshot
                  </label>
                  <input
                    type="text"
                    placeholder="URL o ubicación: 'Desktop/Screenshots/TSLA-nov26.png'"
                    value={currentTrade.screenshot}
                    onChange={(e) => setCurrentTrade({...currentTrade, screenshot: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <ExternalLink size={16} />
                    Link TradingView
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.tradingview.com/chart/..."
                    value={currentTrade.linkTradingView}
                    onChange={(e) => setCurrentTrade({...currentTrade, linkTradingView: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Análisis Pre-Trade */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4 text-yellow-400">📋 ANÁLISIS PRE-TRADE</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Red Flags</label>
                  <input
                    type="text"
                    placeholder="FDA, Earnings..."
                    value={currentTrade.redFlags}
                    onChange={(e) => setCurrentTrade({...currentTrade, redFlags: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Volumen Pre-Market</label>
                  <input
                    type="text"
                    placeholder="50M"
                    value={currentTrade.volumen}
                    onChange={(e) => setCurrentTrade({...currentTrade, volumen: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Motivo de Entrada</label>
                <textarea
                  placeholder="¿Por qué entraste?"
                  value={currentTrade.motivoEntrada}
                  onChange={(e) => setCurrentTrade({...currentTrade, motivoEntrada: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 h-20 text-white"
                />
              </div>
            </div>

            {/* Gestión de Riesgo */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4 text-orange-400">⚠️ GESTIÓN DE RIESGO</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Drawdown Máximo (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="-7.5"
                    value={currentTrade.drawdownMax}
                    onChange={(e) => setCurrentTrade({...currentTrade, drawdownMax: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">R:R Ratio</label>
                  <input
                    type="text"
                    placeholder="1:3"
                    value={currentTrade.rrRatio}
                    onChange={(e) => setCurrentTrade({...currentTrade, rrRatio: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Comisiones ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="3.50"
                    value={currentTrade.comisiones}
                    onChange={(e) => setCurrentTrade({...currentTrade, comisiones: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Post-Trade */}
            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4 text-purple-400">🧠 ANÁLISIS POST-TRADE</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Emociones</label>
                  <textarea
                    placeholder="¿Cómo te sentiste?"
                    value={currentTrade.emociones}
                    onChange={(e) => setCurrentTrade({...currentTrade, emociones: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 h-20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Errores</label>
                  <textarea
                    placeholder="¿Qué hiciste mal?"
                    value={currentTrade.errores}
                    onChange={(e) => setCurrentTrade({...currentTrade, errores: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 h-20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Notas</label>
                  <textarea
                    placeholder="Observaciones..."
                    value={currentTrade.notas}
                    onChange={(e) => setCurrentTrade({...currentTrade, notas: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 h-20 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={agregarTrade}
                className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                {editingIndex !== null ? '✓ Actualizar Trade' : '💾 Guardar Trade'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Tabla de Trades */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ticker</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dir</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Estrategia</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Entrada</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Salida</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">P&L</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">%</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Conf</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {tradesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                      {trades.length === 0 ? '¡Agrega tu primer trade!' : 'No hay trades con estos filtros'}
                    </td>
                  </tr>
                ) : (
                  tradesFiltrados.map((trade) => {
                    const realIndex = trades.findIndex(t => t.timestamp === trade.timestamp);
                    return (
                      <tr key={trade.timestamp} className="hover:bg-slate-700/50 transition">
                        <td className="px-4 py-3 text-sm">{trade.fecha}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-400">{trade.ticker}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.direccion === 'SHORT' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'
                          }`}>
                            {trade.direccion}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{trade.estrategia}</td>
                        <td className="px-4 py-3 text-sm">${trade.precioPromedioEntrada}</td>
                        <td className="px-4 py-3 text-sm">${trade.precioPromedioSalida}</td>
                        <td className={`px-4 py-3 text-sm font-semibold ${parseFloat(trade.resultado) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${trade.resultado}
                        </td>
                        <td className={`px-4 py-3 text-sm font-semibold ${parseFloat(trade.porcentajeGanancia) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.porcentajeGanancia}%
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.confluenciasCumplidas === trade.totalConfluencias ? 'bg-green-900/50 text-green-400' :
                            trade.confluenciasCumplidas >= trade.totalConfluencias * 0.5 ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {trade.confluenciasCumplidas}/{trade.totalConfluencias}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => verDetalle(trade)}
                              className="text-blue-400 hover:text-blue-300 transition"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => editarTrade(realIndex)}
                              className="text-yellow-400 hover:text-yellow-300 transition"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => eliminarTrade(realIndex)}
                              className="text-red-400 hover:text-red-300 transition"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Ver Detalles */}
        {viewingTrade && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50" onClick={() => setViewingTrade(null)}>
            <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {viewingTrade.ticker} - {viewingTrade.fecha}
                </h2>
                <button
                  onClick={() => setViewingTrade(null)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Dirección</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded text-sm font-semibold ${
                      viewingTrade.direccion === 'SHORT' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'
                    }`}>
                      {viewingTrade.direccion}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Estrategia</p>
                    <p className="font-semibold mt-1">{viewingTrade.estrategia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">P&L</p>
                    <p className={`text-xl font-bold mt-1 ${parseFloat(viewingTrade.resultado) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${viewingTrade.resultado}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Porcentaje</p>
                    <p className={`text-xl font-bold mt-1 ${parseFloat(viewingTrade.porcentajeGanancia) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {viewingTrade.porcentajeGanancia}%
                    </p>
                  </div>
                </div>

                {/* CRITIREA + Confluencias */}
                {viewingTrade.totalConfluencias > 0 && (
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-yellow-400">
                      Confluencias: {viewingTrade.confluenciasCumplidas}/{viewingTrade.totalConfluencias}
                    </h3>
                    
                    {estrategiasConCritirea.includes(viewingTrade.estrategia) && (
                      <div className="mb-3 p-3 bg-blue-900/20 border border-blue-500/50 rounded">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={viewingTrade.critirea ? 'text-green-400' : 'text-slate-500'}>
                            {viewingTrade.critirea ? '✓' : '○'}
                          </span>
                          <span className={`font-semibold ${viewingTrade.critirea ? 'text-blue-400' : 'text-slate-500'}`}>
                            CRITIREA GENERAL
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {confluenciasPorEstrategia[viewingTrade.estrategia]?.map((conf) => (
                        <div key={conf.id} className="flex items-center gap-2 text-sm">
                          <span className={viewingTrade.confluencias[conf.key] ? 'text-green-400' : 'text-slate-500'}>
                            {viewingTrade.confluencias[conf.key] ? '✓' : '○'}
                          </span>
                          <span className={viewingTrade.confluencias[conf.key] ? '' : 'text-slate-500'}>
                            {conf.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewingTrade.tags && viewingTrade.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-purple-400">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingTrade.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-blue-400">Entradas</h3>
                    <div className="space-y-2 text-sm">
                      {viewingTrade.precioEntrada1 && (
                        <p>E1: ${viewingTrade.precioEntrada1} × {viewingTrade.cantidadEntrada1}</p>
                      )}
                      {viewingTrade.precioEntrada2 && (
                        <p>E2: ${viewingTrade.precioEntrada2} × {viewingTrade.cantidadEntrada2}</p>
                      )}
                      {viewingTrade.precioEntrada3 && (
                        <p>E3: ${viewingTrade.precioEntrada3} × {viewingTrade.cantidadEntrada3}</p>
                      )}
                      <p className="font-semibold border-t border-slate-700 pt-2">
                        Promedio: ${viewingTrade.precioPromedioEntrada}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-green-400">Salidas</h3>
                    <div className="space-y-2 text-sm">
                      {viewingTrade.precioSalida1 && (
                        <p>S1: ${viewingTrade.precioSalida1} × {viewingTrade.cantidadSalida1}</p>
                      )}
                      {viewingTrade.precioSalida2 && (
                        <p>S2: ${viewingTrade.precioSalida2} × {viewingTrade.cantidadSalida2}</p>
                      )}
                      {viewingTrade.precioSalida3 && (
                        <p>S3: ${viewingTrade.precioSalida3} × {viewingTrade.cantidadSalida3}</p>
                      )}
                      <p className="font-semibold border-t border-slate-700 pt-2">
                        Promedio: ${viewingTrade.precioPromedioSalida}
                      </p>
                    </div>
                  </div>
                </div>

                {(viewingTrade.screenshot || viewingTrade.linkTradingView) && (
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-purple-400">Recursos</h3>
                    <div className="space-y-2">
                      {viewingTrade.screenshot && (
                        <div className="flex items-center gap-2 text-sm">
                          <Image size={16} className="text-slate-400" />
                          <p className="text-slate-300">{viewingTrade.screenshot}</p>
                        </div>
                      )}
                      {viewingTrade.linkTradingView && (
                        <div className="flex items-center gap-2 text-sm">
                          <ExternalLink size={16} className="text-slate-400" />
                          <a
                            href={viewingTrade.linkTradingView}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Ver en TradingView
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(viewingTrade.motivoEntrada || viewingTrade.emociones || viewingTrade.errores || viewingTrade.notas) && (
                  <div className="space-y-4">
                    {viewingTrade.motivoEntrada && (
                      <div className="bg-slate-900 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-yellow-400">Motivo</h3>
                        <p className="text-sm text-slate-300">{viewingTrade.motivoEntrada}</p>
                      </div>
                    )}
                    {viewingTrade.emociones && (
                      <div className="bg-slate-900 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-purple-400">Emociones</h3>
                        <p className="text-sm text-slate-300">{viewingTrade.emociones}</p>
                      </div>
                    )}
                    {viewingTrade.errores && (
                      <div className="bg-slate-900 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-red-400">Errores</h3>
                        <p className="text-sm text-slate-300">{viewingTrade.errores}</p>
                      </div>
                    )}
                    {viewingTrade.notas && (
                      <div className="bg-slate-900 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-blue-400">Notas</h3>
                        <p className="text-sm text-slate-300">{viewingTrade.notas}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="font-semibold mb-3 text-blue-400">🚀 JOURNAL V4.1 - THE ULTIMATE EDITION</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
            <div>
              <p className="font-semibold text-white mb-2">✅ Nuevo en V4.1:</p>
              <ul className="space-y-1">
                <li>• <strong>CRITIREA GENERAL:</strong> Checkbox único para estrategias</li>
                <li>• <strong>Botón Eliminar:</strong> 100% funcional con confirmación</li>
                <li>• <strong>Sistema optimizado:</strong> Código limpio y profesional</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Características:</p>
              <ul className="space-y-1">
                <li>• Editar, Ver, Eliminar trades</li>
                <li>• Filtros avanzados</li>
                <li>• Stats por estrategia</li>
                <li>• Tags inteligentes</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-slate-500 text-sm">
          <p>🔥 Trading Journal Pro V4.1 - Ultimate Professional Edition</p>
          <p className="text-xs mt-1">Isaac Molina System · Ready for Vercel Deploy</p>
        </div>
      </div>
    </div>
  );
}