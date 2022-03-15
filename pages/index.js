import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import NFTCard from "./components/nftCard";
import connect from "./utils/auth";
import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/Marketplace.sol/NFTMarketplace.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [account, setAccount] = useState();

  useEffect(async () => {
    const { account, web3 } = await connect();
    if (account && web3) {
      setAccount(account);
      loadNFTs();
    }
  }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <div>
      <h2 className="px-20 py-10 text-3xl justify-center">All Collections</h2>
      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft) => {
              if (nft.owner != account) {
                return <NFTCard key={nft.tokenId} buyable={true} nft={nft} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
