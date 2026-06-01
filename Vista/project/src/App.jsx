import { useState } from "react";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <main>
      {user ? (
        <div>
          <h1>Bienvenido, {user.nombre}</h1>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <Login onLoginSuccess={setUser} />
      )}
    </main>
  );
}

export default App;
