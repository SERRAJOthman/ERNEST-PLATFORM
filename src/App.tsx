import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OfficeLayout } from './components/layouts/OfficeLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { FinancialsPage } from './pages/FinancialsPage';
import { CompliancePage } from './pages/CompliancePage';
import { SitesPage } from './pages/SitesPage';

function App() {
  return (
    <Router>
      <OfficeLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </OfficeLayout>
    </Router>
  );
}


export default App;
