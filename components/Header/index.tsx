import jwtDecode from "jwt-decode";
import {
  ArrowDown,
  Bell,
  Game,
  MenuBars,
  Message,
  Official,
  QC,
  USDG,
} from "@/public/icons";
import PoolLogo from "@/public/pool-logo.png";
import Profile from "@/public/profile.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button, { variantTypes } from "../Button";
import Login from "../Login";
import Modal from "../Modal";
import { MobileNav } from "../Nav";
import Signup from "../Signup";
import ForgotPassword from "../ForgotPassword";
import { IState } from "@/store";
import { authActions } from "@/store/auth";
import { SERVER_URI, SERVER_HOST } from "@/config";
import Axios from "axios";
import { notification } from "antd";
import { useRouter } from "next/router";
import { getCake } from "@/service/helper";
import Userchallenge from "./userchallenge";
import Openchallenge from "./openchallenge";
import Avatar from "@/public/profile.png";

const Header = () => {
  const router = useRouter();
  const { currentUser } = useSelector((state: IState) => state.auth);
  const { model } = useSelector((state: IState) => state.poolchallenge);
  const dispatch = useDispatch();
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);
  const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isErrorChallengeOpen, setIsErrorChallengeOpen] = useState(false);
  const [isSuccessChallengeOpen, setIsSuccessChallengeOpen] = useState(false);
  const [cakePrice, setCakePrice] = useState<number>(0);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [data, setData] = useState<object[]>([]);

  const toggleDropdownMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const toggleDropdownNotificate = () => {
    setIsOpenNotification(!isOpenNotification);
  };

  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined" || !localStorage) {
      return "";
    }
    return window.localStorage.getItem(key);
  };

  const getCakePrice = async () => {
    getCake().then((price) => {
      setCakePrice(price);
    });
  };

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

  const toggleLogin = () => {
    setIsOpenSignup(false);
    setIsOpenLogin(!isOpenLogin);
  };

  const toggleForgotPassword = () => {
    setIsOpenLogin(false);
    setIsOpenForgotPassword(!isOpenForgotPassword);
  };

  const toggleSignup = () => {
    setIsOpenLogin(false);
    setIsOpenSignup(!isOpenSignup);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleChallenge = () => {
    setIsChallengeOpen(!isChallengeOpen);
  };

  const toggleErrorChallenge = () => {
    setIsErrorChallengeOpen(!isErrorChallengeOpen);
  };

  const toggleSuccessChallenge = () => {
    setIsSuccessChallengeOpen(!isSuccessChallengeOpen);
  };

  const logout = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("token");
    dispatch(authActions.setCurrentUser({}));
    router.push("/");
  };

  const clickLoginRoute = () => {
    toggleSignup();
    toggleLogin();
  };

  const clickForgotPasswordRoute = () => {
    toggleLogin();
    toggleForgotPassword();
  };

  const clickForgotPasswordRoute2 = () => {
    toggleForgotPassword();
    toggleSignup();
  };

  const clickSignupRoute = () => {
    toggleLogin();
    toggleSignup();
  };

  const startGame = (challengeId: any) => {
    if (!currentUser || Object.keys(currentUser).length === 0) {
      notification.warning({
        message: "Warning!",
        description: "Please login!",
      });
      return;
    }

    localStorage.setItem("cid", challengeId.toString());
    const uid: any = currentUser.id;

    Axios.post(`${SERVER_URI}/pool-game/start`, {
      cid: challengeId,
      uid,
    }).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success",
          description: res.data.message,
        });
        localStorage.setItem("token", res.data.token);
        dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        router.push(`/game?cid=${challengeId}`);
      } else {
        notification.warning({
          message: "Warning!",
          description: res.data.message,
        });
      }
    });
  };

  useEffect(() => {
    const token = getFromLocalStorage("token");
    const user: any = token ? jwtDecode(token) : null;
    dispatch(authActions.setCurrentUser(token ? user : {}));
    getCakePrice();
    if (user) {
      Axios.post(`${SERVER_URI}/getUserInfo`, { user: user?.id }).then(
        (res) => {
          localStorage.setItem("token", res.data.token);
        }
      );
    }
  }, []);

  useEffect(() => {
    setData(model);
  }, [model]);

  const filteredData = data.filter((item: any) => {
    return (
      item.status_num > 0 &&
      item.status_num < 3 &&
      ((item.status_num == 1 &&
        item.create_userid &&
        item.create_userid._id == currentUser.id &&
        item.joinOpponent == true) ||
        (item.status_num == 1 &&
          item.opponent_userid &&
          item.opponent_userid._id == currentUser.id &&
          item.joinUser == true) ||
        item.status_num == 2) &&
      (item.create_userid?._id == currentUser.id ||
        item.opponent_userid?._id == currentUser.id)
    );
  });

  return (
    <>
      <div className="bg-primary-200 small-border-b xl:border-b-primary-150 border-b-black">
        <div className="hidden w-full xl:flex xl:items-center xl:justify-between container mx-auto py-6">
          <div>
            <h1 className="text-3xl font-bold text-white">BITPOOL</h1>
            <div className="flex items-center justify-center gap-1">
              <Official size="22" />
              <div className="text-primary-300 text-sm pt-0.5 font-Poppins">
                Official Page
              </div>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-7">
              <Button
                variant={variantTypes.outline}
                px="px-5"
                text="Create Challenge"
                onClick={toggleChallenge}
              />
              <div className="cursor-pointer hidden xl:block">
                <Message />
              </div>
              <div>
                <div
                  id="dropdownNotification"
                  data-dropdown-toggle="dropdownNotificate"
                  className="cursor-pointer relative hidden xl:block"
                  onClick={toggleDropdownNotificate}
                >
                  <Bell />
                  {currentUser && currentUser.email ? (
                    <div className="bg-secondary-250 absolute top-2.5 -right-2 h-4 w-4 rounded-full flex justify-center items-center">
                      <div className="text-white font-bold ten">
                        {filteredData?.length ? filteredData?.length : 0}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-secondary-250 absolute top-2.5 -right-2 h-4 w-4 rounded-full flex justify-center items-center">
                      <div className="text-white font-bold ten">0</div>
                    </div>
                  )}
                </div>

                <div
                  id="dropdownNotificate"
                  className={`z-10 ${
                    isOpenNotification ? "" : "hidden"
                  } absolute w-80 max-h-52 overflow-auto ml-[-150px] mt-2 bg-gray-700 divide-y divide-gray-700 rounded-lg shadow`}
                >
                  {currentUser && currentUser.email ? (
                    <ul
                      className="py-2 text-center text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownNotification"
                    >
                      {filteredData.length > 0 ? (
                        filteredData.map((item: any, index) => (
                          <li key={index}>
                            <div
                              onClick={() => startGame(item._id)}
                              className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold cursor-pointer"
                            >
                              {currentUser.id === item.create_userid._id ? (
                                <Image
                                  width={50}
                                  height={50}
                                  className="h-8 w-8 rounded-full object-cover mx-1"
                                  src={
                                    item?.opponent_userid?.avatar
                                      ? `${SERVER_HOST}/uploads/${item?.opponent_userid?.avatar}`
                                      : Avatar
                                  }
                                  alt="avatar"
                                />
                              ) : (
                                <Image
                                  width={50}
                                  height={50}
                                  className="h-8 w-8 rounded-full object-cover mx-1"
                                  src={
                                    item?.create_userid?.avatar
                                      ? `${SERVER_HOST}/uploads/${item?.create_userid?.avatar}`
                                      : Avatar
                                  }
                                  alt="avatar"
                                />
                              )}
                              <p className="text-white text-sm m-auto">
                                <span className="font-bold text-blue-500 pr-1">
                                  @
                                  {currentUser.id === item.create_userid._id
                                    ? item.opponent_userid.username
                                    : item.create_userid.username}
                                </span>
                                joined the challenge of
                                <span className="font-bold text-blue-500 px-1">
                                  {item?.amount}
                                </span>
                                <span className="font-bold text-blue-500">
                                  {item?.coin_type === 1
                                    ? "BITP"
                                    : item.coin_type === 2
                                    ? "BUSD"
                                    : item.coin_type === 3
                                    ? "USDT"
                                    : "CAKE"}
                                </span>
                              </p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p className="my-3">No Notification</p>
                      )}
                    </ul>
                  ) : (
                    <ul
                      className="py-2 text-center text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownNotification"
                    >
                      <p className="my-3">Please Sign Up or Sign In</p>
                    </ul>
                  )}
                </div>
              </div>

              {currentUser && currentUser.email && (
                <div className="flex items-center">
                  <Link href="/wallet">
                    <div className="cursor-pointer px-6 py-7 flex items-center gap-3.5 bg-primary-950 rounded-l h-12">
                      <USDG width="30.194" height={"35.075"} />
                      <div className="font-medium lg:text-base text-xs text-white font-Poppins">
                        {calcTotal().toFixed(2)} USD
                      </div>
                      <div className="ml-3">
                        <QC width={"29.759"} height={"34.569"} />
                      </div>
                      <div className="font-medium flex lg:text-base text-xs text-white font-Poppins">
                        {currentUser &&
                          currentUser.money &&
                          currentUser.money.quest}{" "}
                        QC
                      </div>
                    </div>
                  </Link>
                  <div className="cursor-pointer relative px-6 py-7 justify-center items-center bg-primary-1000 rounded-br h-12">
                    <ArrowDown />
                    <div className="h-9 w-9 bg-primary-200 rotate-45 -top-5 -right-7 absolute"></div>
                  </div>
                </div>
              )}
            </div>
            {currentUser && currentUser.email ? (
              <div className="flex items-center justify-end gap-4">
                {currentUser.avatar ? (
                  <Image
                    priority={true}
                    height={75}
                    width={75}
                    src={`${SERVER_HOST}/uploads/${currentUser.avatar}`}
                    alt="profile"
                    className="max-h-[75px] cursor-pointer rounded-full object-cover"
                  />
                ) : (
                  <Image
                    priority={true}
                    height={75}
                    width={75}
                    src={Profile}
                    alt="profile"
                    className="max-h-[75px] cursor-pointer  rounded-full object-cover"
                  />
                )}

                <div>
                  <button
                    id="dropdownDefaultButton"
                    data-dropdown-toggle="dropdown"
                    className="text-white hover:blue-800 focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                    type="button"
                    onClick={toggleDropdownMenu}
                  >
                    <p className="m-0 text-base font-semibold hover:text-gray-400">
                      {currentUser && currentUser.username}
                    </p>
                    <svg
                      className="w-2.5 h-2.5 ml-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>

                  <div
                    id="dropdown"
                    className={`z-10 ${
                      isOpenMenu ? "" : "hidden"
                    } absolute bg-gray-700 divide-y divide-gray-700 rounded-lg shadow`}
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {currentUser?.role === 1 ? (
                        <>
                          <li>
                            <Link
                              href="/admin-withdraw"
                              className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                            >
                              Admin Withdrawal
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin-challenge"
                              className="block px-4 py-2 text-white hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                            >
                              Admin Challenge
                            </Link>
                          </li>
                        </>
                      ) : (
                        <li>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-white hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                          >
                            My Profile
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          href="#"
                          className="block px-4 py-2 text-white hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                          onClick={logout}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button onClick={toggleSignup} px="px-7" text="SIGN UP" />
                <Button
                  onClick={toggleLogin}
                  variant={variantTypes.outline}
                  text="SIGN IN"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center xl:hidden bg-primary-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div onClick={toggleNav}>
              <MenuBars />
            </div>
            <Image
              priority={true}
              height={51.31}
              width={45}
              src={PoolLogo}
              alt="pool logo"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">BITPOOL</h1>
              <div className="flex items-center justify-center gap-1">
                <Official size="15" />
                <div className="text-primary-300 ten pt-0.5 font-Poppins">
                  Official Page
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              id="dropdownNotification"
              data-dropdown-toggle="dropdownNotificate"
              className="cursor-pointer relative"
              onClick={toggleDropdownNotificate}
            >
              <Bell />
              {currentUser && currentUser.email ? (
                <div className="bg-secondary-250 absolute top-2.5 -right-2 h-4 w-4 rounded-full flex justify-center items-center">
                  <div className="text-white font-bold ten">
                    {filteredData?.length ? filteredData?.length : 0}
                  </div>
                </div>
              ) : (
                <div className="bg-secondary-250 absolute top-2.5 -right-2 h-4 w-4 rounded-full flex justify-center items-center">
                  <div className="text-white font-bold ten">0</div>
                </div>
              )}
            </div>
            <div
              id="dropdownNotificate"
              className={`z-10 ${
                isOpenNotification ? "" : "hidden"
              } absolute w-72 max-h-52 overflow-auto ml-[-130px] mt-2 bg-gray-700 divide-y divide-gray-700 rounded-lg shadow`}
            >
              {currentUser && currentUser.email ? (
                <ul
                  className="py-2 text-center text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownNotification"
                >
                  {filteredData.length > 0 ? (
                    filteredData.map((item: any, index) => (
                      <li key={index}>
                        <div
                          onClick={() => startGame(item._id)}
                          className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold cursor-pointer"
                        >
                          {currentUser.id === item.create_userid._id ? (
                            <Image
                              width={50}
                              height={50}
                              className="h-8 w-8 rounded-full object-cover mx-1"
                              src={
                                item?.opponent_userid?.avatar
                                  ? `${SERVER_HOST}/uploads/${item?.opponent_userid?.avatar}`
                                  : Avatar
                              }
                              alt="avatar"
                            />
                          ) : (
                            <Image
                              width={50}
                              height={50}
                              className="h-8 w-8 rounded-full object-cover mx-1"
                              src={
                                item?.create_userid?.avatar
                                  ? `${SERVER_HOST}/uploads/${item?.create_userid?.avatar}`
                                  : Avatar
                              }
                              alt="avatar"
                            />
                          )}
                          <p className="text-white text-sm m-auto">
                            <span className="font-bold text-blue-500 pr-1">
                              @
                              {currentUser.id === item.create_userid._id
                                ? item.opponent_userid.username
                                : item.create_userid.username}
                            </span>
                            joined the challenge of
                            <span className="font-bold text-blue-500 px-1">
                              {item?.amount}
                            </span>
                            <span className="font-bold text-blue-500">
                              {item?.coin_type === 1
                                ? "BITP"
                                : item.coin_type === 2
                                ? "BUSD"
                                : item.coin_type === 3
                                ? "USDT"
                                : "CAKE"}
                            </span>
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="my-3">No Notification</p>
                  )}
                </ul>
              ) : (
                <ul
                  className="py-2 text-center text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownNotification"
                >
                  <p className="my-3">Please Sign Up or Sign In</p>
                </ul>
              )}
            </div>
          </div>

          {currentUser && currentUser.email ? (
            <div className="flex items-center">
              <Link href="/wallet" className="hidden md:flex">
                <div className="cursor-pointe px-2 py-3 flex items-center gap-3 bg-primary-950 h-8 rounded-l">
                  <USDG width={17} height={19.75} />
                  <div className="font-medium lg:text-base ten text-white font-Poppins">
                    {calcTotal().toFixed(2)}
                  </div>
                </div>
              </Link>
              <div className="hidden md:flex cursor-pointer relative px-3 py-3 justify-center items-center bg-primary-1000 h-8 rounded-br">
                <ArrowDown />
                <div className="h-4 w-4 bg-primary-50 rotate-45 -top-2 -right-2.5 absolute"></div>
              </div>
              <div className="flex pl-3">
                {currentUser.avatar ? (
                  <Image
                    priority={true}
                    height={50}
                    width={50}
                    src={`${SERVER_HOST}/uploads/${currentUser.avatar}`}
                    alt="profile"
                    className="max-h-[75px] cursor-pointer rounded-full object-cover"
                  />
                ) : (
                  <Image
                    priority={true}
                    height={50}
                    width={50}
                    src={Profile}
                    alt="profile"
                    className="max-h-[75px] cursor-pointer  rounded-full object-cover"
                  />
                )}
                <button
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className="text-white hover:blue-800 focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  type="button"
                  onClick={toggleDropdownMenu}
                >
                  <p className="m-0 text-base font-semibold hover:text-gray-400">
                    {currentUser && currentUser.username}
                  </p>
                  <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                <div
                  id="dropdown"
                  className={`z-10 ${
                    isOpenMenu ? "" : "hidden"
                  } absolute bg-gray-700 divide-y divide-gray-700 rounded-lg shadow`}
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    {currentUser?.role === 1 ? (
                      <>
                        <li>
                          <Link
                            href="/admin-withdraw"
                            className="block px-4 text-white py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                          >
                            Admin Withdrawal
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin-challenge"
                            className="block px-4 text-white py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                          >
                            Admin Challenge
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                        >
                          My Profile
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                        onClick={logout}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button onClick={toggleSignup} text="SIGN UP" />
            </div>
          )}
        </div>
      </div>
      <MobileNav open={isNavOpen} close={toggleNav} />
      <Modal
        key={0}
        Body={
          <Login
            switch={clickSignupRoute}
            switch2={clickForgotPasswordRoute}
            close={toggleLogin}
          />
        }
        isOpen={isOpenLogin}
        close={toggleLogin}
        isVoid={1}
      />
      <Modal
        key={1}
        Body={<Signup switch={clickLoginRoute} close={toggleSignup} />}
        isOpen={isOpenSignup}
        close={toggleSignup}
        isVoid={2}
      />
      <Modal
        key={2}
        Body={
          <ForgotPassword
            switch={clickForgotPasswordRoute2}
            close={toggleForgotPassword}
          />
        }
        isOpen={isOpenForgotPassword}
        close={toggleForgotPassword}
        isVoid={3}
      />
      <Modal
        key={3}
        Body={<NoChallenge toggledChallenge={toggleChallenge} />}
        isOpen={isChallengeOpen}
        close={toggleChallenge}
        isVoid={4}
      />
      <Modal
        key={4}
        Body={<ErrorChallenge toggledChallenge={toggleErrorChallenge} />}
        isOpen={isErrorChallengeOpen}
        close={toggleErrorChallenge}
        isVoid={5}
      />
      <Modal
        key={5}
        Body={<SuccessChallenge toggledChallenge={toggleSuccessChallenge} />}
        isOpen={isSuccessChallengeOpen}
        close={toggleSuccessChallenge}
        isVoid={6}
      />
    </>
  );
};

export default Header;

export const NoChallenge = (props: { toggledChallenge: () => void }) => {
  const [tabflag, setTabflag] = useState(true);

  const closeModalPage = () => {
    props.toggledChallenge();
  };

  return (
    <div className="flex flex-col justify-center px-5 items-center gap-7 w-full">
      <div className="lg:text-2xl text-xl font-bold text-primary-900">
        CREATE CHALLENGE
      </div>
      <div className="challenge-modal-tab w-full">
        <div
          className={`challenge-modal-tab-item ${
            tabflag ? "challenge-modal-tab-item-active" : ""
          } h-12 text-primary-750`}
          onClick={() => setTabflag(true)}
        >
          User Challenge
        </div>
        <div
          className={`challenge-modal-tab-item ${
            !tabflag ? "challenge-modal-tab-item-active" : ""
          } h-12 text-primary-750`}
          onClick={() => setTabflag(false)}
        >
          Open Challenge
        </div>
      </div>
      {tabflag ? (
        <Userchallenge close={closeModalPage} />
      ) : (
        <Openchallenge close={closeModalPage} />
      )}
    </div>
  );
};

export const ErrorChallenge = (props: any) => {
  return (
    <div className="flex flex-col justify-center px-5 items-center gap-7 w-full">
      <div className="lg:text-2xl text-xl font-bold text-primary-900">
        ERROR!
      </div>
    </div>
  );
};

export const SuccessChallenge = (props: any) => {
  return (
    <div className="flex flex-col justify-center px-5 items-center gap-7 w-full">
      <div className="lg:text-2xl text-xl font-bold text-primary-900">
        CREATE CHALLENGE SUCCESSFULLY
      </div>
      <div className="lg:text-2xl text-xl font-bold text-primary-900">
        CREATE CHALLENGE SUCCESSFULLY
      </div>
    </div>
  );
};
