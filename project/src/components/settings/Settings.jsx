import { useState } from 'react';
import { settings } from '../../mockData';
import './Settings.css';

function Settings() {
  const [formData, setFormData] = useState({
    capital: settings.capital,
    email: settings.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would save the settings
    console.log('Settings updated:', formData);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
      </div>
      
      {showSuccess && (
        <div className="alert alert-success">
          Configurações atualizadas com sucesso!
        </div>
      )}
      
      <div className="settings-grid">
        <div className="card">
          <h2>Informações Gerais</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="capital" className="form-label">Capital Disponível (MZN)</label>
              <input
                type="number"
                id="capital"
                name="capital"
                className="form-input"
                value={formData.capital}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <h2>Conta</h2>
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
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-input"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-input"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Atualizar Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;