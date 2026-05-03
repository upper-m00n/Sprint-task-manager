import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import Starred from './pages/Starred'
import SpaceDetails from './pages/SpaceDetails'
import Teams from './pages/Teams'
import TeamDetails from './pages/TeamDetails'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import AdminLogin from './pages/Auth/AdminLogin'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { WorkItemProvider, useWorkItem } from './context/WorkItemContext'
import { AdminProvider } from './admin/context/AdminContext'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminProjects from './admin/pages/AdminProjects'
import WorkItemModal from './components/WorkItems/WorkItemModal'
import WorkItemForm from './components/WorkItems/WorkItemForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ModalRenderer = () => {
    const { isModalOpen, closeModal } = useWorkItem();
    return (
      <WorkItemModal isOpen={isModalOpen} onClose={closeModal}>
        <WorkItemForm
          onSubmit={(data) => {
            console.log('Issue Created:', data);
            if (!data.createAnother) closeModal();
          }}
          onCancel={closeModal}
        />
      </WorkItemModal>
    );
  };

  const ProtectedLayout = ({ children }) => (
    <WorkItemProvider>
      <AdminProvider>
        <div className="min-h-screen bg-background text-text font-sans antialiased transition-colors duration-300">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-panel min-h-[calc(100vh-64px)] overflow-x-hidden transition-colors duration-300">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          <ModalRenderer />
        </div>
      </AdminProvider>
    </WorkItemProvider>
  );



  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Internal Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout><Dashboard /></ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/starred" element={
          <ProtectedRoute>
            <ProtectedLayout><Starred /></ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/spaces/:id/*" element={
          <ProtectedRoute>
            <ProtectedLayout><SpaceDetails /></ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute>
            <ProtectedLayout><Teams /></ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/teams/:id" element={
          <ProtectedRoute>
            <ProtectedLayout><TeamDetails /></ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin routes: admin-only, same layout with sidebar */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <ProtectedLayout><AdminDashboard /></ProtectedLayout>
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <AdminRoute>
              <ProtectedLayout><AdminProjects /></ProtectedLayout>
            </AdminRoute>
          </ProtectedRoute>
        } />

        {/* Redirect old root to dashboard (Home will handle unauthenticated) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App