import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import Debtors from './components/debtors/Debtors'
import NewDebt from './components/debts/NewDebt'
import DebtorDetails from './components/debtors/DebtorDetails'
import DebtList from './components/debts/DebtList'
import DebtDetails from './components/debts/DebtDetails'
import Settings from './components/settings/Settings'
import Navbar from './components/layout/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        <main className="content-container">
          <Routes>
            <Route path="/" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/debtors" element={isAuthenticated ? <Debtors /> : <Navigate to="/" />} />
            <Route path="/debtors/:id" element={isAuthenticated ? <DebtorDetails /> : <Navigate to="/" />} />
            <Route path="/new-debt" element={isAuthenticated ? <NewDebt /> : <Navigate to="/" />} />
            <Route path="/debts" element={isAuthenticated ? <DebtList /> : <Navigate to="/" />} />
            <Route path="/debts/:id" element={isAuthenticated ? <DebtDetails /> : <Navigate to="/" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App