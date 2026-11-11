// Sesión y persistencia local. Cuando el backend tenga endpoints,
// cambia `registrarUsuario` para que haga POST a /api/usuarios.
const KEY_SESION = "nutre_sesion";
const KEY_USUARIOS = "nutre_usuarios";

export async function sha256(texto) {
  const datos = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem(KEY_SESION));
  } catch {
    return null;
  }
}

export async function registrarUsuario({ nombre, correo, rol, departamento, contrasena }) {
  const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
  if (usuarios.some((u) => u.correo === correo)) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  // Mismos campos que la clase Usuario.java
  const usuario = {
    id: crypto.randomUUID(),
    nombre,
    correo,
    rol,
    departamento,
    contrasena_hash: await sha256(contrasena),
  };
  localStorage.setItem(KEY_USUARIOS, JSON.stringify([...usuarios, usuario]));
  // En la sesión no guardamos el hash
  const { contrasena_hash, ...sesion } = usuario;
  localStorage.setItem(KEY_SESION, JSON.stringify(sesion));
  return sesion;
}

export function cerrarSesion() {
  localStorage.removeItem(KEY_SESION);
}
