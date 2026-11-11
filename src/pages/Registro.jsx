import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTAMENTOS, ROLES, etiqueta } from "../models/enums.js";
import { registrarUsuario } from "../auth.js";

const inicial = { nombre: "", correo: "", rol: "", departamento: "", contrasena: "", confirmar: "" };

function validar(f) {
  const e = {};
  if (f.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";
  if (!/^\S+@\S+\.\S+$/.test(f.correo)) e.correo = "Escribe un correo válido, por ejemplo ana@empresa.com.";
  if (!f.rol) e.rol = "Elige tu rol.";
  if (!f.departamento) e.departamento = "Elige tu departamento.";
  if (f.contrasena.length < 8) e.contrasena = "Usa al menos 8 caracteres.";
  if (f.confirmar !== f.contrasena) e.confirmar = "Las contraseñas no coinciden.";
  return e;
}

const claseInput =
  "w-full rounded-[10px] border-[1.5px] border-borde bg-white px-3 py-2.5 aria-[invalid=true]:border-coral";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    const err = validar(form);
    setErrores(err);
    setErrorGeneral("");
    if (Object.keys(err).length) return;
    setEnviando(true);
    try {
      await registrarUsuario(form);
      navigate("/home");
    } catch (ex) {
      setErrorGeneral(ex.message);
    } finally {
      setEnviando(false);
    }
  }

  const Mensaje = ({ name }) =>
    errores[name] ? <p className="text-sm text-coral">{errores[name]}</p> : null;

  const campo = (name, label, props = {}) => (
    <div className="grid gap-1">
      <label htmlFor={name} className="text-[0.95rem] font-semibold">{label}</label>
      <input id={name} name={name} value={form[name]} onChange={cambiar}
             aria-invalid={!!errores[name]} className={claseInput} {...props} />
      <Mensaje name={name} />
    </div>
  );

  const lista = (name, label, opciones) => (
    <div className="grid gap-1">
      <label htmlFor={name} className="text-[0.95rem] font-semibold">{label}</label>
      <select id={name} name={name} value={form[name]} onChange={cambiar}
              aria-invalid={!!errores[name]} className={claseInput}>
        <option value="" disabled>Selecciona una opción</option>
        {opciones.map((o) => <option key={o} value={o}>{etiqueta(o)}</option>)}
      </select>
      <Mensaje name={name} />
    </div>
  );

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="flex flex-col justify-center gap-6 bg-tinta px-6 py-10 text-[#e7f2ec] md:px-12 md:py-16">
        <p className="font-display text-2xl font-extrabold text-azafran">NutreAPP</p>
        <h1 className="max-w-[14ch] text-4xl font-extrabold leading-[1.05] lg:text-5xl">
          Aprende lo que tu equipo necesita saber, a tu ritmo.
        </h1>
        <p className="max-w-[38ch] text-[#b9d3c6]">
          Seguridad y salud en el trabajo, talento humano y capacitaciones internas en un solo lugar.
        </p>
      </section>

      <section className="grid place-items-center p-8">
        <form onSubmit={enviar} noValidate className="grid w-full max-w-[440px] gap-4">
          <h2 className="text-3xl font-extrabold">Crea tu cuenta</h2>
          {errorGeneral && (
            <p role="alert" className="rounded-[10px] bg-[#fbe9e5] px-3.5 py-2.5 text-sm text-coral">
              {errorGeneral}
            </p>
          )}
          {campo("nombre", "Nombre completo", { autoComplete: "name" })}
          {campo("correo", "Correo corporativo", { type: "email", autoComplete: "email" })}
          <div className="grid gap-4 sm:grid-cols-2">
            {lista("rol", "Rol", ROLES)}
            {lista("departamento", "Departamento", DEPARTAMENTOS)}
          </div>
          {campo("contrasena", "Contraseña", { type: "password", autoComplete: "new-password" })}
          {campo("confirmar", "Repite la contraseña", { type: "password", autoComplete: "new-password" })}
          <button disabled={enviando}
                  className="cursor-pointer rounded-[10px] bg-tinta px-6 py-3 font-semibold text-white hover:bg-hoja disabled:cursor-wait disabled:opacity-60">
            {enviando ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>
      </section>
    </main>
  );
}
