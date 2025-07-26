import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Chat, Send, SmartToy, Person } from '@mui/icons-material';
import { chatbotAPI } from '../../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your MedReserve AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ['Book appointment', 'Find doctor', 'View appointments', 'Ask about symptoms'],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Try to call the actual API first
      const response = await chatbotAPI.sendMessage({ message });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.data.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // If API fails, provide a mock response
      const mockResponses = [
        "I understand you're asking about health concerns. While I can provide general information, please consult with a healthcare professional for personalized medical advice.",
        "Based on your symptoms, I'd recommend scheduling an appointment with one of our specialists. Would you like me to help you find a suitable doctor?",
        "For immediate medical concerns, please contact emergency services. For non-urgent health questions, our doctors are available for consultation.",
        "I can help you understand general health information, but for specific medical advice, please book an appointment with one of our qualified doctors.",
        "Your health is important. While I can provide general guidance, a proper medical consultation would be best for your specific situation."
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Book Appointment', 'Find Doctors', 'Emergency Contacts'],
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Chat sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold">
          AI Assistant
        </Typography>
      </Box>

      <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: 'background.default',
          }}
        >
          {messages.map((message) => (
            <Box key={message.id} mb={2}>
              <Box
                display="flex"
                justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                alignItems="flex-start"
                gap={1}
              >
                {message.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <SmartToy sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: 'block',
                      mt: 1,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>

                {message.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    <Person sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
              </Box>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <Box mt={1} display="flex" flexWrap="wrap" gap={1} justifyContent="flex-start">
                  {message.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}

          {isLoading && (
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <SmartToy sx={{ fontSize: 20 }} />
              </Avatar>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    AI is thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Box component="form" onSubmit={handleSubmit} display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !inputMessage.trim()}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Send />
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Chatbot;
