import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
import NFTMarketplace from "../artifacts/contracts/Marketplace.sol/NFTMarketplace.json";
import { marketplaceAddress } from "../config";

export default function CreateCollection() {
  const [value, setValue] = useState("default");
  const [fileUrl, setFileUrl] = useState(null);
  const [bgUrl, setBgUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    type: "",
    title: "",
    description: "",
  });

  const router = useRouter();

  async function onChange(e) {
    /* upload image to IPFS */
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
  }

  async function onChangeBg(e) {
    /* upload image to IPFS */
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setBgUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { title, description, type } = formInput;
    if (!title || !description || !type || !bgUrl || !fileUrl) return;
    /* first, upload metadata to IPFS */
    console.log("Uploading to IPFS...");
    const data = JSON.stringify({
      title,
      description,
      type,
      image: fileUrl,
      bgImage: bgUrl,
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

  async function createCollection() {
    const url = await uploadToIPFS();
    console.log("Connecting to wallet");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    let collectingPrice = await contract.getCollectingPrice();

    collectingPrice = collectingPrice.toString();

    let transaction = await contract.createNFTCollection(url, {
      value: collectingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="justify-between">
      <div className="relative bg-gray overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:white absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">
                    Create Your Own Collection
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your Collections can be Musics, Art Pics, Video, GIF, etc.
                  Share it with your friends and community.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt=""
          />
        </div>
      </div>
      <div>
        <form className="flex justify-center">
          <div className="w-1/2 shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-gray-999 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="collection-title"
                    className="block text-sm font-medium text-white"
                  >
                    Collection Title
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      name="collection-title"
                      id="collection-title"
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded-none rounded-r-md sm:text-sm border-gray-300"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          title: e.target.value,
                        })
                      }
                      placeholder="Bored Apes"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="Description"
                    name="description"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="It's a collection of ..."
                    onChange={(e) =>
                      updateFormInput({
                        ...formInput,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <p className="mt-2 text-sm text-white">
                  Brief description for your profile.
                </p>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-white"
                >
                  Collection Type
                </label>
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
                  defaultValue={value}
                  onChange={(e) =>
                    updateFormInput({ ...formInput, type: e.target.value })
                  }
                >
                  <option
                    className="text-gray-50"
                    value="default"
                    disabled
                    hidden
                  >
                    Choose Your collection
                  </option>
                  <option>Music</option>
                  <option>Picture</option>
                  <option>Movie</option>
                  <option>Access Token</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Cover photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {!fileUrl && (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {fileUrl && (
                      <img className="rounded mt-4" width="350" src={fileUrl} />
                    )}
                    <div className="flex justify-center text-sm text-gray-600">
                      <label
                        htmlFor="cover-upload"
                        className="relative cursor-pointer bg-gray-999 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="cover-upload"
                          name="cover-upload"
                          type="file"
                          className="sr-only"
                          onChange={onChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Background photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {!bgUrl && (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {bgUrl && (
                      <img className="rounded mt-4" width="350" src={bgUrl} />
                    )}
                    <div className="flex justify-center text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-gray-999 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={onChangeBg}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-999 text-right sm:px-6">
              <button
                type="button"
                onClick={createCollection}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Collection
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
