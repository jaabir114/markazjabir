
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import type { ProgressRecord } from '../types';

interface StatsChartsProps {
  progress: ProgressRecord[];
}

const COLORS = {
  correct: '#10B981', // Emerald 500
  incorrect: '#EF4444', // Red 500
};

export const StatsCharts: React.FC<StatsChartsProps> = ({ progress }) => {
  const { t, language } = useLanguage();

  const overallData = [
    { name: t('totalCorrect'), value: progress.filter(p => p.status === 'correct').length },
    { name: t('totalIncorrect'), value: progress.filter(p => p.status === 'incorrect').length },
  ].filter(d => d.value > 0);

  const hifzData = {
    correct: progress.filter(p => p.type === 'hifz' && p.status === 'correct').length,
    incorrect: progress.filter(p => p.type === 'hifz' && p.status === 'incorrect').length,
  };

  const murajaahData = {
    correct: progress.filter(p => p.type === 'murajaah' && p.status === 'correct').length,
    incorrect: progress.filter(p => p.type === 'murajaah' && p.status === 'incorrect').length,
  };

  const barChartData = [
    { name: t('hifz'), [t('correct')]: hifzData.correct, [t('incorrect')]: hifzData.incorrect },
    { name: t('murajaah'), [t('correct')]: murajaahData.correct, [t('incorrect')]: murajaahData.incorrect },
  ];

  if (progress.length === 0) {
    return <div className="text-center py-8 text-gray-500">{t('noData')}</div>;
  }
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="text-xl font-bold text-center mb-4 text-gray-700">{t('performanceOverview')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overallData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {overallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === t('totalCorrect') ? COLORS.correct : COLORS.incorrect} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-xl font-bold text-center mb-4 text-gray-700">{t('progress')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <XAxis dataKey="name" angle={language === 'ar' ? 0 : -20} textAnchor={language === 'ar' ? 'middle' : 'end'} height={50} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey={t('correct')} stackId="a" fill={COLORS.correct} />
            <Bar dataKey={t('incorrect')} stackId="a" fill={COLORS.incorrect} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
