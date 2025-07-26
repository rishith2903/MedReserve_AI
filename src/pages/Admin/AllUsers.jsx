import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { People } from '@mui/icons-material';

const AllUsers = () => {
  return (
    <PlaceholderPage
      title="All Users"
      description="Manage all users in the system. Admin access required."
      icon={People}
    />
  );
};

export default AllUsers;
