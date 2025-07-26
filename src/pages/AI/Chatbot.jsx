import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { Chat } from '@mui/icons-material';

const Chatbot = () => {
  return (
    <PlaceholderPage
      title="AI Health Assistant"
      description="Chat with our AI-powered health assistant for instant support."
      icon={Chat}
    />
  );
};

export default Chatbot;
