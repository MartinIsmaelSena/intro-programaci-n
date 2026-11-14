import React, { useState, useEffect, useCallback } from 'react';
import {
  getStoredTPSession,
  saveStoredTPSession,
  clearStoredTPSession,
  requestAccessCode,
  verifyAccessCode,
  autoSaveAnswers,
  submitTP
} from '../../services/tpCpem69Service';
import {
  TPCpem69ActiveSession,
  TPCpem69StudentData,
  TPCpem69Exercise
} from '../../types/tpCpem69';
import {
  getTPCpem69Exercise,
  TP_CPEM69_EXERCISES
} from '../../data/tpCpem69Exercises';
import {
  getTeacherAuthState,
  TeacherAuthState
} from '../../services/teacherAuthService';
import { TeacherLoginModal } from '../exams/TeacherLoginModal';
import { TPCpem69StartScreen } from './TPCpem69StartScreen';
import { TPCpem69Workspace } from './TPCpem69Workspace';
import { TPCpem69SubmittedScreen } from './TPCpem69SubmittedScreen';
import { TPCpem69TeacherPanel } from './TPCpem69TeacherPanel';
import { ArrowLeft } from 'lucide-react';

interface TPCpem69PortalViewProps {
  onBackToPortal?: () => void;
}

export const TPCpem69PortalView: React.FC<TPCpem69PortalViewProps> = ({
  onBackToPortal
}) => {
  const [session, setSession] = useState<TPCpem69ActiveSession | null>(() => getStoredTPSession());
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [alreadySubmittedError, setAlreadySubmittedError] = useState<string | null>(null);
  const [unpublishedError, setUnpublishedError] = useState<string | null>(null);
  const [pendingStudent, setPendingStudent] = useState<TPCpem69StudentData | null>(null);

  // Modo de visualización Docente
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  const [isTeacherLoginModalOpen, setIsTeacherLoginModalOpen] = useState(false);
  const [teacherAuth, setTeacherAuth] = useState<TeacherAuthState>({
    isAuthenticated: false,
    email: null,
    loading: true
  });

  // Carga de estado docente
  useEffect(() => {
    let mounted = true;
    async function loadAuth() {
      const auth = await getTeacherAuthState();
      if (mounted) setTeacherAuth(auth);
    }
    loadAuth();
    return () => {
      mounted = false;
    };
  }, []);

  // 1. Solicitar código OTP
  const handleRequestCode = async (student: TPCpem69StudentData): Promise<{ success: boolean; devCode?: string }> => {
    setIsStarting(true);
    setStartError(null);
    setAlreadySubmittedError(null);
    setUnpublishedError(null);

    try {
      const res = await requestAccessCode(student);
      if (res.success) {
        setPendingStudent(student);
        return { success: true };
      }

      if (res.alreadySubmitted) {
        setAlreadySubmittedError(res.error || 'Este trabajo práctico ya fue entregado con este correo electrónico. No podrás realizar una nueva entrega.');
      } else if (res.isUnpublished) {
        setUnpublishedError(res.error || 'El Trabajo Práctico se encuentra deshabilitado por el docente y no admite nuevos intentos en este momento.');
      } else {
        setStartError(res.error || 'No se pudo generar el código de verificación.');
      }
      return { success: false };
    } catch (err: any) {
      setStartError(err?.message || 'Error inesperado de comunicación.');
      return { success: false };
    } finally {
      setIsStarting(false);
    }
  };

  // 2. Verificar código OTP y comenzar / reanudar sesión
  const handleVerifyCode = async (code: string): Promise<boolean> => {
    if (!pendingStudent) return false;
    setIsStarting(true);
    setStartError(null);

    try {
      const res = await verifyAccessCode({
        email: pendingStudent.email,
        code,
        studentName: pendingStudent.studentName,
        studentLastName: pendingStudent.studentLastName,
        school: pendingStudent.school,
        division: pendingStudent.division
      });

      if (res.success && res.session) {
        setSession(res.session);
        return true;
      }

      if (res.alreadySubmitted) {
        setAlreadySubmittedError(res.error || 'Este trabajo práctico ya fue entregado con este correo electrónico.');
      } else {
        setStartError(res.error || 'El código ingresado es incorrecto.');
      }
      return false;
    } catch (err: any) {
      setStartError(err?.message || 'Error al validar el código.');
      return false;
    } finally {
      setIsStarting(false);
    }
  };

  // Auto-guardado
  const handleAutoSave = useCallback(async (answers: Record<string, string>): Promise<boolean> => {
    if (!session) return false;
    const res = await autoSaveAnswers(session.submissionId, answers);
    if (res.isExpired) {
      setSession(prev => (prev ? { ...prev, status: 'expired', answers } : null));
      return false;
    }
    if (res.success) {
      setSession(prev => (prev ? { ...prev, answers } : null));
    }
    return res.success;
  }, [session]);

  // Entrega final
  const handleSubmit = useCallback(async (answers: Record<string, string>) => {
    if (!session || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await submitTP(session.submissionId, answers);
      if (res.isExpired) {
        const updated: TPCpem69ActiveSession = {
          ...session,
          answers,
          status: 'expired'
        };
        setSession(updated);
        return;
      }

      if (res.success) {
        const updated: TPCpem69ActiveSession = {
          ...session,
          answers,
          status: res.score !== undefined ? 'graded' : 'submitted',
          score: res.score,
          auditStatus: (res.auditStatus as any) || session.auditStatus
        };
        setSession(updated);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [session, isSubmitting]);

  // Salir / Reset
  const handleExit = () => {
    clearStoredTPSession();
    setSession(null);
    if (onBackToPortal) {
      onBackToPortal();
    }
  };

  // Abrir panel docente (solicita login si no está autenticado)
  const handleOpenTeacherPanel = () => {
    if (teacherAuth.isAuthenticated) {
      setIsTeacherPanelOpen(true);
    } else {
      setIsTeacherLoginModalOpen(true);
    }
  };

  // 1. Vista Docente Activa
  if (isTeacherPanelOpen && teacherAuth.isAuthenticated && teacherAuth.email) {
    return (
      <TPCpem69TeacherPanel
        teacherEmail={teacherAuth.email}
        onClose={() => setIsTeacherPanelOpen(false)}
      />
    );
  }

  // 2. Pantalla de Entrega Realizada o Vencida (si la sesión está submitted, graded, error_grading, grading o expired)
  if (session && (session.status === 'submitted' || session.status === 'graded' || session.status === 'error_grading' || session.status === 'grading' || session.status === 'expired')) {
    const exercise = getTPCpem69Exercise(session.assignedExercise);
    return (
      <TPCpem69SubmittedScreen
        session={session}
        exercise={exercise}
        onExit={handleExit}
      />
    );
  }

  // 3. Área de Trabajo (Workspace) con cronómetro y preguntas
  if (session && session.status === 'in_progress') {
    const exercise = getTPCpem69Exercise(session.assignedExercise);
    return (
      <TPCpem69Workspace
        session={session}
        exercise={exercise}
        onAutoSave={handleAutoSave}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        saveStatus="saved"
      />
    );
  }

  // 4. Pantalla Inicial (Identificación e Instrucciones)
  return (
    <>
      {onBackToPortal && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <button
            onClick={onBackToPortal}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la selección de actividades</span>
          </button>
        </div>
      )}

      <TPCpem69StartScreen
        onRequestCode={handleRequestCode}
        onVerifyCode={handleVerifyCode}
        isLoading={isStarting}
        errorMessage={startError}
        alreadySubmittedMessage={alreadySubmittedError}
        isUnpublishedMessage={unpublishedError}
        onOpenTeacherPanel={handleOpenTeacherPanel}
        isTeacherAuthenticated={teacherAuth.isAuthenticated}
        hasActiveSession={Boolean(session && session.status === 'in_progress')}
        onResumeSession={() => {
          // Reanudar workspace
        }}
      />

      {/* Modal de Inicio de Sesión Docente si no estaba logueado */}
      <TeacherLoginModal
        isOpen={isTeacherLoginModalOpen}
        onClose={() => setIsTeacherLoginModalOpen(false)}
        onLoginSuccess={async () => {
          const freshAuth = await getTeacherAuthState();
          setTeacherAuth(freshAuth);
          setIsTeacherLoginModalOpen(false);
          if (freshAuth.isAuthenticated) {
            setIsTeacherPanelOpen(true);
          }
        }}
      />
    </>
  );
};
