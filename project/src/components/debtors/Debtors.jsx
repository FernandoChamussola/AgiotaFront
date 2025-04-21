import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { debtors } from '../../mockData';
import './Debtors.css';
import { use } from 'react';
import axios from 'axios';

function Debtors() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '258',
    endereco: ''
  });
  const [debtorsList, setDebtorsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    console.log("executando pedido de devedores")
    const usuarioId = localStorage.getItem('usuarioId');
    axios.get(`https://gestor-agiota.onrender.com/api/devedor/usuario/${usuarioId}`)
      .then(response => {
        setDebtorsList(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDebtor = {
      id: debtorsList.length + 1,
      ...formData
    };
    setDebtorsList([...debtorsList, newDebtor]);
    setFormData({
      nome: '',
      telefone: '258',
      endereco: ''
    });
    axios.post('https://gestor-agiota.onrender.com/api/devedor/register', formData)
    .then(response => {
      console.log(response.data);
      setShowForm(false);
    })
    .catch(error => {
      console.error(error);
    });
  
  };

  const filteredDebtors = debtorsList.filter(debtor => 
    debtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debtor.telefone.includes(searchTerm) ||
    debtor.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Devedores</h1>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Adicionar Devedor'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="card mb-4">
          <h2>Adicionar Novo Devedor</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-input"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone" className="form-label">Número de Telefone</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                className="form-input"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endereco" className="form-label">Localização</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                className="form-input"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar devedores..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredDebtors.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Localização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebtors.map(debtor => (
                  <tr key={debtor.id}>
                    <td>{debtor.nome}</td>
                    <td>{debtor.telefone}</td>
                    <td>{debtor.endereco}</td>
                    <td>
                      <div className="table-actions">
                        <Link 
                          to={`/debtors/${debtor.id}`}
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
            <p>Nenhum devedor encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Debtors;
