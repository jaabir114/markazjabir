import React from 'react';
import type { Language, Role } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
    role: Role;
    setRole: (role: Role) => void;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };
  
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value as Role);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-700">{t('appName')}</h1>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <label htmlFor="role-select" className="text-sm font-medium text-gray-600">{t('dashboard')}:</label>
                <select id="role-select" value={role} onChange={handleRoleChange} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                    <option value="supervisor">{t('supervisor')}</option>
                    <option value="teacher">{t('teacher')}</option>
                    <option value="student">{t('student')}</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
             <span className="text-sm font-medium text-gray-600">{t('language')}:</span>
             <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-3 py-1 text-sm rounded-md ${language === 'ar' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                AR
              </button>
              <button
                onClick={() => handleLanguageChange('so')}
                className={`px-3 py-1 text-sm rounded-md ${language === 'so' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                SO
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};