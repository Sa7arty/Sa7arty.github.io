import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import CalendarView from './components/Calendar';
import Settings from './components/Settings';
import { ViewState, Patient, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS } from './constants';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // -- Persistence Logic --
  
  // Initialize Patients from LocalStorage or fallback to Mock
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('pf_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  // Initialize Appointments from LocalStorage or fallback to Mock
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pf_appointments');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pf_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('pf_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleResetData = () => {
    localStorage.removeItem('pf_patients');
    localStorage.removeItem('pf_appointments');
    localStorage.removeItem('pf_settings');
    setPatients(MOCK_PATIENTS);
    setAppointments(MOCK_APPOINTMENTS);
    window.location.reload();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard appointments={appointments} totalPatients={patients.length} />;
      case 'PATIENTS':
        return <Patients patients={patients} setPatients={setPatients} />;
      case 'CALENDAR':
        return <CalendarView appointments={appointments} />;
      case 'SETTINGS':
        return <Settings onResetData={handleResetData} />;
      default:
        return <Dashboard appointments={appointments} totalPatients={patients.length} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-gray-800">PracticeFlow</span>
          </div>
          <img 
            src="https://picsum.photos/40/40" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;