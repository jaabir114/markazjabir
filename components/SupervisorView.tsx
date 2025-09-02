import React, { useState, useMemo, useEffect } from 'react';
import type { Student, Teacher, Period, Halaqa } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { StatsCharts } from './StatsCharts';
import { StudentProgress } from './StudentProgress';
import { Modal } from './Modal';
import { UserGroupIcon, CollectionIcon, ChartPieIcon, AcademicCapIcon, ClockIcon, PencilIcon, TrashIcon } from './icons';

type SupervisorTab = 'dashboard' | 'periods' | 'halaqas' | 'teachers' | 'students';
type EditableItem = { type: 'period', data: Period } | { type: 'halaqa', data: Halaqa } | { type: 'teacher', data: Teacher } | { type: 'student', data: Omit<Student, 'progress'> };

export const SupervisorView: React.FC = () => {
    const { t, language } = useLanguage();
    const { 
        students, teachers, periods, halaqas, 
        addPeriod, updatePeriod, deletePeriod,
        addHalaqa, updateHalaqa, deleteHalaqa,
        addTeacher, updateTeacher, deleteTeacher,
        addStudent, updateStudent, deleteStudent
    } = useData();
    
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
    const [activeTab, setActiveTab] = useState<SupervisorTab>('dashboard');
    const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
    const [formData, setFormData] = useState<any>({});
    
    // Form states
    const [periodNameAr, setPeriodNameAr] = useState('');
    const [periodName, setPeriodName] = useState('');
    const [halaqaNameAr, setHalaqaNameAr] = useState('');
    const [halaqaName, setHalaqaName] = useState('');
    const [selectedPeriodId, setSelectedPeriodId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [teacherNameAr, setTeacherNameAr] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [studentNameAr, setStudentNameAr] = useState('');
    const [studentName, setStudentName] = useState('');
    const [selectedHalaqaId, setSelectedHalaqaId] = useState('');
    
    useEffect(() => { if (editingItem) setFormData(editingItem.data); else setFormData({}); }, [editingItem]);
    useEffect(() => { if (!periods.find(p => p.id === selectedPeriodId)) setSelectedPeriodId(periods[0]?.id || ''); }, [periods, selectedPeriodId]);
    useEffect(() => { if (!teachers.find(t => t.id === selectedTeacherId)) setSelectedTeacherId(teachers[0]?.id || ''); }, [teachers, selectedTeacherId]);
    useEffect(() => { if (!halaqas.find(h => h.id === selectedHalaqaId)) setSelectedHalaqaId(halaqas[0]?.id || ''); }, [halaqas, selectedHalaqaId]);

    const allProgress = useMemo(() => students.flatMap(s => s.progress), [students]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        try {
            switch(editingItem.type) {
                case 'period': await updatePeriod(formData as Period); break;
                case 'halaqa': await updateHalaqa(formData as Halaqa); break;
                case 'teacher': await updateTeacher(formData as Teacher); break;
                case 'student': await updateStudent(formData as Omit<Student, 'progress'>); break;
            }
        } catch (error) {
            console.error("Failed to save item:", error); alert("Failed to save changes.");
        }
        setEditingItem(null);
    };

    const handleDelete = async (type: 'period' | 'halaqa' | 'teacher' | 'student', id: string) => {
        if (window.confirm(t('confirmDelete'))) {
            try {
                switch (type) {
                    case 'period': await deletePeriod(id); break;
                    case 'halaqa': await deleteHalaqa(id); break;
                    case 'teacher': await deleteTeacher(id); break;
                    case 'student': await deleteStudent(id); break;
                }
            } catch (error) { if (error instanceof Error) alert(error.message); else alert('An unknown error occurred.');}
        }
    };

    const handleAddPeriod = (e: React.FormEvent) => { e.preventDefault(); if (periodNameAr.trim() && periodName.trim()) { addPeriod({ name: periodName, nameAr: periodNameAr }); setPeriodName(''); setPeriodNameAr(''); }};
    const handleAddHalaqa = (e: React.FormEvent) => { e.preventDefault(); if (halaqaNameAr.trim() && halaqaName.trim() && selectedPeriodId && selectedTeacherId) { addHalaqa({ name: halaqaName, nameAr: halaqaNameAr, periodId: selectedPeriodId, teacherId: selectedTeacherId }); setHalaqaName(''); setHalaqaNameAr(''); }};
    const handleAddTeacher = (e: React.FormEvent) => { e.preventDefault(); if (teacherNameAr.trim() && teacherName.trim()) { addTeacher({ name: teacherName, nameAr: teacherNameAr }); setTeacherName(''); setTeacherNameAr(''); }};
    const handleAddStudent = (e: React.FormEvent) => { e.preventDefault(); if (studentNameAr.trim() && studentName.trim() && selectedHalaqaId) { addStudent({ name: studentName, nameAr: studentNameAr, halaqaId: selectedHalaqaId }); setStudentName(''); setStudentNameAr(''); }};

    const renderInput = (label: string, name: string, value: string, onChange: (e: any) => void, type="text", required = true) => (<div><label className="block text-sm font-medium text-gray-700">{t(label)}</label><input type={type} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" /></div>);
    const renderSelect = (label: string, name: string, value: string, onChange: (e: any) => void, options: {id: string, name: string, nameAr: string}[], emptyText: string) => (<div><label className="block text-sm font-medium text-gray-700">{t(label)}</label>{options.length > 0 ? (<select name={name} value={value} onChange={onChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">{options.map(opt => <option key={opt.id} value={opt.id}>{language === 'ar' ? opt.nameAr : opt.name}</option>)}</select>) : <p className="mt-1 text-sm text-red-600">{t(emptyText)}</p>}</div>);

    const renderManagementSection = (title: string, entityType: 'period' | 'halaqa' | 'teacher' | 'student', data: any[], columns: {key: string, label: string, render?: (item: any) => React.ReactNode}[], form: React.ReactNode) => (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold mb-4 text-gray-700">{t(title)}</h3><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr>{[...columns, {key:'actions', label: 'actions'}].map(col => <th key={col.key} scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t(col.label)}</th>)}</tr></thead><tbody className="bg-white divide-y divide-gray-200">{data.map((item) => (<tr key={item.id}>{columns.map(col => (<td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{col.render ? col.render(item) : (language === 'ar' ? item[col.key+'Ar'] || item[col.key] : item[col.key])}</td>))}<td className="px-6 py-4 whitespace-nowrap text-sm"><div className="flex gap-2"><button onClick={() => setEditingItem({ type: entityType, data: item })} className="text-blue-600 hover:text-blue-900 p-1"><PencilIcon className="h-5 w-5"/></button><button onClick={() => handleDelete(entityType, item.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="h-5 w-5"/></button></div></td></tr>))}</tbody></table></div></div><div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold mb-4 text-gray-700">{t('addNew')}</h3>{form}</div></div>);
    
    const renderEditForm = () => { if (!editingItem) return null; const commonFields = [renderInput('nameAr', 'nameAr', formData.nameAr || '', handleFormChange), renderInput('nameEn', 'name', formData.name || '', handleFormChange)]; switch (editingItem.type) { case 'period': return <>{commonFields}</>; case 'teacher': return <>{commonFields}</>; case 'halaqa': return <>{commonFields}{renderSelect('selectPeriod', 'periodId', formData.periodId || '', handleFormChange, periods, 'noPeriods')}{renderSelect('selectTeacher', 'teacherId', formData.teacherId || '', handleFormChange, teachers, 'noTeachers')}</>; case 'student': return <>{commonFields}{renderSelect('selectHalaqa', 'halaqaId', formData.halaqaId || '', handleFormChange, halaqas, 'noHalaqas')}</>; default: return null;}};
    
    if (viewingStudent) return (<div><button onClick={() => setViewingStudent(null)} className="mb-6 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors">&larr; {t('allStudents')}</button><StudentProgress student={viewingStudent} /></div>);
    
    const tabs: {id: SupervisorTab, label: string, icon: React.FC<{className?:string}>}[] = [{id: 'dashboard', label: 'dashboard', icon: ChartPieIcon}, {id: 'periods', label: 'periods', icon: ClockIcon}, {id: 'halaqas', label: 'halaqas', icon: CollectionIcon}, {id: 'teachers', label: 'teacher', icon: AcademicCapIcon}, {id: 'students', label: 'students', icon: UserGroupIcon}];

    return (<div className="space-y-8"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">{t('supervisor')} {t('dashboard')}</h2><div className="w-full sm:w-auto"><div className="border-b border-gray-200"><nav className="-mb-px flex gap-4" aria-label="Tabs">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}><tab.icon className="h-5 w-5" />{t(tab.label)}</button>))}</nav></div></div></div>
    {activeTab === 'dashboard' && <div className="space-y-8"><div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold mb-4 text-gray-700">{t('statistics')}</h3><StatsCharts progress={allProgress} /></div><div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold mb-4 text-gray-700">{t('allStudents')}</h3><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('student')}</th><th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('teacher')}</th><th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('halaqa')}</th><th scope="col" className="relative px-6 py-3"><span className="sr-only">{t('viewProgress')}</span></th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{students.map(student => { const halaqa = halaqas.find(h => h.id === student.halaqaId); const teacher = halaqa ? teachers.find(t => t.id === halaqa.teacherId) : undefined; return (<tr key={student.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{language === 'ar' ? student.nameAr : student.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher ? (language === 'ar' ? teacher.nameAr : teacher.name) : '-'}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{halaqa ? (language === 'ar' ? halaqa.nameAr : halaqa.name) : '-'}</td><td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium"><button onClick={() => setViewingStudent(student)} className="text-teal-600 hover:text-teal-900">{t('viewProgress')}</button></td></tr>); })}</tbody></table></div></div></div>}
    {activeTab === 'periods' && renderManagementSection('currentPeriods', 'period', periods, [{key: 'name', label: 'periodName'}], <form onSubmit={handleAddPeriod} className="space-y-4">{renderInput('nameAr', 'nameAr', periodNameAr, e => setPeriodNameAr(e.target.value))}{renderInput('nameEn', 'nameEn', periodName, e => setPeriodName(e.target.value))}<button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">{t('addPeriod')}</button></form>)}
    {activeTab === 'halaqas' && renderManagementSection('currentHalaqas', 'halaqa', halaqas, [{key: 'name', label: 'halaqaName'}, {key: 'period', label: 'period', render: (item) => {const p=periods.find(p=>p.id===item.periodId); return p?(language==='ar'?p.nameAr:p.name):'-'}}, {key: 'teacher', label: 'teacher', render: (item) => {const t=teachers.find(t=>t.id===item.teacherId); return t?(language==='ar'?t.nameAr:t.name):'-'}}], <form onSubmit={handleAddHalaqa} className="space-y-4">{renderInput('nameAr', 'nameAr', halaqaNameAr, e=>setHalaqaNameAr(e.target.value))}{renderInput('nameEn', 'nameEn', halaqaName, e=>setHalaqaName(e.target.value))}{renderSelect('selectPeriod', 'periodId', selectedPeriodId, e=>setSelectedPeriodId(e.target.value), periods, 'noPeriods')}{renderSelect('selectTeacher', 'teacherId', selectedTeacherId, e=>setSelectedTeacherId(e.target.value), teachers, 'noTeachers')}<button type="submit" disabled={periods.length===0||teachers.length===0} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">{t('addHalaqa')}</button></form>)}
    {activeTab === 'teachers' && renderManagementSection('currentTeachers', 'teacher', teachers, [{key: 'name', label: 'teacherName'}], <form onSubmit={handleAddTeacher} className="space-y-4">{renderInput('nameAr', 'nameAr', teacherNameAr, e=>setTeacherNameAr(e.target.value))}{renderInput('nameEn', 'nameEn', teacherName, e=>setTeacherName(e.target.value))}<button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">{t('addTeacher')}</button></form>)}
    {activeTab === 'students' && renderManagementSection('currentStudents', 'student', students, [{key: 'name', label: 'studentName'}, {key: 'halaqa', label: 'halaqa', render: (item) => {const h=halaqas.find(h=>h.id===item.halaqaId); return h?(language==='ar'?h.nameAr:h.name):'-'}}], <form onSubmit={handleAddStudent} className="space-y-4">{renderInput('nameAr', 'nameAr', studentNameAr, e=>setStudentNameAr(e.target.value))}{renderInput('nameEn', 'nameEn', studentName, e=>setStudentName(e.target.value))}{renderSelect('selectHalaqa', 'halaqaId', selectedHalaqaId, e=>setSelectedHalaqaId(e.target.value), halaqas, 'noHalaqas')}<button type="submit" disabled={halaqas.length===0} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">{t('addStudent')}</button></form>)}
    <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={t(editingItem ? `edit${editingItem.type.charAt(0).toUpperCase() + editingItem.type.slice(1)}` as any : '')}>{editingItem && (<form onSubmit={handleSave} className="space-y-4">{renderEditForm()}<div className="flex justify-end gap-4 pt-4"><button type="button" onClick={() => setEditingItem(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">{t('cancel')}</button><button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">{t('saveChanges')}</button></div></form>)}</Modal></div>);
};