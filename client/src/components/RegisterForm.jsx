import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, errorMessages } from '../api.js';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  description: ''
};

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await api.register(form);
      navigate('/login');
    } catch (err) {
      setErrors(errorMessages(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </div>
      )}

      <div className="row">
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" className="form-control" required maxLength="50"
            value={form.firstName} onChange={handleChange} />
        </div>
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" className="form-control" required maxLength="50"
            value={form.lastName} onChange={handleChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="regEmail">Email</label>
        <input id="regEmail" type="email" name="email" className="form-control" required
          value={form.email} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="regPassword">Password</label>
        <input id="regPassword" type="password" name="password" className="form-control" required minLength="8"
          value={form.password} onChange={handleChange} />
        <div className="form-text">At least 8 characters.</div>
      </div>

      <div className="row">
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="location">Location (optional)</label>
          <input id="location" name="location" className="form-control" maxLength="100"
            value={form.location} onChange={handleChange} />
        </div>
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="occupation">Occupation (optional)</label>
          <input id="occupation" name="occupation" className="form-control" maxLength="100"
            value={form.occupation} onChange={handleChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="description">About you (optional)</label>
        <textarea id="description" name="description" className="form-control" rows="3" maxLength="500"
          value={form.description} onChange={handleChange} />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}

export default RegisterForm;
