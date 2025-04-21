import { useParams, Link } from 'react-router-dom';
import { getDebtorById, getDebtsByDebtorId } from '../../mockData';
import './DebtorDetails.css';

function DebtorDetails() {
  const { id } = useParams();
  const debtorId = parseInt(id);
  const debtor = getDebtorById(debtorId);
  const debtorDebts = getDebtsByDebtorId(debtorId);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-MZ', options);
  };
  
  const totalDebt = debtorDebts.reduce((total, debt) => {
    if (debt.status === 'pending') {
      return total + debt.amount;
    }
    return total;
  }, 0);
  
  const totalPaid = debtorDebts.reduce((total, debt) => {
    if (debt.status === 'paid') {
      return total + debt.amount;
    }
    return total;
  }, 0);

  if (!debtor) {
    return (
      <div className="container">
        <div className="card">
          <p>Devedor não encontrado.</p>
          <Link to="/debtors" className="btn btn-primary">
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Detalhes do Devedor</h1>
        <div className="page-actions">
          <Link to="/debtors" className="btn btn-secondary">
            Voltar
          </Link>
          <Link to="/new-debt" className="btn btn-primary">
            Nova Dívida
          </Link>
        </div>
      </div>
      
      <div className="debtor-profile card">
        <div className="debtor-info">
          <h2>{debtor.name}</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Telefone:</span>
              <span className="info-value">{debtor.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Localização:</span>
              <span className="info-value">{debtor.location}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total em Dívida:</span>
              <span className="info-value highlight">{formatCurrency(totalDebt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Pago:</span>
              <span className="info-value paid">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="debtor-debts">
        <h2>Dívidas</h2>
        {debtorDebts.length > 0 ? (
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Valor</th>
                    <th>Juros</th>
                    <th>Data de Vencimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {debtorDebts.map(debt => (
                    <tr key={debt.id}>
                      <td>{formatCurrency(debt.amount)}</td>
                      <td>{debt.interest}%</td>
                      <td>{formatDate(debt.dueDate)}</td>
                      <td>
                        <span className={`status-badge ${debt.status}`}>
                          {debt.status === 'pending' ? 'Pendente' : 'Pago'}
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
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <p>Este devedor não possui dívidas registradas.</p>
              <Link to="/new-debt" className="btn btn-primary mt-4">
                Adicionar Dívida
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DebtorDetails;