import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where, limit } from 'firebase/firestore';
import { Appointment } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID mapping
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path,
  };
  console.error('[Firebase Client] Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function getAppointments(): Promise<Appointment[]> {
  const colPath = 'appointments';
  try {
    const querySnapshot = await getDocs(collection(db, colPath));
    const appointments: Appointment[] = [];
    querySnapshot.forEach((docRef) => {
      appointments.push(docRef.data() as Appointment);
    });
    // Sort by createdAt descending
    return appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, colPath);
  }
}

export async function createAppointment(payload: {
  serviceId: string;
  dentistId: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
}): Promise<Appointment> {
  const colPath = 'appointments';
  try {
    // 1. Check double bookings
    const q = query(
      collection(db, colPath),
      where('dentistId', '==', payload.dentistId),
      where('date', '==', payload.date),
      where('timeSlot', '==', payload.timeSlot),
      where('status', '==', 'confirmed')
    );
    const checkSnapshot = await getDocs(q);
    if (!checkSnapshot.empty) {
      const conflictErr = new Error('This time slot has already been reserved. Please choose a different appointment slot.');
      (conflictErr as any).status = 409;
      throw conflictErr;
    }

    // 2. Build unique ID matching standard format: APT-XXXX-XXXX
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const lastPart = Date.now().toString().slice(-4);
    const appointmentId = `APT-${randPart}-${lastPart}`;

    const newAppointment: Appointment = {
      id: appointmentId,
      serviceId: payload.serviceId,
      dentistId: payload.dentistId,
      date: payload.date,
      timeSlot: payload.timeSlot,
      patientName: payload.patientName,
      patientEmail: payload.patientEmail,
      patientPhone: payload.patientPhone,
      notes: payload.notes || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // 3. Save to database
    await setDoc(doc(db, colPath, appointmentId), newAppointment);
    return newAppointment;
  } catch (error) {
    if (error instanceof Error && (error as any).status === 409) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, colPath);
  }
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const path = `appointments/${id}`;
  try {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Appointment not found.');
    }

    const updatedData: Appointment = {
      ...(docSnap.data() as Appointment),
      status: 'cancelled',
    };

    await setDoc(docRef, updatedData, { merge: true });
    return updatedData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function rescheduleAppointment(id: string, date: string, timeSlot: string): Promise<Appointment> {
  const path = `appointments/${id}`;
  try {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Appointment not found.');
    }

    const targetApt = docSnap.data() as Appointment;

    // Check with other active bookings for the same dentist, date, and timeslot
    const checkQ = query(
      collection(db, 'appointments'),
      where('dentistId', '==', targetApt.dentistId),
      where('date', '==', date),
      where('timeSlot', '==', timeSlot),
      where('status', '==', 'confirmed')
    );
    const dupSnap = await getDocs(checkQ);
    const slotTaken = dupSnap.docs.some((docRecord) => docRecord.id !== id);

    if (slotTaken) {
      const conflictErr = new Error('This slot is already booked for another appointment on this day.');
      (conflictErr as any).status = 409;
      throw conflictErr;
    }

    const updatedApt: Appointment = {
      ...targetApt,
      date,
      timeSlot,
      status: 'confirmed',
    };

    await setDoc(docRef, updatedApt, { merge: true });
    return updatedApt;
  } catch (error) {
    if (error instanceof Error && (error as any).status === 409) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
