import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN, GOOGLE_SIGN_IN } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import ErrorMessage from '../Common/ErrorMessage';
import { getErrorMessage } from '../../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.tokenAuth) {
        login(
          data.tokenAuth.token,
          data.tokenAuth.refreshToken,
          data.tokenAuth.user
        );
      }
    },
    onError: (error) => {
      setErrors({ general: getErrorMessage(error) });
    },
  });

  const [googleSignInMutation, { loading: googleLoading }] = useMutation(GOOGLE_SIGN_IN, {
    onCompleted: (data) => {
      if (data.googleSignIn.success) {
        login(
          data.googleSignIn.token,
          data.googleSignIn.refreshToken,
          data.googleSignIn.user
        );
      } else if (data.googleSignIn.errors) {
        setErrors({ general: data.googleSignIn.errors.join(', ') });
      }
    },
    onError: (error) => {
      setErrors({ general: getErrorMessage(error) });
    },
  });

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      await googleSignInMutation({
        variables: { token: response.credential },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await loginMutation({
        variables: {
          username: formData.username,
          password: formData.password,
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-accent dark:text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-blue-600">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && <ErrorMessage message={errors.general} />}

          <div className="card p-6">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              placeholder="Enter your username"
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-blue-600">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
