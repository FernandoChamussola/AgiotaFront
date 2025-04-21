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

  // Fetch debt details and payments on component mount
  useEffect(() => {
    const fetchDivida = async () => {
      try {
        // Fetch debt details
        const dividaResponse = await axios.get(`http://localhost:3000/api/divida/${id}`);
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
        const pagamentoResponse = await axios.get(`http://localhost:3000/api/pagamento/divida/${id}`);
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
      await axios.put(`http://localhost:3000/api/divida/${id}`, updatedData);
      setIsEditing(false);
      // Refresh debt details
      const response = await axios.get(`http://localhost:3000/api/divida/${id}`);
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
      await axios.post(`http://localhost:3000/api/pagamento`, {
        dividaId: id,
        valorPagamento,
      });
      setPaymentForm({ valorPagamento: '' });
      setIsRegisteringPayment(false);
      // Refresh debt and payment details
      const dividaResponse = await axios.get(`http://localhost:3000/api/divida/${id}`);
      setDivida(dividaResponse.data);
      const pagamentoResponse = await axios.get(`http://localhost:3000/api/pagamento/divida/${id}`);
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

  // Handle debt deletion
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta dívida?')) {
      try {
        await axios.delete(`http://localhost:3000/api/divida/${id}`);
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
          <p><strong>Valor Inicial:</strong> R$ {divida.valorInicial?.toFixed(2) || '0.00'}</p>
          <p><strong>Taxa de Juros:</strong> {divida.taxaJuros || '0'}%</p>
          <p><strong>Valor Total Devido:</strong> R$ {valorTotal}</p>
          <p>
            <strong>Data de Vencimento:</strong>{' '}
            {divida.dataVencimento
              ? new Date(divida.dataVencimento).toLocaleDateString()
              : 'N/A'}
          </p>
          <p><strong>Status:</strong> {divida.status || 'N/A'}</p>
          <p><strong>Observações:</strong> {divida.observacoes || 'Nenhuma'}</p>
          <button onClick={toggleEdit}>Editar</button>
          <button onClick={toggleRegisterPayment}>Registrar Pagamento</button>
          <button onClick={handleDelete} className="delete-button">Excluir</button>
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

      {pagamentos.length > 0 && (
        <div className="payment-history">
          <h3>Histórico de Pagamentos</h3>
          <ul>
            {pagamentos.map((pagamento) => (
              <li key={pagamento.id}>
                Valor: R$ {pagamento.valor.toFixed(2)} - Data:{' '}
                {new Date(pagamento.data).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DebtDetails;