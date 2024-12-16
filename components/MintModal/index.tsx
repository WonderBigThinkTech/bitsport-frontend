import { topItems } from "@/pages/nft";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import React from "react";
import checkImg from "@/public/mint-check.png";

export const MintModal: React.FC<{
  open: boolean;
  onClose: () => void;
  id: number;
}> = ({ open, onClose, id }) => {
  const handleMintClick = (id: number) => {};
  return (
    <div
      className={`mint-modal-wrapper fixed top-0 left-0 bottom-0 right-0 flex z-50 bg-[#00000030] ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 bottom-0 z-10"
        onClick={onClose}
      />
      <div className="max-w-[1100px] w-full relative bg-[#28282D] m-auto border-[#707070] border py-[33px] max-h-full h-fit overflow-auto z-20">
        <CloseCircleFilled
          className="text-white absolute top-3 right-3 cursor-pointer text-lg"
          onClick={onClose}
        />
        <div className="w-[95%] m-auto flex">
          <div className="flex-col lg:flex-row flex justify-between w-full">
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
              <div className="h-[386px] relative">
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
                <div className="border-b border-b-[#70707077] px-6 py-4 text-[#848C9E] font-bold text-[19px] lg:text-[27px]">
                  PROPERTIES
                </div>
                <div className=" px-6 py-4">
                  <div className="flex justify-between text-[#848C9E] font-Poppins text-xs font-medium mb-2">
                    <span>creater name</span>
                    <span>
                      {topItems.filter((f) => f.id === Number(id))[0]?.creator}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#848C9E] font-Poppins  text-xs font-medium mb-2">
                    <span>NFT item id</span>
                    <span>{id}</span>
                  </div>
                  <div className="flex justify-between text-[#848C9E] font-Poppins  text-xs font-medium mb-2">
                    <span>Release date</span>
                    <span>2022 / 12 /12</span>
                  </div>
                  <div className="flex flex-wrap justify-between text-[#848C9E] font-Poppins  text-xs font-medium mb-2">
                    <span>Description</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[55%]">
              <div className="hidden lg:block">
                <p className="flex items-center text-[#848C9E] font-Poppins text-[21px] mb-3">
                  <span className="mr-3">BitsSport cup</span>
                  <Image src={checkImg} className="" alt="" />
                </p>
                <h1 className="text-white text-[34px] font-bold mb-3">
                  {topItems.filter((f) => f.id === Number(id))[0]?.title}
                </h1>
              </div>
              <div className="hidden lg:block rounded py-7 px-6 bg-[#191C25] mb-[30px]">
                <div className="flex justify-between text-[#848C9E] ">
                  <div>
                    <div className="text-[19px] font-bold">MINT PRICE</div>
                    <div className="text-[28px] font-Poppins">
                      {topItems.filter((f) => f.id === Number(id))[0]?.price}
                    </div>
                  </div>
                  <div>
                    <div className="text-[19px] font-bold">MINT ENDS</div>
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
                <div className="border-b border-b-[#70707077] px-6 py-4 text-[#848C9E] font-bold text-[19px]">
                  ITEM ACTIVITIES
                </div>
                <div className="py-4 px-6 overflow-auto">
                  <table className="activities-table mint-modal-table">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
