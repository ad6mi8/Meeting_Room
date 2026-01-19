import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Button from '../components/Button';
import './MeetingRoom.css';

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const peersRef = useRef(new Map());
  const localStreamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket']
    });
    socketRef.current = socket;

    // Get user media
    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    }).then(stream => {
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Join meeting
      socket.emit('join-meeting', { meetingId, userId });

      // Handle new user joining
      socket.on('user-joined', async ({ userId: newUserId, socketId }) => {
        await createPeerConnection(socketId, newUserId, true);
      });

      // Handle existing participants
      socket.on('participants-list', (participantsList) => {
        setParticipants(participantsList);
        participantsList.forEach(({ socketId: otherSocketId, userId: otherUserId }) => {
          if (otherSocketId !== socket.id) {
            createPeerConnection(otherSocketId, otherUserId, false);
          }
        });
      });

      // Handle WebRTC offer
      socket.on('offer', async ({ offer, socketId }) => {
        await handleOffer(offer, socketId);
      });

      // Handle WebRTC answer
      socket.on('answer', async ({ answer, socketId }) => {
        await handleAnswer(answer, socketId);
      });

      // Handle ICE candidates
      socket.on('ice-candidate', async ({ candidate, socketId }) => {
        await handleIceCandidate(candidate, socketId);
      });

      // Handle user leaving
      socket.on('user-left', ({ socketId }) => {
        removePeer(socketId);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        setError('Connection error. Please try again.');
      });
    }).catch(error => {
      console.error('Error accessing media devices:', error);
      setError('Unable to access camera/microphone. Please check permissions.');
    });

    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      socket.emit('leave-meeting', { meetingId });
      socket.disconnect();
      peersRef.current.forEach(peer => {
        peer.close();
      });
      peersRef.current.clear();
    };
  }, [meetingId, userId]);

  const createPeerConnection = async (socketId, otherUserId, isInitiator) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      addRemoteVideo(socketId, remoteStream, otherUserId);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          meetingId,
          candidate: event.candidate,
          targetSocketId: socketId
        });
      }
    };

    peersRef.current.set(socketId, { peerConnection, userId: otherUserId });

    // Create and send offer if initiator
    if (isInitiator) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current.emit('offer', {
          meetingId,
          offer,
          targetSocketId: socketId
        });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }
  };

  const handleOffer = async (offer, socketId) => {
    const peerData = peersRef.current.get(socketId);
    if (!peerData) return;

    try {
      await peerData.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerData.peerConnection.createAnswer();
      await peerData.peerConnection.setLocalDescription(answer);
      socketRef.current.emit('answer', {
        meetingId,
        answer,
        targetSocketId: socketId
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer, socketId) => {
    const peerData = peersRef.current.get(socketId);
    if (!peerData) return;

    try {
      await peerData.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate, socketId) => {
    const peerData = peersRef.current.get(socketId);
    if (!peerData) return;

    try {
      await peerData.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const addRemoteVideo = (socketId, stream, otherUserId) => {
    setParticipants(prev => {
      const existing = prev.find(p => p.socketId === socketId);
      if (existing) {
        return prev.map(p => 
          p.socketId === socketId ? { ...p, stream } : p
        );
      }
      return [...prev, { socketId, userId: otherUserId, stream }];
    });
  };

  const removePeer = (socketId) => {
    const peerData = peersRef.current.get(socketId);
    if (peerData) {
      peerData.peerConnection.close();
      peersRef.current.delete(socketId);
    }
    setParticipants(prev => prev.filter(p => p.socketId !== socketId));
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleLeave = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.emit('leave-meeting', { meetingId });
      socketRef.current.disconnect();
    }
    peersRef.current.forEach(peer => {
      peer.peerConnection.close();
    });
    navigate('/');
  };

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <div className="meeting-info">
          <h2 className="meeting-title">Meeting: {meetingId}</h2>
          <span className="participant-count">{participants.length + 1} participant{participants.length !== 0 ? 's' : ''}</span>
        </div>
        <Button variant="danger" onClick={handleLeave} className="leave-button">
          Leave Meeting
        </Button>
      </div>

      <div className="video-grid">
        <div className="video-item local-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
          />
          <div className="video-label">
            You {isMuted && '🔇'} {isVideoOff && '📷'}
          </div>
        </div>

        {participants.map(({ socketId, userId: otherUserId, stream }) => (
          <div key={socketId} className="video-item remote-video">
            <video
              autoPlay
              playsInline
              ref={(videoElement) => {
                if (videoElement && stream) {
                  videoElement.srcObject = stream;
                }
              }}
              className="video-element"
            />
            <div className="video-label">{otherUserId}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="meeting-error">
          <p>{error}</p>
          <Button variant="secondary" onClick={() => setError('')}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="meeting-controls">
        <Button
          variant={isMuted ? "danger" : "secondary"}
          onClick={toggleMute}
          className="control-button"
        >
          {isMuted ? '🔇 Unmute' : '🎤 Mute'}
        </Button>
        <Button
          variant={isVideoOff ? "danger" : "secondary"}
          onClick={toggleVideo}
          className="control-button"
        >
          {isVideoOff ? '📷 Turn On Camera' : '📹 Turn Off Camera'}
        </Button>
      </div>
    </div>
  );
};

export default MeetingRoom;
