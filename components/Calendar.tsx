import React from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { Clock, MapPin, Video, CheckCircle, XCircle } from 'lucide-react';

interface CalendarProps {
  appointments: Appointment[];
}

const CalendarView: React.FC<CalendarProps> = ({ appointments }) => {
  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Completed: return 'bg-green-100 text-green-700 border-green-200';
      case AppointmentStatus.Cancelled: return 'bg-red-100 text-red-700 border-red-200';
      case AppointmentStatus.NoShow: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Schedule</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors text-sm font-medium">
          + New Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
           <h3 className="font-semibold text-gray-700">Upcoming Appointments</h3>
           <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Today: {new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2">
          {sortedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No appointments scheduled.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedAppointments.map((appt) => (
                <div key={appt.id} className="flex flex-col md:flex-row bg-white hover:bg-gray-50 border border-gray-100 rounded-lg p-4 transition-all hover:shadow-md">
                  
                  {/* Time Column */}
                  <div className="md:w-48 flex flex-col justify-center border-l-4 border-indigo-500 pl-4 mb-3 md:mb-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{formatDate(appt.date)}</p>
                    <div className="flex items-center text-gray-800 text-xl font-semibold mt-1">
                      <Clock size={18} className="mr-2 text-indigo-500" />
                      {formatTime(appt.date)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{appt.durationMinutes} min</p>
                  </div>

                  {/* Details Column */}
                  <div className="flex-1 pl-0 md:pl-6 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">{appt.patientName}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                           <span className="flex items-center"><Video size={14} className="mr-1"/> Telehealth</span>
                           <span className="flex items-center"><MapPin size={14} className="mr-1"/> San Francisco</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="md:w-32 flex md:flex-col items-center justify-center space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                    {appt.status === AppointmentStatus.Scheduled && (
                      <>
                        <button className="w-full flex items-center justify-center px-3 py-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 text-xs font-medium transition-colors">
                          <CheckCircle size={14} className="mr-1" /> Complete
                        </button>
                        <button className="w-full flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs font-medium transition-colors">
                          <XCircle size={14} className="mr-1" /> Cancel
                        </button>
                      </>
                    )}
                    {appt.status === AppointmentStatus.Completed && (
                      <button className="w-full text-indigo-600 hover:text-indigo-800 text-xs font-medium underline">
                        View Invoice
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;