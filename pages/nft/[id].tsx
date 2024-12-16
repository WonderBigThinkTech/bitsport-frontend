import { Header } from "@/components";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { topItems } from "./index";
import checkImg from "@/public/mint-check.png";
import creatorImg from "@/public/creator.png";
import { MintModal } from "@/components/MintModal";
import { ArrowLeftOutlined } from "@ant-design/icons";

const NFTDetail: React.FC = () => {
  const [mintModal, setMintModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const handleMintClick = (id: number) => {
    setMintModal(true);
  };

  const handleNFTClick = (id: number) => {
    router.push("/nft/" + id);
  };

  return (
    <div className="w-full">
      <MintModal
        open={mintModal}
        onClose={() => setMintModal(false)}
        id={Number(id)}
      />
      <Header />
      <div className="max-w-[1543px] w-[95%] m-auto mt-5 lg:mt-[90px]">
        <div
          className="text-[19px] flex items-center text-white mb-4 cursor-pointer"
          onClick={() => router.push("/nft")}
        >
          <ArrowLeftOutlined /> <span className="ml-4">Back</span>
        </div>
        <div className="flex-col lg:flex-row flex justify-between ">
          <div className="w-full lg:w-[40%] flex flex-col">
            <div className="block lg:hidden">
              <p className="flex items-center text-[#848C9E] font-Poppins text-[17px] mb-2">
                <span className="mr-3">BitsSport cup</span>
                <Image src={checkImg} className="" alt="" />
              </p>
              <h1 className="text-white text-[21px] font-bold mb-6">
                {topItems.filter((f) => f.id === Number(id))[0]?.title}
              </h1>
            </div>
            <div className="h-[620px] relative">
              <Image
                src={topItems.filter((f) => f.id === Number(id))[0]?.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="block lg:hidden rounded bg-[#191C25] mt-10">
              <div className="border-b border-b-[#70707077] px-3 py-4 font-Poppins text-[#848C9E] font-bold text-[18px]">
                SALE ENDS: 4:19:24:12
              </div>
              <div className="px-3 py-4 text-[#848C9E]">
                <div>
                  <div className="text-[23px] font-bold">MINT PRICE</div>
                  <div className="text-[26px] font-Poppins">
                    {topItems.filter((f) => f.id === Number(id))[0]?.price}
                  </div>
                </div>
                <button
                  onClick={() => handleMintClick(Number(id))}
                  className="w-full h-10 border-none outline-none font-bold rounded-[7px] text-2xl text-white bg-[#BC2345] mt-7"
                >
                  MINT NOW
                </button>
              </div>
            </div>
            <div className="rounded bg-[#191C25] order-5 lg:-order-none mt-6 lg:mt-12">
              <div className="border-b border-b-[#70707077] px-6 py-4 text-[#848C9E] font-bold text-[23px] lg:text-[27px]">
                PROPERTIES
              </div>
              <div className=" px-6 py-4">
                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>creater name</span>
                  <span>
                    {topItems.filter((f) => f.id === Number(id))[0]?.creator}
                  </span>
                </div>

                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>NFT item id</span>
                  <span>{id}</span>
                </div>
                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>Release date</span>
                  <span>2022 / 12 /12</span>
                </div>
                <div className="flex flex-wrap justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>Description</span>
                  <span className="text-[13px] leading-[14px]">
                    {
                      "Meet UnknownCarl (UC)! Everyone’s favorite mystery gamer in the MetaVerse. UnknownCarl is a BitSport’s unique top 5 star Gamer with an unmatched and incredible skill set in playing FIFA & Mortal Kombat . Always ready to win p2p challenges, outshine on the leaderboard and conquer opponents via Insta-Duel & Tournaments. UC’s premium NFT IGO card is a unique and rare collection of 500 supercharged rewards /dividends-backed NFTs. Premium UnknownCarl NFT IGO Cards Dividend rate is 10% DPG (Dividends Per Game) to be shared amongst holding wallets. Now we have reasons to hold NFTs!!!"
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded bg-[#191C25] order-4 lg:-order-none mt-6">
              <div className="border-b border-b-[#70707077] px-6 py-4 text-[#848C9E] font-bold text-[23px] lg:text-[27px]">
                NFT DETAILS
              </div>
              <div className=" px-6 py-4">
                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>Contract Address</span>
                  <span>0xc7a0…66a36</span>
                </div>
                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>Token ID</span>
                  <span>12345676543</span>
                </div>
                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>Network</span>
                  <span>ETH</span>
                </div>
                <div className="flex justify-between text-[#848C9E] font-Poppins text-lg font-medium mb-2">
                  <span>Token Standard</span>
                  <span>ERC-721</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[55%]">
            <div className="hidden lg:block">
              <p className="flex items-center text-[#848C9E] font-Poppins text-[21px] mb-6">
                <span className="mr-3">BitsSport cup</span>
                <Image src={checkImg} className="" alt="" />
              </p>
              <h1 className="text-white text-[45px] font-bold mb-[49px]">
                {topItems.filter((f) => f.id === Number(id))[0]?.title}
              </h1>
            </div>
            <div className="hidden lg:block rounded py-7 px-6 bg-[#191C25] mb-[30px]">
              <div className="flex justify-between text-[#848C9E] ">
                <div>
                  <div className="text-[21px] font-bold">MINT PRICE</div>
                  <div className="text-[28px] font-Poppins">
                    {topItems.filter((f) => f.id === Number(id))[0]?.price}
                  </div>
                </div>
                <div>
                  <div className="text-[21px] font-bold">MINT ENDS</div>
                  <div className="text-[28px] font-Poppins">4:19:24:12</div>
                </div>
              </div>
              <button
                onClick={() => handleMintClick(Number(id))}
                className="w-full h-10 border-none outline-none font-bold rounded-[7px] text-2xl text-white bg-[#BC2345] mt-7"
              >
                MINT NOW
              </button>
            </div>
            <div className="rounded bg-[#191C25] mt-6 lg:mb-12 lg:mt-0">
              <div className="border-b border-b-[#70707077] px-6 py-4 text-[#848C9E] font-bold text-[23px] lg:text-[27px]">
                ITEM ACTIVITIES
              </div>
              <div className="py-4 px-6 overflow-auto">
                <table className="activities-table">
                  <tr>
                    <th>Event</th>
                    <th>Price</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Time</th>
                  </tr>
                  <tr>
                    <td>Minted</td>
                    <td></td>
                    <td>0x000...0000</td>
                    <td>0x000...0000</td>
                    <td>11 months ago</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-[44px] font-bold text-white mb-8">
                RECOMMENDED ITEMS
              </h1>
              <div className="grid grid-cols-3 gap-9">
                {topItems
                  .filter((f) => f.id !== Number(id))
                  .map(
                    (item, key) =>
                      key < 3 && (
                        <div
                          key={key}
                          className="p-4 rounded-[32px] bg-[#191c25]"
                        >
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
                          <p className="text-white font-Rajdhani text-[11px] font-bold mt-3 mb-2">
                            {item.title}
                          </p>
                          <div className="mb-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <img
                                src={creatorImg.src}
                                className="w-[38px] h-[38px] mr-[10px]"
                              />
                              <div className="flex flex-col">
                                <span className="text-[9px] font-Rajdhani font-bold text-[#9B9CA3] mb-1">
                                  CREATOR
                                </span>
                                <p className="font-Poppins text-[8px] font-bold text-white mb-0">
                                  {item.creator}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] font-Rajdhani font-bold text-[#9B9CA3] mb-1">
                                FLOOR PRICE
                              </span>
                              <p className="font-Poppins text-[8px] font-bold text-white mb-0">
                                {item.price}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMintClick(item.id)}
                            className="bg-[#F92552a0] cursor-pointer h-[26px] w-full border-none outline-none text-white rounded font-bold text-[11px] font-Rajdhani"
                          >
                            MINT NOW
                          </button>
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NFTDetail;
