import React, { useState, useMemo } from 'react';
import type { Teacher } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { StudentProgress } from './StudentProgress';

interface TeacherViewProps {
  teacher: Teacher;
}

export const TeacherView: React.FC<TeacherViewProps> = ({ teacher }) => {
  const { t, language } = useLanguage();
  const { students, halaqas } = useData();
  
  const teacherHalaqas = useMemo(() => halaqas.filter(h => h.teacherId === teacher.id), [halaqas, teacher.id]);
  
  const [selectedHalaqaId, setSelectedHalaqaId] = useState<string | null>(teacherHalaqas[0]?.id || null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const halaqaStudents = useMemo(() => {
    if (!selectedHalaqaId) return [];
    return students.filter(s => s.halaqaId === selectedHalaqaId);
  }, [students, selectedHalaqaId]);

  const selectedStudent = useMemo(() => {
      if (!selectedStudentId) return null;
      return halaqaStudents.find(s => s.id === selectedStudentId) || null;
    }, [halaqaStudents, selectedStudentId]);

  const handleHalaqaSelection = (halaqaId: string) => {
    setSelectedHalaqaId(halaqaId);
    setSelectedStudentId(null); // Reset student selection when halaqa changes
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/3 lg:w-1/4 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-700">{t('halaqas')}</h2>
          {teacherHalaqas.length > 0 ? (
            <ul className="space-y-2">
              {teacherHalaqas.map(halaqa => (
                <li key={halaqa.id}>
                  <button
                    onClick={() => handleHalaqaSelection(halaqa.id)}
                    className={`w-full text-start p-3 rounded-lg transition-colors ${
                      selectedHalaqaId === halaqa.id
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-teal-100'
                    }`}
                  >
                    {language === 'ar' ? halaqa.nameAr : halaqa.name}
                  </button>
                </li>
              ))}
            </ul>
          ): <p className="text-gray-500">{t('noHalaqas')}</p>}
        </div>

        {selectedHalaqaId && (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">{t('students')}</h2>
                {halaqaStudents.length > 0 ? (
                    <ul className="space-y-2">
                        {halaqaStudents.map(student => (
                        <li key={student.id}>
                            <button
                            onClick={() => setSelectedStudentId(student.id)}
                            className={`w-full text-start p-3 rounded-lg transition-colors ${
                                selectedStudentId === student.id
                                ? 'bg-teal-500 text-white shadow'
                                : 'bg-gray-100 hover:bg-teal-100'
                            }`}
                            >
                            {language === 'ar' ? student.nameAr : student.name}
                            </button>
                        </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">{t('noData')}</p>}
            </div>
        )}

      </aside>
      <main className="flex-1">
        {selectedStudent ? (
          <StudentProgress student={selectedStudent} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-md p-10">
            <p className="text-gray-500 text-lg">
                {selectedHalaqaId ? t('noStudentSelected') : t('noHalaqaSelected')}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};