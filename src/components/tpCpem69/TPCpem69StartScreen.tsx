import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  Mail,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Sparkles,
  BookOpen,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  Building2,
  Users
} from 'lucide-react';
import {
  TP_CPEM69_NAME,
  TP_CPEM69_COURSE,
  TP_CPEM69_DURATION_MINUTES
} from '../../data/tpCpem69Exercises';
import {
  TPCpem69StudentData,
  TPCpemSchool,
  TPCpemDivision,
  TP_VALID_SCHOOLS,
  TP_VALID_DIVISIONS
} from '../../types/tpCpem69';

interface TPCpem69StartScreenProps {
  onRequestCode: (student: TPCpem69StudentData) => Promise<{ success: boolean; devCode?: string }>;
  onVerifyCode: (code: string) => Promise<boolean>;
  isLoading: boolean;
  errorMessage: string | null;
  alreadySubmittedMessage: string | null;
  isUnpublishedMessage: string | null;
  onOpenTeacherPanel: () => void;
  isTeacherAuthenticated: boolean;
  hasActiveSession: boolean;
  onResumeSession?: () => void;
}

export const TPCpem69StartScreen: React.FC<TPCpem69StartScreenProps> = ({
  onRequestCode,
  onVerifyCode,
  isLoading,
  errorMessage,
  alreadySubmittedMessage,
  isUnpublishedMessage,
  onOpenTeacherPanel,
  isTeacherAuthenticated,
  hasActiveSession,
  onResumeSession
}) => {
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [school, setSchool] = useState<TPCpemSchool | ''>('');
  const [division, setDivision] = useState<TPCpemDivision | ''>('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleRequestCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Por favor ingresá tu nombre.';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Por favor ingresá tu apellido.';
    }
    if (!school) {
      errors.school = 'Por favor seleccioná tu institución educativa.';
    }
    if (!division) {
      errors.division = 'Por favor seleccioná tu curso y división.';
    }
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errors.email = 'Por favor ingresá tu correo electrónico institucional o personal.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        errors.email = 'Por favor ingresá un formato de correo válido (ej: nombre@dominio.com).';
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const res = await onRequestCode({
      studentName: name.trim(),
      studentLastName: lastName.trim(),
      email: cleanEmail.toLowerCase(),
      school: school as TPCpemSchool,
      division: division as TPCpemDivision
    });

    if (res.success) {
      setStep('code');
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setFieldErrors({ otp: 'Por favor ingresá el código de 6 dígitos recibido por correo.' });
      return;
    }

    setFieldErrors({});
    await onVerifyCode(otpCode.trim());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-6 px-4 pb-16">
      {/* Banner de Presentación */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-python-blue text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sky-300">
            <FileText className="w-4 h-4" />
            <span>Evaluación Oficial Escrita Individual</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {TP_CPEM69_NAME}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Evaluación conceptual escrita sobre análisis de código Python, variables, operadores relacionales y operadores lógicos. Destinado a estudiantes de 4.º año del <strong>CPEM N.º 69</strong> y <strong>CPEM N.º 29</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 text-amber-300">
              <Clock className="w-4 h-4" />
              <span>Duración: {TP_CPEM69_DURATION_MINUTES} minutos</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 text-sky-200">
              <Building2 className="w-4 h-4" />
              <span>CPEM N.º 69 y CPEM N.º 29</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 text-emerald-300">
              <Users className="w-4 h-4" />
              <span>Divisiones: 4.º A, 4.º B y 4.º C</span>
            </div>
          </div>
        </div>

        {/* Acceso Docente en esquina superior derecha */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={onOpenTeacherPanel}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 hover:text-white border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTeacherAuthenticated ? 'Panel Docente' : 'Acceso Docente'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Despublicado */}
      {isUnpublishedMessage && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 dark:bg-amber-900 flex items-center justify-center text-amber-800 dark:text-amber-300 flex-shrink-0 mt-0.5">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-amber-950 dark:text-amber-100">
              Evaluación no disponible
            </h3>
            <p className="text-sm font-semibold leading-relaxed">
              {isUnpublishedMessage}
            </p>
          </div>
        </div>
      )}

      {/* Alerta de Trabajo ya entregado (Requisito estricto de mensaje) */}
      {alreadySubmittedMessage && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-4 animate-shake">
          <div className="w-10 h-10 rounded-2xl bg-rose-200 dark:bg-rose-900 flex items-center justify-center text-rose-700 dark:text-rose-300 flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-rose-950 dark:text-rose-100">
              Entrega no permitida
            </h3>
            <p className="text-sm font-semibold leading-relaxed">
              {alreadySubmittedMessage}
            </p>
          </div>
        </div>
      )}

      {/* Alerta de Sesión Activa Pendiente de Continuar */}
      {hasActiveSession && onResumeSession && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base">Tenés una evaluación en curso</h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Tu tiempo continúa corriendo. Podés reanudarla inmediatamente conservando tus respuestas.
              </p>
            </div>
          </div>
          <button
            onClick={onResumeSession}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-all cursor-pointer flex-shrink-0"
          >
            Reanudar evaluación
          </button>
        </div>
      )}

      {/* Error genérico */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Características del Examen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-python-blue dark:text-sky-400 font-bold text-base">
            <BookOpen className="w-5 h-5" />
            <h3>Instrucciones generales</h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
              <span><strong>Modalidad individual:</strong> Cada estudiante trabajará de manera individual con un ejercicio asignado.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
              <span><strong>Respuestas escritas:</strong> No hay opciones múltiples. Cada una de las 5 preguntas debe ser redactada en tus propias palabras con fundamentación lógica.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
              <span><strong>Asignación equilibrada:</strong> El sistema asigna automáticamente uno de los 5 ejercicios disponibles de manera controlada.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
              <span><strong>Identidad protegida:</strong> Verificación de correo electrónico mediante código de un solo uso para garantizar que nadie rinda por vos.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <h3>Criterios de Calificación y Seguridad</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900 dark:text-white">Escala de 0 a 10 puntos</strong>
                <span className="text-slate-500 text-xs">5 preguntas de 2.0 puntos cada una</span>
              </div>
              <span className="font-black text-python-blue dark:text-sky-400 text-lg">10.0 pts</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              La evaluación conceptual valora la comprensión del funcionamiento del código y los operadores lógicos. No se exige coincidencia literal con una frase de memoria.
            </p>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <strong>Control de tiempo estricto:</strong> 90 minutos controlados en el servidor. Al vencer el plazo, se cierra automáticamente y se preservan las respuestas guardadas.
            </div>
          </div>
        </div>
      </div>

      {/* PASO 1: Formulario de Identificación */}
      {step === 'form' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-python-blue" />
              <span>Paso 1: Identificación del estudiante</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ingresá tus datos para recibir tu código de acceso personal por correo electrónico.
            </p>
          </div>

          <form onSubmit={handleRequestCodeSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="Ej: Sofía"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-python-blue'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value);
                    if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="Ej: Martínez"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.lastName
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-python-blue'
                  }`}
                />
                {fieldErrors.lastName && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Listas Desplegables Obligatorias: Institución y División */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-python-blue" />
                  <span>Institución educativa *</span>
                </label>
                <select
                  value={school}
                  onChange={e => {
                    setSchool(e.target.value as TPCpemSchool);
                    if (fieldErrors.school) setFieldErrors(prev => ({ ...prev, school: '' }));
                  }}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                    fieldErrors.school
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-python-blue'
                  }`}
                >
                  <option value="" disabled>Seleccioná tu colegio...</option>
                  {TP_VALID_SCHOOLS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {fieldErrors.school && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{fieldErrors.school}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-python-blue" />
                  <span>Curso y división *</span>
                </label>
                <select
                  value={division}
                  onChange={e => {
                    setDivision(e.target.value as TPCpemDivision);
                    if (fieldErrors.division) setFieldErrors(prev => ({ ...prev, division: '' }));
                  }}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                    fieldErrors.division
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-python-blue'
                  }`}
                >
                  <option value="" disabled>Seleccioná tu división...</option>
                  {TP_VALID_DIVISIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {fieldErrors.division && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{fieldErrors.division}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Correo electrónico * (identificador único del examen)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="ejemplo@alumno.edu.ar"
                  disabled={isLoading}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-python-blue'
                  }`}
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              {fieldErrors.email ? (
                <p className="text-rose-500 text-xs mt-1 font-semibold">{fieldErrors.email}</p>
              ) : (
                <p className="text-slate-400 text-xs mt-1">
                  Te enviaremos un código de seguridad de 6 dígitos para validar tu identidad.
                </p>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Se requiere verificación previa para evitar suplantaciones de identidad.
              </span>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-python-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar y recibir código</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PASO 2: Verificación de Código OTP */}
      {step === 'code' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-python-blue/40 dark:border-sky-500/40 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-python-blue dark:text-sky-400">
                Paso 2 de 2: Verificación de Seguridad
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>Ingresá tu código de 6 dígitos</span>
              </h2>
            </div>

            <button
              onClick={() => {
                setStep('form');
                setOtpCode('');
                setFieldErrors({});
              }}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cambiar correo</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-sky-900 dark:text-sky-200 space-y-1">
            <p>
              Enviamos un código de verificación a la casilla: <strong className="font-mono">{email}</strong>
            </p>
            <p className="text-xs text-sky-700 dark:text-sky-300">
              Revisá tu bandeja de entrada (y la carpeta de spam si es necesario). El código es de un solo uso y vence en 15 minutos. Al verificarlo, se iniciará tu temporizador de 90 minutos y se asignará tu ejercicio.
            </p>
          </div>

          <form onSubmit={handleVerifyCodeSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 text-center">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setOtpCode(val);
                  if (fieldErrors.otp) setFieldErrors(prev => ({ ...prev, otp: '' }));
                }}
                placeholder="000000"
                disabled={isLoading}
                autoFocus
                className="w-full max-w-xs mx-auto block text-center tracking-[10px] text-2xl sm:text-3xl font-mono font-black py-4 px-6 rounded-2xl border-2 border-python-blue/60 focus:border-python-blue bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner"
              />
              {fieldErrors.otp && (
                <p className="text-rose-500 text-xs text-center mt-2 font-semibold">{fieldErrors.otp}</p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleRequestCodeSubmit}
                disabled={isLoading}
                className="text-xs font-bold text-python-blue dark:text-sky-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>¿No recibiste el código? Reenviar</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Validando e iniciando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verificar y comenzar examen</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
