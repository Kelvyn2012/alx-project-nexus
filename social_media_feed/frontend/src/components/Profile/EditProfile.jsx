import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE } from '../../graphql/profileMutations';
import { GET_MY_PROFILE } from '../../graphql/profileQueries';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/helpers';

const EditProfile = ({ profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
    dateOfBirth: profile?.dateOfBirth || '',
    location: profile?.location || '',
    profilePicture: profile?.profilePicture || '',
  });

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_MY_PROFILE }],
    onCompleted: (data) => {
      if (data.updateProfile.success) {
        toast.success('Profile updated successfully!');
        if (onUpdate) {
          onUpdate(data.updateProfile.profile);
        }
        onClose();
      } else if (data.updateProfile.errors) {
        toast.error(data.updateProfile.errors.join(', '));
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profilePicture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProfile({
      variables: {
        bio: formData.bio || null,
        date_of_birth: formData.dateOfBirth || null,
        location: formData.location || null,
        profile_picture: formData.profilePicture || null,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {formData.profilePicture && (
                <img
                  src={formData.profilePicture}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              className="input-field resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              maxLength="100"
              className="input-field"
              placeholder="City, Country"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
