import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../../graphql/mutations';
import Input from '../Common/Input';
import Button from '../Common/Button';
import ErrorMessage from '../Common/ErrorMessage';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setErrors({ general: 'Invalid or missing reset token' });
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data.resetPassword.success) {
        alert('Password reset successful! Please log in with your new password.');
        navigate('/login');
      } else if (data.resetPassword.errors) {
        setErrors({ general: data.resetPassword.errors.join(', ') });
      }
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setErrors({ general: 'Invalid or missing reset token' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword({
        variables: {
          token,
          newPassword: formData.password,
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-accent">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && <ErrorMessage message={errors.general} />}

          <div className="card p-6">
            <Input
              type="password"
              label="New Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Enter new password"
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              placeholder="Confirm new password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || !token}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:text-blue-600"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
