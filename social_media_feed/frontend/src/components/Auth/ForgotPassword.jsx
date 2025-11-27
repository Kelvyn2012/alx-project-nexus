import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REQUEST_PASSWORD_RESET } from '../../graphql/mutations';
import Input from '../Common/Input';
import Button from '../Common/Button';
import ErrorMessage from '../Common/ErrorMessage';
import { isValidEmail } from '../../utils/helpers';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.requestPasswordReset.success) {
        setSuccessMessage(data.requestPasswordReset.message);
        setEmail('');
        setErrors({});
      } else if (data.requestPasswordReset.errors) {
        setErrors({ general: data.requestPasswordReset.errors.join(', ') });
      }
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
  });

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
    setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      await requestReset({
        variables: { email },
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-accent">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && <ErrorMessage message={errors.general} />}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          <div className="card p-6">
            <Input
              type="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="Enter your email"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
