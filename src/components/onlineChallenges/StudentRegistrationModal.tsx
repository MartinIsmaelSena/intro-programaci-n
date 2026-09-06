import React, { useState } from 'react';
import { StudentProfile } from '../../types/onlineChallenge';
import { validateStudentProfile } from '../../utils/nameModerationUtils';
import { Shield, X, ArrowRight, Swords, AlertTriangle } from 'lucide-react';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  initialProfile?: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  initialProfile,
  onSave,
  onClose,
  canClose = false
}) => {
  const [firstName, setFirstName] = useState(initialProfile?.firstName || '');
  const [lastName, setLastName] = useState(initialProfile?.lastName || '');
  const [school, setSchool] = useState(initialProfile?.school || '');
  const [course, setCourse] = useState(initialProfile?.course || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate: StudentProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      school: school.trim(),
      course: course.trim() || undefined
    };

    const { isValid, errors: valErrors } = validateStudentProfile(candidate);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    setErrors({});
    onSave(candidate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
        
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Swords className="w-3.5 h-3.5" />
            <span>Identificación de Alumno</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            ⚔️ Ingreso a la Sala
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ingresá tus datos para que los demás estudiantes puedan identificarte en las partidas de Desafíos en Línea.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Mensaje educativo si se detecta nombre inapropiado */}
          {errors.general && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{errors.general}</p>
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Nombre <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                  if (errors.firstName || errors.general) {
                    setErrors(prev => ({ ...prev, firstName: '', general: '' }));
                  }
                }}
                placeholder="Tu nombre (ej: Martín)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            {errors.firstName && <p className="text-xs text-rose-500 font-medium">{errors.firstName}</p>}
          </div>

          {/* Apellido */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Apellido <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value);
                  if (errors.lastName || errors.general) {
                    setErrors(prev => ({ ...prev, lastName: '', general: '' }));
                  }
                }}
                placeholder="Tu apellido (ej: Pérez)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            {errors.lastName && <p className="text-xs text-rose-500 font-medium">{errors.lastName}</p>}
          </div>

          {/* Colegio */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Colegio / Institución Educativa <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={school}
                onChange={e => {
                  setSchool(e.target.value);
                  if (errors.school || errors.general) {
                    setErrors(prev => ({ ...prev, school: '', general: '' }));
                  }
                }}
                placeholder="Colegio o escuela (ej: CPEM 69)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            {errors.school && <p className="text-xs text-rose-500 font-medium">{errors.school}</p>}
          </div>

          {/* Curso (Opcional) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Curso / Año <span className="text-slate-400 text-[10px] font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={course}
                onChange={e => setCourse(e.target.value)}
                placeholder="Curso o división (ej: 3° A)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Protección de privacidad para estudiantes */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Privacidad protegida:</strong> No se solicitan contraseñas, DNI, teléfono ni email. Los datos se guardan en tu navegador para representarte en la arena.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>Ingresar a la arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
