import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, errorMessages } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function UploadPhoto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);

  // only logged-in users can upload
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    if (!file) {
      setErrors(['Please select a photo']);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('photo', file);

    setUploading(true);
    try {
      const photo = await api.uploadPhoto(formData);
      navigate(`/photos/${photo._id}`);
    } catch (err) {
      setErrors(errorMessages(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Upload Photo</h2>

              <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    {errors.map((message) => (
                      <div key={message}>{message}</div>
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input id="title" className="form-control" required maxLength="100"
                    value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea id="description" className="form-control" rows="3" maxLength="1000"
                    value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="photo">Photo (JPG, PNG, GIF or WEBP, max 5 MB)</label>
                  <input id="photo" type="file" className="form-control" required
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPhoto;
