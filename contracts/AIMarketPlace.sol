// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIMarketPlace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 totalRatings;
        uint256 ratingSum;
        bool isPurchased;
    }

    mapping(uint256 => Model) public models;
    uint256 public modelCounter;
    address public owner;
    uint256 public contractBalance;

    event ModelListed(uint256 modelId, string name, address creator, uint256 price);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating);
    event RatingFailed(string message);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier validModel(uint256 modelId) {
        require(modelId < modelCounter, "Invalid model ID");
        _;
    }

    modifier notPurchased(uint256 modelId) {
        require(!models[modelId].isPurchased, "Model already purchased");
        _;
    }

    modifier validRating(uint8 rating) {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to list a new AI model
    function listModel(string memory name, string memory description, uint256 price) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(price > 0, "Price must be greater than 0");

        models[modelCounter] = Model({
            name: name,
            description: description,
            price: price,
            creator: payable(msg.sender),
            totalRatings: 0,
            ratingSum: 0,
            isPurchased: false
        });

        emit ModelListed(modelCounter, name, msg.sender, price);
        modelCounter++;
    }

    // Function to purchase an AI model
    function purchaseModel(uint256 modelId) public payable validModel(modelId) notPurchased(modelId) {
        Model storage model = models[modelId];
        require(msg.value >= model.price, "Insufficient funds to purchase model");

        model.creator.transfer(msg.value);  // Transfer payment to the model creator
        model.isPurchased = true;

        contractBalance += msg.value;
        emit ModelPurchased(modelId, msg.sender);
    }

    // Function to rate a purchased AI model
    function rateModel(uint256 modelId, uint8 rating) public validModel(modelId) validRating(rating) {
        Model storage model = models[modelId];
        if (!model.isPurchased) {
            emit RatingFailed("Model must be purchased before rating");
            revert("Model must be purchased before rating");
        }

        model.ratingSum += rating;
        model.totalRatings++;

        emit ModelRated(modelId, rating);
    }

    // Function for the contract owner to withdraw funds
    function withdrawFunds() public onlyOwner {
        require(contractBalance > 0, "No funds to withdraw");
        payable(owner).transfer(contractBalance);
        contractBalance = 0;
    }

    // Function to retrieve the details of a specific model
    function getModelDetails(uint256 modelId) public view validModel(modelId) returns (
        string memory name,
        string memory description,
        uint256 price,
        address creator,
        uint8 averageRating,
        bool isPurchased
    ) {
        Model storage model = models[modelId];
        uint8 avgRating = model.totalRatings > 0 ? uint8(model.ratingSum / model.totalRatings) : 0;
        return (model.name, model.description, model.price, model.creator, avgRating, model.isPurchased);
    }

    // Function to get all available (non-purchased) models
    function getAvailableModels() public view returns (uint256[] memory) {
        uint256 availableCount;
        for (uint256 i = 0; i < modelCounter; i++) {
            if (!models[i].isPurchased) {
                availableCount++;
            }
        }

        uint256[] memory availableModels = new uint256[](availableCount);
        uint256 index = 0;
        for (uint256 i = 0; i < modelCounter; i++) {
            if (!models[i].isPurchased) {
                availableModels[index] = i;
                index++;
            }
        }

        return availableModels;
    }
}
