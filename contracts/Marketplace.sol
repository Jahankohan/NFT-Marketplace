// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _collectionIds;

    uint256 listingPrice = 0.025 ether;
    uint256 collectingPrice = 0.025 ether;
    address payable owner;

    address[] private artists;
    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Collections) private idToCollections;
    mapping(address => Collections[]) artistToCollection;
    mapping(uint256 => MarketItem[]) collectionToItems;
    
    struct Collections {
      uint256 collectionId;
      address payable creator;
    }
    
    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
      uint256 coll;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold,
      uint256 coll
    );


    constructor() ERC721("Metaverse Tokens", "METT") {
      owner = payable(msg.sender);
    }

    // Creating NFT collection, TODO: It should be payable function;
    function createNFTCollection(string memory collectionURI) public payable{
      require(msg.value == collectingPrice, "Price must be equal to collecting price");
      _tokenIds.increment();
      _collectionIds.increment();
      uint256 newCollectionId = _tokenIds.current();

      _mint(msg.sender, newCollectionId);
      _setTokenURI(newCollectionId, collectionURI);

      Collections memory newCollection = Collections(newCollectionId, payable(msg.sender));
      artists.push(msg.sender);
      artistToCollection[msg.sender].push(newCollection);
      idToCollections[newCollectionId] = newCollection;
    }

    function fetchMarketCollections() public view returns (Collections[] memory){
      uint itemCount = _collectionIds.current();
      uint currentIndex = 0;

      Collections[] memory allCollections = new Collections[](itemCount);
      for (uint i = 1; i <= itemCount; i++) {
        Collections storage currentCollection = idToCollections[i];
        allCollections[currentIndex] = currentCollection;
        currentIndex += 1;
      }
      return allCollections;
    }


    function fetchAllArtists() public view returns (address[] memory){
      return artists;
    }

    function fetchArtistCollections(address artist) public view returns (Collections[] memory){
      Collections[] memory items = artistToCollection[artist];
      return items;
    }

    function getItemsofCollection(uint256 collecctionId) public view returns (MarketItem[] memory) {
        return collectionToItems[collecctionId];    
    }

    function addNFTtoCollection(uint256 tokenId, uint256 collectionId) public{
      MarketItem memory item = idToMarketItem[tokenId];
      collectionToItems[collectionId].push(item);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    function updateCollectingPrice(uint _collectingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update collecting price.");
      collectingPrice = _collectingPrice;
    }

    function getCollectingPrice() public view returns (uint256) {
      return collectingPrice;
    }

    // // Create NFT for auction
    // function createNFTAuction(string memory tokenURI, uint256 initialPrice, uint256 auctionEndsIn, uint256 collectionId) public payable returns(uint){
    //   _tokenIds.increment();
    //   uint256 newTokenId = _tokenIds.current();

    //   _mint(msg.sender, newTokenId);
    //   _setTokenURI(newTokenId, tokenURI);
    //   createMarketAuction(newTokenId, initialPrice, auctionEndsIn, collectionId);
    //   return newTokenId;
    // }

    // function createMarketAuction(uint256 tokenId, uint256 initialPrice, uint256 auctionEndsIn, uint256 collectionId) private{

    // }

    // // Lazy Minting allow artists to create and list their NFTs and pay the price after their NFT been sold.
    // function lazyMinting(string memory tokenURI, uint256 price, uint256 collectionId) public returns (uint){
    //   _tokenIds.increment();
    //   uint256 newTokenId = _tokenIds.current();

    //   _mint(msg.sender, newTokenId);
    //   _setTokenURI(newTokenId, tokenURI);
    //   createMarketItem(newTokenId, price, collectionId, true);
    //   return newTokenId;
    // }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price, uint256 collecctionId) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price, collecctionId, false);
      return newTokenId;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price,
      uint256 collectionId,
      bool isLazyMinted
    ) private {

      if(isLazyMinted) {
        require(price >= listingPrice, "Price atleast must be equal to listing price");
      }
      else {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");
      }

      Collections memory collection = idToCollections[collectionId];
      require(collection.creator == msg.sender, "You Must be the owner of the collection.");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false,
        collectionId
      );

      addNFTtoCollection(tokenId, collectionId);

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false,
        collectionId
      );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);
      payable(owner).transfer(listingPrice);
      payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current() - _collectionIds.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}