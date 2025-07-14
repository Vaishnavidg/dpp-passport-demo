//Contract Address => 0x5ECEE892DcB07b6b55219915053B858E433b5410

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClaimTopicsRegistry {
    uint256[] public requiredTopics;
    mapping(uint256 => string) public topicNames;
     mapping(uint256 => bool) public topicExists;

    event ClaimTopicAdded(uint256 indexed topic, string name);
    event ClaimTopicRemoved(uint256 topic);

    //Add a new required claim topic (e.g., KYC = 1)
    function addClaimTopic(uint256 topic,string calldata name) external {
        require(!topicExists[topic], "Topic already exists");
        requiredTopics.push(topic);
        topicNames[topic] = name;
        topicExists[topic] = true;
        emit ClaimTopicAdded(topic, name);
    }

     // Remove an existing topic
    function removeClaimTopic(uint256 topic) external {
        require(topicExists[topic], "Topic does not exist");

        // Find and remove
        for (uint i = 0; i < requiredTopics.length; i++) {
            if (requiredTopics[i] == topic) {
                requiredTopics[i] = requiredTopics[requiredTopics.length - 1]; // swap
                requiredTopics.pop(); // remove last
                delete topicNames[topic]; 
                topicExists[topic] = false;
                emit ClaimTopicRemoved(topic);
                break;
            }
        }
    }

    function getClaimTopics() public view returns (uint256[] memory) {
        return requiredTopics;
    }
      function getClaimTopicName(uint256 topic) public view returns (string memory) {
        return topicNames[topic];
    }

    //function to return IDs + Names
    function getClaimTopicsWithNames() public view returns (uint256[] memory, string[] memory) {
    uint256 length = requiredTopics.length;
    string[] memory names = new string[](length);

    for (uint i = 0; i < length; i++) {
        names[i] = topicNames[requiredTopics[i]];
    }

    return (requiredTopics, names);
}

} 