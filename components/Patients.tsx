import React, { useState, useCallback } from 'react';
import { Patient, Note } from '../types';
import { Search, Plus, MoreVertical, FileText, Mail, ArrowLeft, Sparkles, Send, Mic } from 'lucide-react';
import { refineNoteToSOAP, generatePatientEmail } from '../services/geminiService';

interface PatientsProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const Patients: React.FC<PatientsProps> = ({ patients, setPatients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activePatient = patients.find(p => p.id === selectedPatientId);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdatePatientNotes = (patientId: string, newNote: Note) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, notes: [newNote, ...p.notes] };
      }
      return p;
    }));
  };

  if (activePatient) {
    return (
      <PatientDetailView 
        patient={activePatient} 
        onBack={() => setSelectedPatientId(null)} 
        onAddNote={handleUpdatePatientNotes}
      />
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Patients</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center">
          <Plus size={16} className="mr-2" /> Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search patients by name or email..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <div 
            key={patient.id}
            onClick={() => setSelectedPatientId(patient.id)}
            className="bg-white p-5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
              <button className="text-gray-400 hover:text-indigo-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{patient.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{patient.email}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
              <span>Last Visit: {patient.lastVisit || 'N/A'}</span>
              <span className={`px-2 py-1 rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {patient.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-component: Patient Detail & AI Notes ---

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onAddNote: (id: string, note: Note) => void;
}

const PatientDetailView: React.FC<PatientDetailProps> = ({ patient, onBack, onAddNote }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'communication'>('notes');
  const [noteInput, setNoteInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Communication state
  const [emailTopic, setEmailTopic] = useState('');
  const [emailDetails, setEmailDetails] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');

  const handleAISoapGeneration = async () => {
    if (!noteInput.trim()) return;
    setIsGenerating(true);
    const soapNote = await refineNoteToSOAP(noteInput);
    setNoteInput(soapNote);
    setIsGenerating(false);
  };

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: noteInput,
      type: 'SOAP'
    };
    onAddNote(patient.id, newNote);
    setNoteInput('');
  };

  const handleDraftEmail = async () => {
    if (!emailTopic || !emailDetails) return;
    setIsGenerating(true);
    const email = await generatePatientEmail(patient.name, emailTopic, emailDetails);
    setGeneratedEmail(email);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Directory
      </button>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <img src={patient.avatar} alt={patient.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
          <div className="flex flex-col md:flex-row md:space-x-4 text-gray-500 mt-2 text-sm">
             <span>DOB: {patient.dob}</span>
             <span className="hidden md:inline">•</span>
             <span>{patient.phone}</span>
             <span className="hidden md:inline">•</span>
             <span>{patient.email}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
             <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 px-2">
        <button 
          onClick={() => setActiveTab('notes')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Clinical Notes
        </button>
        <button 
          onClick={() => setActiveTab('communication')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'communication' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Communication
        </button>
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Overview
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'notes' && (
            <>
              {/* New Note Editor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <FileText size={18} className="mr-2 text-indigo-500"/> New Clinical Note
                  </h3>
                  <div className="flex space-x-2">
                     <button 
                      onClick={handleAISoapGeneration}
                      disabled={isGenerating || !noteInput}
                      className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold rounded-full shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      {isGenerating ? 'Thinking...' : (
                        <>
                          <Sparkles size={14} className="mr-1" /> AI Refine to SOAP
                        </>
                      )}
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Mic size={18} />
                    </button>
                  </div>
                </div>
                <textarea 
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Start typing raw notes here... e.g. 'Patient sleeping better, less anxiety, continued 50mg Zoloft'"
                  className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm text-gray-700 bg-gray-50/50"
                />
                <div className="flex justify-end mt-3">
                  <button 
                    onClick={handleSaveNote}
                    disabled={!noteInput}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Past Notes History */}
              <div className="space-y-4">
                {patient.notes.map(note => (
                  <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wide">{note.type}</span>
                        <span className="text-xs text-gray-400 ml-2">{note.date}</span>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{note.content}</pre>
                  </div>
                ))}
                {patient.notes.length === 0 && (
                  <div className="text-center py-10 text-gray-400">No notes recorded yet.</div>
                )}
              </div>
            </>
          )}

          {activeTab === 'communication' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Mail size={18} className="mr-2 text-indigo-500"/> Draft Email to Patient
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  placeholder="Topic (e.g. Appointment Reminder, Lab Results)" 
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  value={emailTopic}
                  onChange={e => setEmailTopic(e.target.value)}
                />
                <textarea 
                  placeholder="Key details to include..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm resize-none"
                  value={emailDetails}
                  onChange={e => setEmailDetails(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleDraftEmail}
                  disabled={isGenerating || !emailTopic}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  <Sparkles size={14} className="mr-2" />
                  {isGenerating ? 'Drafting...' : 'Draft with AI'}
                </button>
              </div>

              {generatedEmail && (
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 animate-in fade-in">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Generated Draft</h4>
                  <textarea 
                    readOnly
                    value={generatedEmail}
                    className="w-full h-48 bg-white p-3 border border-gray-200 rounded text-sm text-gray-700"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button className="text-xs text-gray-500 hover:text-gray-800">Copy to Clipboard</button>
                    <button className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
                      <Send size={12} className="mr-1" /> Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

           {activeTab === 'overview' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-gray-400 h-64">
              <p>Patient demographics and insurance info would go here.</p>
            </div>
          )}

        </div>

        {/* Sidebar Info (Right) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Next Appointment</h4>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="text-indigo-900 font-bold text-lg">Nov 14</div>
              <div className="text-indigo-600 text-sm font-medium">10:00 AM - 11:00 AM</div>
              <div className="text-indigo-400 text-xs mt-2">Consultation • 60 min</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">Create Invoice</button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">Upload Documents</button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">Archive Patient</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;