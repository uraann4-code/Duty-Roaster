import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { OfficialItem, UserSettings } from './types';
import { DEFAULT_SETTINGS, getSampleInitialItems } from './storage';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (with explicit databaseId if configured)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const TASKS_COLLECTION = 'tasks';
const SETTINGS_COLLECTION = 'settings';
const GENERAL_SETTINGS_DOC = 'general';

/**
 * Subscribe to real-time updates of official tasks/directives from Firestore
 */
export const subscribeToOfficialItems = (
  onData: (items: OfficialItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const colRef = collection(db, TASKS_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed default items if the cloud database is completely empty
        const initial = getSampleInitialItems();
        try {
          const batch = writeBatch(db);
          for (const item of initial) {
            const docRef = doc(db, TASKS_COLLECTION, item.id);
            batch.set(docRef, { ...item, updatedAt: new Date().toISOString() });
          }
          await batch.commit();
        } catch (seedErr) {
          console.error('Error seeding initial tasks to Firestore:', seedErr);
        }
        onData(initial);
      } else {
        const items: OfficialItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            type: data.type || 'directive',
            referenceNo: data.referenceNo || '',
            assignedBy: data.assignedBy || 'Head of Examination (HOE)',
            assignee: data.assignee || 'Mubashir Qayyum',
            department: data.department || 'Examination & Assessment Directorate',
            dueDate: data.dueDate || new Date().toISOString().split('T')[0],
            dueTime: data.dueTime || '14:00',
            priority: data.priority || 'urgent',
            status: data.status || 'pending',
            actionRequired: data.actionRequired || '',
            locationOrVenue: data.locationOrVenue || '',
            correspondenceSource: data.correspondenceSource || '',
            description: data.description || '',
            checklist: Array.isArray(data.checklist) ? data.checklist : [],
            createdDate: data.createdDate || new Date().toISOString(),
            completedAt: data.completedAt || undefined,
            completionNotes: data.completionNotes || undefined,
            tags: Array.isArray(data.tags) ? data.tags : [],
            isHighlightedAsSirDirective: !!data.isHighlightedAsSirDirective,
          };
        });

        // Sort items: pending first, then by dueDate/dueTime
        items.sort((a, b) => {
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          const aDateTime = `${a.dueDate} ${a.dueTime}`;
          const bDateTime = `${b.dueDate} ${b.dueTime}`;
          return aDateTime.localeCompare(bDateTime);
        });

        onData(items);
      }
    },
    (err) => {
      console.error('Firestore items subscription error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Add or update an official task in Firestore
 */
export const saveTaskToDatabase = async (item: OfficialItem): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, item.id);
  await setDoc(
    docRef,
    {
      ...item,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

/**
 * Delete an official task from Firestore
 */
export const deleteTaskFromDatabase = async (itemId: string): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, itemId);
  await deleteDoc(docRef);
};

/**
 * Subscribe to real-time office & user settings
 */
export const subscribeToOfficeSettings = (
  onData: (settings: UserSettings) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);

  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() });
        } catch (err) {
          console.error('Error creating default settings in Firestore:', err);
        }
        onData(DEFAULT_SETTINGS);
      } else {
        const data = snapshot.data();
        onData({
          officeName: data.officeName || DEFAULT_SETTINGS.officeName,
          departmentName: data.departmentName || DEFAULT_SETTINGS.departmentName,
          officerName: data.officerName || DEFAULT_SETTINGS.officerName,
          officerTitle: data.officerTitle || DEFAULT_SETTINGS.officerTitle,
          superiorTitle: data.superiorTitle || DEFAULT_SETTINGS.superiorTitle,
          showUrgentAlerts: data.showUrgentAlerts !== undefined ? data.showUrgentAlerts : true,
        });
      }
    },
    (err) => {
      console.error('Firestore settings subscription error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Save user/office settings to Firestore
 */
export const saveOfficeSettingsToDatabase = async (settings: UserSettings): Promise<void> => {
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
  await setDoc(
    docRef,
    {
      ...settings,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};
