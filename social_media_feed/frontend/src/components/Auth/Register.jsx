import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import ErrorMessage from '../Common/ErrorMessage';
import { isValidEmail, getErrorMessage } from '../../utils/helpers';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register: registerUser } = useAuth();

  const [registerMutation, { loading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      if (data.register.success) {
        registerUser(
          data.register.token,
          data.register.refreshToken,
          data.register.user
        );
      } else if (data.register.errors) {
        setErrors({ general: data.register.errors.join(', ') });
      }
    },
    onError: (error) => {
      setErrors({ general: getErrorMessage(error) });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

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

    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-accent">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-blue-600">
              Sign in
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
              placeholder="Choose a username"
            />

            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="Enter your email"
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Create a password"
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              placeholder="Confirm your password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
