import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import './JoinMeetingPage.css';

const JoinMeetingPage = () => {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.joinMeeting(meetingId.trim().toUpperCase(), password.trim().toUpperCase());
      if (response.success) {
        navigate(`/meeting/${meetingId.trim().toUpperCase()}`);
      } else {
        setError(response.error || 'Failed to join meeting');
      }
    } catch (err) {
      setError('Failed to join meeting. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-meeting-page">
      <div className="join-meeting-container">
        <header className="join-meeting-header">
          <h1 className="join-meeting-title">Join Meeting</h1>
          <p className="join-meeting-subtitle">
            Enter the meeting ID and password to join
          </p>
        </header>

        <Card className="join-meeting-card">
          <form onSubmit={handleJoinMeeting} className="join-meeting-form">
            <Input
              type="text"
              label="Meeting ID"
              placeholder="Enter meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value.toUpperCase())}
              error={error && error.includes('not found') ? error : ''}
              disabled={loading}
              required
              autoFocus
              className="meeting-input"
            />

            <Input
              type="text"
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              error={error && error.includes('password') ? error : ''}
              disabled={loading}
              required
              className="meeting-input"
            />

            {error && !error.includes('not found') && !error.includes('password') && (
              <div className="error-message">{error}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading || !meetingId || !password}
              className="join-button"
            >
              {loading ? 'Joining...' : 'Join Meeting'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default JoinMeetingPage;
