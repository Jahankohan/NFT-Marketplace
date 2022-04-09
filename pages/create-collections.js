import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import NFTMarketplace from "../artifacts/contracts/Marketplace.sol/NFTMarketplace.json";
import { marketplaceAddress } from "../config";

export default function CreateCollection() {
  const [formInput, updateFormInput] = useState({
    type: "",
    title: "",
    description: "",
  });

  const router = useRouter();

  async function createCollection() {
    const { title, description, type } = formInput;
    if (!title || !description || !type) return;

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    let transaction = await contract.createNFTCollection(
      title,
      description,
      type
    );
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Collection Title"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, title: e.target.value })
          }
        />
        <textarea
          placeholder="Collection Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />

        <select
          className="form-select mt-4
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
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          aria-label="Default select example"
          onChange={(e) =>
            updateFormInput({ ...formInput, type: e.target.value })
          }
        >
          <option>Music</option>
          <option>Picture</option>
          <option>Movie</option>
          <option>Access Token</option>
          <option>Other</option>
        </select>

        <button
          onClick={createCollection}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Collection
        </button>
      </div>
    </div>
  );
}
