import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NewDebt.css';
import axios from 'axios';

function NewDebt() {
  const [formData, setFormData] = useState({
    usuarioId: localStorage.getItem('usuarioId'),
    devedorId: '',
    valorInicial: '',
    taxaJuros: '',
    dataVencimento: '',
    observacoes: ''
  });
  const [debtorOptions, setDebtorOptions] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    axios.get(`https://gestor-agiota.onrender.com/api/devedor/usuario/${usuarioId}`)
      .then(response => {
        setDebtorOptions(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []); // Array de dependências vazio para executar apenas uma vez

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would save the new debt
    console.log('New debt created:', formData);
    
    axios.post('https://gestor-agiota.onrender.com/api/divida', formData)
      .then(response => {
        console.log('Dívida criada com sucesso:', response.data);
        // Redirect to debts list
        navigate('/debts');
      })
      .catch(error => {
        console.error('Erro ao criar dívida:', error);
        // Adicione aqui alguma lógica para tratar erros (exibir mensagem para o usuário, etc)
      });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Nova Dívida</h1>
        <div className="page-actions">
          <Link to="/debts" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="devedorId" className="form-label">Devedor</label>
            <select
              id="devedorId"
              name="devedorId"
              className="form-select"
              value={formData.devedorId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione um devedor</option>
              {debtorOptions.map(debtor => (
                <option key={debtor.id} value={debtor.id}>
                  {debtor.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="valorInicial" className="form-label">Valor da Dívida (MZN)</label>
            <input
              type="number"
              id="valorInicial"
              name="valorInicial"
              className="form-input"
              value={formData.valorInicial}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="taxaJuros" className="form-label">Juros (%)</label>
            <input
              type="number"
              id="taxaJuros"
              name="taxaJuros"
              className="form-input"
              value={formData.taxaJuros}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dataVencimento" className="form-label">Data de Vencimento</label>
            <input
              type="date"
              id="dataVencimento"
              name="dataVencimento"
              className="form-input"
              value={formData.dataVencimento}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="observacoes" className="form-label">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              className="form-input"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Registrar Dívida
            </button>
            <Link to="/debts" className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDebt;