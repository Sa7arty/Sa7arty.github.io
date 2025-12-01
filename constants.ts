import { Patient, Appointment, AppointmentStatus } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    dob: '1985-04-12',
    avatar: 'https://picsum.photos/200/200?random=1',
    status: 'Active',
    lastVisit: '2023-10-15',
    notes: [
      {
        id: 'n1',
        date: '2023-10-15',
        type: 'SOAP',
        content: 'S: Patient reports persistent headaches tailored to stress.\nO: BP 120/80. Tension noted in neck muscles.\nA: Tension headache.\nP: Recommend hydration, stress management, follow up in 2 weeks.'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '(555) 987-6543',
    dob: '1990-08-23',
    avatar: 'https://picsum.photos/200/200?random=2',
    status: 'Active',
    lastVisit: '2023-10-20',
    notes: []
  },
  {
    id: 'p3',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    dob: '1978-11-30',
    avatar: 'https://picsum.photos/200/200?random=3',
    status: 'Active',
    notes: []
  },
  {
    id: 'p4',
    name: 'James Wilson',
    email: 'j.wilson@example.com',
    phone: '(555) 222-3333',
    dob: '1982-02-14',
    avatar: 'https://picsum.photos/200/200?random=4',
    status: 'Archived',
    notes: []
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    durationMinutes: 60,
    status: AppointmentStatus.Completed,
    fee: 150
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Michael Chen',
    date: new Date(Date.now() + 3600000 * 2).toISOString(), // In 2 hours
    durationMinutes: 45,
    status: AppointmentStatus.Scheduled,
    fee: 120
  },
  {
    id: 'a3',
    patientId: 'p3',
    patientName: 'Emily Davis',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    durationMinutes: 60,
    status: AppointmentStatus.Scheduled,
    fee: 150
  },
  {
    id: 'a4',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // Next week
    durationMinutes: 30,
    status: AppointmentStatus.Scheduled,
    fee: 80
  },
  {
    id: 'a5',
    patientId: 'p4',
    patientName: 'James Wilson',
    date: new Date(Date.now() - 86400000 * 10).toISOString(), // Past
    durationMinutes: 60,
    status: AppointmentStatus.Completed,
    fee: 150
  }
];