import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState("");

  const crearUsuario = async (e) => {
    e.preventDefault();
    setMsg("");
    setCargando(true);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nombre, email }])
      .select(); // devuelve el registro insertado

    setCargando(false);

    if (error) {
      setMsg(`❌ Error creando usuario: ${error.message}`);
    } else {
      setMsg("✅ Usuario creado.");
      // limpia el formulario
      setNombre("");
      setEmail("");
      // opcional: refrescar la lista
      setUsuarios((prev) => [...data, ...prev]);
    }
  };

  const listarUsuarios = async () => {
    setMsg("");
    setCargando(true);

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("id", { ascending: false }); // si tienes columna id

    setCargando(false);

    if (error) {
      setMsg(`❌ Error consultando usuarios: ${error.message}`);
    } else {
      setUsuarios(data || []);
      setMsg(`🔄 ${data?.length ?? 0} usuarios cargados`);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Ejemplo Supabase + React (Vite)</h1>
      <p style={{ color: "#666" }}>
        Inserta y consulta registros de la tabla <code>usuarios</code>.
      </p>

      <form onSubmit={crearUsuario} style={{ marginTop: 24 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan Pérez"
            required
            style={{
              display: "block",
              width: "100%",
              padding: 8,
              marginTop: 4,
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@email.com"
            required
            style={{
              display: "block",
              width: "100%",
              padding: 8,
              marginTop: 4,
            }}
          />
        </label>

        <button
          type="submit"
          disabled={cargando}
          style={{ padding: "8px 14px", cursor: "pointer" }}
        >
          {cargando ? "Creando..." : "Crear usuario"}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={listarUsuarios}
          disabled={cargando}
          style={{ padding: "8px 14px" }}
        >
          {cargando ? "Cargando..." : "Listar usuarios"}
        </button>
      </div>

      {msg && (
        <div style={{ marginTop: 12, padding: 8, background: "#f6f6f6" }}>
          {msg}
        </div>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>Usuarios</h2>
        {usuarios.length === 0 ? (
          <p style={{ color: "#666" }}>
            Sin datos. Haz clic en “Listar usuarios”.
          </p>
        ) : (
          <ul>
            {usuarios.map((u) => (
              <li key={u.id ?? `${u.email}-${Math.random()}`}>
                <strong>{u.nombre}</strong> — {u.email}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
