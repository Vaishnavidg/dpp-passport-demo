//Contract Address => 0xb010ECaC9c6f382C73Fad559D0eCE47FCb499C0e

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//The goal is to maintain a list of trusted claim issuers (like KYC providers, auditors, certifiers), 
// and define what type of claims (topics) each issuer is authorized to issue.


contract TrustedIssuersRegistry {
     // issuer => list of authorized claim topics
    mapping(address => uint256[]) public trustedIssuers;

    // Events for off-chain monitoring
    event TrustedIssuerAdded(address indexed issuer, uint256[] topics);
    event TrustedIssuerRemoved(address indexed issuer);
    event TopicRemoved(address indexed issuer, uint256 topic);


    // Add or replace the list of topics for a trusted issuer
    function addTrustedIssuer(address issuer, uint256[] memory topics) external {
        trustedIssuers[issuer] = topics;
          emit TrustedIssuerAdded(issuer, topics);
    }

     // Remove an entire issuer from the registry
    function removeTrustedIssuer(address issuer) external {
        delete trustedIssuers[issuer];
        emit TrustedIssuerRemoved(issuer);
    }

    // Remove a specific topic from a trusted issuer

    function removeTopicForIssuer(address issuer, uint256 topic) external {
        uint256[] storage topics = trustedIssuers[issuer];
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
        uint256[] memory topics = trustedIssuers[issuer];
        for (uint i = 0; i< topics.length; i++) {
            if( topics[i] == topic) return true;
        }
        return false;
    }

    //Get the topics an issuer is trusted for
    function getTopicsForIssuer(address issuer) public view returns (uint256[] memory) {
        return trustedIssuers[issuer];
    }
}