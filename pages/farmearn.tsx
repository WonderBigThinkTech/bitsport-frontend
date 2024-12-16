import { Header } from "@/components";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { IState } from "@/store";
import { SERVER_URI } from "@/config";
import axios from "axios";
import { BsTwitter } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import ViewInfo from "@/components/FarmEarn";
import Admin from "@/components/Admin/admin";
import { authActions } from "@/store/auth";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

export default function ReferralPage() {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [tweetUser, setTweetUser] = useState<string>("");
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState<boolean>(false);
  const [isViewModal, setIsViewModal] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const [checkAdmin, setCheckAdmin] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (currentUser.role === 1) {
        setAdmin(true);
      }
    } else {
      localStorage.setItem("trypage", "farmearn");
      router.push("/?signin=true");
    }
  }, []);

  useEffect(() => {
    if (currentUser.role === 1 && !checkAdmin) {
      setAdmin(true);
    } else if (checkAdmin) {
      setAdmin(false);
    }

    if (currentUser && tweetUser === "" && !auth) {
      const getTwitAuth = async () => {
        const res = await axios.post(`${SERVER_URI}/getTwitAuth`, {
          userId: currentUser.id,
        });
        if (res.data.message === "Check") {
          setAuth(res.data.success);
          setIsViewModal(!res.data.success);
          if (res.data.success) {
            setTweetUser(currentUser.id);
          } else {
            setTweetUser("check");
          }
        }
      };

      getTwitAuth();
    }
  }, [currentUser, checkAdmin]);

  useEffect(() => {
    if (tweetUser === "check") {
      setCheck(true);
    }
  }, [tweetUser]);

  useEffect(() => {
    const signUpTwit = async () => {
      if (session) {
        let refId: string = "";
        if (
          localStorage.getItem("refId") &&
          localStorage.getItem("refId") != ""
        ) {
          //@ts-ignore
          refId = localStorage.getItem("refId");
        }
        //@ts-ignore
        const res = await axios.post(`${SERVER_URI}/signupTwit`, {
          userId: currentUser.id,
          // @ts-ignore
          twitterName: session.token.name,
          // @ts-ignore
          twitterId: session.token.sub,
          // @ts-ignore
          twitterAvatar: session.token.picture,
          // @ts-ignore
          twitterScreenName: session.token.profile.data.username,
          refId: refId,
        });

        if (res.data.success) {
          setAuth(res.data.success);
          setIsViewModal(res.data.success);
          setTweetUser(currentUser.id);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.data)));
        }
      }
    };

    if (check && session && !admin && !posted) {
      signUpTwit();
    }
  }, [session, check, admin]);

  return (
    <>
      {admin ? (
        <Admin setAdmin={setCheckAdmin} />
      ) : (currentUser.role === 0 && auth) ||
        (!admin && session && checkAdmin) ? (
        <ViewInfo
          viewModal={isViewModal}
          setView={setIsViewModal}
          userInfo={tweetUser}
          setPosted={setPosted}
        />
      ) : (
        <div className="grid grid-rows-[auto_1fr_auto] gap-4 md:gap-8 h-full p-4">
          <Header />
          <div className="text-white self-end">
            <div className="border border-white p-4 rounded-md mb-4 max-w-full md:max-w-[800px] mx-auto">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
                $BITP Farm-Earn - Engage on X (Twitter) to Start Farming $BITP
                in 3 simple steps
              </h3>
              <div className="flex justify-center flex-wrap">
                <div
                  onClick={() => signIn("twitter")}
                  className={`py-3 px-5 mr-4 referral-card max-w-full md:max-w-[300px] !flex-row ${
                    currentUser.airdropIndex !== 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <BsTwitter />
                  <span className="ml-2">
                    {currentUser.airdropIndex === 0 ? "Connect" : "Connected"}{" "}
                    Twitter
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-[70%] lg:w-[calc(100%-32px)] max-md:w-[50%] justify-self-center">
            <div className="grid grid-rows-[auto_auto_1fr] gap-1">
              <h2 className="text-4xl sm:text-5xl text-[#ce4765] font-bold m-0 text-center">
                01
              </h2>
              <h3 className="text-xl sm:text-2xl text-white font-semibold m-0 text-center">
                Sign up
              </h3>
              <h3 className="text-md sm:text-lg text-slate-600 font-medium m-0 text-center">
                Simply connect your Twitter to start Farm-Earning $BITP
              </h3>
            </div>
            <div className="grid grid-rows-[auto_auto_1fr] gap-1">
              <h2 className="text-4xl sm:text-5xl text-[#ce4765] font-bold m-0 text-center">
                02
              </h2>
              <h3 className="text-xl sm:text-2xl text-white font-semibold m-0 text-center">
                Create & Earn
              </h3>
              <h3 className="text-md sm:text-lg text-slate-600 font-medium m-0 text-center">
                Earn $BITP from your (X) Twitter content
              </h3>
            </div>
            <div className="grid grid-rows-[auto_auto_1fr] gap-1">
              <h2 className="text-4xl sm:text-5xl text-[#ce4765] font-bold m-0 text-center">
                03
              </h2>
              <h3 className="text-xl sm:text-2xl text-white font-semibold m-0 text-center">
                Get BITS = $BITP AirDrop
              </h3>
              <h3 className="text-md sm:text-lg text-slate-600 font-medium m-0 text-center">
                Every level you progress you win
              </h3>
            </div>
          </div>
        </div>
      )}
      <Footer farm={true} />
    </>
  );
}
