// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SessionManager {
    struct Session {
        uint64 expiresAt;
    }

    mapping(address => Session) private sessions;

    event SessionStarted(address indexed user, uint64 expiresAt);
    event SessionEnded(address indexed user);

    /// @notice Starts a session for the sender with a given duration in seconds
    /// @param duration Duration of the session in seconds
    function startSession(uint64 duration) external {
        require(duration > 0, "Duration must be > 0");
        uint64 expiry = uint64(block.timestamp) + duration;
        sessions[msg.sender] = Session(expiry);
        emit SessionStarted(msg.sender, expiry);
    }

    /// @notice Ends the session for the sender
    function endSession() external {
        require(sessions[msg.sender].expiresAt != 0, "No active session");
        delete sessions[msg.sender];
        emit SessionEnded(msg.sender);
    }

    /// @notice Checks if a session is active for a given user
    /// @param user Address to check
    /// @return True if session is active, false otherwise
    function isSessionActive(address user) external view returns (bool) {
        return sessions[user].expiresAt > block.timestamp;
    }

    /// @notice Gets the expiry timestamp of a user's session
    /// @param user Address to query
    /// @return Expiry timestamp in seconds
    function getSessionExpiry(address user) external view returns (uint64) {
        return sessions[user].expiresAt;
    }
}
