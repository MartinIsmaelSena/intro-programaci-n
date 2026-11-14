import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  RotateCcw,
  ShieldAlert,
  Loader2,
  FileText,
  Edit3,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  Eye,
  Check,
  Save,
  Building2,
  Download
} from 'lucide-react';
import {
  TPCpem69Submission,
  TPCpem69ExerciseNumber,
  TPCpem69AuditStatus,
  TPCpem69TeacherOverride,
  TPCpemSchool,
  TPCpemDivision,
  TP_VALID_SCHOOLS,
  TP_VALID_DIVISIONS
} from '../../types/tpCpem69';
import {
  fetchTeacherSubmissions,
  overrideTeacherGrade,
  retryAIGrading,
  resendStudentEmail
} from '../../services/tpCpem69Service';
import {
  getTPCpem69Exercise,
  TP_CPEM69_EXERCISES
} from '../../data/tpCpem69Exercises';

interface TPCpem69TeacherPanelProps {
  teacherEmail: string;
  onClose: () => void;
}

export const TPCpem69TeacherPanel: React.FC<TPCpem69TeacherPanelProps> = ({
  teacherEmail,
  onClose
}) => {
  const [submissions, setSubmissions] = useState<TPCpem69Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterExercise, setFilterExercise] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAudit, setFilterAudit] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'>('date_desc');

  // Modal de Detalle
  const [selectedSub, setSelectedSub] = useState<TPCpem69Submission | null>(null);

  // Estados de Modificación Docente
  const [isOverriding, setIsOverriding] = useState(false);
  const [newScoreInput, setNewScoreInput] = useState<string>('');
  const [overrideMotive, setOverrideMotive] = useState<string>('');
  const [oralExamResult, setOralExamResult] = useState<'pending' | 'approved' | 'failed'>('pending');
  const [overrideSuccess, setOverrideSuccess] = useState<string | null>(null);
  const [overrideError, setOverrideError] = useState<string | null>(null);

  // Operaciones en curso
  const [isRetryingAI, setIsRetryingAI] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Carga inicial de entregas
  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTeacherSubmissions({
        school: filterSchool !== 'all' ? filterSchool : undefined,
        division: filterDivision !== 'all' ? filterDivision : undefined
      });
      if (res.success && res.submissions) {
        setSubmissions(res.submissions);
      } else {
        setError(res.error || 'No se pudieron cargar las entregas.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error de comunicación.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Filtrado y ordenamiento en memoria
  const filteredSubmissions = useMemo(() => {
    let list = [...submissions];

    // Búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        s =>
          s.student_name.toLowerCase().includes(q) ||
          s.student_last_name.toLowerCase().includes(q) ||
          s.email_original.toLowerCase().includes(q) ||
          (s.school && s.school.toLowerCase().includes(q)) ||
          (s.division && s.division.toLowerCase().includes(q))
      );
    }

    // Filtro por institución
    if (filterSchool !== 'all') {
      list = list.filter(s => s.school === filterSchool);
    }

    // Filtro por división
    if (filterDivision !== 'all') {
      list = list.filter(s => s.division === filterDivision);
    }

    // Filtro por ejercicio
    if (filterExercise !== 'all') {
      list = list.filter(s => s.assigned_exercise === filterExercise);
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      list = list.filter(s => s.status === filterStatus);
    }

    // Filtro por auditoría
    if (filterAudit !== 'all') {
      list = list.filter(s => s.audit_status === filterAudit);
    }

    // Ordenamiento
    list.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'score_desc') {
        return (b.score ?? -1) - (a.score ?? -1);
      }
      if (sortBy === 'score_asc') {
        return (a.score ?? 999) - (b.score ?? 999);
      }
      return 0;
    });

    return list;
  }, [submissions, searchQuery, filterSchool, filterDivision, filterExercise, filterStatus, filterAudit, sortBy]);

  // Estadísticas globales y por institución/división
  const stats = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.status === 'graded');
    const avgScore =
      graded.length > 0
        ? (graded.reduce((acc, s) => acc + (s.score ?? 0), 0) / graded.length).toFixed(1)
        : '0.0';

    const exerciseDistribution: Record<number, number> = { 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    const schoolDistribution: Record<string, number> = {
      'CPEM N.º 69': 0,
      'CPEM N.º 29': 0
    };
    const divisionDistribution: Record<string, number> = {
      '4.º A': 0,
      '4.º B': 0,
      '4.º C': 0
    };

    submissions.forEach(s => {
      if (exerciseDistribution[s.assigned_exercise] !== undefined) {
        exerciseDistribution[s.assigned_exercise]++;
      }
      if (s.school && schoolDistribution[s.school] !== undefined) {
        schoolDistribution[s.school]++;
      }
      if (s.division && divisionDistribution[s.division] !== undefined) {
        divisionDistribution[s.division]++;
      }
    });

    const oralRequiredCount = submissions.filter(s => s.audit_status === 'oral_exam').length;
    const requiresReviewCount = submissions.filter(s => s.audit_status === 'requires_review').length;

    return {
      total,
      gradedCount: graded.length,
      avgScore,
      exerciseDistribution,
      schoolDistribution,
      divisionDistribution,
      oralRequiredCount,
      requiresReviewCount
    };
  }, [submissions]);

  // Exportar listado filtrado a archivo CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) return;

    const headers = [
      'Institución',
      'Curso y División',
      'Apellido',
      'Nombre',
      'Correo Electrónico',
      'Ejercicio Asignado',
      'Estado',
      'Calificación',
      'Auditoría',
      'Instancia Oral Requerida',
      'Fecha Inicio',
      'Fecha Entrega'
    ];

    const escapeCsv = (val: any) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredSubmissions.map(s => [
      escapeCsv(s.school || 'CPEM N.º 69'),
      escapeCsv(s.division || '4.º A'),
      escapeCsv(s.student_last_name),
      escapeCsv(s.student_name),
      escapeCsv(s.email_original),
      escapeCsv(`Ejercicio ${s.assigned_exercise}`),
      escapeCsv(s.status),
      escapeCsv(s.score !== null && s.score !== undefined ? s.score.toFixed(1) : ''),
      escapeCsv(s.audit_status),
      escapeCsv(s.audit_status === 'oral_exam' ? 'SÍ' : 'NO'),
      escapeCsv(s.started_at ? new Date(s.started_at).toLocaleString('es-AR') : ''),
      escapeCsv(s.submitted_at ? new Date(s.submitted_at).toLocaleString('es-AR') : '')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_entregas_tp_programacion_4to_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Utilidad para normalizar historial de modificaciones
  const getModificationsList = (mods: any): TPCpem69TeacherOverride[] => {
    if (!mods) return [];
    if (Array.isArray(mods)) return mods;
    return [mods];
  };

  // Selección de entrega para ver detalle
  const handleOpenDetail = (sub: TPCpem69Submission) => {
    setSelectedSub(sub);
    const modList = getModificationsList(sub.teacher_modifications);
    const lastMod = modList.length > 0 ? modList[modList.length - 1] : null;
    setNewScoreInput(sub.score !== null && sub.score !== undefined ? String(sub.score) : '');
    setOverrideMotive(lastMod?.motive || '');
    setOralExamResult(lastMod?.oralExamResult || 'pending');
    setOverrideSuccess(null);
    setOverrideError(null);
    setActionNotice(null);
  };

  // Guardar modificación de nota del docente
  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const parsed = parseFloat(newScoreInput);
    if (isNaN(parsed) || parsed < 0 || parsed > 10) {
      setOverrideError('La nota debe ser un número entre 0.0 y 10.0.');
      return;
    }

    if (!overrideMotive.trim()) {
      setOverrideError('Es obligatorio indicar el motivo de la modificación para el registro de auditoría.');
      return;
    }

    setIsOverriding(true);
    setOverrideError(null);
    setOverrideSuccess(null);

    const res = await overrideTeacherGrade({
      submissionId: selectedSub.id,
      newScore: Math.round(parsed * 10) / 10,
      motive: overrideMotive.trim(),
      teacherEmail,
      oralResult: selectedSub.audit_status === 'oral_exam' ? oralExamResult : undefined
    });

    if (res.success) {
      setOverrideSuccess('Nota actualizada correctamente en el registro de auditoría.');
      const newEntry: TPCpem69TeacherOverride = {
        originalScore: selectedSub.score ?? 0,
        newScore: Math.round(parsed * 10) / 10,
        motive: overrideMotive.trim(),
        teacherEmail,
        overriddenAt: new Date().toISOString(),
        oralExamResult: selectedSub.audit_status === 'oral_exam' ? oralExamResult : undefined
      };

      // Actualizar en el estado local
      setSubmissions(prev =>
        prev.map(s => {
          if (s.id === selectedSub.id) {
            const existing = getModificationsList(s.teacher_modifications);
            return {
              ...s,
              score: Math.round(parsed * 10) / 10,
              teacher_modifications: [...existing, newEntry]
            };
          }
          return s;
        })
      );
      setSelectedSub(prev => {
        if (!prev) return null;
        const existing = getModificationsList(prev.teacher_modifications);
        return {
          ...prev,
          score: Math.round(parsed * 10) / 10,
          teacher_modifications: [...existing, newEntry]
        };
      });
    } else {
      setOverrideError(res.error || 'No se pudo guardar la modificación.');
    }
    setIsOverriding(false);
  };

  // Reintentar IA
  const handleRetryAI = async (submissionId: string) => {
    setIsRetryingAI(true);
    setActionNotice(null);
    const res = await retryAIGrading(submissionId);
    if (res.success) {
      setActionNotice({ type: 'success', msg: 'Corrección por IA solicitada con éxito.' });
      await loadSubmissions();
      if (selectedSub && selectedSub.id === submissionId) {
        // Refrescar modal
        const updated = submissions.find(s => s.id === submissionId);
        if (updated) setSelectedSub(updated);
      }
    } else {
      setActionNotice({ type: 'error', msg: res.error || 'Error al invocar reintento de IA.' });
    }
    setIsRetryingAI(false);
  };

  // Reenviar correo
  const handleResendEmail = async (submissionId: string) => {
    setIsResendingEmail(true);
    setActionNotice(null);
    const res = await resendStudentEmail(submissionId);
    if (res.success) {
      setActionNotice({ type: 'success', msg: 'Correo reenviado con éxito al alumno.' });
      await loadSubmissions();
    } else {
      setActionNotice({ type: 'error', msg: res.error || 'Error al reenviar el correo.' });
    }
    setIsResendingEmail(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn py-6 px-4 pb-24">
      {/* Encabezado del Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              Panel Docente Oficial
            </span>
            <span className="text-xs text-slate-400 font-mono">
              CPEM N.º 69 / CPEM N.º 29 — 4.º A, 4.º B, 4.º C
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Control de Entregas y Auditoría
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervisión docente, revisión de devoluciones de IA, auditoría pedagógica y modificación de calificaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredSubmissions.length === 0}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-2"
            title="Exportar registros filtrados a CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={loadSubmissions}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Refrescar lista"
          >
            <RotateCcw className={`w-5 h-5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-colors cursor-pointer flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Globales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entregas totales</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.total}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{stats.gradedCount} calificadas</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Promedio de Nota</span>
          <div className="text-2xl sm:text-3xl font-black text-python-blue dark:text-sky-400">
            {stats.avgScore} <span className="text-sm text-slate-400">/ 10</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Sobre entregas corregidas</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instancia Oral Requerida</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {stats.oralRequiredCount}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Notas provisorias</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distribución Ejercicios</span>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex flex-wrap gap-1.5 pt-1">
            {[3, 4, 5, 6, 7].map(num => (
              <span key={num} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                E{num}: {stats.exerciseDistribution[num]}
              </span>
            ))}
          </div>
        </div>

        {/* Resumen por Institución y División */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Institución:
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/50 dark:border-blue-900/50">
              CPEM 69: {stats.schoolDistribution['CPEM N.º 69']}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/50 dark:border-indigo-900/50">
              CPEM 29: {stats.schoolDistribution['CPEM N.º 29']}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              División:
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              4.º A: {stats.divisionDistribution['4.º A']}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              4.º B: {stats.divisionDistribution['4.º B']}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              4.º C: {stats.divisionDistribution['4.º C']}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {/* Búsqueda por texto */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, apellido, email o colegio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-python-blue"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>

          {/* Filtro Institución */}
          <div>
            <select
              value={filterSchool}
              onChange={e => setFilterSchool(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Todas las Instituciones</option>
              <option value="CPEM N.º 69">CPEM N.º 69</option>
              <option value="CPEM N.º 29">CPEM N.º 29</option>
            </select>
          </div>

          {/* Filtro División */}
          <div>
            <select
              value={filterDivision}
              onChange={e => setFilterDivision(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Todas las Divisiones</option>
              <option value="4.º A">4.º A</option>
              <option value="4.º B">4.º B</option>
              <option value="4.º C">4.º C</option>
            </select>
          </div>

          {/* Filtro Ejercicio */}
          <div>
            <select
              value={filterExercise}
              onChange={e => setFilterExercise(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Todos los Ejercicios</option>
              <option value={3}>Ejercicio 3 (Computadora)</option>
              <option value={4}>Ejercicio 4 (Puntos)</option>
              <option value={5}>Ejercicio 5 (Juego / Monedas)</option>
              <option value={6}>Ejercicio 6 (Contraseña error)</option>
              <option value={7}>Ejercicio 7 (Ventilador)</option>
            </select>
          </div>

          {/* Filtro Estado */}
          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Todos los Estados</option>
              <option value="in_progress">En curso</option>
              <option value="submitted">Entregado</option>
              <option value="grading">Calificando</option>
              <option value="graded">Calificado</option>
              <option value="expired">Expirado (90m)</option>
            </select>
          </div>

          {/* Filtro Auditoría */}
          <div>
            <select
              value={filterAudit}
              onChange={e => setFilterAudit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Todas las Auditorías</option>
              <option value="no_observations">Sin observaciones</option>
              <option value="requires_review">Requiere revisión</option>
              <option value="oral_exam">⚠️ Instancia Oral</option>
            </select>
          </div>

          {/* Orden */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
            >
              <option value="date_desc">Más recientes primero</option>
              <option value="date_asc">Más antiguos primero</option>
              <option value="score_desc">Mayor nota</option>
              <option value="score_asc">Menor nota</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Entregas */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
            <p className="text-sm font-medium">Cargando entregas desde Supabase...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              No se encontraron entregas
            </p>
            <p className="text-xs">
              No hay evaluaciones que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Estudiante</th>
                  <th className="p-4">Institución / División</th>
                  <th className="p-4">Ejercicio</th>
                  <th className="p-4">Inicio / Entrega</th>
                  <th className="p-4">Nota</th>
                  <th className="p-4">Auditoría</th>
                  <th className="p-4">Correo</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubmissions.map(sub => {
                  const hasOverride = Boolean(sub.teacher_modifications);
                  const isOral = sub.audit_status === 'oral_exam';

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4">
                        <strong className="block text-slate-900 dark:text-white font-bold">
                          {sub.student_name} {sub.student_last_name}
                        </strong>
                        <span className="text-xs text-slate-400 font-mono truncate block max-w-[200px]" title={sub.email_original}>
                          {sub.email_original}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] border border-blue-200/50 dark:border-blue-800/50 whitespace-nowrap">
                            {sub.school || 'CPEM N.º 69'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] whitespace-nowrap">
                            {sub.division || '4.º A'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs whitespace-nowrap">
                          Ejercicio {sub.assigned_exercise}
                        </span>
                      </td>

                      <td className="p-4 text-xs text-slate-500">
                        <div>Inicio: {new Date(sub.started_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</div>
                        {sub.submitted_at && (
                          <div className="text-slate-400">
                            Entrega: {new Date(sub.submitted_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        {sub.score !== null && sub.score !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`text-base font-black ${
                              isOral
                                ? 'text-amber-600 dark:text-amber-400'
                                : sub.score >= 6.0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {sub.score.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-400">/ 10</span>
                            {hasOverride && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold" title="Nota modificada por docente">
                                Docente
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-400 italic">
                              {sub.status === 'grading'
                                ? 'Calificando...'
                                : sub.status === 'in_progress'
                                ? 'En curso'
                                : sub.status === 'expired'
                                ? 'Tiempo expirado'
                                : 'Sin nota'}
                            </span>
                            {sub.status === 'expired' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold w-fit">
                                Expirado (90m)
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        {sub.audit_status === 'oral_exam' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Instancia Oral</span>
                          </span>
                        ) : sub.audit_status === 'requires_review' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Revisar</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" />
                            <span>OK</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {sub.email_sent ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enviado</span>
                          </span>
                        ) : sub.email_error ? (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-medium text-xs" title={sub.email_error}>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Error envío</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Pendiente</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(sub)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-python-blue hover:text-white dark:hover:bg-python-blue font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle de Entrega y Modificación Docente */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-python-blue dark:text-sky-400">
                    Expediente de Entrega Alumno
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    {selectedSub.school || 'CPEM N.º 69'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {selectedSub.division || '4.º A'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedSub.student_name} {selectedSub.student_last_name}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedSub.email_original} | Ejercicio {selectedSub.assigned_exercise}
                </span>
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Avisos de Acción */}
            {actionNotice && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{actionNotice.msg}</span>
              </div>
            )}

            {/* Aviso de Expiración de Tiempo si corresponde */}
            {selectedSub.status === 'expired' && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-1 text-xs">
                <strong className="block text-sm font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-300">
                  <Clock className="w-4 h-4" />
                  Entrega cerrada por expiración de tiempo reglamentario (90 minutos)
                </strong>
                <p>
                  El estudiante superó el plazo máximo de 90 minutos. Las respuestas fueron guardadas automáticamente por el servidor y el trabajo se encuentra cerrado para revisión.
                </p>
              </div>
            )}

            {/* Aviso de Instancia Oral si corresponde */}
            {selectedSub.audit_status === 'oral_exam' && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1 text-xs">
                <strong className="block text-sm font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="w-4 h-4" />
                  Instancia Oral Requerida para este alumno
                </strong>
                <p>
                  El sistema detectó inconsistencias pedagógicas notorias. La nota es provisoria y debe verificarse de manera oral con el estudiante.
                </p>
                {selectedSub.audit_observations && selectedSub.audit_observations.length > 0 && (
                  <ul className="list-disc list-inside pt-1 opacity-90">
                    {selectedSub.audit_observations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Desglose de Respuestas Originales vs Corrección IA */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Respuestas y Corrección por Pregunta
              </h3>

              {(() => {
                const ex = TP_CPEM69_EXERCISES[selectedSub.assigned_exercise];
                if (!ex) return <p className="text-xs text-slate-400">Ejercicio no encontrado.</p>;

                return ex.questions.map(q => {
                  const studentAns = selectedSub.answers?.[String(q.id)] || selectedSub.answers?.[q.id] || '(Sin respuesta)';
                  const aiResult = selectedSub.ai_correction?.results?.find(r => r.question === q.id);

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs sm:text-sm"
                    >
                      <div className="flex items-start justify-between gap-2 font-bold text-slate-900 dark:text-white">
                        <span>{q.prompt}</span>
                        {aiResult && (
                          <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                            aiResult.points >= 2
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : aiResult.points > 0
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {aiResult.points.toFixed(1)} / 2.0 pts
                          </span>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                          Respuesta escrita del estudiante:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                          {studentAns}
                        </p>
                      </div>

                      {aiResult && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 pl-1">
                          <strong className="text-python-blue dark:text-sky-400">Devolución IA: </strong>
                          {aiResult.feedback}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Formulario de Modificación de Nota y Registro de Instancia Oral */}
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <h4>Modificación Docente y Auditoría de Nota</h4>
              </div>

              {(() => {
                const modList = getModificationsList(selectedSub.teacher_modifications);
                if (modList.length === 0) return null;

                return (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block text-xs uppercase tracking-wider">
                      Historial de Auditoría de Modificaciones ({modList.length}):
                    </span>
                    <div className="space-y-2">
                      {modList.map((mod, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                              Modificación #{idx + 1}: {mod.originalScore} ➔ {mod.newScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(mod.overriddenAt).toLocaleString('es-AR')}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong>Motivo:</strong> {mod.motive}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Docente: {mod.teacherEmail}</span>
                            {mod.oralExamResult && (
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                Instancia oral: {mod.oralExamResult === 'approved' ? 'Aprobada' : mod.oralExamResult === 'failed' ? 'No aprobada' : 'Pendiente'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <form onSubmit={handleSaveOverride} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Calificación Final (0.0 a 10.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newScoreInput}
                      onChange={e => setNewScoreInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {selectedSub.audit_status === 'oral_exam' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Resultado de Instancia Oral
                      </label>
                      <select
                        value={oralExamResult}
                        onChange={e => setOralExamResult(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                      >
                        <option value="pending">Pendiente de rendir</option>
                        <option value="approved">Aprobada</option>
                        <option value="failed">No aprobada</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo de la modificación (obligatorio para auditoría) *
                  </label>
                  <input
                    type="text"
                    value={overrideMotive}
                    onChange={e => setOverrideMotive(e.target.value)}
                    placeholder="Ej: Corroboración oral presencial satisfactoria / Ajuste por interpretación."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                    required
                  />
                </div>

                {overrideSuccess && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{overrideSuccess}</p>
                )}
                {overrideError && (
                  <p className="text-rose-600 dark:text-rose-400 text-xs font-bold">{overrideError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isOverriding}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    {isOverriding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Guardar cambio de nota</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Acciones de Reintento de IA y Reenvío de Correo */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRetryAI(selectedSub.id)}
                  disabled={isRetryingAI}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isRetryingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  <span>Reintentar Corrección IA</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResendEmail(selectedSub.id)}
                  disabled={isResendingEmail || selectedSub.score === null}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isResendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>Reenviar Devolución por Email</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Cerrar detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
