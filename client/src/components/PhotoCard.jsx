import { Link } from 'react-router-dom';

// Props: photo (from the API) and isList (true for the list display style)
function PhotoCard({ photo, isList = false }) {
  const imageUrl = `/uploads/${photo.fileName}`;

  return (
    <div className={`card shadow-sm h-100 ${isList ? 'gallery-list-card' : ''}`}>
      <Link to={`/photos/${photo._id}`}>
        <img src={imageUrl} className="card-img-top gallery-image" alt={photo.title} />
      </Link>

      <div className="card-body">
        <h5 className="card-title">{photo.title}</h5>
        <p className="card-text text-muted">{photo.description}</p>
        <p className="card-text">
          <small className="text-muted">
            By {photo.userId?.firstName} {photo.userId?.lastName}
          </small>
        </p>
        <Link to={`/photos/${photo._id}`} className={`btn btn-dark ${isList ? '' : 'w-100'}`}>
          View Photo
        </Link>
      </div>
    </div>
  );
}

export default PhotoCard;
