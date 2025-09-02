import React from 'react';
import type { Student } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { XIcon } from './icons';
import { StatsCharts } from './StatsCharts';

interface StudentViewProps {
  student: Student;
}

export const StudentView: React.FC<StudentViewProps> = ({ student }) => {
  const { t, language } = useLanguage();

  const incorrectRecords = student.progress
    .filter(p => p.status === 'incorrect')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        {t('welcome')}, <span className="text-teal-600">{language === 'ar' ? student.nameAr : student.name}</span>!
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-xl font-bold mb-4 text-gray-700">{t('notifications')}</h3>
        {incorrectRecords.length > 0 ? (
          <>
            <p className="mb-4 text-gray-600">{t('areasForImprovement')}</p>
            <ul className="space-y-3">
              {incorrectRecords.map(record => (
                <li key={record.id} className="flex items-center text-red-700">
                  <XIcon className="h-5 w-5 me-3 text-red-500 flex-shrink-0" />
                  <span className="font-semibold">{t(record.type)}:</span>
                  <span className="mx-2">{record.details}</span>
                  <span className="text-sm text-gray-500">({new Date(record.date).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-500">{t('noData')}</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-700">{t('overallPerformance')}</h3>
        <StatsCharts progress={student.progress} />
      </div>
    </div>
  );
};
