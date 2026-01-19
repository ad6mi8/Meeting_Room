/**
 * Meeting Manager - In-Memory Meeting Storage
 * 
 * All meeting data exists only in memory.
 * No persistence, no database, no logs.
 * Data is destroyed when meeting ends or server restarts.
 */

const crypto = require('crypto');

class MeetingManager {
    constructor() {
        // In-memory storage: Map<meetingId, meetingObject>
        this.meetings = new Map();

        // Track participants: Map<meetingId, Set<socketId>>
        this.participants = new Map();

        // Socket to meeting mapping: Map<socketId, meetingId>
        this.socketToMeeting = new Map();
    }

    /**
     * Generate a unique meeting ID
     */
    generateMeetingId() {
        return crypto.randomBytes(8).toString('hex').toUpperCase();
    }

    /**
     * Generate a secure meeting password
     */
    generatePassword() {
        return crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    /**
     * Create a new meeting
     * Returns meeting object with id and password
     */
    createMeeting() {
        const id = this.generateMeetingId();
        const password = this.generatePassword();
        const createdAt = Date.now();

        const meeting = {
            id,
            password,
            createdAt,
            expiresAt: createdAt + (2 * 60 * 60 * 1000) // 2 hours
        };

        this.meetings.set(id, meeting);
        this.participants.set(id, new Map()); // Map<socketId, userId>

        return meeting;
    }

    /**
     * Get meeting by ID
     */
    getMeeting(meetingId) {
        const meeting = this.meetings.get(meetingId);

        if (!meeting) {
            return null;
        }

        // Check if meeting has expired
        if (Date.now() > meeting.expiresAt) {
            this.deleteMeeting(meetingId);
            return null;
        }

        return meeting;
    }

    /**
     * Add participant to meeting
     */
    addParticipant(meetingId, socketId, userId) {
        const participants = this.participants.get(meetingId);
        if (participants) {
            participants.set(socketId, userId);
            this.socketToMeeting.set(socketId, meetingId);
        }
    }

    /**
     * Remove participant from meeting
     */
    removeParticipant(meetingId, socketId) {
        const participants = this.participants.get(meetingId);
        if (participants) {
            participants.delete(socketId);
            this.socketToMeeting.delete(socketId);

            // If no participants left, delete meeting after 5 minutes
            if (participants.size === 0) {
                setTimeout(() => {
                    if (this.participants.get(meetingId) ? .size === 0) {
                        this.deleteMeeting(meetingId);
                    }
                }, 5 * 60 * 1000);
            }
        }
    }

    /**
     * Get all participants in a meeting
     */
    getParticipants(meetingId) {
        const participants = this.participants.get(meetingId);
        if (!participants) {
            return [];
        }

        return Array.from(participants.entries()).map(([socketId, userId]) => ({
            socketId,
            userId
        }));
    }

    /**
     * Find meeting ID by socket ID
     */
    findMeetingBySocketId(socketId) {
        return this.socketToMeeting.get(socketId);
    }

    /**
     * Delete meeting and all its data
     */
    deleteMeeting(meetingId) {
        const participants = this.participants.get(meetingId);
        if (participants) {
            // Remove all socket mappings
            participants.forEach((userId, socketId) => {
                this.socketToMeeting.delete(socketId);
            });
        }

        this.meetings.delete(meetingId);
        this.participants.delete(meetingId);
    }

    /**
     * Cleanup expired meetings
     */
    cleanupExpiredMeetings() {
        const now = Date.now();
        const expiredMeetings = [];

        this.meetings.forEach((meeting, meetingId) => {
            if (now > meeting.expiresAt) {
                expiredMeetings.push(meetingId);
            }
        });

        expiredMeetings.forEach(meetingId => {
            this.deleteMeeting(meetingId);
        });
    }
}

module.exports = MeetingManager;