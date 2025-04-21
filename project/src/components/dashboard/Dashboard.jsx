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