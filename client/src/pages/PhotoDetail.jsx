import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentForm from '../components/CommentForm.jsx';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getPhoto(id), api.getComments(id)])
      .then(([photoData, commentsData]) => {
        setPhoto(photoData);
        setComments(commentsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await api.deletePhoto(id);
      navigate('/gallery');
    } catch (err) {
      setError(err.message);
    }
  };

  // the new comment is appended to the state, so the page updates without reloading
  const handleCommentAdded = (newComment) => setComments((previous) => [...previous, newComment]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Photo not found'}</div>
        <Link to="/gallery" className="btn btn-dark">Back to Gallery</Link>
      </div>
    );
  }

  const isOwner = user && user._id === photo.userId?._id;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow">
            <img src={`/uploads/${photo.fileName}`} className="card-img-top detail-image" alt={photo.title} />

            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <h1 className="card-title">{photo.title}</h1>
              <p className="card-text">{photo.description}</p>

              <p className="text-muted">
                Uploaded by:{' '}
                <strong>
                  {photo.userId?.firstName} {photo.userId?.lastName}
                </strong>
                <br />
                {new Date(photo.dateTime).toLocaleString()}
              </p>

              {isOwner && (
                <button type="button" className="btn btn-danger mb-4" onClick={handleDelete}>
                  Delete Photo
                </button>
              )}

              <hr />

              <h3 className="mb-4">Comments</h3>

              {comments.length === 0 ? (
                <div className="alert alert-light">No comments yet.</div>
              ) : (
                comments.map((c) => (
                  <div className="border rounded p-3 mb-3 bg-light" key={c._id}>
                    <strong>
                      {c.userId?.firstName} {c.userId?.lastName}
                    </strong>
                    <p className="mb-1 mt-2">{c.comment}</p>
                    <small className="text-muted">{new Date(c.dateTime).toLocaleString()}</small>
                  </div>
                ))
              )}

              {user ? (
                <CommentForm photoId={id} onCommentAdded={handleCommentAdded} />
              ) : (
                <div className="alert alert-info">
                  Please <Link to="/login">login</Link> to add a comment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoDetail;
