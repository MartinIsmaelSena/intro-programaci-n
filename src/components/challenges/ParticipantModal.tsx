import React, { useState } from 'react';
import { PythonChallenge, ParticipantData } from '../../types/challenge';
import { User, School, BookOpen, AlertCircle, Shield, X, ArrowRight, Play, Clock } from 'lucide-react';

interface ParticipantModalProps {
  challenge: PythonChallenge;
  isOpen: boolean;
  onClose: () => void;
  onStart: (data: ParticipantData) => void;
}

export const ParticipantModal: React.FC<ParticipantModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onStart
}) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [school, setSchool] = useState('');
  const [course, setCourse] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<'form' | 'confirm'>('form');

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = '⚠️ Completá tu nombre.';
    if (!lastName.trim()) errs.lastName = '⚠️ Completá tu apellido.';
    if (!school.trim()) errs.school = '⚠️ Completá tu colegio o institución educativa.';
    if (!course.trim()) errs.course = '⚠️ Completá tu curso o año escolar.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep('confirm');
    }
  };

  const handleConfirmStart = () => {
    onStart({
      studentName: name.trim(),
      studentLastName: lastName.trim(),
      school: school.trim(),
      course: course.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <form onSubmit={handleNext} className="space-y-4">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-python-blue/10 text-python-blue dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Registro Previo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                👤 Datos del participante
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ingresá tus datos para identificar tu solución y computar tu calificación oficial.
              </p>
            </div>

            {/* Nombre */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nombre <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="Tu nombre (ej: Juan)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>}
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
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="Tu apellido (ej: Pérez)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
              </div>
              {errors.lastName && <p className="text-xs text-rose-500 font-semibold">{errors.lastName}</p>}
            </div>

            {/* Colegio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Colegio / Escuela <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={school}
                  onChange={e => {
                    setSchool(e.target.value);
                    if (errors.school) setErrors(prev => ({ ...prev, school: '' }));
                  }}
                  placeholder="Nombre de tu colegio (ej: CPEM 69)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
              </div>
              {errors.school && <p className="text-xs text-rose-500 font-semibold">{errors.school}</p>}
            </div>

            {/* Curso */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Curso / Año <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={course}
                  onChange={e => {
                    setCourse(e.target.value);
                    if (errors.course) setErrors(prev => ({ ...prev, course: '' }));
                  }}
                  placeholder="Curso o división (ej: 3° A)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
              </div>
              {errors.course && <p className="text-xs text-rose-500 font-semibold">{errors.course}</p>}
            </div>

            {/* Privacy Note */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Compromiso de privacidad:</strong> Estos datos se utilizarán exclusivamente para identificar tu participación en el desafío y registrar tu resultado. No se solicita DNI, dirección, teléfono ni contraseñas.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Continuar a la confirmación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        ) : (
          <div className="space-y-5 text-center">
            
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 text-white">
              🚀
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Confirmación
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                ¿Estás listo para comenzar?
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Participante:</span>
                <strong className="text-slate-900 dark:text-white">{name} {lastName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Colegio y Curso:</span>
                <strong className="text-slate-900 dark:text-white">{school} — {course}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Desafío:</span>
                <strong className="text-python-blue dark:text-sky-400">{challenge.title}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Tiempo disponible:</span>
                <strong className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {challenge.durationMinutes} minutos
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 text-left flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Importante:</strong> Una vez que comiences, el tiempo de 40 minutos empezará a correr en cuenta regresiva.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Modificar datos
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Comenzar desafío</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
