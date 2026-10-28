import React, { useState } from 'react';
import { User, Lock, Save, KeyRound, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [yearlyGoal, setYearlyGoal] = useState(String(user?.yearlyGoal || 12));
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  // Password fields state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const getUserInitials = (userName) => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Save Name and Yearly Goal
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name cannot be empty';
    }
    const goalNum = Number(yearlyGoal);
    if (!yearlyGoal || isNaN(goalNum) || goalNum < 1) {
      errors.yearlyGoal = 'Reading goal must be at least 1 book';
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsSavingProfile(true);
      const res = await api.put('/users/profile', {
        name: name.trim(),
        yearlyGoal: goalNum
      });

      const updated = res.data.user || res.data || { name: name.trim(), yearlyGoal: goalNum };
      updateUser(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Enter your current password';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'Enter your new password';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsChangingPassword(true);
      await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      showToast('Password changed successfully!', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordErrors({});
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to change password. Please check your current password.',
        'error'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="container profile-container">
        {/* Header */}
        <header className="profile-header">
          <h1 className="profile-title">Account & Preferences</h1>
          <p className="profile-subtitle">
            Manage your personal profile and set annual reading ambitions.
          </p>
        </header>

        <div className="profile-card">
          {/* Avatar & Email Banner */}
          <div className="profile-avatar-row">
            <div className="profile-avatar-large">
              {getUserInitials(user?.name)}
            </div>
            <div className="profile-avatar-meta">
              <span className="profile-avatar-name">{user?.name || 'Reader'}</span>
              <span className="profile-avatar-email">{user?.email}</span>
            </div>
          </div>

          {/* Profile Details Form */}
          <form onSubmit={handleSaveProfile} noValidate>
            <h2 className="profile-section-title">
              <User size={20} />
              <span>Personal Details</span>
            </h2>

            <div className="input-group">
              <label className="input-label" htmlFor="profile-name">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                className={`input ${profileErrors.name ? 'input-error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {profileErrors.name && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {profileErrors.name}
                </span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="profile-goal">
                Yearly Reading Goal (books per year)
              </label>
              <input
                id="profile-goal"
                type="number"
                min="1"
                max="500"
                className={`input ${profileErrors.yearlyGoal ? 'input-error' : ''}`}
                value={yearlyGoal}
                onChange={(e) => setYearlyGoal(e.target.value)}
              />
              {profileErrors.yearlyGoal && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {profileErrors.yearlyGoal}
                </span>
              )}
              <span className="input-helper">
                This sets the target on your Dashboard's annual progress ring.
              </span>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
                  <>
                    <span className="spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="profile-separator" />

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} noValidate>
            <h2 className="profile-section-title">
              <Lock size={20} />
              <span>Change Password</span>
            </h2>

            <div className="input-group">
              <label className="input-label" htmlFor="current-password">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                className={`input ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))
                }
                autoComplete="current-password"
              />
              {passwordErrors.currentPassword && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {passwordErrors.currentPassword}
                </span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="At least 6 characters"
                className={`input ${passwordErrors.newPassword ? 'input-error' : ''}`}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value
                  }))
                }
                autoComplete="new-password"
              />
              {passwordErrors.newPassword && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {passwordErrors.newPassword}
                </span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="confirm-new-password">
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                placeholder="Re-enter new password"
                className={`input ${passwordErrors.confirmNewPassword ? 'input-error' : ''}`}
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmNewPassword: e.target.value
                  }))
                }
                autoComplete="new-password"
              />
              {passwordErrors.confirmNewPassword && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {passwordErrors.confirmNewPassword}
                </span>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <span className="spinner" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
