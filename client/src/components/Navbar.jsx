import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Alzikrayat
        </Link>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <Link to="/gallery" className="btn btn-outline-light">
            Gallery
          </Link>

          {user ? (
            <>
              <span className="text-white">
                Hi <strong>{user.firstName}</strong>
              </span>
              <Link to="/upload" className="btn btn-primary">
                Upload Photo
              </Link>
              <button type="button" className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="text-white me-2">Please Login</span>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-light">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
