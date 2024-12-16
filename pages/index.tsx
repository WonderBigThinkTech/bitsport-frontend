import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Header } from "@/components";
import Pagination from "@/components/Pagination";
import QuestComponent from "@/components/Quest";
import Footer from "@/components/Footer";
import { SERVER_URI } from "@/config";
import { useRouter } from "next/router";
import { IState } from "@/store";
import { notification } from "antd";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
//@ts-ignore
import SwiperCore, { Autoplay, Navigation } from "swiper";
import Banner from "@/public/banner_slider.png";
import Banner1 from "@/public/banner_slider2.png";
import Banner_mobile from "@/public/banner_slider1.png";
import Banner1_mobile from "@/public/buy-bitp.png";
import Image from "next/image";

SwiperCore.use([Navigation]);

interface currentMatchData {
  challenge_id: number;
  current_match: number;
}

export default function Home() {
  // const [ws, setWs] = useState(null);

  // useEffect(() => {
  //   const websocket: any = new WebSocket("ws://localhost:8000");

  //   websocket.onopen = () => {
  //     console.log("Connected to the WebSocket server");
  //   };

  //   websocket.onmessage = (event: any) => {
  //     console.log(`Received from server: ${event.data}`);
  //   };

  //   setWs(websocket);

  //   return () => {
  //     websocket.close();
  //   };
  // }, []);

  const [data, setData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [currentMatchInfo, setCurrentMatchInfo] = useState<currentMatchData[]>(
    []
  );
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { currentUser } = useSelector((state: IState) => state.auth);

  useEffect(() => {
    if (router.query.signin) {
      notification.warning({
        message: "Warning!",
        description: "Please login or signup to access this page",
      });
    }
  }, [router.query.signin]);

  useEffect(() => {
    setData([]);
    if (currentUser.id === undefined) {
      setLoadingState(true);
      axios.get(`${SERVER_URI}/challenge/index`).then((res) => {
        setData(res.data.models);
        setLoadingState(false);
      });
    } else {
      setLoadingState(true);
      axios
        .post(`${SERVER_URI}/challenge/searchByUser`, {
          userId: currentUser?.index,
        })
        .then((res) => {
          setData(res.data.data.filteredData);
          setCurrentMatchInfo(res.data.data.newData);
          setLoadingState(false);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    setFilteredData(
      data.slice(10 * (currentPage - 1), 10 * (currentPage - 1) + 10)
    );
  }, [data]);

  useEffect(() => {
    console.log("refi id ===> ", router.query.refId);
    if (router.query && router.query.refId) {
      console.log("refi id ===> ", router.query.refId);
      localStorage.setItem("refId", router.query.refId.toString());
    } else if (router.query && router.query.refid) {
      console.log("refi id ===> ", router.query.refid);
      localStorage.setItem("refId", router.query.refid.toString());
    }
  }, [router.query, router]);

  useEffect(() => {
    // Check if the flag is present in localStorage indicating redirection
    const redirectedFromGame =
      window.localStorage.getItem("redirectedFromGame");

    const getFromLocalStorage = (key: string) => {
      if (!key || typeof window === "undefined" || !localStorage) {
        return "";
      }
      return window.localStorage.getItem(key);
    };
    const token = getFromLocalStorage("token");
    const currentUser: any = token ? jwtDecode(token) : null;

    if (redirectedFromGame === "true" && !currentUser) {
      // Show the alert on the homepage
      notification.warning({
        message: "Warning!",
        description: "Please login to join the game!",
      });

      // Clear the flag from localStorage after showing the alert
      window.localStorage.removeItem("redirectedFromGame");
    }
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  const handlePageChange = (number: number) => {
    setFilteredData(data.slice(10 * (number - 1), 10 * (number - 1) + 10));
    setCurrentPage(number);
  };

  const getCurrentMatch = (item: any) => {
    const filterData = currentMatchInfo.filter((element) => {
      return element?.challenge_id == item.index;
    });
    return filterData[0]?.current_match;
  };

  return (
    <main className="w-full">
      <Header />
      <div className="container mx-auto px-4 lg:px-0 mt-5">
        <Swiper
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
        >
          <SwiperSlide>
            <div
              className="overflow-hidden border border-[#ffffff50] rounded-md"
              onClick={() => router.push("/farmearn")}
            >
              <Image
                src={isMobile ? Banner_mobile : Banner}
                className="w-full h-full"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="banner w-full relative mt-5 xl:mt-0">
              <div className="win relative" />
              <div className="flex flex-col justify-center items-center relative banner-text">
                <h2 className="text-white mb-4 font-bold text-xl px-8 pt-4 xl:pt-0 xl:px-0 xl:text-6xl text-center font-Poppins">
                  WORLD FIRST PLAY-TO-EARN POOL GAME
                </h2>
                <Button px="px-4" text="Test2Earn" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <section className="px-3 xl:px-0 mt-6 xl:mt-0 xl:container xl:mx-auto">
        <h3 className="xl:text-2xl text-xl text-white font-bold ">QUESTS</h3>
        <p className="text-secondary-200 xl:text-sm text-xs">
          Accept and play some of the below F2E (Free to Earn) modes, earn $BITP
          and other Crypto
        </p>

        <div className="mt-5 xl:gap-11 flex w-full flex-col xl:flex-row  items-start justify-between">
          <div className="flex w-full flex-col gap-2">
            {!loadingState &&
              filteredData
                .filter(
                  (item: any) =>
                    item.number_of_players !== item.played_number_count
                )
                .map((item, index) => (
                  <QuestComponent
                    key={index}
                    quest={item}
                    index={index}
                    currentMatch={
                      getCurrentMatch(item) == undefined
                        ? 0
                        : getCurrentMatch(item)
                    }
                  />
                ))}
            {!loadingState && (
              <Pagination
                currentPage={currentPage}
                total={Math.ceil(data.length / 10)}
                onPageChange={handlePageChange}
                data={filteredData.filter(
                  (item: any) =>
                    item.number_of_players !== item.played_number_count
                )}
              />
            )}
            {loadingState && (
              <div className="flex justify-center">
                <img
                  src="/loading.gif"
                  className="w-[50px] h-[50px]"
                  alt="loading..."
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

