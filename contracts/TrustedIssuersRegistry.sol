//Contract Address = 0xFAF9C47067D436ca7480bd7C3E2a85b53aC0c8E5

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//The goal is to maintain a list of trusted claim issuers (like KYC providers, auditors, certifiers), 
// and define what type of claims (topics) each issuer is authorized to issue.


contract TrustedIssuersRegistry {
    address[] public issuers;
     // issuer => list of authorized claim topics
    mapping(address => uint256[]) public trustedIssuersTopics;
    mapping (address => string) public trustedIssuerName;
    mapping(address => bool) public isTrustedIssuer;

    // Events for off-chain monitoring
    event TrustedIssuerAdded(address indexed issuer, uint256[] topics);
    event TrustedIssuerRemoved(address indexed issuer);
    event TopicRemoved(address indexed issuer, uint256 topic);


    // Add or replace the list of topics for a trusted issuer
    function addTrustedIssuer(address issuer, string memory name, uint256[] memory topics) external {
        if (!isTrustedIssuer[issuer]) {
            isTrustedIssuer[issuer] = true;
         }
        issuers.push(issuer);
        trustedIssuersTopics[issuer] = topics;
        trustedIssuerName[issuer] = name;
          emit TrustedIssuerAdded(issuer, topics);
    }

     // Remove an entire issuer from the registry
    function removeTrustedIssuer(address issuer) external {
        for (uint i = 0; i < issuers.length; ++i){
            if (issuer == issuers[i]) {
    issuers[i] = issuers[issuers.length - 1]; // move last to current index
    issuers.pop();         
    isTrustedIssuer[issuer] = false;                    // remove last
    break;
}
         }
        delete trustedIssuersTopics[issuer];
        emit TrustedIssuerRemoved(issuer);
    }

    // Remove a specific topic from a trusted issuer

    function removeTopicForIssuer(address issuer, uint256 topic) external {
        uint256[] storage topics = trustedIssuersTopics[issuer];
        for(uint256 i = 0 ; i< topics.length; i++){
            if(topics[i] == topic){
                topics[i]= topics[topics.length -1];
                topics.pop();
                emit TopicRemoved(issuer,topic);    
                return;
            }
        }
    }

    //Check if issuer is trusted for a given claim topic
    function isIssuerTrusted(address issuer, uint256 topic) public view returns (bool) {
        uint256[] memory topics = trustedIssuersTopics[issuer];
        for (uint i = 0; i< topics.length; i++) {
            if( topics[i] == topic) return true;
        }
        return false;
    }

    //Get the topics an issuer is trusted for
    function getTopicsForIssuer(address issuer) public view returns (uint256[] memory) {
        return trustedIssuersTopics[issuer];
    }

    function getAllIssuersDetails() public view returns(address[] memory, uint256[] memory, string[] memory) {
        uint256 length = issuers.length;
        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        uint256[] memory topics = new uint256[](length);
         
        for( uint256 i = 0; i < length; i++){
            addresses[i] = issuers[i];
            names[i] = trustedIssuerName[issuers[i]];
            topics[i]=trustedIssuersTopics[issuers[i]].length; 
        }
         return (addresses, topics, names);
    }
     // get the name of an issuer by their address
    function getIssuerName(address issuer) public view returns (string memory){
          if(!isTrustedIssuer[issuer]) return "Not Trusted Issuer";
        return trustedIssuerName[issuer]; 
    }
    
}