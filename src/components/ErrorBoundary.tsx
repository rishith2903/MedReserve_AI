import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
            🚨 Application Error
          </h1>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Something went wrong. Please refresh the page or contact support.
          </p>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '20px',
            maxWidth: '600px',
            textAlign: 'left'
          }}>
            <strong>Error Details:</strong>
            <pre style={{ 
              fontSize: '12px', 
              color: '#d32f2f',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
