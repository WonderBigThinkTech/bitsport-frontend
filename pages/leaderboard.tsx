import { Header } from "@/components";
import Footer from "@/components/Footer";
import { Cup, Star } from "@/public/icons";
import user from "@/public/user-img.svg";
import Image from "next/image";

const items = [
  {
    rank: 1,
    image: user,
    star: <Star />,
    username: "Meister",
    score: "123454398",
  },
  {
    rank: 2,
    image: user,
    star: <Star />,
    username: "Meister",
    score: "123454398",
  },
  {
    rank: 3,
    image: user,
    star: <Star />,
    username: "Meister",
    score: "123454398",
  },
  {
    rank: 4,
    image: user,
    star: <Star />,
    username: "Meister",
    score: "123454398",
  },
  {
    rank: 5,
    image: user,
    star: <Star />,
    username: "Meister",
    score: "123454398",
  },
];

const Leaderboard = () => {
  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto">
        <div className="relative mt-20 flex flex-col justify-center items-center">
          <Cup />
          <div className="leader text-primary-100 font-bold xl:text-primary-50 font-Poppins absolute xl:-top-1 -top-10 text-center">
            BITPOOL LEADERBOARD
          </div>
          <div className="text-white md:top-16 lg:top-6 top-3 text-center absolute mint font-Poppins font-semibold text-lg px-5 xl:px-0 md:text-3xl lg:text-2xl">
            RUN YOUR WAY UP THE LEADERBOARD FOR SOME AMAZING REWARDS
          </div>
          <div className="text-white md:top-36 lg:top-16 md:px-24 lg:px-96 top-14 text-center absolute font-Poppins font-light px-5 text-sm md:text-base">
            MORE THAN JUST NFT’S. MINT, POWER UP, EARN ALONGSIDE YOUR FAVORITE
            GAMERS IN THE METAVERSE.
          </div>
        </div>

        <section className="relative">
          <div className="mt-10 flex flex-col gap-1.5 blur-md">
            {items.map((item) => (
              <div
                key={item.rank}
                className="flex justify-between items-center bg-primary-200 lg:h-20 h-14 px-3 lg:px-16"
              >
                <div className="flex items-center lg:gap-16 gap-8">
                  <div className="font-bold lg:text-2xl text-base text-white">
                    {item.rank}
                  </div>
                  <Image
                    priority={true}
                    height={40}
                    width={39}
                    src={item.image}
                    alt="user image"
                  />
                  {item.star}
                  <div className="font-bold font-Poppins lg:text-xl text-base text-white">
                    {item.username}
                  </div>
                </div>
                <div className="font-bold font-Poppins lg:text-xl text-base text-white">
                  {item.score}
                </div>
              </div>
            ))}
          </div>
          <div className="font-bold absolute announce lg:text-2xl text-base text-white">
            TO BE ANNOUNCED SOON
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
