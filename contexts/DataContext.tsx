import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { Student, Teacher, ProgressRecord, Period, Halaqa } from '../types';
import { db } from '../firebaseConfig';

declare const firebase: any;

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  periods: Period[];
  halaqas: Halaqa[];
  addProgressRecord: (studentId: string, record: Omit<ProgressRecord, 'id'>) => Promise<void>;
  addPeriod: (period: Omit<Period, 'id'>) => Promise<void>;
  updatePeriod: (period: Period) => Promise<void>;
  deletePeriod: (periodId: string) => Promise<void>;
  addHalaqa: (halaqa: Omit<Halaqa, 'id'>) => Promise<void>;
  updateHalaqa: (halaqa: Halaqa) => Promise<void>;
  deleteHalaqa: (halaqaId: string) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (teacher: Teacher) => Promise<void>;
  deleteTeacher: (teacherId: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id' | 'progress'>) => Promise<void>;
  updateStudent: (student: Omit<Student, 'progress'>) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [halaqas, setHalaqas] = useState<Halaqa[]>([]);

  useEffect(() => {
    const collections: { [key: string]: React.Dispatch<React.SetStateAction<any[]>> } = {
      periods: setPeriods,
      halaqas: setHalaqas,
      teachers: setTeachers,
      students: setStudents,
    };

    const unsubscribes = Object.entries(collections).map(([collectionName, setter]) => {
      const q = db.collection(collectionName);
      return q.onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => {
            const d = doc.data();
            switch(collectionName) {
                case 'periods':
                    return { id: doc.id, name: d.name, nameAr: d.nameAr };
                case 'halaqas':
                    return { id: doc.id, name: d.name, nameAr: d.nameAr, periodId: d.periodId, teacherId: d.teacherId };
                case 'teachers':
                    return { id: doc.id, name: d.name, nameAr: d.nameAr };
                case 'students':
                    const progress = (d.progress || []).map((p: any) => ({
                        id: p.id, date: p.date, type: p.type, status: p.status, surah: p.surah, details: p.details,
                    }));
                    return { id: doc.id, name: d.name, nameAr: d.nameAr, halaqaId: d.halaqaId, progress };
                default:
                    return { id: doc.id, ...d };
            }
        });
        setter(data);
      }, (error) => {
        console.error(`Firestore snapshot error for ${collectionName}: `, error);
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);


  const addProgressRecord = async (studentId: string, record: Omit<ProgressRecord, 'id'>) => {
    const studentRef = db.collection('students').doc(studentId);
    const newRecordWithId = { ...record, id: `p${Date.now()}` };
    await studentRef.update({
      progress: firebase.firestore.FieldValue.arrayUnion(newRecordWithId)
    });
  };

  const addPeriod = async (period: Omit<Period, 'id'>) => {
    await db.collection('periods').add(period);
  };

  const updatePeriod = async (updatedPeriod: Period) => {
    const { id, ...data } = updatedPeriod;
    await db.collection('periods').doc(id).update(data);
  };

  const deletePeriod = async (periodId: string) => {
    const halaqaQuery = db.collection('halaqas').where('periodId', '==', periodId);
    const querySnapshot = await halaqaQuery.get();
    if (!querySnapshot.empty) {
      throw new Error('This period cannot be deleted because it is assigned to one or more halaqas.');
    }
    await db.collection('periods').doc(periodId).delete();
  };

  const addHalaqa = async (halaqa: Omit<Halaqa, 'id'>) => {
    await db.collection('halaqas').add(halaqa);
  };

  const updateHalaqa = async (updatedHalaqa: Halaqa) => {
    const { id, ...data } = updatedHalaqa;
    await db.collection('halaqas').doc(id).update(data);
  };

  const deleteHalaqa = async (halaqaId: string) => {
     const studentQuery = db.collection('students').where('halaqaId', '==', halaqaId);
     const querySnapshot = await studentQuery.get();
     if (!querySnapshot.empty) {
        throw new Error('This halaqa cannot be deleted because it has students in it.');
     }
    await db.collection('halaqas').doc(halaqaId).delete();
  };

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    await db.collection('teachers').add(teacher);
  };
  
  const updateTeacher = async (updatedTeacher: Teacher) => {
    const { id, ...data } = updatedTeacher;
    await db.collection('teachers').doc(id).update(data);
  };

  const deleteTeacher = async (teacherId: string) => {
    const teacherDoc = await db.collection('teachers').doc(teacherId).get();
    if (!teacherDoc.exists) {
        throw new Error("Teacher not found.");
    }
    
    const halaqaQuery = db.collection('halaqas').where('teacherId', '==', teacherId);
    const querySnapshot = await halaqaQuery.get();
    if (!querySnapshot.empty) {
      throw new Error('This teacher cannot be deleted because they are assigned to one or more halaqas.');
    }
    await db.collection('teachers').doc(teacherId).delete();
  };

  const addStudent = async (student: Omit<Student, 'id' | 'progress'>) => {
    await db.collection('students').add({ ...student, progress: [] });
  };

  const updateStudent = async (updatedStudent: Omit<Student, 'progress'>) => {
    const { id, ...data } = updatedStudent;
    await db.collection('students').doc(id).update(data);
  };

  const deleteStudent = async (studentId: string) => {
    await db.collection('students').doc(studentId).delete();
  };
  
  const value = useMemo(() => ({ 
      students, teachers, periods, halaqas, 
      addProgressRecord, 
      addPeriod, updatePeriod, deletePeriod,
      addHalaqa, updateHalaqa, deleteHalaqa,
      addTeacher, updateTeacher, deleteTeacher,
      addStudent, updateStudent, deleteStudent
    }), [students, teachers, periods, halaqas]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};