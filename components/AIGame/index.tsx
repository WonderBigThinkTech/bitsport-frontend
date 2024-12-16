import { Header } from "@/components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store";
import { notification } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { SERVER_URI } from "@/config";
import FullScreen from "@/public/full-screen.svg";
import jwtDecode from "jwt-decode";
import { authActions } from "@/store/auth";

export default function AIGameComponent() {
  const [uid, setUid] = useState("");
  const [cid, setCid] = useState("");
  const router = useRouter();
  const { currentUser } = useSelector((state: IState) => state.auth);
  const dispatch = useDispatch();

  const requestFullScreen = () => {
    const elem: any = document.getElementById("iframe");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  useEffect(() => {
    window.onmessage = (e) => {
      const elementdata: any = document.querySelector("#iframe_poolgame");
      if (e.data.name === "gameconnected") {
        const msg_data = {
          name: "start_game_first",
          currentUser: currentUser,
          cid: window.localStorage.getItem("cid"),
        };
        elementdata.contentWindow.postMessage(msg_data, "*");
      } else if (e.data.name === "gameendstatus") {
        setTimeout(() => {
          router.push("/challenges");
        }, 5000);
        axios
          .post(`${SERVER_URI}/pool-game/end`, e.data)
          .then((res) => {
            localStorage.setItem("token", res.data.token);
            dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(e.data);
      } else if (e.data.name === "gamedisconnected") {
        alert(e.data.cid);
      }
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      notification.warning({
        message: "Warning!",
        description: "Please Login!",
      });
      router.push("/");
    }

    const getFromLocalStorage = (key: string) => {
      if (!key || typeof window === "undefined" || !localStorage) {
        return "";
      }
      return window.localStorage.getItem(key);
    };

    const cid: any = getFromLocalStorage("cid");
    // const { cid } = router.query;
    setCid(String(cid));
    setUid(String(currentUser.index));

    // const cid: any = getFromLocalStorage("cid");
    // setCid(cid);
    // setUid(currentUser.id);
  }, [currentUser]);

  return (
    <div className="w-full absolute xl:relative top-0 left-0 h-full">
      <Header />
      <div className="min-h-90vh w-full bg-white relative">
        <Image
          priority={true}
          height={75}
          width={79}
          src={FullScreen}
          alt="full screen"
          className="cursor-pointer z-50 absolute bottom-10 right-0"
          onClick={requestFullScreen}
        />
        {cid && (
          <iframe
            src={`https://portal.bitpool.gg/?c=${cid}&u=${uid}`}
            id="iframe_poolgame"
            className="w-full absolute top-0 left-0 h-full"
          ></iframe>
        )}
      </div>
    </div>
  );
}

function getFromLocalStorage(arg0: string) {
  throw new Error("Function not implemented.");
}
