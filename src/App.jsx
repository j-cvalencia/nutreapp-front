import { Navigate, Route, Routes } from "react-router-dom";
import Registro from "./pages/Registro.jsx";
import Home from "./pages/Home.jsx";
import { getUsuario } from "./auth.js";

function RutaPrivada({ children }) {
  return getUsuario() ? children : <Navigate to="/registro" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={getUsuario() ? "/home" : "/registro"} replace />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/home" element={<RutaPrivada><Home /></RutaPrivada>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
