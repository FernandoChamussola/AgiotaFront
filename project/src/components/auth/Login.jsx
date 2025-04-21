import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
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
    axios.post('https://gestor-agiota.onrender.com/api/auth/login', formData)
    .then(response => {
      console.log('Login attempt with:', formData);
      onLogin();
      navigate('/dashboard');
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
          <h2 className="text-center mb-6">Login</h2>
          
          <form onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary w-full">
                Entrar
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" style={{ color: 'var(--primary-color)' }}>
                Criar conta
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

export default Login;
