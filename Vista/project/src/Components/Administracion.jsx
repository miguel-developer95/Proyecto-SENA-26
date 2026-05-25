import { useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin",
      role: "Administrador",
    },
    {
      id: 2,
      name: "Juan",
      role: "Vendedor",
    },
  ]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Usuarios y Roles</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>

              <td>
                <select
                  value={user.role}
                >
                  <option>
                    Administrador
                  </option>

                  <option>
                    Vendedor
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}