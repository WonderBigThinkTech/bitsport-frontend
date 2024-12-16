import { Button, Header } from "@/components";
import Footer from "@/components/Footer";
import arrowDown from "@/public/arrow-down.png";
import Image from "next/image";
import React from "react";
import nft1 from "@/public/nft1.svg";
import nft2 from "@/public/nft2.svg";
import nft3 from "@/public/nft3.svg";
import nft4 from "@/public/nft4.svg";
import nft5 from "@/public/nft5.svg";
import creatorImg from "@/public/creator.png";
import { useRouter } from "next/router";

export const topItems = [
  {
    id: 1,
    image: nft1,
    title: "Gold Edition - UnknownCarl NFT IGO Card",
    creator: "BitSport",
    price: "2 BNB",
  },
  {
    id: 2,
    image: nft2,
    title: "Gold Edition - UnknownCarl NFT IGO Card",
    creator: "BitSport",
    price: "2 BNB",
  },
  {
    id: 3,
    image: nft3,
    title: "Gold Edition - UnknownCarl NFT IGO Card",
    creator: "BitSport",
    price: "2 BNB",
  },
  {
    id: 4,
    image: nft4,
    title: "Gold Edition - UnknownCarl NFT IGO Card",
    creator: "BitSport",
    price: "2 BNB",
  },
  {
    id: 5,
    image: nft5,
    title: "Gold Edition - UnknownCarl NFT IGO Card",
    creator: "BitSport",
    price: "2 BNB",
  },
];

const Nft: React.FC = () => {
  const router = useRouter();

  const handleMintClick = (id: number) => {};

  const handleNFTClick = (id: number) => {
    router.push("/nft/" + id);
  };

  return (
    <div className="w-full">
      <Header />
      <div className="nft-background relative mt-[30px] flex flex-col justify-center max-w-[1673px] min-h-[367px] m-auto w-[95%]">
        <div className="relative z-10 flex flex-col justify-center items-center">
          <div className="nft-text text-transparent -mb-6 font-bold xl:text-transparent font-Poppins text-center">
            BITPOOL NFT ASSETS
          </div>
          <div className="text-white text-center nft-text-sub  mint font-Poppins font-semibold text-base px-20 xl:px-0 md:text-3xl lg:text-3xl">
            MINT YOUR EXCLUSIVE NFT ASSETS FOR BITPOOL
          </div>
          <div className="text-white nft-sub max-w-[498px] m-auto text-center font-Poppins font-light text-lg mb-8">
            MORE THAN JUST NFT’S. MINT, POWER UP, EARN ALONGSIDE PLAY WITH YOUR
            GAMING ASSETS IN THE METAVERSE.
          </div>
          <Button text="EXPLORE ALL" />
        </div>
      </div>
      <div className="mt-11 max-w-[1673px] m-auto w-[95%] md:px-8">
        <h1 className="mb-7 text-white text-[22px] font-bold md:text-[57px]">
          TOP ITEMS{" "}
          <span className="text-[#BC2345] inline-flex items-center">
            ALL TIME
            <div className="ml-3 w-[10px] md:w-[26px] md:h-[16px]">
              <Image
                priority={true}
                src={arrowDown}
                alt="nft image"
                // className="nft"
              />
            </div>
          </span>
        </h1>
        <div className="grid grid-cols-5 gap-8 nft-card-grid">
          {topItems.map((item, key) => (
            <div key={key} className="p-4 rounded-[32px] bg-[#191c25]">
              <div
                className="w-full pb-[90%] relative"
                onClick={() => handleNFTClick(item.id)}
              >
                <img
                  src={item.image.src}
                  alt="nft image"
                  className="absolute h-full object-cover rounded-t-[32px]"
                  // className="nft"
                />
              </div>
              <p className="text-white font-Rajdhani text-[15px] font-bold mt-3 mb-2">
                {item.title}
              </p>
              <div className="mb-3 flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={creatorImg.src}
                    className="w-[38px] h-[38px] mr-[10px]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-Rajdhani font-bold text-[#9B9CA3] mb-1">
                      CREATOR
                    </span>
                    <p className="font-Poppins text-[11px] font-bold text-white mb-0">
                      {item.creator}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-Rajdhani font-bold text-[#9B9CA3] mb-1">
                    FLOOR PRICE
                  </span>
                  <p className="font-Poppins text-[11px] font-bold text-white mb-0">
                    {item.price}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleMintClick(item.id)}
                className="bg-[#F92552a0] cursor-pointer h-[31px] w-full border-none outline-none text-white rounded font-bold text-sm font-Rajdhani"
              >
                MINT NOW
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Nft;
