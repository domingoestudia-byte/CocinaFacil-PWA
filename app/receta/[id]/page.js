'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';

function VineDivider({ color = '#c9a13b' }) {
  return (
    <svg className="divider-vine" viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 6 C 150 22, 300 -8, 450 10 C 600 26, 750 -6, 900 10 C 1050 24, 1100 4, 1200 12"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="220" cy="14" r="3" fill={color} opacity="0.8" />
      <circle cx="620" cy="9" r="3" fill={color} opacity="0.8" />
      <circle cx="980" cy="15" r="3" fill={color} opacity="0.8" />
    </svg>
  );
}

export default function RecetaPage() {
  const params = useParams();
  const router = useRouter();
  const [receta, setReceta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;
    cargarReceta(params.id);
  }, [params.id]);

  const cargarReceta = async (id) => {
    try {
      const { data, error: err } = await supabase
        .from('recetas')
        .select('*')
        .eq('id', id)
        .single();

      if (err) throw err;
      setReceta(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar receta:', err.message);
      setError('No se pudo cargar la receta.');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col flex-1 bg-background">
        <header className="header-nouveau text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 relative z-10">
            <Link href="/" className="text-secondary-light hover:text-white text-sm">
              ← Volver
            </Link>
          </div>
          <VineDivider />
        </header>
        <div className="flex flex-1 items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !receta) {
    return (
      <div className="flex flex-col flex-1 bg-background">
        <header className="header-nouveau text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 relative z-10">
            <Link href="/" className="text-secondary-light hover:text-white text-sm">
              ← Volver
            </Link>
          </div>
          <VineDivider />
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 text-center">
          <div className="card-nouveau p-8">
            <p className="text-accent mb-4">{error || 'Receta no encontrada'}</p>
            <Link href="/" className="text-primary-dark underline font-medium">
              Volver al inicio
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-background">
      <header className="header-nouveau text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 relative z-10">
          <Link href="/" className="text-secondary-light hover:text-white text-sm flex items-center gap-1">
            ← Volver
          </Link>
        </div>
        <VineDivider />
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <article className="card-nouveau overflow-hidden animate-fade-in">
          {receta.imagen_url && (
            <div className="w-full h-64 sm:h-80 bg-gray-100">
              <img
                src={receta.imagen_url}
                alt={receta.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-dark mb-3">
              {receta.nombre}
            </h1>
            {receta.descripcion && (
              <p className="text-text-dark leading-relaxed mb-2">{receta.descripcion}</p>
            )}

            <div className="my-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="flex-1 h-px bg-gradient-to-r from-border via-secondary to-border" />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>

            <div className="flex flex-wrap gap-3 mb-8 text-sm text-text-dark/80">
              {receta.tiempo_minutos && (
                <span className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border">
                  <svg className="w-5 h-5 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {receta.tiempo_minutos} minutos
                </span>
              )}
              <span className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {receta.ingredientes?.length || 0} ingredientes
              </span>
            </div>

            {receta.ingredientes && receta.ingredientes.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold text-primary-dark mb-4">
                  Ingredientes
                </h2>
                <ul className="space-y-2.5">
                  {receta.ingredientes.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-dark">
                      <svg className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-secondary" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 0 C 8 2, 12 3, 12 6 C 12 9, 8 10, 6 12 C 4 10, 0 9, 0 6 C 0 3, 4 2, 6 0 Z" />
                      </svg>
                      {ing}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {receta.pasos && receta.pasos.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-primary-dark mb-4">
                  Preparación
                </h2>
                <ol className="space-y-4">
                  {receta.pasos.map((paso, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-[12px_4px_12px_4px] bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-text-dark pt-1 leading-relaxed">{paso}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
