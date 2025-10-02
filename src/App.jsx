import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [msg, setMsg] = useState("");

  const crearUsuario = async (e) => {
    e.preventDefault();
    setMsg("");
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nombre, email }])
      .select();

    if (error) setMsg("❌ " + error.message);
    else {
      setMsg("✅ Usuario creado");
      setNombre("");
      setEmail("");
      setUsuarios((prev) => [...data, ...prev]);
    }
  };

  const listarUsuarios = async () => {
    setMsg("");
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("id", { ascending: false });

    if (error) setMsg("❌ " + error.message);
    else setUsuarios(data || []);
  };

  const alertClass = msg
    ? msg.startsWith("❌")
      ? "alert alert-danger"
      : msg.startsWith("✅")
      ? "alert alert-success"
      : "alert alert-secondary"
    : "";

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4 text-center">
            <h1 className="display-6 fw-semibold">React + Supabase</h1>
            <p className="text-muted m-0">
              Demo CRUD de tabla <code>usuarios</code> con Bootstrap
            </p>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h5 mb-3">Crear usuario</h2>
              <form onSubmit={crearUsuario} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="juan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Crear
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={listarUsuarios}
                  >
                    Listar usuarios
                  </button>
                </div>
              </form>

              {msg && <div className={`${alertClass} mt-3 mb-0`}>{msg}</div>}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Usuarios</h2>
              {usuarios.length === 0 ? (
                <p className="text-muted mb-0">
                  Sin datos. Haz clic en <b>Listar usuarios</b>.
                </p>
              ) : (
                <ul className="list-group">
                  {usuarios.map((u) => (
                    <li
                      key={u.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{u.nombre}</strong>
                        <div className="text-muted small">{u.email}</div>
                      </div>
                      <span className="badge text-bg-light">
                        {new Date(u.created_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
