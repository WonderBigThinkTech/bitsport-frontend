import Image from "next/image";
import { Button, Header } from "@/components";
import Footer from "@/components/Footer";
import event1 from "@/public/event1.svg";
import event2 from "@/public/event2.svg";
import event3 from "@/public/event3.svg";
import event4 from "@/public/event4.svg";
import event5 from "@/public/event5.svg";
import event6 from "@/public/event6.svg";
import event7 from "@/public/event7.svg";

const items = [event1, event2, event3];

const items2 = [event4, event5, event6, event7];

export default function Events() {
  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto mt-2 px-4 lg:px-0">
        <div className="pool-banner w-full lg:relative">
          <div className="pool-win relative" />
          <div className="flex flex-col justify-center items-center relative pool-banner-text">
            <h2 className="text-white mb-4 font-bold text-xl px-5 pt-5 xl:pt-0 xl:px-0 xl:text-6xl text-center font-Poppins">
              WORLD FIRST PLAY-TO-EARN POOL GAME
            </h2>
            <Button px="px-4" text="Test2Earn" />
          </div>
        </div>
      </div>

      <section className="px-3 xl:px-0 mt-8 xl:mt-0 xl:container xl:mx-auto w-full">
        <h3 className="xl:text-2xl text-xl text-white font-bold ">
          CURRENT EVENTS
        </h3>
        <p className="text-secondary-200 xl:text-sm text-xs">
          available on BitPool Web
        </p>
        <div className="relative flex justify-center items-center">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-7 mt-5 blur-md w-full">
            {items.map((item, i) => (
              <Image
                key={item}
                priority={true}
                height={367}
                width={500}
                src={item}
                alt="nft image"
                className={i === 0 ? "w-full" : "hidden lg:block w-full"}
              />
            ))}
          </div>
          <div className="text-white absolute font-bold text-2xl lg:text-4xl text-center">
            COMING SOON
          </div>
        </div>
      </section>

      <section className="px-3 xl:px-0 mt-8 xl:mt-14 xl:container xl:mx-auto w-full">
        <h3 className="xl:text-2xl text-xl text-white font-bold ">
          BITPOOL NEWS
        </h3>
        <p className="text-secondary-200 xl:text-sm text-xs">
          Last Updated on 12/02/2023
        </p>
        <div className="relative flex justify-center items-center">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-5 blur-md w-full">
            {items2.map((item, i) => (
              <Image
                key={item}
                priority={true}
                height={267}
                src={item}
                alt="nft image"
                className={i === 0 ? "w-full" : "hidden lg:block w-full"}
              />
            ))}
          </div>
          <div className="text-white absolute font-bold text-2xl lg:text-4xl text-center">
            COMING SOON
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
