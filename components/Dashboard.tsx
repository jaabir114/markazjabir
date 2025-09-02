import React from 'react';
import type { Role, Teacher, Student } from '../types';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TeacherView } from './TeacherView';
import { StudentView } from './StudentView';
import { SupervisorView } from './SupervisorView';

interface DashboardProps {
  role: Role;
  selectedTeacherId: string | null;
  onTeacherChange: (id: string) => void;
  selectedStudentId: string | null;
  onStudentChange: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  role, 
  selectedTeacherId, 
  onTeacherChange, 
  selectedStudentId, 
  onStudentChange 
}) => {
  const { students, teachers } = useData();
  const { t, language } = useLanguage();

  const renderContent = () => {
    switch (role) {
      case 'teacher':
        const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
        return (
          <>
            <div className="mb-6 max-w-sm">
               <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700">{t('teacher')}</label>
               <select
                id="teacher-select"
                value={selectedTeacherId || ''}
                onChange={(e) => onTeacherChange(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" disabled>{t('teacher')}</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {language === 'ar' ? teacher.nameAr : teacher.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedTeacher ? <TeacherView teacher={selectedTeacher} /> : <p>{t('teacher')}</p>}
          </>
        );
      
      case 'student':
        const selectedStudent = students.find(s => s.id === selectedStudentId);
        return (
           <>
            <div className="mb-6 max-w-sm">
               <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">{t('student')}</label>
               <select
                id="student-select"
                value={selectedStudentId || ''}
                onChange={(e) => onStudentChange(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" disabled>{t('student')}</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {language === 'ar' ? student.nameAr : student.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedStudent ? <StudentView student={selectedStudent} /> : <p>{t('student')}</p>}
          </>
        );
      
      case 'supervisor':
        return <SupervisorView />;
      
      default:
        return <div>Please select a role.</div>;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};