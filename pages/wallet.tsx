import Link from "next/link";
import { Header, Swap } from "@/components";
import { EmptyTransaction, Filter, QC, Refresh, USDG } from "@/public/icons";
import Image from "next/image";
import USDT from "@/public/usdt.png";
import QIC from "@/public/qc.png";
import Paypal from "@/public/paypal.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";
import CAKE from "@/public/cake.png";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store";
import Axios from "axios";
import { SERVER_URI } from "@/config";
import { notification } from "antd";
import { authActions } from "@/store/auth";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { getCake } from "@/service/helper";

const navs = ["DEPOSIT", "WITHDRAW", "SWAP"];

const Wallet = () => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [cakePrice, setCakePrice] = useState<number>(0);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const refreshWalletBalance = () => {
    setRefreshing(true);
    if (currentUser) {
      const payload = { user: currentUser.id };
      Axios.post(`${SERVER_URI}/refreshWalletBalance`, payload).then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
          setRefreshing(false);
        }
      });
    } else {
      setRefreshing(false);
      notification.warning({
        message: "Warning!",
        description: "Please login to",
      });
    }
  };

  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined" || !localStorage) {
      return "";
    }
    return window.localStorage.getItem(key);
  };

  const toggleSwap = () => {
    // setIsSwapOpen(!isSwapOpen);
    // if (currentUser) {
    //   const user = { user: currentUser.id };
    //   Axios.post(`${SERVER_URI}/getUserInfo`, user).then((res) => {
    //     if (res.data.success) {
    //       localStorage.setItem("token", res.data.token);
    //       dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
    //     } else {
    //       console.log("failed");
    //     }
    //   });
    // } else {
    //   notification.warning({
    //     message: "Warning!",
    //     description: "Please login to",
    //   });
    // }
    router.push("/swap");
  };
  const gotoDeposit = (type: string) => {
    localStorage.setItem("type", type);
    router.push("/deposit");
  };

  const gotoWithdraw = (type: string) => {
    localStorage.setItem("type", type);
    router.push("/withdraw");
  };

  useEffect(() => {
    const token = getFromLocalStorage("token");
    const userInfo: any = token ? jwtDecode(token) : {};
    if (userInfo) {
      const user = { user: userInfo.id };
      Axios.post(`${SERVER_URI}/getUserInfo`, user).then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        }
      });
    } else {
      notification.warning({
        message: "Warning!",
        description: "Please login to",
      });
    }
  }, []);

  const getCakePrice = async () => {
    getCake().then((price) => {
      setCakePrice(price);
    });
  };

  const items = useMemo(() => {
    if (currentUser && currentUser.money) {
      const { busd, usdt, usd, cake, bitp, quest } = currentUser.money;

      return [
        {
          icon: BUSD,
          name: "BUSD",
          value: busd ? busd.toFixed(2) : 0,
          type: "deposit",
          hasWithdraw: true,
        },
        {
          icon: USDT,
          name: "USDT",
          value: usdt ? usdt.toFixed(2) : 0,
          type: "deposit",
          hasWithdraw: true,
        },
        {
          icon: CAKE,
          name: "CAKE",
          value: cake ? cake.toFixed(2) : 0,
          type: "deposit",
          hasWithdraw: true,
        },
        {
          icon: BITP,
          name: "BITP",
          value: bitp ? bitp.toFixed(2) : 0,
          type: "deposit",
          hasWithdraw: true,
        },
        {
          icon: QIC,
          name: "Quest Credit",
          value: quest ? quest.toFixed(2) : 0,
          type: "swap",
          hasWithdraw: false,
        },
        {
          icon: Paypal,
          name: "USD",
          value: usd ? usd.toFixed(2) : 0,
          type: "deposit",
          hasWithdraw: true,
        },
      ];
    }
    return [];
  }, [currentUser]);

  const calcTotal = () => {
    if (currentUser && currentUser.money) {
      const { busd, usdt, usd, cake, bitp, quest } = currentUser.money;
      return (
        (busd ?? 0) +
        (usdt ?? 0) +
        (usd ?? 0) +
        (cake * cakePrice ?? 0) +
        (bitp * 0.06 ?? 0) +
        (quest * 3 ?? 0)
      );
    }
    return 0;
  };

  useEffect(() => {
    getCakePrice();
  }, []);

  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto mt-16 px-4 lg:px-0 flex flex-col xl:flex-row justify-between">
        <div>
          <div className="flex gap-0.5">
            <div className="flex px-2 lg:px-8 lg:pr-14 rounded py-2 lg:py-4 items-center gap-2 lg:gap-20 bg-primary-1050 border-l border-t border-b border-primary-150">
              <USDG height="60" width="50" />
              <div>
                <div className="text-base lg:text-2xl font-bold text-primary-1100 text-right">
                  TOTAL BALANCE
                </div>
                <div className="text-base mt-2 lg:text-xl font-bold text-white text-right">
                  USD{" "}
                  <span className="text-base lg:text-2xl">
                    {calcTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex px-2 lg:px-8 py-2 lg:py-4 items-center gap-2 lg:gap-20 border-l border-t border-b border-primary-550">
              <QC height="60" width="50" />
              <div>
                <div className="text-base lg:text-2xl font-bold text-primary-1100 text-right">
                  QUEST CREDIT
                </div>
                <div className="text-base mt-2 lg:text-2xl font-bold text-white text-right">
                  {currentUser && currentUser.money && currentUser.money.quest}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={
              refreshing
                ? () => {}
                : () => {
                    refreshWalletBalance();
                  }
            }
            className="flex bg-secondary-450 mt-10 px-6 py-2 rounded-lg items-center text-white gap-3 font-bold text-base"
          >
            <div>{refreshing ? "LOADING..." : "REFRESH"}</div>
            <Refresh />
          </button>
          <div className="mt-10 w-full xl:w-table">
            <div className="grid grid-cols-4 xl:grid-cols-5 gap-0 font-bold lg:text-base text-sm text-primary-1100">
              <div className="mr-20 hidden xl:block">COIN</div>
              <div className="mr-20 whitespace-nowrap">COIN NAME</div>
              <div className="mr-20 xl:hidden">BALANCE</div>
              <div className="mr-20"></div>
              <div className="xl:mr-20">ACTION</div>
              <button
                onClick={toggleSwap}
                className="bg-secondary-300 hidden xl:block font-bold text-white h-10 px-20 lg:px-10 rounded"
              >
                SWAP
              </button>
            </div>
            <div className="mt-7">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 py-5 border-b border-primary-550 items-center gap-0 font-medium lg:text-xl text-base text-white"
                >
                  <Image
                    priority={true}
                    height={50}
                    width={60}
                    src={item.icon}
                    alt="icon"
                    className="hidden xl:block"
                  />
                  <div>{item.name}</div>
                  <div className="text-right lg:text-left lg:ml-10">
                    {item.value}
                  </div>
                  <div className="relative">
                    <button
                      className={`${
                        item.type === "deposit"
                          ? "bg-secondary-150"
                          : "bg-secondary-300"
                      } font-bold text-white ml-10 xl:ml-0 h-7 lg:h-9 px-1 lg:px-2 w-16 lg:w-24 lg:text-sm ten`}
                      onClick={
                        item.type !== "deposit"
                          ? toggleSwap
                          : item.name === "BITP"
                          ? () =>
                              notification.error({
                                message: "Error",
                                description:
                                  "Coin is inactive until listed on exchange",
                              })
                          : () => gotoDeposit(item.name)
                      }
                    >
                      {item.type === "deposit" ? "DEPOSIT" : "SWAP"}
                    </button>
                    <div className="xl:bg-primary-50 bg-primary-100 h-3 w-6 absolute rotate-45 -top-1.5 md:right-9 lg:right-14 xl:right-7 -right-10" />
                  </div>
                  {item.hasWithdraw && (
                    <button
                      className={`font-bold xl:ml-10 hidden xl:block text-sm text-white border-2 border-secondary-150 h-7 lg:h-9 ten px-1 lg:px-2 w-16 lg:w-24`}
                      onClick={
                        item.name === "BITP"
                          ? () =>
                              notification.error({
                                message: "Error",
                                description:
                                  "Coin is inactive until listed on exchange",
                              })
                          : () => gotoWithdraw(item.name)
                      }
                    >
                      WITHDRAW
                    </button>
                  )}
                  {item.hasWithdraw && (
                    <Link href={"/withdraw"}>
                      <button
                        className={`font-bold xl:hidden text-sm text-white bg-secondary-350 h-7 lg:h-9 ten px-1 lg:px-2 w-16 lg:w-24 ml-12`}
                      >
                        WITHDRAW
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-14 xl:mt-0">
          <h3 className="xl:text-2xl text-lg font-bold text-white text-left">
            TRANSACTION HISTORY
          </h3>
          <div className="flex items-center gap-32 mt-6">
            <div className="flex items-center gap-8">
              {navs.map((item, index) => (
                <div
                  className="text-sm xl:text-lg font-bold text-primary-450"
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>
            <Filter />
          </div>
          <div className="xl:mt-40 mt-32 flex justify-center">
            <EmptyTransaction />
          </div>
        </div>
      </div>
      <Modal
        key={0}
        Body={<Swap />}
        isOpen={isSwapOpen}
        close={toggleSwap}
        isVoid={5}
      />
      <Footer />
    </div>
  );
};

export default Wallet;
