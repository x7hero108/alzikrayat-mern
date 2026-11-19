import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import PhotoDetail from './pages/PhotoDetail.jsx';
import UploadPhoto from './pages/UploadPhoto.jsx';
import LoginRegister from './pages/LoginRegister.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/upload" element={<UploadPhoto />} />
        <Route path="/login" element={<LoginRegister mode="login" />} />
        <Route path="/register" element={<LoginRegister mode="register" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <p className="mb-0">© {new Date().getFullYear()} Alzikrayat</p>
      </footer>
    </>
  );
}

export default App;
