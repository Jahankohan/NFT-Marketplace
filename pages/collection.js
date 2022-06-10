/* eslint-disable @next/next/no-img-element */
import { CgWebsite } from "react-icons/cg";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";
import NFTCards from "../components/NFTCards";

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

export default function Collections() {
  var collection = [];
  var nfts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="overflow-hidden">
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : "https://s11.favim.com/orig/7/760/7603/76030/twitter-header-art-Favim.com-7603077.jpg"
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : "https://dailygazette.com/wp-content/uploads/fly-images/132597/APTOPIX_Bitcoin_Found_ONe-scaled-940x940.jpg"
            }
            alt="profile image"
          />
        </div>
      </div>
      <div className={style.endRow}>
        <div className={style.socialIconsContainer}>
          <div className={style.socialIconsWrapper}>
            <div className={style.socialIconsContent}>
              <div className={style.socialIcon}>
                <CgWebsite />
              </div>
              <div className={style.divider} />
              <div className={style.socialIcon}>
                <AiOutlineInstagram />
              </div>
              <div className={style.divider} />
              <div className={style.socialIcon}>
                <AiOutlineTwitter />
              </div>
              <div className={style.divider} />
              <div className={style.socialIcon}>
                <HiDotsVertical />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.midRow}>
        <div className={style.title}>
          {collection?.title ? collection.title : "Collection Title"}
        </div>
      </div>
      <div className={style.midRow}>
        <div className={style.createdBy}>
          Created by{" "}
          <span className="text-[#2081e2]">
            {collection?.creator ? collection.creator : "Reza Jahankohan"}
          </span>
        </div>
      </div>
      <div className={style.midRow}>
        <div className={style.statsContainer}>
          <div className={style.collectionStat}>
            <div className={style.statValue}>80</div>
            <div className={style.statName}>items</div>
          </div>
          <div className={style.collectionStat}>
            <div className={style.statValue}>
              {collection?.allOwners ? collection.allOwners.length : "5"}
            </div>
            <div className={style.statName}>owners</div>
          </div>
          <div className={style.collectionStat}>
            <div className={style.statValue}>
              <img
                src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                alt="eth"
                className={style.ethLogo}
              />
              {collection?.floorPrice ? collection.floorPrice : "0.1"}
            </div>
            <div className={style.statName}>floor price</div>
          </div>
          <div className={style.collectionStat}>
            <div className={style.statValue}>
              <img
                src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                alt="eth"
                className={style.ethLogo}
              />
              {collection?.volumeTraded}.5K
            </div>
            <div className={style.statName}>volume traded</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap ">
        {nfts.map((nftItem, id) => (
          <NFTCards
            key={id}
            nftItem={nftItem}
            title={collection?.title ? collection.title : "Iranian Carpet"}
            listings={nftItem?.listings ? nftItem.listings : "0.1"}
          />
        ))}
      </div>
    </div>
  );
}
