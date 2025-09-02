
import React, { useState } from 'react';
import type { Student } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { SURAHS } from '../constants';
import { CheckIcon, XIcon, BookOpenIcon, RefreshIcon } from './icons';

interface StudentProgressProps {
  student: Student;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ student }) => {
  const { t, language } = useLanguage();
  const { addProgressRecord } = useData();
  const [activeTab, setActiveTab] = useState<'hifz' | 'murajaah'>('hifz');
  const [selectedSurah, setSelectedSurah] = useState<string>(SURAHS[0]);

  const handleProgressUpdate = (type: 'hifz' | 'murajaah', status: 'correct' | 'incorrect') => {
    const newRecord = {
      date: new Date().toISOString(),
      type,
      status,
      surah: type === 'hifz' ? 'Al-Baqarah' : selectedSurah, // Example for Hifz
      details: type === 'hifz' ? 'Al-Baqarah: 16-20' : selectedSurah, // Example for Hifz
    };
    addProgressRecord(student.id, newRecord);
  };

  const sortedProgress = [...student.progress].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {t('studentProgressFor')} <span className="text-teal-600">{language === 'ar' ? student.nameAr : student.name}</span>
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('hifz')}
              className={`${
                activeTab === 'hifz'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <BookOpenIcon className="h-5 w-5" />
              {t('hifz')}
            </button>
            <button
              onClick={() => setActiveTab('murajaah')}
              className={`${
                activeTab === 'murajaah'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
                <RefreshIcon className="h-5 w-5" />
              {t('murajaah')}
            </button>
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'hifz' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">{t('todaysLesson')}: <span className="font-normal text-gray-600">Al-Baqarah: 16-20</span></h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleProgressUpdate('hifz', 'correct')}
                  className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon className="h-6 w-6" /> {t('markAsCorrect')}
                </button>
                <button
                  onClick={() => handleProgressUpdate('hifz', 'incorrect')}
                  className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <XIcon className="h-6 w-6" /> {t('markAsIncorrect')}
                </button>
              </div>
            </div>
          )}
          {activeTab === 'murajaah' && (
            <div className="space-y-4">
              <label htmlFor="surah-select" className="block text-lg font-semibold text-gray-700">{t('selectSurahForRevision')}</label>
              <select
                id="surah-select"
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                {SURAHS.map(surah => <option key={surah} value={surah}>{surah}</option>)}
              </select>
              <div className="flex gap-4 pt-2">
                 <button
                  onClick={() => handleProgressUpdate('murajaah', 'correct')}
                  className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon className="h-6 w-6" /> {t('markAsCorrect')}
                </button>
                <button
                  onClick={() => handleProgressUpdate('murajaah', 'incorrect')}
                  className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <XIcon className="h-6 w-6" /> {t('markAsIncorrect')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-700 mb-4">{t('progressHistory')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('details')}</th>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProgress.map(record => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t(record.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t(record.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
