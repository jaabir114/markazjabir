import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider, useData } from './contexts/DataContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import type { Role } from './types';

const AppContent: React.FC = () => {
  const [role, setRole] = useState<Role>('supervisor');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const { teachers, students } = useData();

  useEffect(() => {
    if (role === 'teacher' && teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [role, teachers, selectedTeacherId]);

  useEffect(() => {
    if (role === 'student' && students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [role, students, selectedStudentId]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header role={role} setRole={setRole} />
      <main className="container mx-auto px-6 py-8">
        <Dashboard 
          role={role} 
          selectedTeacherId={selectedTeacherId}
          onTeacherChange={setSelectedTeacherId}
          selectedStudentId={selectedStudentId}
          onStudentChange={setSelectedStudentId}
        />
      </main>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <DataProvider>
          <AppContent />
      </DataProvider>
    </LanguageProvider>
  );
}

export default App;