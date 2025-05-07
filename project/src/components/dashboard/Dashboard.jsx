import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { useState, useEffect } from 'react';

function formatCurrency(value) {
  if (value === undefined || value === null) return formatCurrency(0);
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'MZN'
  }).format(value);
}

function Dashboard() {
  const usuarioId = localStorage.getItem('usuarioId');
  const [dashboard, setDashboard] = useState({});
  const [showDueToday, setShowDueToday] = useState(false);
  const [showDueWeek, setShowDueWeek] = useState(false);
  const [showNearDue, setShowNearDue] = useState(false);
  
  const getDashboard = async () => {
    try {
      const response = await axios.get(`https://gestor-agiota.onrender.com/api/relatorios/dashboard/${usuarioId}`);
      const dashboardData = response.data;
      setDashboard(dashboardData);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getDashboard();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  };
  
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        {/* Name Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <h3>Nome</h3>
            <p className="card-value">{dashboard.nome}</p>
          </div>
        </div>
        
        {/* Active Debts Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <h3>Dívidas Ativas</h3>
            <p className="card-value">{dashboard.dividasAtivas}</p>
          </div>
        </div>
        
        {/* Late Debts Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <h3>Dívidas Atrasadas</h3>
            <p className="card-value">{dashboard.dividasAtrasadas}</p>
          </div>
        </div>
        
        {/* Total Debt Value Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <h3>Total Investido</h3>
            <p className="card-value">{formatCurrency(dashboard.totalValorDividas)}</p>
          </div>
        </div>
        
        {/* Total Remaining Value Card */}
        <div className="dashboard-card pending-card">
          <div className="card-content">
            <h3>Valor Pendente</h3>
            <p className="card-value">{formatCurrency(dashboard.valorRestante)}</p>
          </div>
        </div>
        
        {/* Total Payments Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <h3>Total Recebido</h3>
            <p className="card-value">{formatCurrency(dashboard.totalPagamentos)}</p>
          </div>
        </div>

        {/* Expected Return Card */}
        <div className="dashboard-card return-card">
          <div className="card-content">
            <h3>Retorno Esperado</h3>
            <p className="card-value">{formatCurrency(dashboard.valorEsperadoRetorno)}</p>
          </div>
        </div>
      </div>

      {/* Alertas e Dívidas para Acompanhamento */}
      <div className="debt-sections">
        {/* Dívidas que vencem hoje */}
        <div className="debt-section">
          <div className="section-header" onClick={() => setShowDueToday(!showDueToday)}>
            <h2>Dívidas que vencem hoje ({dashboard.dividasVencemHoje?.length || 0})</h2>
            <span className="toggle-icon">{showDueToday ? '▼' : '►'}</span>
          </div>
          
          {showDueToday && dashboard.dividasVencemHoje && dashboard.dividasVencemHoje.length > 0 ? (
            <div className="debt-list">
              <table>
                <thead>
                  <tr>
                    <th>Devedor</th>
                    <th>Valor Inicial</th>
                    <th>Valor Pendente</th>
                    <th>Taxa de Juros</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.dividasVencemHoje.map((divida) => {
                    const pagamentoTotal = divida.pagamentos.reduce((sum, pagamento) => sum + pagamento.valor, 0);
                    const valorPendente = divida.valorInicial - pagamentoTotal;
                    
                    return (
                      <tr key={divida.id}>
                        <td>{divida.devedor?.nome || 'N/A'}</td>
                        <td>{formatCurrency(divida.valorInicial)}</td>
                        <td>{formatCurrency(valorPendente)}</td>
                        <td>{divida.taxaJuros}%</td>
                        <td>{formatDate(divida.dataVencimento)}</td>
                        <td>
                          <Link to={`/debts/${divida.id}`} className="btn btn-small">
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : showDueToday ? (
            <p className="empty-message">Não há dívidas vencendo hoje.</p>
          ) : null}
        </div>

        {/* Dívidas próximas do vencimento (3 dias) */}
        <div className="debt-section">
          <div className="section-header" onClick={() => setShowNearDue(!showNearDue)}>
            <h2>Alertas: Dívidas a vencer nos próximos 3 dias ({dashboard.dividasProximasVencimento?.length || 0})</h2>
            <span className="toggle-icon">{showNearDue ? '▼' : '►'}</span>
          </div>
          
          {showNearDue && dashboard.dividasProximasVencimento && dashboard.dividasProximasVencimento.length > 0 ? (
            <div className="debt-list">
              <table>
                <thead>
                  <tr>
                    <th>Devedor</th>
                    <th>Valor Inicial</th>
                    <th>Valor Pendente</th>
                    <th>Taxa de Juros</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.dividasProximasVencimento.map((divida) => {
                    const pagamentoTotal = divida.pagamentos.reduce((sum, pagamento) => sum + pagamento.valor, 0);
                    const valorPendente = divida.valorInicial - pagamentoTotal;
                    
                    return (
                      <tr key={divida.id}>
                        <td>{divida.devedor?.nome || 'N/A'}</td>
                        <td>{formatCurrency(divida.valorInicial)}</td>
                        <td>{formatCurrency(valorPendente)}</td>
                        <td>{divida.taxaJuros}%</td>
                        <td>{formatDate(divida.dataVencimento)}</td>
                        <td>
                          <Link to={`/debts/${divida.id}`} className="btn btn-small">
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : showNearDue ? (
            <p className="empty-message">Não há dívidas a vencer nos próximos 3 dias.</p>
          ) : null}
        </div>

        {/* Dívidas que vencem na semana */}
        <div className="debt-section">
          <div className="section-header" onClick={() => setShowDueWeek(!showDueWeek)}>
            <h2>Dívidas a vencer esta semana ({dashboard.dividasVencemNaSemana?.length || 0})</h2>
            <span className="toggle-icon">{showDueWeek ? '▼' : '►'}</span>
          </div>
          
          {showDueWeek && dashboard.dividasVencemNaSemana && dashboard.dividasVencemNaSemana.length > 0 ? (
            <div className="debt-list">
              <table>
                <thead>
                  <tr>
                    <th>Devedor</th>
                    <th>Valor Inicial</th>
                    <th>Valor Pendente</th>
                    <th>Taxa de Juros</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.dividasVencemNaSemana.map((divida) => {
                    const pagamentoTotal = divida.pagamentos.reduce((sum, pagamento) => sum + pagamento.valor, 0);
                    const valorPendente = divida.valorInicial - pagamentoTotal;
                    
                    return (
                      <tr key={divida.id}>
                        <td>{divida.devedor?.nome || 'N/A'}</td>
                        <td>{formatCurrency(divida.valorInicial)}</td>
                        <td>{formatCurrency(valorPendente)}</td>
                        <td>{divida.taxaJuros}%</td>
                        <td>{formatDate(divida.dataVencimento)}</td>
                        <td>
                          <Link to={`/debts/${divida.id}`} className="btn btn-small">
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : showDueWeek ? (
            <p className="empty-message">Não há dívidas a vencer esta semana.</p>
          ) : null}
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/new-debt" className="btn btn-primary">
          Nova Dívida
        </Link>
        <Link to="/debtors" className="btn btn-secondary">
          Adicionar Devedor
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;