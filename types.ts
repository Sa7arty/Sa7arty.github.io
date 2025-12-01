export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'No Show'
}

export interface Note {
  id: string;
  date: string;
  content: string;
  type: 'SOAP' | 'General' | 'Prescription';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar: string; // URL
  notes: Note[];
  lastVisit?: string;
  status: 'Active' | 'Archived';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // ISO string
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  fee: number;
}

export type ViewState = 'DASHBOARD' | 'CALENDAR' | 'PATIENTS' | 'SETTINGS';

export interface UserSettings {
  practiceName: string;
  providerName: string;
}