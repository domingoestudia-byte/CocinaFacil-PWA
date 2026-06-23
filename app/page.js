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
      <header className="gradient-nouveau text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🍳</span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">CocinaFácil</h1>
                <p className="text-sm opacity-90">Recetas offline</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
            <button 
              onClick={cargarRecetas} 
              className="ml-4 underline text-sm hover:text-red-800 transition"
            >
              Reintentar
            </button>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-nouveau-accent mb-8 ornament-top">
          Todas las recetas
        </h2>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-light">
            <svg className="animate-spin h-8 w-8 mb-3 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Cargando recetas...</p>
          </div>
        ) : recetas.length === 0 ? (
          <div className="card-nouveau text-center py-12">
            <p className="text-text-light">No hay recetas disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recetas.map((receta) => (
              <Link
                key={receta.id}
                href={`/receta/${receta.id}`}
                className="card-nouveau group animate-fade-in"
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
                <h3 className="text-lg font-semibold text-nouveau-accent mb-2 group-hover:text-primary-dark transition-colors">
                  {receta.nombre}
                </h3>
                {receta.descripcion && (
                  <p className="text-sm text-text-light mb-3 line-clamp-2">
                    {receta.descripcion}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-text-light">
                  {receta.tiempo_minutos && (
                    <span className="flex items-center gap-1">
                      ⏱️ {receta.tiempo_minutos} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    🥘 {receta.ingredientes?.length || 0} ingredientes
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