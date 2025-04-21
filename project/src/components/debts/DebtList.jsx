import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DebtList.css';
import axios from 'axios';

function DebtList() {
  const [debtsList, setDebtsList] = useState([]);
  const [debtorsList, setDebtorsList] = useState([]);
  const [selectedDebtorId, setSelectedDebtorId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Função para formatar valor monetário
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };
  
  // Função para formatar data
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-MZ', options);
  };
  
  // Função para obter o status formatado
  const getStatusDisplay = (status) => {
    const statusMap = {
      'ATIVA': 'Ativa',
      'ATRASADA': 'Atrasada',
      'QUITADA': 'Quitada'
    };
    return statusMap[status] || status;
  };
  
  // Efeito para buscar devedores
  useEffect(() => {
    console.log("Executando pedido de devedores");
    const usuarioId = localStorage.getItem('usuarioId');
    axios.get(`http://localhost:3000/api/devedor/usuario/${usuarioId}`)
      .then(response => {
        setDebtorsList(response.data);
        console.log("Devedores:", response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar devedores:", error);
      });
  }, []);

  // Efeito para buscar dívidas
  useEffect(() => {
    console.log("Executando pedido de dívidas");
    const usuarioId = localStorage.getItem('usuarioId');
    axios.get(`http://localhost:3000/api/divida/usuario/${usuarioId}`)
      .then(response => {
        setDebtsList(response.data);
        console.log("Dívidas:", response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dívidas:", error);
        setIsLoading(false);
      });
  }, []);
  
  // Filtrar dívidas com base nos filtros selecionados
  const filteredDebts = debtsList.filter(debt => {
    let matches = true;
    
    if (selectedDebtorId && debt.devedorId !== selectedDebtorId) {
      matches = false;
    }
    
    if (selectedStatus && debt.status !== selectedStatus) {
      matches = false;
    }
    
    return matches;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Dívidas</h1>
        <div className="page-actions">
          <Link to="/new-debt" className="btn btn-primary">
            Nova Dívida
          </Link>
        </div>
      </div>
      
      <div className="card">
        <div className="filters">
          <div className="filter-item">
            <label htmlFor="debtorFilter" className="form-label">Filtrar por Devedor</label>
            <select
              id="debtorFilter"
              className="form-select"
              value={selectedDebtorId}
              onChange={(e) => setSelectedDebtorId(e.target.value)}
            >
              <option value="">Todos os Devedores</option>
              {debtorsList.map(debtor => (
                <option key={debtor.id} value={debtor.id}>
                  {debtor.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label htmlFor="statusFilter" className="form-label">Filtrar por Status</label>
            <select
              id="statusFilter"
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="ATIVA">Ativa</option>
              <option value="ATRASADA">Atrasada</option>
              <option value="QUITADA">Quitada</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-state">
            <p>Carregando dívidas...</p>
          </div>
        ) : filteredDebts.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Devedor</th>
                  <th>Valor</th>
                  <th>Juros</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebts.map(debt => (
                  <tr key={debt.id}>
                    <td>{debt.devedor?.nome || 'Desconhecido'}</td>
                    <td>{formatCurrency(debt.valorInicial)}</td>
                    <td>{debt.taxaJuros}%</td>
                    <td>{formatDate(debt.dataVencimento)}</td>
                    <td>
                      <span className={`status-badge ${debt.status.toLowerCase()}`}>
                        {getStatusDisplay(debt.status)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link 
                          to={`/debts/${debt.id}`}
                          className="action-link view-link"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma dívida encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DebtList;