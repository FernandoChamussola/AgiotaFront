import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    axios.post('https://gestor-agiota.onrender.com/api/auth/login', formData)
      .then(response => {
        localStorage.setItem('usuarioId', response.data.id);
        console.log('id:', response.data.id);
        setSuccessMessage('Login bem-sucedido! Redirecionando...');
        
        // Give user time to see success message
        setTimeout(() => {
          onLogin();
          navigate('/dashboard');
        }, 1000);
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else if (error.message === 'Network Error') {
          setError('Erro de conexão. Por favor, verifique sua internet.');
        } else {
          setError('Falha ao realizar login. Verifique suas credenciais.');
        }
      })
      .finally(() => {
        setIsLoading(false);
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
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{successMessage}</p>
            </div>
          )}
          
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary w-full flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : 'Entrar'}
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