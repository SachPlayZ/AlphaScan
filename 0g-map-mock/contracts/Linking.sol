// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Linking
 * @dev Contract for mapping wallet addresses to agent wallet addresses with multi-owner support
 */
contract Linking {
    struct AgentKey {
        string agentAddress;
        uint256 timestamp;
    }

    mapping(address => AgentKey) private addressToKeys;

    // Mapping to track contract owners
    mapping(address => bool) private owners;

    // Events
    event KeysLinked(
        address indexed wallet,
        string agentAddress,
        uint256 timestamp
    );
    event OwnerAdded(address indexed newOwner, address indexed addedBy);
    event OwnerRemoved(address indexed removedOwner, address indexed removedBy);

    // Modifiers
    modifier onlyOwner() {
        require(owners[msg.sender], "Not an owner");
        _;
    }

    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {
        owners[msg.sender] = true;
        emit OwnerAdded(msg.sender, msg.sender);
    }

    /**
     * @dev Adds a new owner to the contract
     * @param _newOwner Address of the new owner
     */
    function addOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        require(!owners[_newOwner], "Already an owner");

        owners[_newOwner] = true;
        emit OwnerAdded(_newOwner, msg.sender);
    }

    /**
     * @dev Removes an owner from the contract
     * @param _owner Address of the owner to remove
     */
    function removeOwner(address _owner) external onlyOwner {
        require(_owner != msg.sender, "Cannot remove self");
        require(owners[_owner], "Not an owner");

        owners[_owner] = false;
        emit OwnerRemoved(_owner, msg.sender);
    }

    /**
     * @dev Checks if an address is an owner
     * @param _address Address to check
     * @return True if the address is an owner, false otherwise
     */
    function isOwner(address _address) external view returns (bool) {
        return owners[_address];
    }

    /**
     * @dev Links the sender's wallet address to the provided agent wallet address
     * @param _agentAddress The agent wallet address to link
     */
    function linkKeys(string memory _agentAddress) external {
        addressToKeys[msg.sender] = AgentKey({
            agentAddress: _agentAddress,
            timestamp: block.timestamp
        });
        emit KeysLinked(msg.sender, _agentAddress, block.timestamp);
    }

    /**
     * @dev Links a specified wallet address to an agent wallet address (owner only)
     * @param _walletAddress The wallet address to link
     * @param _agentAddress The agent wallet address to link
     */
    function linkKeysForAddress(
        address _walletAddress,
        string memory _agentAddress
    ) external onlyOwner {
        require(_walletAddress != address(0), "Invalid address");
        addressToKeys[_walletAddress] = AgentKey({
            agentAddress: _agentAddress,
            timestamp: block.timestamp
        });
        emit KeysLinked(_walletAddress, _agentAddress, block.timestamp);
    }

    /**
     * @dev Retrieves the agent wallet address linked to the specified wallet
     * @param _walletAddress The wallet address to query
     * @return The agent wallet address
     */
    function getAgentAddress(
        address _walletAddress
    ) external view returns (string memory) {
        return addressToKeys[_walletAddress].agentAddress;
    }

    /**
     * @dev Checks if the specified wallet address has a linked agent wallet
     * @param _walletAddress The wallet address to check
     * @return True if linked, false otherwise
     */
    function hasLinkedKeys(
        address _walletAddress
    ) external view returns (bool) {
        return bytes(addressToKeys[_walletAddress].agentAddress).length > 0;
    }

    /**
     * @dev Retrieves the timestamp when the agent wallet was linked
     * @param _walletAddress The wallet address to query
     * @return The timestamp of the link
     */
    function getLinkTimestamp(
        address _walletAddress
    ) external view returns (uint256) {
        return addressToKeys[_walletAddress].timestamp;
    }
}
