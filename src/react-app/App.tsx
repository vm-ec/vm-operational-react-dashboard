import { BrowserRouter as Router, Routes, Route } from "react-router";
import { EnvironmentProvider } from "@/react-app/context/EnvironmentContext";
import { ServiceStateProvider } from "@/react-app/context/ServiceStateContext";
import { DashboardDataProvider } from "@/react-app/context/DashboardDataContext";
import Dashboard from "@/react-app/pages/Dashboard";

export default function App() {
  return (
    <DashboardDataProvider>
      <EnvironmentProvider>
        <ServiceStateProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Router>
        </ServiceStateProvider>
      </EnvironmentProvider>
    </DashboardDataProvider>
  );
}
