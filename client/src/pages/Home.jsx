import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: '📸', title: 'Upload Photos', text: 'Upload and preserve your favorite memories.' },
  { icon: '💬', title: 'Share Comments', text: 'Leave comments and interact with memories.' },
  { icon: '🔒', title: 'Secure', text: 'Your account and uploaded content are protected.' }
];

function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="py-5 bg-dark text-white">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Preserve Your Memories</h1>
          <p className="lead mt-3">
            Alzikrayat is a simple photo gallery where you can upload, share and remember your
            favorite moments.
          </p>
          <Link to="/gallery" className="btn btn-light btn-lg mt-3 me-2">
            Browse Gallery
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg mt-3">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row text-center g-4">
            {features.map((feature) => (
              <div className="col-md-4" key={feature.title}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="display-4">{feature.icon}</div>
                    <h4 className="mt-3">{feature.title}</h4>
                    <p className="text-muted">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold">About Alzikrayat</h2>
              <p className="text-muted">
                Alzikrayat is a web-based photo gallery designed to help users keep their memories
                organized in one place.
              </p>
              <p className="text-muted">
                Users can create an account, upload photographs, add descriptions, view memories and
                communicate through comments.
              </p>
            </div>
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-body text-center p-5">
                  <div className="display-1">📷</div>
                  <h3 className="mt-3">Your Memories</h3>
                  <p className="text-muted">Every picture tells a story.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
