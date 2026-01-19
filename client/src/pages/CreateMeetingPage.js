import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Button from '../components/Button';
import Card from '../components/Card';
import './CreateMeetingPage.css';

const CreateMeetingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meetingData, setMeetingData] = useState(null);

  const handleCreateMeeting = async () => {
    setLoading(true);
    setError('');
    setMeetingData(null);

    try {
      const response = await api.createMeeting();
      if (response.meetingId && response.password) {
        setMeetingData(response);
      } else {
        setError(response.error || 'Failed to create meeting');
      }
    } catch (err) {
      setError('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = () => {
    if (meetingData) {
      navigate(`/meeting/${meetingData.meetingId}`);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="create-meeting-page">
      <div className="create-meeting-container">
        <header className="create-meeting-header">
          <h1 className="create-meeting-title">Create Meeting</h1>
          <p className="create-meeting-subtitle">
            Generate a secure meeting room with a unique ID and password
          </p>
        </header>

        {!meetingData ? (
          <Card className="create-meeting-card">
            <div className="create-meeting-content">
              <div className="create-meeting-icon">🎥</div>
              <p className="create-meeting-description">
                Click the button below to create a new secure meeting room.
                You'll receive a unique meeting ID and password.
              </p>
              {error && <div className="error-message">{error}</div>}
              <Button
                variant="primary"
                size="large"
                onClick={handleCreateMeeting}
                disabled={loading}
                className="create-button"
              >
                {loading ? 'Creating...' : 'Create Meeting'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="meeting-details-card">
            <div className="meeting-details-content">
              <div className="success-icon">✓</div>
              <h2 className="meeting-details-title">Meeting Created</h2>
              <p className="meeting-details-subtitle">
                Share these details with participants
              </p>

              <div className="meeting-info">
                <div className="info-item">
                  <label className="info-label">Meeting ID</label>
                  <div className="info-value-wrapper">
                    <code className="info-value">{meetingData.meetingId}</code>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleCopy(meetingData.meetingId)}
                      className="copy-button"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="info-item">
                  <label className="info-label">Password</label>
                  <div className="info-value-wrapper">
                    <code className="info-value">{meetingData.password}</code>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleCopy(meetingData.password)}
                      className="copy-button"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="meeting-actions">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMeetingData(null);
                    setError('');
                  }}
                >
                  Create Another
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleJoinMeeting}
                  className="join-button"
                >
                  Join Meeting
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateMeetingPage;
