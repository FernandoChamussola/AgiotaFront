import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    capitalTotal: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://gestor-agiota.onrender.com/api/auth/register', formData)
      .then(response => {
        console.log(response.data);
        localStorage.setItem('usuarioId', response.data.id);
        console.log('Register attempt with:', formData);
        navigate('/');
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-between flex-col" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-center" style={{ color: 'var(--primary-color)', fontSize: '2.5rem' }}>Debt Tracker</h1>
          <p style={{ color: 'var(--gray-500)' }}>Gerencie suas dívidas com facilidade</p>
        </div>
        
        <div className="card">
          <h2 className="text-center mb-6">Criar Conta</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome" className="form-label">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-input"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                className="form-input"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="capitalTotal" className="form-label">Capital Total</label>
              <input
                type="text"
                id="capitalTotal"
                name="capitalTotal"
                className="form-input"
                style={{ marginBottom: '1.5rem' }}
                value={formData.capitalTotal}
                onChange={handleChange}
                placeholder="Capacidade financeira total"
                required
              />
            </div>
            
            <div className="form-group">
              <button type="submit" className="btn btn-primary w-full">
                Criar Conta
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p>
              Já tem uma conta?{' '}
              <Link to="/" style={{ color: 'var(--primary-color)' }}>
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-4" style={{ color: 'var(--gray-500)' }}>
        <p>© 2023 Debt Tracker. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}

export default Register;

