import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OfficeLayout } from './components/layouts/OfficeLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { FinancialsPage } from './pages/FinancialsPage';
import { CompliancePage } from './pages/CompliancePage';
import { SitesPage } from './pages/SitesPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen bg-[#0a1628] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <OfficeLayout>
                <DashboardPage />
              </OfficeLayout>
            </ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute>
              <OfficeLayout>
                <ProjectsPage />
              </OfficeLayout>
            </ProtectedRoute>
          } />

          <Route path="/financials" element={
            <ProtectedRoute>
              <OfficeLayout>
                <FinancialsPage />
              </OfficeLayout>
            </ProtectedRoute>
          } />

          <Route path="/compliance" element={
            <ProtectedRoute>
              <OfficeLayout>
                <CompliancePage />
              </OfficeLayout>
            </ProtectedRoute>
          } />

          <Route path="/sites" element={
            <ProtectedRoute>
              <OfficeLayout>
                <SitesPage />
              </OfficeLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
