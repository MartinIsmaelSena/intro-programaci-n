import React from 'react';
import { Globe, ExternalLink, BookOpen, Users, Sparkles, Code2 } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const officialResources = [
    {
      title: 'Python.org',
      subtitle: 'Sitio oficial de Python Software Foundation',
      description: 'La casa matriz de Python. Descargas oficiales, anuncios de nuevas versiones, estándares de mejora (PEPs) y el Zen de Python.',
      url: 'https://www.python.org/',
      icon: '🐍',
      tag: 'Principal'
    },
    {
      title: 'Documentación Oficial de Python',
      subtitle: 'Guías completas y referencia oficial de la biblioteca estándar',
      description: 'El manual de referencia más completo del mundo sobre cada función, módulo estándar y especificación del lenguaje en español.',
      url: 'https://docs.python.org/es/3/',
      icon: '📚',
      tag: 'Referencia'
    },
    {
      title: 'Comunidad Oficial de Python',
      subtitle: 'Python Community & Foros Globales',
      description: 'Espacios de debate, foros de discusión, conferencias PyCon alrededor del mundo y grupos locales de usuarios (Python Meetups).',
      url: 'https://www.python.org/community/',
      icon: '💬',
      tag: 'Comunidad'
    },
    {
      title: 'Tutorial Oficial de Python',
      subtitle: 'El tutorial guiado de la PSF para principiantes',
      description: 'Un recorrido introductorio diseñado por los propios creadores del lenguaje para profundizar en tipos de datos y estructuras avanzadas.',
      url: 'https://docs.python.org/es/3/tutorial/',
      icon: '🎓',
      tag: 'Tutorial'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-python-blue via-sky-600 to-indigo-700 text-white shadow-xl shadow-python-blue/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Ecosistema y Recursos Oficiales</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            🌐 Para seguir aprendiendo
          </h1>
          <p className="text-sm sm:text-base text-sky-100 max-w-xl">
            ¿Querés profundizar? Aquí tienes los enlaces 100% oficiales de la Python Software Foundation para continuar tu camino.
          </p>
        </div>
      </div>

      {/* Official Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {officialResources.map((res, i) => (
          <a
            key={i}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-python-blue dark:hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                  {res.icon}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {res.tag}
                </span>
              </div>

              <h2 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-python-blue dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                <span>{res.title}</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-python-blue dark:group-hover:text-sky-400 transition-colors" />
              </h2>

              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                {res.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-python-blue dark:text-sky-400 font-semibold">
              <span>Visitar sitio oficial</span>
              <span>↗</span>
            </div>
          </a>
        ))}
      </div>

      {/* Community Info Box */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-python-blue dark:text-sky-400" />
          <span>La comunidad de Python es inclusiva y global</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Una de las razones más grandes del éxito de Python no es solo su elegante sintaxis, sino la cálida comunidad de entusiastas y profesionales dispuesta a ayudar a los recién llegados. No dudes en participar en foros, comunidades de Discord y eventos locales para compartir tus proyectos.
        </p>
      </div>

    </div>
  );
};
