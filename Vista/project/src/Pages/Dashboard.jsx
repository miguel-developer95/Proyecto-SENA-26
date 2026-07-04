import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const modulos = [
  {
    titulo: "Administracion",
    descripcion: "Informes, rotacion de productos y gestion de roles.",
    ruta: "/administracion",
    color: "#7F77DD",
    letra: "A",
  },
  {
    titulo: "Inventario",
    descripcion: "Consulta y gestion del stock de productos.",
    ruta: "/inventario",
    color: "#1D9E75",
    letra: "I",
  },
  {
    titulo: "Ventas",
    descripcion: "Registro y seguimiento de ventas del dia.",
    ruta: "/ventas",
    color: "#EF9F27",
    letra: "V",
  },
  {
    titulo: "Compras",
    descripcion: "Gestion de compras y proveedores.",
    ruta: "/compras",
    color: "#D85A30",
    letra: "C",
  },
];

function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={estilos.pagina}>
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.titulo}>Sistema Tentaciones Marlly</h1>
          <p style={estilos.sub}>Tentaciones Marlly</p>
        </div>
        <div style={estilos.headerDerecha}>
          <p style={estilos.usuarioTexto}>{usuario?.email}</p>
          <button style={estilos.btnLogout} onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </div>

      <p style={estilos.bienvenida}>Selecciona un modulo para comenzar</p>

      <div style={estilos.grid}>
        {modulos.map((mod) => (
          <div
            key={mod.titulo}
            style={estilos.card}
            onClick={() => navigate(mod.ruta)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ ...estilos.icono, background: mod.color }}>
              {mod.letra}
            </div>
            <h2 style={estilos.cardTitulo}>{mod.titulo}</h2>
            <p style={estilos.cardDesc}>{mod.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    padding: "2rem",
    fontFamily: "sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e5e5e5",
  },
  titulo: {
    fontSize: "22px",
    fontWeight: "500",
    color: "#1a1a1a",
    margin: 0,
  },
  sub: {
    fontSize: "13px",
    color: "#aaa",
    margin: "4px 0 0",
  },
  headerDerecha: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  usuarioTexto: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
  },
  btnLogout: {
    fontSize: "13px",
    padding: "6px 14px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    color: "#1a1a1a",
  },
  bienvenida: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "1.5rem",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  icono: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "500",
    fontSize: "18px",
    marginBottom: "1rem",
  },
  cardTitulo: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#1a1a1a",
    margin: "0 0 6px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
    lineHeight: "1.5",
  },
};

export default Dashboard;