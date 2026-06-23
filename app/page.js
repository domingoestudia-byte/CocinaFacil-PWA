'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import OnlineIndicator from '@/components/OnlineIndicator';
import Link from 'next/link';

export default function Home() {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      const { data, error: err } = await supabase
        .from('recetas')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setRecetas(data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar recetas:', err.message);
      setError('No se pudieron cargar las recetas.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      <header className="header-nouveau text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-sm">🍳</span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                CocinaFácil
              </h1>
            </div>
            <p className="text-sm text-secondary-light hidden sm:block italic">
              Recetas, sin conexión
            </p>
          </div>
        </div>

        {/* Divisor "vid" — motivo orgánico de remate Art Nouveau */}
        <svg
          className="divider-vine relative z-10"
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 6 C 150 22, 300 -8, 450 10 C 600 26, 750 -6, 900 10 C 1050 24, 1100 4, 1200 12"
            fill="none"
            stroke="#c9a13b"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <circle cx="220" cy="14" r="3" fill="#c9a13b" opacity="0.8" />
          <circle cx="620" cy="9" r="3" fill="#c9a13b" opacity="0.8" />
          <circle cx="980" cy="15" r="3" fill="#c9a13b" opacity="0.8" />
        </svg>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
            <button onClick={cargarRecetas} className="ml-4 underline text-sm">
              Reintentar
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-2xl font-semibold text-primary-dark">
            Todas las recetas
          </h2>
          <span className="flex-1 h-px bg-gradient-to-r from-secondary via-border to-transparent" />
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin h-8 w-8 mb-3 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm italic">Cargando recetas...</p>
          </div>
        ) : recetas.length === 0 ? (
          <div className="card-nouveau p-8 text-center">
            <p className="text-text-dark italic">No hay recetas disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7">
            {recetas.map((receta) => (
              <Link
                key={receta.id}
                href={`/receta/${receta.id}`}
                className="card-nouveau p-5 animate-fade-in group block"
              >
                {receta.imagen_url && (
                  <div className="w-full h-48 rounded-[20px_6px_20px_6px] overflow-hidden mb-4 bg-gray-100 ring-1 ring-border/60">
                    <img
                      src={receta.imagen_url}
                      alt={receta.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="font-display text-lg font-semibold text-primary-dark mb-2 group-hover:text-accent transition-colors">
                  {receta.nombre}
                </h3>
                {receta.descripcion && (
                  <p className="text-sm text-text-dark/90 mb-3 line-clamp-2">
                    {receta.descripcion}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-text-dark/60">
                  {receta.tiempo_minutos && (
                    <span className="flex items-center gap-1 bg-background px-2.5 py-1 rounded-full border border-border">
                      <svg className="w-3.5 h-3.5 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {receta.tiempo_minutos} min
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-background px-2.5 py-1 rounded-full border border-border">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {receta.ingredientes?.length || 0} ingredientes
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <OnlineIndicator />
    </div>
  );
}
