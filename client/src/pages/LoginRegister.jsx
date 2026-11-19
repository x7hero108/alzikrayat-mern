import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

// Props: mode ("login" or "register") decides which form is displayed
function LoginRegister({ mode = 'login' }) {
  const isLogin = mode === 'login';

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className={isLogin ? 'col-md-5' : 'col-md-7'}>
          <div className="card shadow mt-5">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>

              {isLogin ? <LoginForm /> : <RegisterForm />}

              <p className="text-center mt-3 mb-0">
                {isLogin ? (
                  <>
                    No account yet? <Link to="/register">Register</Link>
                  </>
                ) : (
                  <>
                    Already registered? <Link to="/login">Login</Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
