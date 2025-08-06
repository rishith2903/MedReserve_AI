/**
 * API Status Dashboard Component
 * Shows real-time status of all backend integrations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Database, 
  MessageSquare,
  Activity,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { apiTester } from '../../utils/apiTester';

const APIStatusDashboard = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Check if tests were already run
    if (window.apiTestResults) {
      setTestResults(window.apiTestResults);
      setLastUpdate(new Date());
    }
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await apiTester.runAllTests();
      setTestResults(window.apiTestResults);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to run API tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status] || variants.pending}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      authentication: <Server className="h-4 w-4" />,
      dashboard: <Activity className="h-4 w-4" />,
      doctors: <Server className="h-4 w-4" />,
      appointments: <Database className="h-4 w-4" />,
      prescriptions: <Database className="h-4 w-4" />,
      reports: <Database className="h-4 w-4" />,
      chatbot: <MessageSquare className="h-4 w-4" />
    };
    return icons[category] || <Server className="h-4 w-4" />;
  };

  const getOverallStatus = () => {
    if (!testResults) return 'pending';
    
    const { summary } = testResults;
    if (summary.passedRequired === summary.required) return 'operational';
    if (summary.passedRequired > 0) return 'degraded';
    return 'outage';
  };

  const getOverallStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'outage':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={`border-2 ${getOverallStatusColor()}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getOverallStatus() === 'operational' ? (
                <Wifi className="h-6 w-6" />
              ) : (
                <WifiOff className="h-6 w-6" />
              )}
              MedReserve AI System Status
            </CardTitle>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isRunning ? 'Testing...' : 'Run Tests'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {getOverallStatus().replace('_', ' ')}
              </h3>
              <p className="text-sm text-gray-600">
                {testResults ? (
                  `${testResults.summary.passedRequired}/${testResults.summary.required} critical services operational`
                ) : (
                  'Click "Run Tests" to check system status'
                )}
              </p>
            </div>
            {testResults && (
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {Math.round((testResults.summary.passedRequired / testResults.summary.required) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            )}
          </div>
          
          {testResults && (
            <Progress 
              value={(testResults.summary.passedRequired / testResults.summary.required) * 100} 
              className="h-2"
            />
          )}
          
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {lastUpdate.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Service Status Grid */}
      {testResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(testResults.details).map(([category, result]) => (
            <Card key={category} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <CardTitle className="text-sm capitalize">
                      {category.replace('_', ' ')}
                    </CardTitle>
                  </div>
                  {getStatusIcon(result.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {getStatusBadge(result.status)}
                  
                  {result.tests && (
                    <div className="space-y-1">
                      {result.tests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className={`flex items-center gap-1 ${
                            test.passed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {test.passed ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {test.name}
                          </span>
                          <span className="text-gray-500">
                            {test.responseTime}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {result.error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Backend Services</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Spring Boot API</span>
                  <Badge variant="outline" className="text-green-600">
                    {import.meta.env.VITE_API_BASE_URL ? 'Configured' : 'Not Set'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>ML Service</span>
                  <Badge variant="outline" className="text-green-600">
                    {import.meta.env.VITE_ML_SERVICE_URL ? 'Configured' : 'Not Set'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Chatbot Service</span>
                  <Badge variant="outline" className="text-green-600">
                    {import.meta.env.VITE_CHATBOT_SERVICE_URL ? 'Configured' : 'Not Set'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Real-time Features</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>WebSocket</span>
                  <Badge variant="outline" className="text-green-600">
                    {import.meta.env.VITE_WEBSOCKET_URL ? 'Configured' : 'Not Set'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-refresh</span>
                  <Badge variant="outline" className="text-green-600">
                    {import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === 'true' ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fallback Data</span>
                  <Badge variant="outline" className="text-blue-600">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Automatic Testing:</strong> Add <code>?test-api</code> to the URL to run tests automatically.
            </p>
            <p>
              <strong>Manual Testing:</strong> Click "Run Tests" to check all API endpoints.
            </p>
            <p>
              <strong>Fallback Mode:</strong> When APIs are unavailable, the app uses enhanced demo data.
            </p>
            <p>
              <strong>Real-time Updates:</strong> Data refreshes automatically every 60 seconds when APIs are available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIStatusDashboard;
