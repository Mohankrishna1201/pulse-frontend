import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../context/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.updateProfile({ username, email });
      
      // Refresh user data
      const response = await authAPI.getCurrentUser();
      login(localStorage.getItem('token'), response.data.user);
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b-2 border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group p-3 rounded-xl bg-gradient-to-r from-[#796ce7] to-[#3a6cee] text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#796ce7] to-[#3a6cee] bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
        )}
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />
        )}

        {/* Profile Overview Card */}
        <Card className="p-8 mb-6 border-2 border-purple-100 shadow-2xl bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-4xl">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.username}</h2>
              <p className="text-gray-600 mb-3">{user?.email}</p>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={user?.role === 'admin' ? 'primary' : user?.role === 'editor' ? 'secondary' : 'default'}
                  className="text-sm px-3 py-1"
                >
                  {user?.role}
                </Badge>
                <Badge variant="default" className="text-sm px-3 py-1">
                  {user?.organization}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Update Profile Card */}
          <Card className="p-6 border-2 border-purple-100 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update Profile</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#796ce7] to-[#3a6cee] hover:from-[#6a5cd6] hover:to-[#2e5cdd] text-white shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6 border-2 border-blue-100 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3a6cee] to-[#796ce7] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#3a6cee] to-[#796ce7] hover:from-[#2e5cdd] hover:to-[#6a5cd6] text-white shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Account Info Card */}
        <Card className="p-6 mt-6 border-2 border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account Status</p>
              <Badge variant={user?.isActive ? 'success' : 'danger'} className="text-sm">
                {user?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-sm font-medium text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
