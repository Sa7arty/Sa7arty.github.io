import React from 'react';
import { LayoutDashboard, Calendar, Users, Settings, Activity } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'CALENDAR', label: 'Schedule', icon: Calendar },
    { id: 'PATIENTS', label: 'Patients', icon: Users },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
    `}>
      <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Activity className="text-white h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">PracticeFlow</h1>
      </div>

      <nav className="p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
          <img 
            src="https://picsum.photos/40/40" 
            alt="Doctor" 
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Dr. Alex Smith</p>
            <p className="text-xs text-gray-500 truncate">Psychologist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;