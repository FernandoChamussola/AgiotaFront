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
  
  // Função para verificar se a dívida está vencida
  const isDebtOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const debtDate = new Date(dueDate);
    debtDate.setHours(0, 0, 0, 0);
    return debtDate < today;
  };
  
  // Função para obter o status real da dívida, verificando a data de vencimento
  const getRealStatus = (debt) => {
    // Se a dívida está quitada, mantém o status
    if (debt.status === 'QUITADA') {
      return {
        displayStatus: 'Quitada',
        className: 'quitada',
        originalStatus: debt.status
      };
    }
    
    // Verifica se a dívida está vencida
    if (isDebtOverdue(debt.dataVencimento)) {
      return {
        displayStatus: 'Atrasada',
        className: 'atrasada',
        originalStatus: 'ATRASADA'
      };
    }
    
    // Caso contrário, mantém o status original
    const statusMap = {
      'ATIVA': { display: 'Ativa', className: 'ativa' },
      'ATRASADA': { display: 'Atrasada', className: 'atrasada' },
      'QUITADA': { display: 'Quitada', className: 'quitada' }
    };
    
    const status = statusMap[debt.status] || { display: debt.status, className: 'ativa' };
    
    return {
      displayStatus: status.display,
      className: status.className,
      originalStatus: debt.status
    };
  };
  
  // Efeito para buscar devedores
  useEffect(() => {
    console.log("Executando pedido de devedores");
    const usuarioId = localStorage.getItem('usuarioId');
    axios.get(`https://gestor-agiota.onrender.com/api/devedor/usuario/${usuarioId}`)
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
    axios.get(`https://gestor-agiota.onrender.com/api/divida/usuario/${usuarioId}`)
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
    
    if (selectedStatus) {
      // Se o status real da dívida for diferente do filtro, não mostrar
      const realStatus = getRealStatus(debt);
      if (realStatus.originalStatus !== selectedStatus) {
        matches = false;
      }
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
                {filteredDebts.map(debt => {
                  const statusInfo = getRealStatus(debt);
                  return (
                    <tr key={debt.id}>
                      <td>{debt.devedor?.nome || 'Desconhecido'}</td>
                      <td>{formatCurrency(debt.valorInicial)}</td>
                      <td>{debt.taxaJuros}%</td>
                      <td>{formatDate(debt.dataVencimento)}</td>
                      <td>
                        <span className={`status-badge ${statusInfo.className}`}>
                          {statusInfo.displayStatus}
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
                  );
                })}
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