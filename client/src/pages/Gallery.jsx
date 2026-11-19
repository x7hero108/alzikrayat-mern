import { useEffect, useState } from 'react';
import PhotoCard from '../components/PhotoCard.jsx';
import { api } from '../api.js';

// Display styles (same three styles as the PHP version)
const styles = [
  { key: 'three', label: '3 Columns', colClass: 'col-md-6 col-lg-4' },
  { key: 'four', label: '4 Columns', colClass: 'col-md-6 col-lg-3' },
  { key: 'list', label: 'List', colClass: 'col-12' }
];

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [style, setStyle] = useState('three');

  useEffect(() => {
    api
      .getPhotos()
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const current = styles.find((s) => s.key === style);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Gallery</h2>

        <div className="text-center mb-4">
          {styles.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`btn me-2 ${style === s.key ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setStyle(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && !error && photos.length === 0 && (
          <div className="alert alert-info text-center">No photos have been uploaded yet.</div>
        )}

        <div className="row g-4">
          {photos.map((photo) => (
            <div key={photo._id} className={current.colClass}>
              <PhotoCard photo={photo} isList={style === 'list'} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
