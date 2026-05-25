import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { direccionesService } from '../../../shared/services/direcciones';
import type { Direccion, DireccionCreate, DireccionUpdate } from '../../../shared/services/direcciones';
import { MapPin, Star, Trash2, Edit2, Plus, X } from 'lucide-react';

interface ModalDireccionProps {
  estaAbierto: boolean;
  alCerrar: () => void;
  direccionAEditar?: Direccion;
}

const ModalDireccion: React.FC<ModalDireccionProps> = ({ estaAbierto, alCerrar, direccionAEditar }) => {
  const queryClient = useQueryClient();
  const [datosFormulario, setDatosFormulario] = useState<DireccionCreate>({
    alias: direccionAEditar?.alias ?? '',
    linea1: direccionAEditar?.linea1 ?? '',
    linea2: direccionAEditar?.linea2 ?? '',
    ciudad: direccionAEditar?.ciudad ?? '',
    provincia: direccionAEditar?.provincia ?? '',
    codigo_postal: direccionAEditar?.codigo_postal ?? '',
  });

  const [error, setError] = useState('');

  const esEdicion = !!direccionAEditar;

  const mutacion = useMutation({
    mutationFn: (datos: DireccionCreate | DireccionUpdate) => {
      if (esEdicion) {
        return direccionesService.update(direccionAEditar!.id, datos);
      }
      return direccionesService.create(datos as DireccionCreate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
      alCerrar();
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail ?? 'Error al guardar la dirección');
    },
  });

  if (!estaAbierto) return null;

  const manejarEnvio = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!datosFormulario.linea1 || !datosFormulario.ciudad) {
      setError('La calle y la ciudad son obligatorias.');
      return;
    }
    mutacion.mutate(datosFormulario);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#281814]/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#b22300]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#b22300]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#281814]">{esEdicion ? 'Editar Dirección' : 'Nueva Dirección'}</h2>
              <p className="text-xs text-[#5c403a]">Completá los datos de envío</p>
            </div>
          </div>
          <button onClick={alCerrar} className="p-2 text-[#5c403a] hover:bg-[#ffe9e4] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">Alias (Ej: Casa, Trabajo)</label>
            <input
              type="text"
              value={datosFormulario.alias || ''}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, alias: e.target.value })}
              className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">Calle y Número *</label>
            <input
              type="text"
              value={datosFormulario.linea1}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, linea1: e.target.value })}
              className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">Piso, Depto (Opcional)</label>
            <input
              type="text"
              value={datosFormulario.linea2 || ''}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, linea2: e.target.value })}
              className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">Ciudad *</label>
              <input
                type="text"
                value={datosFormulario.ciudad}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, ciudad: e.target.value })}
                className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">Provincia</label>
              <input
                type="text"
                value={datosFormulario.provincia || ''}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, provincia: e.target.value })}
                className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#5c403a]">Código Postal</label>
            <input
              type="text"
              value={datosFormulario.codigo_postal || ''}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, codigo_postal: e.target.value })}
              className="w-full h-12 px-4 bg-[#fff0ed] border border-[#e5beb5] rounded-lg text-base text-[#281814] focus:outline-none focus:ring-2 focus:ring-[#b22300]/20 focus:border-[#b22300] transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={alCerrar}
              className="flex-1 py-3 border border-[#907068] text-[#281814] font-semibold rounded-lg hover:bg-[#fff0ed] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutacion.isPending}
              className="flex-1 py-3 bg-[#b22300] text-white font-bold rounded-lg hover:bg-[#da3711] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutacion.isPending ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SeccionDirecciones: React.FC = () => {
  const queryClient = useQueryClient();
  const [estadoModal, setEstadoModal] = useState<{ estaAbierto: boolean; direccionAEditar?: Direccion }>({ estaAbierto: false });

  const { data: direcciones, isLoading, isError } = useQuery({
    queryKey: ['direcciones'],
    queryFn: direccionesService.getAll,
  });

  const mutacionEliminar = useMutation({
    mutationFn: direccionesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
    },
  });

  const mutacionPrincipal = useMutation({
    mutationFn: direccionesService.setPrincipal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direcciones'] });
    },
  });

  if (isLoading) {
    return <div className="animate-pulse flex gap-4 mt-6">
      <div className="h-32 bg-[#e5beb5]/40 rounded-xl w-full max-w-sm"></div>
      <div className="h-32 bg-[#e5beb5]/40 rounded-xl w-full max-w-sm"></div>
    </div>;
  }

  if (isError) {
    return <p className="text-[#ba1a1a] mt-6">Error al cargar las direcciones.</p>;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#b22300]" />
          <h3 className="text-lg font-semibold text-[#281814]">Mis Direcciones</h3>
        </div>
        <button
          onClick={() => setEstadoModal({ estaAbierto: true })}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffe9e4] text-[#b22300] font-semibold text-sm rounded-lg hover:bg-[#ffdad2] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Dirección
        </button>
      </div>

      {direcciones?.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5beb5]/40 shadow-sm p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#fff0ed] flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-[#b22300]/50" />
          </div>
          <p className="text-[#281814] font-semibold mb-1">No tenés direcciones guardadas</p>
          <p className="text-[#5c403a] text-sm mb-4">Agregá una dirección para recibir tus pedidos</p>
          <button
            onClick={() => setEstadoModal({ estaAbierto: true })}
            className="px-5 py-2.5 bg-[#b22300] text-white font-semibold rounded-lg hover:bg-[#da3711] transition-colors"
          >
            Agregar mi primer dirección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {direcciones?.map((dir) => (
            <div
              key={dir.id}
              className={`bg-white rounded-xl border transition-all shadow-sm flex flex-col overflow-hidden relative group ${dir.es_principal ? 'border-[#b22300] ring-1 ring-[#b22300]' : 'border-[#e5beb5]/60 hover:border-[#b22300]/50'
                }`}
            >
              {dir.es_principal && (
                <div className="absolute top-0 right-0 bg-[#b22300] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Principal
                </div>
              )}

              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-[#281814] text-lg">
                    {dir.alias || 'Dirección'}
                  </h4>
                </div>
                <p className="text-[#5c403a] text-sm">
                  {dir.linea1} {dir.linea2 && `, ${dir.linea2}`}
                </p>
                <p className="text-[#907068] text-sm">
                  {dir.ciudad}{dir.provincia ? `, ${dir.provincia}` : ''} {dir.codigo_postal}
                </p>
              </div>

              <div className="border-t border-[#e5beb5]/40 bg-[#fff8f6] p-3 flex items-center justify-between gap-2">
                {!dir.es_principal ? (
                  <button
                    onClick={() => mutacionPrincipal.mutate(dir.id)}
                    disabled={mutacionPrincipal.isPending}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#5c403a] hover:text-[#b22300] transition-colors disabled:opacity-50"
                  >
                    <Star className="w-4 h-4" />
                    Hacer principal
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#b22300]">
                    <Star className="w-4 h-4 fill-current" />
                    Principal
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEstadoModal({ estaAbierto: true, direccionAEditar: dir })}
                    className="p-1.5 text-[#5c403a] hover:bg-[#ffe9e4] hover:text-[#b22300] rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('¿Seguro que querés eliminar esta dirección?')) {
                        mutacionEliminar.mutate(dir.id);
                      }
                    }}
                    disabled={mutacionEliminar.isPending}
                    className="p-1.5 text-[#5c403a] hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {estadoModal.estaAbierto && (
        <ModalDireccion
          estaAbierto={estadoModal.estaAbierto}
          alCerrar={() => setEstadoModal({ estaAbierto: false, direccionAEditar: undefined })}
          direccionAEditar={estadoModal.direccionAEditar}
        />
      )}
    </section>
  );
};
