import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, errorMessages } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function LoginForm() {
  const { login, getLastLogin, saveLastLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastLogin = getLastLogin();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const user = await api.login(form);
      saveLastLogin();
      login(user);
      navigate('/gallery');
    } catch (err) {
      setErrors(errorMessages(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {lastLogin && <div className="alert alert-info">Last login: {lastLogin}</div>}

      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label" htmlFor="loginEmail">Email</label>
        <input id="loginEmail" type="email" name="email" className="form-control" required
          value={form.email} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="loginPassword">Password</label>
        <input id="loginPassword" type="password" name="password" className="form-control" required
          value={form.password} onChange={handleChange} />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
