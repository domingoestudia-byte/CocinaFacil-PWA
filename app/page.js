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
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍳</span>
              <h1 className="text-2xl font-bold tracking-tight">CocinaFácil</h1>
            </div>
            <p className="text-sm text-primary-light hidden sm:block">Recetas offline</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
            <button onClick={cargarRecetas} className="ml-4 underline text-sm">Reintentar</button>
          </div>
        )}

        <h2 className="text-xl font-semibold text-primary mb-6">Todas las recetas</h2>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin h-8 w-8 mb-3 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Cargando recetas...</p>
          </div>
        ) : recetas.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-gray-500">No hay recetas disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {recetas.map((receta) => (
              <Link
                key={receta.id}
                href={`/receta/${receta.id}`}
                className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-all duration-300 animate-fade-in group"
              >
                {receta.imagen_url && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={receta.imagen_url}
                      alt={receta.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary-dark transition-colors">
                  {receta.nombre}
                </h3>
                {receta.descripcion && (
                  <p className="text-sm text-text-dark mb-3 line-clamp-2">{receta.descripcion}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {receta.tiempo_minutos && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {receta.tiempo_minutos} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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