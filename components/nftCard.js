/* eslint-disable @next/next/no-img-element */
import { marketplaceAddress } from "../../config";
import NFTMarketplace from "../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json";

import { useRouter } from "next/router";
import connect from "../utils/auth";

export default function NFTCard({ nft, buyable }) {
  const router = useRouter();

  async function buyNFT() {
    const { account, web3 } = await connect();
    const nftMarketplaceContract = new web3.eth.Contract(
      NFTMarketplace.abi,
      marketplaceAddress
    );
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    nftMarketplaceContract.methods
      .createMarketSale(nft.id, nftAddress)
      .send({
        from: account,
        value: price,
      })
      .on("receipt", (transaction) => {
        router.push("/my-nfts");
      });
  }

  return (
    <div className="flex flex-col justify-between max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div>
        <img
          className="h-60 w-full object-cover rounded-t-lg"
          src={nft.image}
          alt={nft.title}
        />
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {nft.title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {nft.description.substring(0, 80)}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {nft.collection}
        </p>
        <div className="pb-4">
          <p className="text-2xl font-bold text-white">
            Price - {nft.price} Eth
          </p>
        </div>
        <a
          href="#"
          className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
        </a>
      </div>
    </div>
  );
}
