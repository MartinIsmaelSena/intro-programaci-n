import React, { useState, useEffect, useCallback } from 'react';
import {
  PracticalWork,
  PracticalWorkStatus,
  CreatePracticalWorkInput,
  UpdatePracticalWorkInput
} from '../../types/practicalWork';
import { TeacherAuthState } from '../../services/teacherAuthService';
import {
  fetchPracticalWorks,
  createPracticalWork,
  updatePracticalWorkStatus,
  updatePracticalWork,
  deletePracticalWork,
  subscribeToPracticalWorks
} from '../../services/practicalWorkService';
import {
  BookOpen,
  PlusCircle,
  School,
  Users,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Archive,
  Edit3,
  Trash2,
  AlertCircle,
  Loader2,
  Info,
  Calendar,
  Sparkles,
  FileCheck,
  ShieldCheck,
  ClipboardCheck,
  X
} from 'lucide-react';
import { PracticalWorkPortalView } from '../practicalWork/PracticalWorkPortalView';

interface PracticalWorksSectionProps {
  teacherAuth: TeacherAuthState;
  onOpenTeacherLogin: () => void;
  onNavigateToExams?: () => void;
}

export const PracticalWorksSection: React.FC<PracticalWorksSectionProps> = ({
  teacherAuth,
  onOpenTeacherLogin,
  onNavigateToExams
}) => {
  const [works, setWorks] = useState<PracticalWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTakingEvaluation, setIsTakingEvaluation] = useState(false);

  // Estados del modal de creación / edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<PracticalWork | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    targetSchool: string;
    targetCourse: string;
    status: PracticalWorkStatus;
  }>({
    title: '',
    description: '',
    targetSchool: '',
    targetCourse: '',
    status: 'draft'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Carga de trabajos prácticos
  const loadWorks = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    const res = await fetchPracticalWorks(teacherAuth.isAuthenticated);
    if (res.success) {
      setWorks(res.data);
    } else {
      setErrorMessage(res.error || 'No se pudieron consultar los trabajos prácticos.');
    }
    setLoading(false);
  }, [teacherAuth.isAuthenticated]);

  useEffect(() => {
    loadWorks();

    const unsubscribe = subscribeToPracticalWorks(() => {
      loadWorks();
    });

    return () => {
      unsubscribe();
    };
  }, [loadWorks]);

  // Manejo de apertura de modal para Crear
  const handleOpenCreateModal = () => {
    setEditingWork(null);
    setFormData({
      title: '',
      description: '',
      targetSchool: '',
      targetCourse: '',
      status: 'draft'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Manejo de apertura de modal para Editar
  const handleOpenEditModal = (work: PracticalWork) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description || '',
      targetSchool: work.target_school,
      targetCourse: work.target_course || '',
      status: work.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'El título del trabajo práctico es obligatorio.';
    }
    if (!formData.targetSchool.trim()) {
      errors.targetSchool = 'El colegio o institución destinataria es obligatorio.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading('saving');
    setErrorMessage(null);

    try {
      if (editingWork) {
        const updateInput: UpdatePracticalWorkInput = {
          title: formData.title,
          description: formData.description,
          target_school: formData.targetSchool,
          target_course: formData.targetCourse,
          status: formData.status
        };
        const res = await updatePracticalWork(editingWork.id, updateInput);
        if (res.success) {
          setSuccessMessage('Trabajo práctico actualizado con éxito.');
          setIsModalOpen(false);
          await loadWorks();
        } else {
          setErrorMessage(res.error || 'Error al actualizar el trabajo práctico.');
        }
      } else {
        const createInput: CreatePracticalWorkInput = {
          title: formData.title,
          description: formData.description,
          target_school: formData.targetSchool,
          target_course: formData.targetCourse,
          status: formData.status
        };
        const res = await createPracticalWork(createInput, teacherAuth.email || undefined);
        if (res.success) {
          setSuccessMessage('Trabajo práctico creado exitosamente.');
          setIsModalOpen(false);
          await loadWorks();
        } else {
          setErrorMessage(res.error || 'Error al crear el trabajo práctico.');
        }
      }
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  // Cambio rápido de estado desde las tarjetas docentes
  const handleChangeStatus = async (id: string, newStatus: PracticalWorkStatus) => {
    setActionLoading(id);
    setErrorMessage(null);
    const res = await updatePracticalWorkStatus(id, newStatus);
    if (res.success) {
      await loadWorks();
    } else {
      setErrorMessage(res.error || 'No se pudo actualizar el estado del trabajo práctico.');
    }
    setActionLoading(null);
  };

  // Eliminación de un trabajo práctico
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de que deseás eliminar el trabajo práctico "${title}"?`)) {
      return;
    }
    setActionLoading(id);
    setErrorMessage(null);
    const res = await deletePracticalWork(id);
    if (res.success) {
      setSuccessMessage('Trabajo práctico eliminado.');
      await loadWorks();
    } else {
      setErrorMessage(res.error || 'No se pudo eliminar el trabajo práctico.');
    }
    setActionLoading(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (isTakingEvaluation) {
    return (
      <PracticalWorkPortalView
        onBackToPortal={() => setIsTakingEvaluation(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Alertas informativas / mensajes */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs sm:text-sm text-rose-800 dark:text-rose-200 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Evaluación Autocorregible Oficial de 80 minutos */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Evaluación Autocorregible Activa</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>80 Minutos</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-xs font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Individual o en Pareja</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            📝 Trabajo Práctico de Python — Evaluación Oficial
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Evaluación integral de 8 preguntas teóricas (4.0 pts) y 4 ejercicios prácticos de código (6.0 pts) con corrección automática inmediata por Pyodide y registro directo en el sistema de calificaciones.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-emerald-200">
            <span>• 3 modelos equivalentes asignados aleatoriamente</span>
            <span>• Contador con tiempo límite estricto de 80 minutos</span>
            <span>• Devolución pedagógica al finalizar</span>
          </div>
        </div>

        <button
          onClick={() => setIsTakingEvaluation(true)}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Comenzar Evaluación (80 min)</span>
        </button>
      </div>

      {/* Modo Docente: Panel de Administración */}
      {teacherAuth.isAuthenticated ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/40 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Panel Docente — Gestión de Trabajos Prácticos</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  practical_works
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Administración y Disponibilidad
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Definí títulos, descripciones y colegios destinatarios. Podés mantener los trabajos en borrador mientras los preparás y habilitarlos cuando corresponda para tus estudiantes.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="py-3 px-5 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Crear Trabajo Práctico</span>
            </button>
          </div>

          {/* Nota sobre la etapa de perfiles y colegios */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Arquitectura Institucional:</strong> El campo de colegio permite estructurar la relación con instituciones reales. Mientras la plataforma no cuente con autenticación individual de alumnos, no se aplica una restricción obligatoria en el backend por colegio.
            </div>
          </div>
        </div>
      ) : null}

      {/* Lista de Trabajos Prácticos o Estado Vacío */}
      {loading ? (
        <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs sm:text-sm">
          <Loader2 className="w-7 h-7 animate-spin text-python-blue" />
          <span>Consultando disponibilidad de trabajos prácticos...</span>
        </div>
      ) : works.length === 0 ? (
        /* Estado vacío cuando no hay trabajos habilitados / disponibles */
        <div className="p-10 sm:p-14 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-python-blue dark:text-sky-400">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              No hay trabajos prácticos disponibles por el momento
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tu docente habilitará los trabajos prácticos evaluatorios en las fechas correspondientes. Mientras tanto, podés continuar practicando en los módulos y exámenes modulares.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsTakingEvaluation(true)}
              className="py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Rendir Trabajo Práctico Oficial (80 min)</span>
            </button>

            {onNavigateToExams && (
              <button
                onClick={onNavigateToExams}
                className="py-2.5 px-5 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs shadow-md transition-all"
              >
                Ver Exámenes Modulares
              </button>
            )}

            {!teacherAuth.isAuthenticated && (
              <button
                onClick={onOpenTeacherLogin}
                className="py-2.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>¿Sos docente? Ingresá para gestionar</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Lista de Trabajos Prácticos */
        <div className="space-y-4">
          {works.map(work => {
            const isToggling = actionLoading === work.id;

            // Formato de fechas
            const createdDate = new Date(work.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={work.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                  work.status === 'enabled'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-python-blue/60'
                    : work.status === 'draft'
                    ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-200/70 dark:border-amber-900/40'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div className="space-y-3 max-w-3xl">
                  {/* Badges de cabecera */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge de Estado */}
                    {work.status === 'enabled' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Habilitado</span>
                      </span>
                    ) : work.status === 'draft' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800">
                        <Clock className="w-3 h-3" />
                        <span>Borrador (Solo Docente)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                        <Archive className="w-3 h-3" />
                        <span>Cerrado</span>
                      </span>
                    )}

                    {/* Colegio Destinatario */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800">
                      <School className="w-3 h-3 text-python-blue dark:text-sky-400" />
                      <span>Colegio: {work.target_school}</span>
                    </span>

                    {/* Curso / Grupo opcional */}
                    {work.target_course && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                        <Users className="w-3 h-3" />
                        <span>{work.target_course}</span>
                      </span>
                    )}

                    {/* Fecha de creación */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{createdDate}</span>
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {work.title}
                    </h3>
                    {work.description ? (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-pre-line">
                        {work.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-1">
                        Sin descripción complementaria.
                      </p>
                    )}
                  </div>

                  {/* Aviso de etapa siguiente para alumnos */}
                  {work.status === 'enabled' && !teacherAuth.isAuthenticated && (
                    <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-python-blue dark:text-sky-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Este trabajo práctico está habilitado por tu institución. Las consignas evaluatorias, actividades y el formulario de entrega se activarán en la siguiente etapa del módulo.
                      </span>
                    </div>
                  )}
                </div>

                {/* Columna de Acciones */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2 flex-shrink-0">
                  {teacherAuth.isAuthenticated ? (
                    /* Acciones Docentes */
                    <div className="flex flex-wrap lg:flex-col gap-2 w-full sm:w-auto">
                      {/* Alternar estado: Habilitar / Deshabilitar / Cerrar */}
                      <div className="flex items-center gap-1.5">
                        {work.status !== 'enabled' && (
                          <button
                            disabled={isToggling}
                            onClick={() => handleChangeStatus(work.id, 'enabled')}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                            title="Habilitar para alumnos"
                          >
                            {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
                            <span>Habilitar</span>
                          </button>
                        )}

                        {work.status !== 'draft' && (
                          <button
                            disabled={isToggling}
                            onClick={() => handleChangeStatus(work.id, 'draft')}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                            title="Mover a borrador (oculto para alumnos)"
                          >
                            {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                            <span>Borrador</span>
                          </button>
                        )}

                        {work.status !== 'closed' && (
                          <button
                            disabled={isToggling}
                            onClick={() => handleChangeStatus(work.id, 'closed')}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                            title="Cerrar entrega de trabajo práctico"
                          >
                            {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                            <span>Cerrar</span>
                          </button>
                        )}
                      </div>

                      {/* Editar y Eliminar */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleOpenEditModal(work)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          disabled={isToggling}
                          onClick={() => handleDelete(work.id, work.title)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 dark:text-rose-300 transition-colors"
                          title="Eliminar trabajo práctico"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Vista de Alumno */
                    <button
                      disabled
                      className="py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-python-blue" />
                      <span>Consignas próximamente</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Creación / Edición para el Docente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-python-blue/10 dark:bg-sky-500/20 text-python-blue dark:text-sky-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {editingWork ? 'Editar Trabajo Práctico' : 'Nuevo Trabajo Práctico'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Estructuración inicial de la evaluación
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Título */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Título del Trabajo Práctico <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="Ej: Trabajo Práctico N° 1 — Estructuras Condicionales y Bucles"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-500 font-semibold">{formErrors.title}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Descripción u orientaciones generales
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve explicación sobre los temas evaluados, objetivos y pautas generales..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-python-blue resize-none"
                />
              </div>

              {/* Colegio y Curso Destinatario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Colegio destinatario <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetSchool}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, targetSchool: e.target.value }));
                      if (formErrors.targetSchool) setFormErrors(prev => ({ ...prev, targetSchool: '' }));
                    }}
                    placeholder="Ej: CPEM 69"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-python-blue"
                  />
                  {formErrors.targetSchool && (
                    <p className="text-xs text-rose-500 font-semibold">{formErrors.targetSchool}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Curso, grado o grupo <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetCourse}
                    onChange={e => setFormData(prev => ({ ...prev, targetCourse: e.target.value }))}
                    placeholder="Ej: 3° A / Turno Tarde"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-python-blue"
                  />
                </div>
              </div>

              {/* Estado Inicial */}
              <div className="space-y-2 pt-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Estado del trabajo práctico
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formData.status === 'draft'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="work_status"
                        checked={formData.status === 'draft'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-bold text-xs">Borrador</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Oculto para los alumnos
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formData.status === 'enabled'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="work_status"
                        checked={formData.status === 'enabled'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'enabled' }))}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-xs">Habilitado</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Visible para alumnos
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formData.status === 'closed'
                        ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="work_status"
                        checked={formData.status === 'closed'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'closed' }))}
                        className="text-slate-600 focus:ring-slate-500"
                      />
                      <span className="font-bold text-xs">Cerrado</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Finalizado
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={actionLoading === 'saving'}
                  className="px-6 py-2.5 rounded-xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {actionLoading === 'saving' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{editingWork ? 'Actualizar Trabajo Práctico' : 'Crear Trabajo Práctico'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
