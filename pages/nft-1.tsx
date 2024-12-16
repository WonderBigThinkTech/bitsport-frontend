import Image from "next/image";
import nft1 from "@/public/nft1.svg";
import nft2 from "@/public/nft2.svg";
import nft3 from "@/public/nft3.svg";
import nft4 from "@/public/nft4.svg";
import nft5 from "@/public/nft5.svg";
import nft6 from "@/public/nft6.svg";
import nft8 from "@/public/nft8.svg";
import nft9 from "@/public/nft9.svg";
import nft10 from "@/public/nft10.svg";
import nft11 from "@/public/nft11.svg";
import nft12 from "@/public/nft12.svg";
import nft13 from "@/public/nft13.svg";
import { Header } from "@/components";
import Footer from "@/components/Footer";

const items = [nft1, nft2, nft3, nft4, nft5, nft6];

const items2 = [nft8, nft9, nft10, nft11, nft12, nft13];

const Nft = () => {
  return (
    <div className="w-full">
      <Header />
      <div className="flex justify-between mt-8 gap-2 overflow-x-auto">
        {items.map((item, i) => (
          <Image
            key={item}
            priority={true}
            height={187}
            width={329}
            src={item}
            alt="nft image"
            className="nft"
          />
        ))}
      </div>
      <div className="flex justify-between gap-2 mt-1 overflow-x-auto">
        {items2.map((item, i) => (
          <Image
            key={item}
            priority={true}
            height={187}
            width={329}
            src={item}
            alt="nft image"
            className="nft2"
          />
        ))}
      </div>

      <div className="relative mt-20 flex flex-col justify-center items-center">
        <div className="nft-text text-primary-100 font-bold xl:text-primary-50 font-Poppins absolute xl:-top-1 -top-10 text-center">
          BITPOOL NFT ASSETS
        </div>
        <div className="text-white md:top-16 lg:top-10 top-9 text-center absolute mint font-Poppins font-semibold text-base px-20 xl:px-0 md:text-3xl lg:text-2xl">
          MINT YOUR EXCLUSIVE NFT ASSETS FOR BITPOOL
        </div>
        <div className="text-white md:top-36 lg:top-20 nft-sub top-24 text-center absolute font-Poppins font-light text-xs md:text-xs">
          MORE THAN JUST NFT’S. MINT, POWER UP, EARN ALONGSIDE PLAY WITH YOUR
          GAMING ASSETS IN THE METAVERSE.
        </div>
      </div>
      <div className="text-white relative font-bold text-2xl lg:text-5xl top-52 lg:top-36 text-center">
        COMING SOON
      </div>
      <Footer />
    </div>
  );
};

export default Nft;
