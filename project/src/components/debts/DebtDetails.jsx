import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DebtDetails.css';

function DebtDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [divida, setDivida] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisteringPayment, setIsRegisteringPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ valorPagamento: '' });
  const [formData, setFormData] = useState({
    usuarioId: '',
    devedorId: '',
    valorInicial: '',
    taxaJuros: '',
    dataVencimento: '',
    observacoes: '',
  });
  const [error, setError] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyType, setNotifyType] = useState('upcoming');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Verificar se a dívida está vencida e por quantos dias
  const getDaysOverdue = () => {
    if (!divida || !divida.dataVencimento) return 0;
    
    const today = new Date();
    const dueDate = new Date(divida.dataVencimento);
    
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Fetch debt details and payments on component mount
  useEffect(() => {
    const fetchDivida = async () => {
      try {
        // Fetch debt details
        const dividaResponse = await axios.get(`https://gestor-agiota.onrender.com/api/divida/${id}`);
        const dividaData = dividaResponse.data;
        console.log('Detalhes da Dívida:', dividaData);
        setDivida(dividaData);

        // Validate and format dataVencimento
        let formattedDate = '';
        if (dividaData.dataVencimento) {
          const date = new Date(dividaData.dataVencimento);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          } else {
            console.warn('Invalid date received:', dividaData.dataVencimento);
          }
        }

        // Initialize form data
        setFormData({
          usuarioId: dividaData.usuarioId || '',
          devedorId: dividaData.devedorId || '',
          valorInicial: dividaData.valorInicial || '',
          taxaJuros: dividaData.taxaJuros || '',
          dataVencimento: formattedDate,
          observacoes: dividaData.observacoes || '',
        });

        // Fetch payment history
        const pagamentoResponse = await axios.get(`https://gestor-agiota.onrender.com/api/pagamento/divida/${id}`);
        const { pagamentos, totalPago } = pagamentoResponse.data;
        setPagamentos(pagamentos);
        // Calculate valorTotal: valorInicial + interest - total payments
        setValorTotal(dividaData.valorTotal);
      } catch (err) {
        setError('Erro ao carregar detalhes da dívida');
        console.error(err);
      }
    };
    fetchDivida();
  }, [id]);

  // Handle form input changes for debt editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment form input changes
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle debt editing submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        usuarioId: formData.usuarioId,
        devedorId: formData.devedorId,
        valorInicial: parseFloat(formData.valorInicial),
        taxaJuros: parseFloat(formData.taxaJuros),
        dataVencimento: formData.dataVencimento
          ? new Date(formData.dataVencimento).toISOString()
          : null,
        observacoes: formData.observacoes,
      };
      await axios.put(`https://gestor-agiota.onrender.com/api/divida/${id}`, updatedData);
      setIsEditing(false);
      // Refresh debt details
      const response = await axios.get(`https://gestor-agiota.onrender.com/api/divida/${id}`);
      setDivida(response.data);
      alert('Dívida atualizada com sucesso!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar dívida');
      console.error(err);
    }
  };

  // Handle payment registration
  const handleRegisterPayment = async (e) => {
    e.preventDefault();
    try {
      const valorPagamento = parseFloat(paymentForm.valorPagamento);
      if (valorPagamento <= 0) {
        setError('O valor do pagamento deve ser maior que zero');
        return;
      }
      await axios.post(`https://gestor-agiota.onrender.com/api/pagamento`, {
        dividaId: id,
        valorPagamento,
      });
      setPaymentForm({ valorPagamento: '' });
      setIsRegisteringPayment(false);
      // Refresh debt and payment details
      const dividaResponse = await axios.get(`https://gestor-agiota.onrender.com/api/divida/${id}`);
      setDivida(dividaResponse.data);
      const pagamentoResponse = await axios.get(`https://gestor-agiota.onrender.com/api/pagamento/divida/${id}`);
      const { pagamentos, totalPago } = pagamentoResponse.data;
      setPagamentos(pagamentos);
      const interest = (dividaResponse.data.valorInicial * dividaResponse.data.taxaJuros) / 100;
      setValorTotal((dividaResponse.data.valorInicial + interest - totalPago).toFixed(2));
      alert('Pagamento registrado com sucesso!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar pagamento');
      console.error(err);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(null);
  };

  // Toggle payment registration form
  const toggleRegisterPayment = () => {
    setIsRegisteringPayment(!isRegisteringPayment);
    setError(null);
  };

  // Toggle notification modal
  const toggleNotifyModal = () => {
    setShowNotifyModal(!showNotifyModal);
    setCustomMessage('');
    setNotifyType('upcoming');
    setError(null);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  // Prepare WhatsApp message based on type
  const prepareMessage = () => {
    if (!divida || !divida.devedor) return '';

    const devedorNome = divida.devedor.nome;
    const valorDivida = formatCurrency(valorTotal);
    const dataVencimento = divida.dataVencimento ? formatDate(divida.dataVencimento) : 'não definida';
    const diasAtraso = getDaysOverdue();

    switch (notifyType) {
      case 'upcoming':
        return `Olá ${devedorNome}, este é um lembrete amigável de que sua dívida no valor de ${valorDivida} vence em ${dataVencimento}. Por favor, prepare-se para o pagamento. Obrigado! #Debt Tracker`;
      case 'overdue':
        return `Olá ${devedorNome}, sua dívida no valor de ${valorDivida} está atrasada há ${diasAtraso} dias (vencimento: ${dataVencimento}). Por favor, entre em contato para regularizar sua situação o mais rápido possível. #Debt Tracker`;
      case 'custom':
        return customMessage;
      default:
        return '';
    }
  };

  // Send WhatsApp notification
  const sendWhatsAppNotification = async () => {
    if (!divida || !divida.devedor || !divida.devedor.telefone) {
      setError('Telefone do devedor não disponível');
      return;
    }

    const telefone = divida.devedor.telefone.replace(/\D/g, ''); // Remove non-numeric characters
    const mensagem = prepareMessage();

    if (!mensagem) {
      setError('Mensagem não pode estar vazia');
      return;
    }

    setSendingMessage(true);
    try {
      const response = await axios.post('https://mywhatssapapi.onrender.com/enviar', {
        numero: telefone,
        mensagem: mensagem
      });
      
      console.log('Resposta da API:', response.data);
      alert('Notificação enviada com sucesso!');
      setShowNotifyModal(false);
    } catch (err) {
      setError('Erro ao enviar notificação: ' + (err.response?.data?.erro || err.message));
      console.error('Erro ao enviar WhatsApp:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle debt deletion
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta dívida?')) {
      try {
        await axios.delete(`https://gestor-agiota.onrender.com/api/divida/${id}`);
        alert('Dívida excluída com sucesso!');
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao excluir dívida');
        console.error(err);
      }
    }
  };

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => setError(null)}>Tentar novamente</button>
      </div>
    );
  }

  if (!divida) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="debt-details-container">
      <h2>Detalhes da Dívida</h2>
      {!isEditing ? (
        <div className="debt-info">
          <p><strong>Devedor:</strong> {divida.devedor?.nome || 'N/A'}</p>
          <p><strong>Telefone:</strong> {divida.devedor?.telefone || 'N/A'}</p>
          <p><strong>Valor Inicial:</strong> {formatCurrency(divida.valorInicial || 0)}</p>
          <p><strong>Taxa de Juros:</strong> {divida.taxaJuros || '0'}%</p>
          <p><strong>Valor Total Devido:</strong> {formatCurrency(valorTotal)}</p>
          <p>
            <strong>Data de Vencimento:</strong>{' '}
            {divida.dataVencimento
              ? formatDate(divida.dataVencimento)
              : 'N/A'}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${getDaysOverdue() > 0 && divida.status !== 'QUITADA' ? 'atrasada' : divida.status.toLowerCase()}`}>
              {getDaysOverdue() > 0 && divida.status !== 'QUITADA' ? 'Atrasada' : 
                divida.status === 'ATIVA' ? 'Ativa' : 
                divida.status === 'QUITADA' ? 'Quitada' : divida.status}
            </span>
          </p>
          <p><strong>Observações:</strong> {divida.observacoes || 'Nenhuma'}</p>
          <div className="action-buttons">
            <button onClick={toggleEdit}>Editar</button>
            <button onClick={toggleRegisterPayment}>Registrar Pagamento</button>
            <button onClick={toggleNotifyModal} className="notify-button">Notificar via WhatsApp</button>
            <button onClick={handleDelete} className="delete-button">Excluir</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
          <label>
            Valor Inicial:
            <input
              type="number"
              name="valorInicial"
              value={formData.valorInicial}
              onChange={handleInputChange}
              required
              step="0.01"
            />
          </label>
          <label>
            Taxa de Juros (%):
            <input
              type="number"
              name="taxaJuros"
              value={formData.taxaJuros}
              onChange={handleInputChange}
              required
              step="0.01"
            />
          </label>
          <label>
            Data de Vencimento:
            <input
              type="date"
              name="dataVencimento"
              value={formData.dataVencimento}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Observações:
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={toggleEdit}>Cancelar</button>
        </form>
      )}

      {isRegisteringPayment && (
        <form onSubmit={handleRegisterPayment} className="payment-form">
          <label>
            Valor do Pagamento:
            <input
              type="number"
              name="valorPagamento"
              value={paymentForm.valorPagamento}
              onChange={handlePaymentInputChange}
              required
              step="0.01"
              placeholder="Digite o valor"
            />
          </label>
          <button type="submit">Confirmar Pagamento</button>
          <button type="button" onClick={toggleRegisterPayment}>Cancelar</button>
        </form>
      )}

      {/* Modal de Notificação WhatsApp */}
      {showNotifyModal && (
        <div className="notify-modal">
          <div className="notify-modal-content">
            <h3>Notificar via WhatsApp</h3>
            <div className="notify-options">
              <label>
                <input
                  type="radio"
                  name="notifyType"
                  value="upcoming"
                  checked={notifyType === 'upcoming'}
                  onChange={() => setNotifyType('upcoming')}
                />
                Lembrete de Pagamento Próximo
              </label>
              <label>
                <input
                  type="radio"
                  name="notifyType"
                  value="overdue"
                  checked={notifyType === 'overdue'}
                  onChange={() => setNotifyType('overdue')}
                />
                Notificação de Atraso
              </label>
              <label>
                <input
                  type="radio"
                  name="notifyType"
                  value="custom"
                  checked={notifyType === 'custom'}
                  onChange={() => setNotifyType('custom')}
                />
                Mensagem Personalizada
              </label>
            </div>
            
            {notifyType === 'custom' && (
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Digite sua mensagem personalizada..."
                rows={4}
              />
            )}

            <div className="message-preview">
              <h4>Prévia da Mensagem:</h4>
              <p>{prepareMessage()}</p>
            </div>

            <div className="modal-actions">
              <button 
                onClick={sendWhatsAppNotification} 
                disabled={sendingMessage || (notifyType === 'custom' && !customMessage.trim())}
              >
                {sendingMessage ? 'Enviando...' : 'Enviar Notificação'}
              </button>
              <button onClick={toggleNotifyModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {pagamentos.length > 0 && (
        <div className="payment-history">
          <h3>Histórico de Pagamentos</h3>
          <ul>
            {pagamentos.map((pagamento) => (
              <li key={pagamento.id}>
                Valor: {formatCurrency(pagamento.valor)} - Data:{' '}
                {formatDate(pagamento.data)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DebtDetails;