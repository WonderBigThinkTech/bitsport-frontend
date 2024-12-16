import React, { useEffect, useState } from "react";
import { ImDiamonds } from "react-icons/im";
import { CiHeart } from "react-icons/ci";
import { LuRepeat } from "react-icons/lu";
import { BsChatSquareDots } from "react-icons/bs";
import { SlActionUndo } from "react-icons/sl";
import axios from "axios";
import { SERVER_URI } from "@/config";
import { IRanking, IUser } from "@/store";
import { RxCross2 } from "react-icons/rx";
import { Header } from "@/components";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { notification } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { IState } from "@/store";

import { useCopyToClipboard } from "usehooks-ts";
import Image from "next/image";
import { authActions } from "@/store/auth";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import Pagination from "../Pagination";
import QuestTable from "./QuestTable";

interface DataProps {
  content: string;
  endTime: number;
  tweetId: string;
  tweetType: string;
  _id: string;
}

const ViewInfo = ({
  viewModal,
  setView,
  userInfo,
  setPosted,
}: {
  viewModal: boolean;
  setView: (data: boolean) => void;
  userInfo: string;
  setPosted: (data: boolean) => void;
}) => {
  const [postText, setPostText] = useState<DataProps[]>([]);
  const [post, setPost] = useState<string>();
  const [user, setUser] = useState<IUser>();
  const [stateInfo, setStateInfo] = useState<
    { farm: number; booster: number }[]
  >([]);
  const [score, setScore] = useState<number>(0);
  const [ranking, setRanking] = useState<IRanking[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [power, setPower] = useState<boolean>(false);
  const [play, setPlay] = useState<boolean>(false);
  const [point, setPoint] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [retweet, setRetweet] = useState<number>(0);
  const [reply, setReply] = useState<number>(0);
  const [quoto, setQuoto] = useState<number>(0);

  const [refreshLoading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  interface BoostTweet {
    content: string,
    imageLink: string,
    tweetId: string,
  }
  const [boostTweet, setBoostTweet] = useState<BoostTweet[]>([]);
  const [refreshTime, setRefreshTime] = useState("");

  const { currentUser } = useSelector((state: IState) => state.auth);

  const [copiedText, copy] = useCopyToClipboard();
  const [referLink, setReferLink] = useState("");

  const [refreshTiming, setRefreshTiming] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [refPoint, setRefPoint] = useState(0);
  const [farmOrLead, setFarmOrLead] = useState(true);
  const [questData, setQuestData] = useState([]);

  const dispatch = useDispatch();

  const router = useRouter();

  const { data: session, status } = useSession();

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        console.log("Copied!", { text });
        notification.success({ message: "Your referral link copied!" });
      })
      .catch((error: any) => {
        console.log("Failed to copy!", error);
      });
  };

  const loadingData = async () => {
    setLoading(true);
    try {
      const info = await axios.post(`${SERVER_URI}/getUser`, {
        userId: userInfo,
      });
      const bonus = await axios.get(`${SERVER_URI}/getBonus`);
      const tempBonus = bonus.data[0].matrix;
      // notification.info({ message: "Don't refresh this page!", description: "It may take some time to score points." });

      const twitStats = await axios.get(
        `${SERVER_URI}/getTwitInfo/${info.data.data.twitter.twitterId}`
      );

      if (twitStats) {
        setLoading(false);
        notification.success({ message: "Refresh successfully done!" });
        const tempInfo = twitStats.data;
        setUser(info.data.data);
        setStateInfo(twitStats.data);
        const score =
          tempInfo[0].farm * tempBonus[1][0] +
          tempInfo[0].booster * tempBonus[2][0] +
          tempInfo[1].farm * tempBonus[1][1] +
          tempInfo[1].booster * tempBonus[2][1] +
          tempInfo[2].farm * tempBonus[1][2] +
          tempInfo[2].booster * tempBonus[2][2] +
          tempInfo[3].farm * tempBonus[1][3] +
          tempInfo[3].booster * tempBonus[2][3];
        const savescore = await axios.post(`${SERVER_URI}/saveScore`, {
          tweetStatus: twitStats.data,
          score: score,
          userId: currentUser.id,
        });
        if (savescore) {
          localStorage.setItem("token", savescore.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(savescore.data.token)));
        }
        setScore(score + currentUser.referralCnt * refPoint);
        if (100000000 < score) {
          setLevel(3);
        } else if (10000000 < score) {
          setLevel(2);
        } else if (1000000 < score) {
          setLevel(1);
        }
      }
    } catch (error) {
      console.log("getcontent error =====>", error);
      notification.error({
        message: "It's not possible to refresh now. Please try later!",
      });
      setLoading(false);
    }
  };

  const getUserScore = async () => {
    try {
      const info = await axios.post(`${SERVER_URI}/getUser`, {
        userId: userInfo,
      });
      const bonus = await axios.get(`${SERVER_URI}/getBonus`);
      const tempBonus = bonus.data[0].matrix;

      const response = await axios.get(
        `${SERVER_URI}/getUserScore/${currentUser.id}`
      );
      if (response) {
        const tempInfo = response.data;
        setUser(info.data.data);
        setStateInfo(response.data);

        const score =
          tempInfo[0].farm * tempBonus[1][0] +
          tempInfo[0].booster * tempBonus[2][0] +
          tempInfo[1].farm * tempBonus[1][1] +
          tempInfo[1].booster * tempBonus[2][1] +
          tempInfo[2].farm * tempBonus[1][2] +
          tempInfo[2].booster * tempBonus[2][2] +
          tempInfo[3].farm * tempBonus[1][3] +
          tempInfo[3].booster * tempBonus[2][3];
        setScore(score + currentUser.referralCnt * refPoint);
        if (100000000 < score) {
          setLevel(3);
        } else if (10000000 < score) {
          setLevel(2);
        } else if (1000000 < score) {
          setLevel(1);
        }
      }
    } catch (error) {
      console.log("get twitter info error ===> ", error);
    }
  };

  const followUs = async () => {
    // const accessToken = session?.token.account.access_token;
    // const accessSecret = session?.token.account.refresh_token;
    // const userId = session?.token.sub;
    // console.log("accesstoken =>>> ", accessToken)
    // console.log("accessSecret =>>> ", accessSecret)
    // console.log("userId =>>> ", userId)
    // const res = await axios.post(`${SERVER_URI}/followUs`, {accessToken, accessSecret, userId});
    // if (res) {
    //   console.log("follow us ===> ", res)
    // }
    const query = { followed: true };

    const res = await axios.post(
      `${SERVER_URI}/updateUserState/${currentUser.id}`,
      query
    );
    if (res) {
      window.open(
        `https://twitter.com/intent/follow?screen_name=bitsportgaming`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (currentUser && refreshTiming != 0) {
      const refreshTimestamp = new Date(currentUser.refresh).getTime();
      const currentTimestamp = Date.now();
      const interval =
        refreshTiming * 60 -
        Math.ceil((currentTimestamp - refreshTimestamp) / (1000 * 60));
      const hour = Math.floor(interval / 60);
      const min = interval % 60;
      console.log("current user for referral ==> ", currentUser);
      try {
        const refer =
          window.location.origin +
          "/?refId=" +
          currentUser.twitter.twitterScreenName;
        setReferLink(refer);
        if (session) {
          const refer =
            window.location.origin +
            "/?refId=" +
            //@ts-ignore
            session?.token.profile.data.username;
          setReferLink(refer);
        }
      } catch (error) {
        console.log("referral link error ==> ", error);
      }
      if (hour <= 0) {
        setRefresh(false);
        setRefreshTime("Ready");
      } else {
        const remainTime = "in " + hour + "h " + min + "min.";
        setRefresh(true);
        setRefreshTime(remainTime);
      }
    }
  }, [refreshTiming, currentUser, session]);

  useEffect(() => {
    const getRanks = async () => {
      const res = await axios.get(`${SERVER_URI}/ranking`);
      const info = await axios.post(`${SERVER_URI}/getUser`, {
        userId: userInfo,
      });
      setUser(info.data.data);
      setRanking(res.data);
    };
    const getBoostedTweet = async () => {
      const res = await axios.get(`${SERVER_URI}/getBoostedTweet`);
      if (res) {
        setBoostTweet(res.data);
      }
    };
    const getRefreshTime = async () => {
      const refresh = await axios.get(`${SERVER_URI}/refreshTime`);
      if (refresh) {
        setRefreshTiming(refresh.data.refreshTime);
      }
    };
    const getReferralCount = async () => {
      const referral = await axios.get(
        `${SERVER_URI}/getReferralCount/${currentUser.id}`
      );
      if (referral) {
        setReferralCount(referral.data.refcount);
      }
    };
    const getRefPoint = async () => {
      const refpoint = await axios.get(`${SERVER_URI}/getRefPoint`);
      if (refpoint) {
        setRefPoint(refpoint.data.refPoint);
      }
    };
    getRanks();
    getBoostedTweet();
    getRefreshTime();
    getReferralCount();
    getRefPoint();

    localStorage.setItem("admin", "");
  }, [currentUser]);

  useEffect(() => {
    if (userInfo && refPoint != 0) {
      getUserScore();
    }
  }, [userInfo, refPoint]);

  useEffect(() => {
    const getContent = async () => {
      const res = await axios.get(`${SERVER_URI}/currentEarn`);
      if (res.data) {
        setPostText(res.data);
      }
    };
    getContent();
  }, []);

  useEffect(() => {
    if (viewModal) {
      const getPreContent = async () => {
        const res = await axios.get(`${SERVER_URI}/getPost`);
        if (res.data.length > 0) {
          setPost(res.data[0].content);
        }
      };
      getPreContent();
    }
  }, [viewModal]);

  const handlePost = async (postState: string) => {
    const text = " " + post;
    const encodedText = encodeURIComponent(text);
    setView(false);
    setPosted(true);

    let query;
    if (postState == "ref") {
      query = { tweetedRef: true };
    } else {
      query = { sharedTweet: true };
    }

    const res = await axios.post(
      `${SERVER_URI}/updateUserState/${currentUser.id}`,
      query
    );
    if (res) {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodedText}`,
        "_blank"
      );
    }
  };

  const referralPost = async () => {
    try {
      const res = await axios.post(
        `${SERVER_URI}/updateUserState/${currentUser.id}`,
        { tweetedRef: true }
      );
      if (res) {
        window.open(
          `https://twitter.com/intent/tweet?text=I'm farming $BITP from @bitsportgaming.%0A` +
          `Use my referral link, and get point multipliers with me! ${referLink}`,
          "_blank"
        );
      }
    } catch (error) {
      console.log("referralpost error ===> ", error);
    }
  };

  const powerPost = (ptext: string) => {
    setPower(false);
    window.open(`https://twitter.com/bitsportgaming/status/${ptext}`, "_blank");
  };

  useEffect(() => {
    if (session) {
      console.log("stateinfo ====>", session);
    }
  }, [session]);

  const fetchQuestData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URI}/farmChallenge/index`
      );
      if (res) {
        const { models } = res.data;
        setQuestData(models);
      }
    } catch (error) {
      console.log("fquest data error ===> ", error);
    }
  }

  useEffect(() => {
    fetchQuestData();
  }, [])

  return (
    <div className="relative grid grid-rows-[auto_1fr] gap-8 h-full">
      <Header />
      <div className="relative overflow-x-hidden">
        <div className="flex items-center justify-between border-b border-b-white border-opacity-40 px-4 pb-4 gap-2 flex-wrap max-[850px]:justify-center">
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center justify-center px-3 py-2 cursor-pointer ${refresh ? "bg-primary-950" : "bg-[#bd2344]"
                } rounded-lg`}
              onClick={() => loadingData()}
              disabled={refresh}
            >
              <h2 className="text-white text-lg font-medium m-0 uppercase">
                {refreshLoading ? "Loading..." : "Refresh Points"}
              </h2>
            </button>
            <span className="text-white">
              {refreshTime} (X{1 + currentUser.myPoint})
            </span>
          </div>
          <div className="grid grid-cols-[auto_auto_auto] gap-3">
            <div
              className="flex items-center justify-center px-3 py-2 cursor-pointer"
              onClick={() => setPower(true)}
            >
              <h2 className="text-white text-lg font-medium m-0 uppercase">
                Farm-Earn / Boosted Post
              </h2>
            </div>
            <div
              className="flex items-center justify-center px-3 py-2 cursor-pointer"
              onClick={() => setPlay(true)}
            >
              <h2 className="text-white text-lg font-medium m-0">
                HOW TO FARM
              </h2>
            </div>
            <div
              className="flex items-center justify-center px-3 py-2 cursor-pointer"
              onClick={() => setPoint(true)}
            >
              <h2 className="text-white text-lg font-medium m-0">
                CALCULATE BITS
              </h2>
            </div>
          </div>
        </div>
        <div className="block lg:grid lg:grid-cols-[3fr,1fr] border-b border-white border-opacity-10 max-md:hidden">
          <div>
            <div className="grid grid-cols-[1fr,1fr] lg:flex">
              <div className="lg:flex w-full justify-between items-center px-4 lg:px-10 py-6">
                <div className="hidden lg:flex items-center gap-2">
                  <img
                    src={user?.twitter.twitterAvatar}
                    alt=""
                    className="w-10 h-10 rounded-md"
                  />
                  <div>
                    <p className="font-extrabold text-lg text-white m-0">
                      {user?.twitter.twitterName}
                    </p>
                    <p className="text-sm text-[rgb(102_102_117)] m-0">
                      {/* Points last refreshed 2 hours ago */}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 uppercase">
                  <div className="inline-flex flex-col lg:items-end">
                    <p className="text-[#bd2344] text-lg sm:text-xl md:text-3xl lg:text-5xl font-bold m-0">
                      {score} BITS
                    </p>
                    <p className="text-sm text-[#666675] whitespace-nowrap m-0 font-bold">
                      SEASON 1 ENDS MAR 1st
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 lg:px-10 py-6 border border-white border-opacity-10 uppercase flex justify-between items-center">
                <div className="inline-flex flex-col lg:items-end">
                  <div className="flex items-center">
                    <ImDiamonds
                      color="#bd2344"
                      className=" text-sm sm:text-lg md:text-xl lg:text-2xl"
                    />
                    <p className="text-[#bd2344] text-lg sm:text-xl md:text-3xl lg:text-5xl m-0">
                      0
                    </p>
                  </div>
                  <p className="text-sm text-[#666675] m-0 font-bold">$BITP</p>
                </div>
                <div className="lg:hidden">
                  <img src="" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block md:border-1 md:border-white border-opacity-10">
            <div className="flex flex-col h-full">
              <div className="px-5 py-5 uppercase">
                {/* <p className="text-[#bd2344] text-2xl m-0">6 days</p>
              <p className="text-[#666675] text-sm m-0">left in the season</p> */}
              </div>
              <div className="mt-auto">
                <div className="w-full h-1">
                  <div className="h-1 w-full bg-[radial-gradient(657300.04%_93.15%_at_6.85%_99.98%,rgba(203,239,60,0)_0,rgba(203,239,60,.2)_100%)]">
                    <div className="h-1 bg-[linear-gradient(to_right,rgba(216,255,62,0.01),#D8FF3e)] w-[5%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:grid grid-cols-[3fr,1fr] max-md:hidden">
          <div className="px-5 lg:px-0 bg-[rgba(6,6,16,.82)] backdrop-blur-0 lg:bg-[none] lg:backdrop-blur-none border-b border-white border-opacity-10">
            <div className="flex flex-col px-5 items-start md:flex-row justify-around bg-[#0d0d18] max-md:justify-center">
              <div className="flex-1 flex items-center gap-1 py-4 uppercase text-sm justify-center md:border-r border-white border-opacity-10">
                <CiHeart color="white" size={20} />
                <p className="m-0 text-white">
                  {(stateInfo.length > 0 &&
                    stateInfo[0].farm + stateInfo[0].booster) ||
                    0}
                </p>
                <p className="text-[#666675] m-0">likes</p>
              </div>
              <div className="flex-1 flex items-center gap-1 py-4 uppercase text-sm justify-center md:border-r border-white border-opacity-10">
                <LuRepeat color="white" size={16} />
                <p className="m-0 text-white">
                  {(stateInfo.length > 0 &&
                    stateInfo[1].farm + stateInfo[1].booster) ||
                    0}
                </p>
                <p className="text-[#666675] m-0">reposts</p>
              </div>
              <div className="flex-1 flex items-center gap-1 py-4 uppercase text-sm justify-center md:border-r border-white border-opacity-10">
                <SlActionUndo color="white" size={16} />
                <p className="m-0 text-white">
                  {(stateInfo.length > 0 &&
                    stateInfo[2].farm + stateInfo[2].booster) ||
                    0}
                </p>
                <p className="text-[#666675] m-0">replies</p>
              </div>
              <div className="flex-1 flex items-center gap-1 py-4 uppercase text-sm justify-center">
                <BsChatSquareDots color="white" size={16} />
                <p className="m-0 text-white">
                  {(stateInfo.length > 0 &&
                    stateInfo[3].farm + stateInfo[3].booster) ||
                    0}
                </p>
                <p className="text-[#666675] m-0">quotes</p>
              </div>
            </div>
          </div>
          <div className="max-lg:hidden md:border md:border-white md:border-opacity-10">
            <p className="m-0 px-10 py-4 uppercase text-white">boosted posts</p>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-[3fr,1fr] h-[calc(100vh-12rem)]">
          <div className="[background-blend-mode:multiply] bg-[linear-gradient(180deg,rgba(4,15,11,0)_0%,rgba(4,15,11,.2736)_50%,rgba(4,15,11,.72)_84%)] overflow-hidden bg-cover bg-no-repeat bg-bottom md:h-[900px]">
            <div className="relative w-full h-full select-none bg-[linear-gradient(to_top,rgb(0,0,0)_0%,rgba(0,0,0,0)_75%)] flex items-center flex-col">
              <div className="flex items-center rounded-lg mt-[45px] md:hidden">
                <div
                  className={`py-3 px-6 ${farmOrLead ? "bg-[#621f92]" : "bg-[#3b245c]"
                    }  font-bold text-white rounded-l-md cursor-pointer`}
                  onClick={() => {
                    setFarmOrLead(true);
                  }}
                >
                  FARM-EARN
                </div>
                <div
                  className={`py-3 px-6 ${!farmOrLead ? "bg-[#621f92]" : "bg-[#3b245c]"
                    }  font-bold text-white rounded-r-md cursor-pointer`}
                  onClick={() => {
                    setFarmOrLead(false);
                  }}
                >
                  LEADERBOARD
                </div>
              </div>
              {farmOrLead && (
                <div className="flex flex-col justify-center gap-6 mt-4 md:hidden">
                  <div className="bg-[#100d18] rounded-2xl text-white">
                    <div className="py-10 text-5xl font-bold text-center align-middle p-3">
                      {score}
                    </div>
                    <div className="flex items-center gap-3 text-center bg-[#621f92] p-3 rounded-b-2xl">
                      <div className="flex flex-col justify-center">
                        <div className="text-lg font-bold">
                          {(stateInfo.length > 0 &&
                            stateInfo[0].farm + stateInfo[0].booster) ||
                            0}
                        </div>
                        <div className="flex items-center gap-1">
                          <CiHeart color="white" size={20} />
                          <span className="max-[420px]:hidden">LIKES</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center border-l-[1px] border-black pl-4">
                        <div className="text-lg font-bold">
                          {(stateInfo.length > 0 &&
                            stateInfo[1].farm + stateInfo[1].booster) ||
                            0}
                        </div>
                        <div className="flex items-center gap-1">
                          <SlActionUndo color="white" size={16} />
                          <span className="max-[420px]:hidden">REPOST</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center border-l-[1px] border-black pl-4">
                        <div className="text-lg font-bold">
                          {(stateInfo.length > 0 &&
                            stateInfo[2].farm + stateInfo[2].booster) ||
                            0}
                        </div>
                        <div className="flex items-center gap-1">
                          <LuRepeat color="white" size={16} />
                          <span className="max-[420px]:hidden">REPLIES</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center border-l-[1px] border-black pl-4">
                        <div className="text-lg font-bold">
                          {(stateInfo.length > 0 &&
                            stateInfo[3].farm + stateInfo[3].booster) ||
                            0}
                        </div>
                        <div className="flex items-center gap-1">
                          <BsChatSquareDots color="white" size={16} />
                          <span className="max-[420px]:hidden">QUOTES</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!farmOrLead && (
                <div className="max-lg:grid max-lg:grid-rows-[auto_1fr] gap-2 p-6 border-l border-white border-opacity-10 md:hidden">
                  <h2 className="text-white text-3xl font-bold text-center capitalize lg:hidden">
                    Your Point Multipliers
                  </h2>
                  <div className="md:border md:border-white md:border-opacity-10">
                    <p className="m-0 px-10 py-4 uppercase text-white">
                      <span className="text-[#bd2344] font-bold">
                        Top the leaderboard, earn $50 USDT every Friday
                      </span>
                    </p>
                  </div>
                  {ranking.length > 0 ? (
                    ranking.map((data, index) => (
                      <div
                        className="grid grid-cols-[auto_1fr] w-full"
                        key={index}
                      >
                        <h2 className="text-white text-xl justify-self-start">
                          {data.userName}
                        </h2>
                        <h2 className="text-white text-xl justify-self-end">
                          {data.Score}
                        </h2>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="md:border md:border-white md:border-opacity-10">
                        <p className="m-0 px-10 py-4 uppercase text-white">
                          <span className="text-[#bd2344] font-bold">
                            Top the leaderboard, earn $50 USDT every Friday
                          </span>
                        </p>
                      </div>
                      <h3 className="text-white text-2xl text-center font-semibold self-center justify-self-center">
                        There is no data to display.
                      </h3>
                    </>
                  )}
                </div>
              )}

              <div className="grid [grid-template-rows:repeat(4,minmax(auto,210px))]">
                <div className="grid max-sm:grid-cols-[auto_minmax(150px,1fr)] max-md:grid-cols-[auto_minmax(200px,1fr)] grid-cols-[auto_minmax(300px,1fr)] gap-3">
                  <img
                    src="/airdrop/1.png"
                    alt=" "
                    className={`max-sm:pl-[1rem] pl-[7rem] h-full justify-self-end ${level === 3 ? "" : "[filter:brightness(0.2)]"
                      }`}
                  />
                  <div className="flex flex-col items-center justify-self-start">
                    <h2 className="text-3xl max-lg:text-2xl max-sm:text-lg text-[#fccb29] font-bold mt-7 mb-0">
                      100,000,000 BITS
                    </h2>
                    <h3 className="text-2xl max-lg:text-xl text-[#fccb29] font-semibold">
                      (Rank 3 - Gold)
                    </h3>
                  </div>
                </div>
                <div className="grid max-sm:grid-cols-[auto_minmax(150px,1fr)] max-md:grid-cols-[auto_minmax(200px,1fr)] grid-cols-[auto_minmax(300px,1fr)] gap-3">
                  <img
                    src="/airdrop/2.png"
                    alt=" "
                    className={`max-sm:pl-[2rem] pl-[10rem] h-full justify-self-end ${level === 2 ? "" : "[filter:brightness(0.2)]"
                      }`}
                  />
                  <div className="flex flex-col items-center justify-self-start">
                    <h2 className="text-3xl max-lg:text-2xl max-sm:text-lg text-[#e3661f] font-bold mt-5 mb-0">
                      10,000,000 BITS
                    </h2>
                    <h3 className="text-2xl max-lg:text-xl text-[#e3661f] font-semibold">
                      (Rank 2 - Silver)
                    </h3>
                  </div>
                </div>
                <div className="grid max-sm:grid-cols-[auto_minmax(150px,1fr)] max-md:grid-cols-[auto_minmax(200px,1fr)] grid-cols-[auto_minmax(300px,1fr)] gap-3">
                  <img
                    src="/airdrop/3.png"
                    alt=" "
                    className={`max-sm:pl-[3rem] pl-[13rem] h-full justify-self-end ${level === 1 ? "" : "[filter:brightness(0.2)]"
                      }`}
                  />
                  <div className="flex flex-col items-center justify-self-start">
                    <h2 className="text-3xl max-lg:text-2xl max-sm:text-lg text-[#cf40aa] font-bold mt-5 mb-0">
                      1,000,000 BITS
                    </h2>
                    <h3 className="text-2xl max-lg:text-xl text-[#cf40aa] font-semibold">
                      (Rank 1 - Bronze)
                    </h3>
                  </div>
                </div>
                <div className="grid max-sm:grid-cols-[auto_minmax(150px,1fr)] max-md:grid-cols-[auto_minmax(200px,1fr)] grid-cols-[auto_minmax(300px,1fr)] gap-3">
                  <img
                    src="/airdrop/4.png"
                    alt=" "
                    className={`max-sm:pl-[4rem] pl-[16rem] h-full justify-self-end ${level === 0 ? "" : "[filter:brightness(0.2)]"
                      }`}
                  />
                  <div className="flex flex-col items-center justify-self-start">
                    <h2 className="text-3xl max-lg:text-2xl max-sm:text-lg text-[#3772c7] font-bold mt-4 mb-0">
                      100,000 BITS
                    </h2>
                    <h3 className="text-2xl max-lg:text-xl text-[#3772c7] font-semibold">
                      (Rank 0)
                    </h3>
                  </div>
                </div>
              </div>
              <div className="w-full items-center border-t-[1px] border-b-[1px] border-[#232323] text-white flex justify-around md:text-lg font-bold flex-wrap">
                <div className="py-3">Referrals - {referralCount}</div>
                <div className="py-3">Referrals Percentage: 1.00%</div>
                <button
                  className="p-2 bg-[#232323] border-[#adadad] border-[1px] rounded-lg"
                  onClick={() => handleCopy(referLink)}
                >
                  Copy Referral Link
                </button>
                <button
                  className="p-2 bg-[#03A9F4] border-[#adadad] border-[1px] rounded-lg"
                  onClick={referralPost}
                >
                  Tweet Referral Link
                </button>
              </div>
            </div>
          </div>
          <div className="max-lg:grid max-lg:grid-rows-[auto_1fr] gap-2 p-6 border-l border-white border-opacity-10 max-[680px]:mt-5">
            <h2 className="text-white text-3xl font-bold text-center uppercase lg:hidden">
              Boosted Posts
            </h2>
            <div className="py-4">
              <p className="m-0 text-2xl text-[#bd2344] font-bold">
                Engage with Boosted Posts to earn 2x multiplier points ( 1reply,
                1 quote, and 1 retweet per post).
              </p>
            </div>
            <div className="flex flex-col text-white">
              <div className="mt-3">
                {boostTweet.length != 0 && boostTweet.map((item, index) => (
                  <a
                    href={`https://twitter.com/bitsportgaming/status/${item.tweetId}`}
                    target="_blank"
                    key={index}
                  >
                    <div className="mb-6 border-white border-b-2 hover:opacity-50">
                      <div>{item.content}</div>
                      {item.imageLink && (
                        <Image
                          src={item.imageLink}
                          alt=""
                          width={100}
                          height={100}
                          className="p-2 mt-2 w-full"
                        />
                      )}
                    </div>
                  </a>
                )
                )}
              </div>
            </div>

            {/* {boostTweet.length > 0 ? (
              boostTweet.map((data, index) => (
                <div className="grid grid-cols-[auto_1fr] w-full" key={index}>
                  <h2 className="text-white text-xl justify-self-start">
                    Please make a chance to collect more $bitp.
                  </h2>
                  <h2 className="text-white text-xl justify-self-end">
                    https://twitter.com/bitsportgaming
                  </h2>
                </div>
              ))
            ) : (
              <>
                <div className="md:border md:border-white md:border-opacity-10">
                  <p className="m-0 px-10 py-4 uppercase text-white">
                    <span className="text-[#bd2344] font-bold">
                      No data
                    </span>
                  </p>
                </div>
                <h3 className="text-white text-2xl text-center font-semibold self-center justify-self-center">
                  There is no data to display.
                </h3>
              </>
            )} */}
          </div>

          <div>
            <QuestTable questData={questData} />
          </div>
          <div></div>
          <div className="max-lg:grid max-lg:grid-rows-[auto_1fr] gap-2 p-6 border-l border-white border-opacity-10">
            <h2 className="text-white text-3xl font-bold text-center capitalize lg:hidden">
              Your Point Multipliers
            </h2>
            <div className="md:border md:border-white md:border-opacity-10">
              <p className="m-0 px-10 py-4 uppercase text-white">
                <span className="text-[#bd2344] font-bold">
                  Top the leaderboard, earn $50 USDT every Friday
                </span>
              </p>
            </div>
            {ranking.length > 0 ? (
              ranking.map((data, index) => (
                <div className="grid grid-cols-[auto_1fr] w-full" key={index}>
                  <h2 className="text-white text-xl justify-self-start">
                    {data.userName}
                  </h2>
                  <h2 className="text-white text-xl justify-self-end">
                    {data.Score}
                  </h2>
                </div>
              ))
            ) : (
              <>
                <div className="md:border md:border-white md:border-opacity-10">
                  <p className="m-0 px-10 py-4 uppercase text-white">
                    <span className="text-[#bd2344] font-bold">
                      Top the leaderboard, earn $50 USDT every Friday
                    </span>
                  </p>
                </div>
                <h3 className="text-white text-2xl text-center font-semibold self-center justify-self-center">
                  There is no data to display.
                </h3>
              </>
            )}
          </div>
        </div>
      </div>
      {viewModal && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 flex flex-col gap-4 items-center w-[400px] bg-[#fff1] [backdrop-filter:blur(5px)] z-[80]">
          <span
            className="absolute top-2 right-2 py-1 px-2 text-md cursor-pointer rounded-xl text-white"
            onClick={() => {
              setPlay(false);
              setPower(false);
              setPoint(false);
              setView(false);
            }}
          >
            X
          </span>
          <h2 className="text-white text-xl m-0 pb-4 border-b">
            2 Steps to start Farm-Earning BITS
          </h2>
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-md m-0 text-center">
              Follow @bitsportgaming
            </h3>
            <button
              className="cursor-pointer w-full flex items-center justify-center py-4 bg-[#323232] text-white font-bold text-[14px] rounded-lg uppercase"
              onClick={followUs}
            >
              Follow Us
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-md m-0 text-center">
              Share default post
            </h3>
            <button
              className="cursor-pointer w-full flex items-center justify-center py-4 bg-[#323232] text-white font-bold text-[14px] rounded-lg uppercase px-5"
              onClick={() => handlePost("common")}
            >
              share on twitter
            </button>
          </div>
        </div>
      )}

      {power && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[650px] w-full max-h-[calc(100vh-40px)] overflow-y-auto z-[3]">
          <div className="flex border-[#ffffff42] border-[1px] relative bg-[#030408] sm:bg-[#0b0b14] backdrop-blur-[20px] h-[100vh] md:h-auto w-full">
            <div className="p-4 md:p-9 flex flex-col justify-normal md:justify-between border-[#FFFFFF1A] border-b-[1px] w-full">
              <div className="p-4 md:p-9 flex flex-col text-white justify-normal md:justify-between border-[#FFFFFF1A] border-b-[1px] w-full">
                <div className="flex flex-col gap-[10px] mb-6 w-full">
                  <div className="uppercase font-ppsans text-[24px] font-[400]">
                    bitsport farm-earn / Boosted posts
                  </div>
                  <div className="text-sm border-4 border-red-500 p-4">
                    Open and engage with the below Boosted posts on X (Twitter)
                    by commenting, liking, reposting to earn boosted BITS. The
                    more engagements on your replies and reposts, the more BITS
                    you earn
                  </div>
                </div>
                <div className="flex flex-col gap-5 overflow-y-auto md:overflow-y-scroll max-h-none md:max-h-[30rem]">
                  {postText.map((content) => (
                    <div
                      className="cursor-pointer hover:bg-[#ffffff32] px-2 grid grid-cols-[1fr_auto]"
                      key={content._id}
                      onClick={() => powerPost(content.tweetId)}
                    >
                      <h4 className="text-white text-xl font-semibold">
                        {content.content}
                      </h4>
                      <BsBoxArrowUpRight color="white" size={20} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="cursor-pointer absolute top-2 right-2"
              onClick={() => setPower(false)}
            >
              <RxCross2 size={24} className="opacity-50" color="white" />
            </div>
          </div>
        </div>
      )}

      {point && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[650px] text-white w-full z-[3] max-h-[calc(100vh-40px)] overflow-y-auto">
          <div className="flex flex-col border-[#ffffff42] border-[1px] bg-[#030408] sm:bg-[#0b0b14] backdrop-blur-[20px]">
            <div className="p-6 relative flex justify-between border-[#FFFFFF1A] border-b-[1px]">
              <div
                className="cursor-pointer absolute top-2 right-2"
                onClick={() => setPoint(false)}
              >
                <RxCross2 size={24} className="opacity-50" color="white" />
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="uppercase font-ppsans text-[24px] font-[300]">
                  BitSport BITS CALCULATOR
                </div>
                <p className="text-[#666675]">
                  Calculate how many points you get from your Tweets
                  Engagements.
                </p>
                <p className="text-[#666675]">
                  Depending on your type of engagement, your BITS rewards
                  calculations will be as follows
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col gap-4 flex-grow border-[#FFFFFF1A] border-r-[1px] p-6 w-auto md:w-[35%]">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <CiHeart color="white" size={20} />
                    <div className="uppercase text-sm">likes</div>
                    <div className="uppercase text-sm"> - {likes / 10}</div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4">
                    <h3 className="font-medium m-0">0</h3>
                    <Slider
                      trackStyle={{
                        backgroundColor: "#878765",
                        height: 6,
                        boxShadow: `0 0 10px 0 #09090B`,
                      }}
                      railStyle={{ backgroundColor: "#2D3135", height: 6 }}
                      handleStyle={{
                        borderColor: "white",
                        height: 18,
                        width: 18,
                        backgroundColor: "#878765",
                      }}
                      value={likes}
                      onChange={(e) => setLikes(Math.ceil(Number(e) / 10) * 10)}
                    />
                    <h3 className="font-medium m-0">10</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <SlActionUndo color="white" size={16} />
                    <div className="uppercase text-sm">replies</div>
                    <div className="uppercase text-sm"> - {reply / 10}</div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4">
                    <h3 className="font-medium m-0">0</h3>
                    <Slider
                      trackStyle={{
                        backgroundColor: "#878765",
                        height: 6,
                        boxShadow: `0 0 10px 0 #09090B`,
                      }}
                      railStyle={{ backgroundColor: "#2D3135", height: 6 }}
                      handleStyle={{
                        borderColor: "white",
                        height: 18,
                        width: 18,
                        backgroundColor: "#878765",
                      }}
                      value={reply}
                      onChange={(e) => setReply(Math.ceil(Number(e) / 10) * 10)}
                    />
                    <h3 className="font-medium m-0">10</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <LuRepeat color="white" size={16} />
                    <div className="uppercase text-sm">reposts</div>
                    <div className="uppercase text-sm"> - {retweet / 10}</div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4">
                    <h3 className="font-medium m-0">0</h3>
                    <Slider
                      trackStyle={{
                        backgroundColor: "#878765",
                        height: 6,
                        boxShadow: `0 0 10px 0 #09090B`,
                      }}
                      railStyle={{ backgroundColor: "#2D3135", height: 6 }}
                      handleStyle={{
                        borderColor: "white",
                        height: 18,
                        width: 18,
                        backgroundColor: "#878765",
                      }}
                      value={retweet}
                      onChange={(e) =>
                        setRetweet(Math.ceil(Number(e) / 10) * 10)
                      }
                    />
                    <h3 className="font-medium m-0">10</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <BsChatSquareDots color="white" size={16} />
                    <div className="uppercase text-sm">quotes</div>
                    <div className="uppercase text-sm"> - {quoto / 10}</div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4">
                    <h3 className="font-medium m-0">0</h3>
                    <Slider
                      trackStyle={{
                        backgroundColor: "#878765",
                        height: 6,
                        boxShadow: `0 0 10px 0 #09090B`,
                      }}
                      railStyle={{ backgroundColor: "#2D3135", height: 6 }}
                      handleStyle={{
                        borderColor: "white",
                        height: 18,
                        width: 18,
                        backgroundColor: "#878765",
                      }}
                      value={quoto}
                      onChange={(e) => setQuoto(Math.ceil(Number(e) / 10) * 10)}
                    />
                    <h3 className="font-medium m-0">10</h3>
                  </div>
                </div>
              </div>
              <div className="flex-grow flex flex-col gap-4 p-6 justify-end">
                <div className="flex items-center gap-2 h-[47px]">
                  <CiHeart color="white" size={20} />
                  <div className="flex flex-col gap-1">
                    <div className="uppercase text-sm">{likes * 2} BITS</div>
                    <div className="text-[#666675] text-sm">
                      20 BITS per likes
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 h-[47px]">
                  <SlActionUndo color="white" size={16} />
                  <div className="flex flex-col gap-1">
                    <div className="uppercase text-sm">{reply * 5} BITS</div>
                    <div className="text-[#666675] text-sm">
                      50 BITS per repost
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 h-[47px]">
                  <LuRepeat color="white" size={16} />
                  <div className="flex flex-col gap-1">
                    <div className="uppercase text-sm">{retweet * 7} BITS</div>
                    <div className="text-[#666675] text-sm">
                      70 BITS per reply
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 h-[47px]">
                  <BsChatSquareDots color="white" size={16} />
                  <div className="flex flex-col gap-1">
                    <div className="uppercase text-sm">{quoto * 10} BITS</div>
                    <div className="text-[#666675] text-sm">
                      100 BITS per reply
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex py-4 px-8 border-t">
              <h2 className="text-white text-4xl font-semibold m-0">
                {likes * 2 + reply * 5 + retweet * 7 + quoto * 10}
              </h2>
            </div>
          </div>
        </div>
      )}

      {play && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[650px] max-md:w-[calc(100%-36px)] text-white z-[3] max-h-[calc(100vh-40px)] overflow-y-auto">
          <div className="flex border-[#ffffff42] border-[1px] relative bg-[#030408] sm:bg-[#0b0b14] backdrop-blur-[20px]">
            <div className="p-6 flex flex-col justify-between border-[#FFFFFF1A] border-b-[1px]">
              <div className="flex flex-col gap-[10px]">
                <div className="uppercase font-ppsans text-[24px] font-[300]">
                  How to Play: FarmEarning is the key:
                </div>
                <p className="text-sm m-0">
                  It&apos;s simple - just engage with @bitsportgaming on Twitter
                  (X)!
                </p>
                <p className="text-sm m-0">
                  Farmed BITS = $BITP tokens, to be claimed OR AirDropped.
                </p>
                <p className="text-sm m-0">
                  By farmearning BITS, you move up on your ranking. Each level
                  reached earns you rewards like : Tweet Doubler, Tweet
                  Trippler, Tweet Quad , QC (Quest Credits), BitPool NFTs
                </p>
                <p className="text-sm m-0">
                  You can earn BITS by interacting with Bitsport Booster Posts
                  (likes and replies, up to 1 reply per post)
                </p>
                <p className="text-sm m-0">
                  Booster posts will only be available for a limited period
                  after they’re posted. Engaging with them after that period
                  will not earn you BITS.
                </p>
                <p className="text-sm m-0">
                  Depending on your type of engagement, your Points rewards be
                  will be as follows:
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-grow px-4 my-4">
                <div className="flex gap-4 items-center text-sm">
                  <CiHeart color="white" size={20} />
                  <div>
                    <div className="first-letter:uppercase">likes</div>
                    <div className="text-[#666675]">20 BITS per like</div>
                  </div>
                </div>
                <div className="flex gap-4 items-center text-sm">
                  <SlActionUndo color="white" size={16} />
                  <div>
                    <div className="first-letter:uppercase">replies</div>
                    <div className="text-[#666675]">40 BITS per like</div>
                  </div>
                </div>
                <div className="flex gap-4 items-center text-sm">
                  <LuRepeat color="white" size={16} />
                  <div>
                    <div className="first-letter:uppercase">reposts</div>
                    <div className="text-[#666675]">50 BITS per like</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="text-sm m-0">
                  Boosted Post Tweeters (Higher following / more tweets) will
                  also receive a multiplier for engaging with Bitsport tweets.
                </p>

                <p className="text-sm m-0">
                  You may only participate with one BitPool account and a
                  Twitter account.
                </p>

                <p className="text-sm m-0">
                  If we suspect any user botting engagement, we will ban the
                  user completely from the campaign.
                </p>
              </div>
            </div>
            <div
              className="cursor-pointer absolute top-2 right-2"
              onClick={() => setPlay(false)}
            >
              <RxCross2 size={24} className="opacity-50" color="white" />
            </div>
          </div>
        </div>
      )}

      {(power || point || play || viewModal) && (
        <div
          className="fixed top-0 left-0 light-0 bg-[#00000012] backdrop-blur-[5px] w-screen h-screen z-[2]"
        // onClick={() => {
        //   setPlay(false);
        //   setPower(false);
        //   setPoint(false);
        //   setView(false);
        // }}
        ></div>
      )}
    </div>
  );
};

export default ViewInfo;

