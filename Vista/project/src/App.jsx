
import Login from "./components/Login";

function App() {
  return (
    <div>
      <Login />
    </div>
  );
}

export default App;

const [User, setUser] = useState(null);

const handleLogout = () => {
  setUser(null);
};

<main>
  
  {User ? (
    <Login onLoginSucess={setUser} / >
  ) : (
    <div>


