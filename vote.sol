// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract SimpleVoting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;
    string public electionName;
    Candidate[] public candidates;
    mapping(bytes32 => uint) private candidateIndexMapping;
    mapping(address => bool) public hasVoted;
    mapping(bytes32 => bool) private voteHashes; // Added mapping for vote hashes
    address[] public voters;
    uint public votingStartTime;
    uint public votingEndTime;

    event VoteConfirmed(address indexed voter);
    event CandidateAdded(string candidateName);

    modifier ownerOnly() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier duringVotingPeriod() {
        require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Voting is not active");
        _;
    }

    constructor(string memory _name, uint _votingDuration) {
        owner = msg.sender;
        electionName = _name;
        votingStartTime = block.timestamp;
        votingEndTime = votingStartTime + _votingDuration;

        // Predefined candidates
        _addCandidate("Blockchain");
        _addCandidate("Penetration Testing");
        _addCandidate("Information Security");
        _addCandidate("Network Security");
        _addCandidate("Cryptography");
    }

    function _addCandidate(string memory candidateName) internal {
        bytes32 candidateHash = keccak256(abi.encodePacked(candidateName));
        require(candidateIndexMapping[candidateHash] == 0, "Candidate already exists");

        candidates.push(Candidate(candidateName, 0));
        candidateIndexMapping[candidateHash] = candidates.length; // Store the index + 1 to differentiate from default 0 value
        
        emit CandidateAdded(candidateName);
    }

    function addCandidates(string[] memory candidateNames) public ownerOnly {
        for (uint i = 0; i < candidateNames.length; i++) {
            _addCandidate(candidateNames[i]);
        }
    }

    function vote(uint index) public duringVotingPeriod {
        require(!hasVoted[msg.sender], "You have already voted");
        require(index < candidates.length, "Candidate not found");

        candidates[index].voteCount += 1;
        hasVoted[msg.sender] = true;
        voters.push(msg.sender);

        // Store the hash of the vote
        voteHashes[keccak256(abi.encodePacked(msg.sender, index))] = true;

        emit VoteConfirmed(msg.sender);
    }

    function endElection() public view ownerOnly returns (string memory winnerName) {
        require(candidates.length > 0, "No candidates available");

        uint maxVotes = 0;
        uint winnerIndex = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }

        winnerName = candidates[winnerIndex].name;
    }

    function getNumCandidates() public view returns (uint) {
        return candidates.length;
    }

    function getCandidate(uint index) public view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Candidate not found");

        Candidate memory candidate = candidates[index];
        return (candidate.name, candidate.voteCount);
    }

    function getVoters() public view ownerOnly returns (address[] memory) {
        return voters;
    }

    function getNumVoters() public view ownerOnly returns (uint) {
        return voters.length;
    }

    function resetElection(uint _votingDuration) public ownerOnly {
        for (uint i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        for (uint i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
            delete voteHashes[keccak256(abi.encodePacked(voters[i]))]; // Διαγραφή των hash ψήφων
        }
        delete voters;
        votingStartTime = block.timestamp;
        votingEndTime = votingStartTime + _votingDuration;
    }
}
