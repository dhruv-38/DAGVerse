// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SessionLog {
    struct Version {
        uint64 timestamp;
        string ipfsHash;
        address savedBy;
    }

    struct Session {
        uint256 sessionId;
        address owner;
        uint64 createdAt;
        address[] participants;
        Version[] history;
        mapping(address => bool) isParticipant;
        bool exists;
    }

    uint256 public sessionCount;
    mapping(uint256 => Session) private sessions;

    // Events
    event SessionCreated(
        uint256 indexed sessionId,
        address indexed owner,
        uint64 createdAt,
        address[] participants,
        string firstIpfsHash
    );
    event VersionAdded(
        uint256 indexed sessionId,
        uint64 timestamp,
        string ipfsHash,
        address indexed participant
    );
    event ParticipantAdded(uint256 indexed sessionId, address indexed participant);

    // Create a new session and log the very first version
    function createSession(address[] memory initialParticipants, string memory ipfsHash) external returns (uint256) {
        require(bytes(ipfsHash).length != 0, "IPFS hash required");
        sessionCount++;
        uint256 newSessionId = sessionCount;

        Session storage s = sessions[newSessionId];
        s.sessionId = newSessionId;
        s.owner = msg.sender;
        s.createdAt = uint64(block.timestamp);
        s.exists = true;

        // Add owner as a participant
        s.participants.push(msg.sender);
        s.isParticipant[msg.sender] = true;

        // Add initial participants, ensuring no duplicates
        for (uint i = 0; i < initialParticipants.length; i++) {
            address p = initialParticipants[i];
            require(p != address(0), "Invalid participant address");
            if (!s.isParticipant[p]) {
                s.participants.push(p);
                s.isParticipant[p] = true;
            }
        }

        s.history.push(Version(uint64(block.timestamp), ipfsHash, msg.sender));
        emit SessionCreated(newSessionId, msg.sender, s.createdAt, s.participants, ipfsHash);

        return newSessionId;
    }

    // Add a new version to an existing session (only by a participant)
    function saveVersion(uint256 sessionId, string memory ipfsHash) external {
        Session storage s = sessions[sessionId];
        require(s.exists, "Session does not exist");
        require(s.isParticipant[msg.sender], "Not a participant");
        require(bytes(ipfsHash).length != 0, "IPFS hash required");

        s.history.push(Version(uint64(block.timestamp), ipfsHash, msg.sender));
        emit VersionAdded(sessionId, uint64(block.timestamp), ipfsHash, msg.sender);
    }

    /// @notice Allows any user to join an existing session as a participant.
    function joinSession(uint256 sessionId) external {
        Session storage s = sessions[sessionId];
        require(s.exists, "Session does not exist");
        require(!s.isParticipant[msg.sender], "Already a participant");

        s.participants.push(msg.sender);
        s.isParticipant[msg.sender] = true;
        emit ParticipantAdded(sessionId, msg.sender);
     }

    // View all version history for a session
    function getHistory(uint256 sessionId) external view returns (
        uint64[] memory timestamps,
        string[] memory ipfsHashes,
        address[] memory savedBys
    ) {
        Session storage s = sessions[sessionId];
        require(s.exists, "Session does not exist");
        uint len = s.history.length;
        timestamps = new uint64[](len);
        ipfsHashes = new string[](len);
        savedBys = new address[](len);

        for (uint i = 0; i < len; i++) {
            Version storage v = s.history[i];
            timestamps[i] = v.timestamp;
            ipfsHashes[i] = v.ipfsHash;
            savedBys[i] = v.savedBy;
        }
    }

    // Convenience: Get session summary and all participants
    function getSession(uint256 sessionId) external view returns (
        address owner,
        uint64 createdAt,
        address[] memory participants,
        uint versionCount
    ) {
        Session storage s = sessions[sessionId];
        require(s.exists, "Session does not exist");
        return (s.owner, s.createdAt, s.participants, s.history.length);
    }

    // Convenience: Get latest IPFS hash for session
    function getLatestVersion(uint256 sessionId) external view returns (string memory ipfsHash, uint64 timestamp, address savedBy) {
        Session storage s = sessions[sessionId];
        require(s.exists, "Session does not exist");
        uint len = s.history.length;
        require(len > 0, "No versions");
        Version storage v = s.history[len - 1];
        return (v.ipfsHash, v.timestamp, v.savedBy);
    }

    // Utility: Check if an address is a participant
    function isParticipant(uint256 sessionId, address user) external view returns (bool) {
        Session storage s = sessions[sessionId];
        require(s.exists, "Session does not exist");
        return s.isParticipant[user];
    }
}
