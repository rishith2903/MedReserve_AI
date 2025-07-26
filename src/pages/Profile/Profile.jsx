import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { Person } from '@mui/icons-material';

const Profile = () => {
  return (
    <PlaceholderPage
      title="Profile"
      description="Manage your personal information and account settings."
      icon={Person}
    />
  );
};

export default Profile;
