import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, User, Building } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsProps {
  onResetData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onResetData }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('pf_settings');
    return saved ? JSON.parse(saved) : { practiceName: 'My Private Practice', providerName: 'Dr. Alex Smith' };
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('pf_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSave = () => {
    localStorage.setItem('pf_settings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure? This will delete all your new patients and notes and reset to the demo data.')) {
      onResetData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Building size={20} className="mr-2 text-indigo-500" /> Practice Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Practice Name</label>
            <input 
              type="text" 
              value={settings.practiceName}
              onChange={(e) => setSettings({...settings, practiceName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={settings.providerName}
                onChange={(e) => setSettings({...settings, providerName: e.target.value})}
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isSaved ? <CheckIcon /> : <Save size={18} className="mr-2" />}
              {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
          <Trash2 size={20} className="mr-2" /> Data Management
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          The app saves your data to this phone's storage. If you want to restart with the original demo data, click below.
        </p>
        <button 
          onClick={handleReset}
          className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <RefreshCw size={18} className="mr-2" /> Reset Application Data
        </button>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default Settings;