// Sample mock data for the prototype

export const debtors = [
  { 
    id: 1, 
    name: 'João Silva', 
    phone: '258912345678', 
    location: 'Maputo' 
  },
  { 
    id: 2, 
    name: 'Maria Gomes', 
    phone: '258987654321', 
    location: 'Beira' 
  },
  { 
    id: 3, 
    name: 'António Santos', 
    phone: '258945678123', 
    location: 'Nampula' 
  }
];

export const debts = [
  {
    id: 1,
    debtorId: 1,
    amount: 5000,
    interest: 10,
    dueDate: '2023-12-31',
    observations: 'Empréstimo para negócios',
    status: 'pending'
  },
  {
    id: 2,
    debtorId: 1,
    amount: 2000,
    interest: 5,
    dueDate: '2023-11-15',
    observations: 'Pagamento de escola',
    status: 'paid'
  },
  {
    id: 3,
    debtorId: 2,
    amount: 10000,
    interest: 15,
    dueDate: '2024-01-20',
    observations: 'Reforma da casa',
    status: 'pending'
  },
  {
    id: 4,
    debtorId: 3,
    amount: 3500,
    interest: 8,
    dueDate: '2023-12-10',
    observations: 'Compra de equipamento',
    status: 'pending'
  }
];

export const dashboardData = {
  totalDebtors: 3,
  totalDebts: 4,
  totalAmount: 20500,
  totalPending: 18500,
  totalPaid: 2000
};

export const settings = {
  capital: 50000,
  email: 'admin@debttracker.com',
  password: '••••••••'
};

// Helper function to get debtor name by ID
export const getDebtorById = (id) => {
  return debtors.find(debtor => debtor.id === id);
};

// Helper function to get debts by debtor ID
export const getDebtsByDebtorId = (debtorId) => {
  return debts.filter(debt => debt.debtorId === debtorId);
};

// Helper function to get debt by ID
export const getDebtById = (id) => {
  return debts.find(debt => debt.id === id);
};