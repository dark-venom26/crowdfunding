// SPDX-License-Identifier: Unlicensed

pragma solidity > 0.7.0 <= 0.9.0;

contract CampaignFactory {
    address[] public deployedCampaings;

    event campaignCreated(
        string title,
        uint requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imgURI,
        string descriptionURI,
        uint indexed timestamp,
        string indexed category
    );

    function createCampaign(
        string memory campaignTitle,
        uint requiredCampaignAmount,
        string memory imgURI,
        string memory descriptionURI,
        string memory category
    ) public payable {
        Campaign newCampaign = new Campaign(campaignTitle, requiredCampaignAmount, imgURI, descriptionURI, msg.sender);
        
        deployedCampaings.push(address(newCampaign));

        emit campaignCreated(
            campaignTitle, 
            requiredCampaignAmount, 
            msg.sender, 
            address(newCampaign), 
            imgURI,
            descriptionURI,
            block.timestamp,
            category
        );
    }
}

contract Campaign {
    string public title;
    uint public requiredAmount;
    string public image;
    string public description;
    address payable public owner;
    uint public receivedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);

    constructor(
        string memory campaignTitle,
        uint requiredCampaignAmount,
        string memory imgURI,
        string memory descriptionURI,
        address campaignOwner
    ){
        title = campaignTitle;
        requiredAmount = requiredCampaignAmount;
        image = imgURI;
        description = descriptionURI;
        owner = payable(campaignOwner);
    }

    function donate() public payable{
        require(requiredAmount > receivedAmount, "required amount fullfilled");
        owner.transfer(msg.value);
        receivedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}