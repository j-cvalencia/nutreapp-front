import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIAS, etiqueta } from "../models/enums.js";
import { cerrarSesion, getUsuario } from "../auth.js";

// Datos de ejemplo con la forma de Video.java. Reemplázalos por GET /api/videos.
const VIDEOS = [
  { id: "v1", titulo: "Pausas activas en la oficina", descripcion: "Ejercicios de cinco minutos para cuidar espalda, cuello y muñecas durante la jornada.", url: "#", categoria: "SST", duracion: "6 min" },
  { id: "v2", titulo: "Cómo actuar ante una evacuación", descripcion: "Rutas de salida, puntos de encuentro y roles de la brigada.", url: "#", categoria: "SST", duracion: "9 min" },
  { id: "v3", titulo: "Tu primera semana en la empresa", descripcion: "Quién es quién, dónde pedir ayuda y qué esperar de tus primeros días.", url: "#", categoria: "Talento", duracion: "12 min" },
  { id: "v4", titulo: "Feedback que sí ayuda", descripcion: "Herramientas para dar y recibir retroalimentación con tu equipo.", url: "#", categoria: "Talento", duracion: "8 min" },
  { id: "v5", titulo: "Uso seguro de la VPN y el correo", descripcion: "Buenas prácticas para proteger la información de la compañía.", url: "#", categoria: "Capacitacion_interna", duracion: "7 min" },
  { id: "v6", titulo: "Guía del portal de autogestión", descripcion: "Solicita certificados, vacaciones y permisos sin trámites en papel.", url: "#", categoria: "Capacitacion_interna", duracion: "5 min" },
];

// Clases completas (Tailwind no detecta nombres armados dinámicamente)
const FONDO_CATEGORIA = { SST: "bg-hoja", Talento: "bg-coral", Capacitacion_interna: "bg-tinta" };

const KEY_VISUALIZACIONES = "nutre_visualizaciones";
const leerVis = () => JSON.parse(localStorage.getItem(KEY_VISUALIZACIONES) || "{}");

export default function Home() {
  const navigate = useNavigate();
  const usuario = getUsuario();
  const [filtro, setFiltro] = useState("Todos");
  const [actual, setActual] = useState(VIDEOS[0]);
  // { [videoId]: { id, fecha_visualizacion, completado } } → forma de Visualizacion.java
  const [vistas, setVistas] = useState(leerVis);

  const visibles = useMemo(
    () => (filtro === "Todos" ? VIDEOS : VIDEOS.filter((v) => v.categoria === filtro)),
    [filtro]
  );
  const completados = VIDEOS.filter((v) => vistas[v.id]?.completado).length;

  function marcarCompletado(video) {
    const nuevas = {
      ...vistas,
      [video.id]: {
        id: crypto.randomUUID(),
        fecha_visualizacion: new Date().toISOString().slice(0, 10),
        completado: true,
      },
    };
    setVistas(nuevas);
    localStorage.setItem(KEY_VISUALIZACIONES, JSON.stringify(nuevas));
  }

  function salir() {
    cerrarSesion();
    navigate("/registro");
  }

  return (
    <div className="min-h-screen">
      <header className="flex flex-col items-center justify-between gap-2 bg-tinta px-4 py-4 text-[#e7f2ec] md:flex-row md:px-8">
        <span className="font-display text-xl font-extrabold text-azafran">NutreAPP</span>
        <div className="flex items-center gap-5 text-[0.95rem]">
          <span>{usuario.nombre} · {etiqueta(usuario.departamento)}</span>
          <button onClick={salir} className="cursor-pointer font-semibold text-white underline">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1100px] gap-8 p-4 md:p-8">
        <section>
          <h1 className="text-4xl font-extrabold md:text-5xl">Hola, {usuario.nombre.split(" ")[0]}.</h1>
          <p className="mb-3 mt-1 text-suave">Has completado {completados} de {VIDEOS.length} videos.</p>
          <div className="h-2 max-w-sm overflow-hidden rounded-full bg-menta"
               role="progressbar" aria-valuenow={completados} aria-valuemin="0" aria-valuemax={VIDEOS.length}>
            <div className="h-full bg-hoja transition-[width] duration-300"
                 style={{ width: `${(completados / VIDEOS.length) * 100}%` }} />
          </div>
        </section>

        <section aria-label="Video seleccionado" className="grid items-start gap-6 md:grid-cols-[1.6fr_1fr]">
          <div className={`grid aspect-video place-items-center rounded-[14px] ${FONDO_CATEGORIA[actual.categoria]}`}>
            <button aria-label={`Reproducir ${actual.titulo}`}
                    className="grid size-[72px] cursor-pointer place-items-center rounded-full bg-white pl-1 text-2xl text-tinta">
              ▶
            </button>
          </div>
          <div className="grid gap-3">
            <p className="text-sm text-suave">{etiqueta(actual.categoria)} · {actual.duracion}</p>
            <h2 className="text-3xl font-extrabold leading-tight">{actual.titulo}</h2>
            <p>{actual.descripcion}</p>
            {vistas[actual.id]?.completado ? (
              <p className="font-semibold text-hoja">Completado el {vistas[actual.id].fecha_visualizacion}</p>
            ) : (
              <button onClick={() => marcarCompletado(actual)}
                      className="cursor-pointer justify-self-start rounded-[10px] bg-tinta px-6 py-3 font-semibold text-white hover:bg-hoja">
                Marcar como completado
              </button>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Categorías">
            {["Todos", ...CATEGORIAS].map((c) => (
              <button key={c} role="tab" aria-selected={filtro === c} onClick={() => setFiltro(c)}
                      className={`cursor-pointer rounded-full border-[1.5px] px-4 py-2 font-medium ${
                        filtro === c ? "border-tinta bg-tinta text-white" : "border-borde bg-white"
                      }`}>
                {c === "Todos" ? "Todos" : etiqueta(c)}
              </button>
            ))}
          </div>

          <ul className="grid gap-2">
            {visibles.map((v) => (
              <li key={v.id}>
                <button onClick={() => setActual(v)}
                        className={`flex w-full cursor-pointer items-center gap-4 rounded-[10px] border-[1.5px] p-3 text-left ${
                          actual.id === v.id ? "border-hoja bg-menta" : "border-transparent bg-white hover:border-borde"
                        }`}>
                  <span aria-hidden="true"
                        className={`grid h-10 w-16 shrink-0 place-items-center rounded-md text-xs text-white ${FONDO_CATEGORIA[v.categoria]}`}>
                    ▶
                  </span>
                  <span className="grid flex-1">
                    <strong>{v.titulo}</strong>
                    <small className="text-suave">{etiqueta(v.categoria)} · {v.duracion}</small>
                  </span>
                  {vistas[v.id]?.completado && (
                    <span aria-label="Completado" className="text-xl font-extrabold text-hoja">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
