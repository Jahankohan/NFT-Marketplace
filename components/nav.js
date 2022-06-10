import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useEffect, useState } from "react";
import connect from "./utils/auth";

const style = {
  wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex `,
  logoContainer: `flex items-center cursor-pointer`,
  logoText: ` ml-[0.8rem] text-white font-semibold text-2xl`,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
  searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  headerItems: ` flex items-center justify-end`,
  headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
  headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
};

export default function Nav() {
  const [account, setAccount] = useState();

  useEffect(() => {
    showAccount();
  }, []);

  async function showAccount() {
    const { account } = await connect();
    setAccount(account.substring(36, 42));
  }

  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image
            src="/../assets/cultchain.svg"
            alt="cultchain logo"
            height={40}
            width={40}
          />
          <div className={style.logoText}>Cultchain</div>
        </div>
      </Link>
      <div className={style.searchBar}>
        <div className={style.searchIcon}>
          <AiOutlineSearch />
        </div>
        <input
          className={style.searchInput}
          placeholder="Search Collections, NFTs, and Artists"
        />
      </div>
      <div className={style.headerItems}>
        <Link href="/explore">
          <div className={style.headerItem}>Explore</div>
        </Link>
        <Link href="/create-nft">
          <div className={style.headerItem}>Mint</div>
        </Link>
        <Link href="/my-nfts">
          <div className={style.headerItem}>My NFTs</div>
        </Link>
        <Link href="/dashboard">
          <div className={style.headerItem}>Dashboard</div>
        </Link>
        <Link href="/create-collections">
          <div className={style.headerItem}>Collections</div>
        </Link>
        <div className={style.headerIcon}>
          <CgProfile />
        </div>
        <div className={style.headerIcon}>
          <MdOutlineAccountBalanceWallet />
        </div>
      </div>
    </div>
  );
}
