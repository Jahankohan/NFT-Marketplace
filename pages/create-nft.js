/* pages/create-nft.js */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/Marketplace.sol/NFTMarketplace.json";

var options = [];

export default function CreateItem() {
  const [value, setValue] = useState("default");
  const [fileUrl, setFileUrl] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    collection: "",
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const handleClick = () => {
    router.push("/create-collections");
  };

  async function loadCollections() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    options = [];
    const data = await contract.fetchMarketCollections();

    const items = await Promise.all(
      data.map(async (i) => {
        const collectionUri = await contract.tokenURI(i.collectionId);
        const meta = await axios.get(collectionUri);
        let item = {
          collectionId: i.collectionId.toNumber(),
          title: meta.data.title,
        };
        options.push({
          value: item.collectionId,
          label: item.title,
        });
        return item;
      })
    );

    setCollections(items);
    setLoadingState("loaded");
  }

  const router = useRouter();

  async function onChange(e) {
    /* upload image to IPFS */
    console.log("onChange function Uploading to IPFS...");
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    console.log("onChange function Uploaded to IPFS!");
  }

  async function uploadToIPFS() {
    const { name, description, price, collection } = formInput;
    if (!name || !description || !price || !collection || !fileUrl) return;
    /* first, upload metadata to IPFS */
    console.log("Uploading to IPFS...");
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    console.log("Uploaded to IPFS!");
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    console.log("URL:", url);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    console.log("Collection:", formInput.collection);
    let transaction = await contract.createToken(
      url,
      price,
      formInput.collection,
      {
        value: listingPrice,
      }
    );

    console.log("ListingNFTs ... 4");
    await transaction.wait();
    console.log("ListingNFTs ... 5");
    router.push("/");
  }

  if (loadingState === "loaded" && collections.length > 0)
    return (
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <div className="inline-flex mt-2 appearance-none">
            <select
              className="form-select 
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              defaultValue={value}
              onChange={(e) =>
                updateFormInput({
                  ...formInput,
                  collection: e.target.options.selectedIndex,
                })
              }
            >
              <option className="text-gray-50" value="default" disabled hidden>
                Choose Your collection
              </option>
              {options.map((option) => (
                <option key={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <input
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
          />

          {fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )}
          <button
            onClick={listNFTForSale}
            className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          >
            Create NFT
          </button>
        </div>
      </div>
    );
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="relative block w-1/2 border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleClick}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
          />
        </svg>
        <span className="mt-2 block text-sm font-medium text-white">
          {" "}
          Create a New Collection{" "}
        </span>
      </button>
    </div>
  );
}
