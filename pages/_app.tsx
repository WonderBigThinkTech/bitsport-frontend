import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { DesktopNav } from "@/components/Nav";
import jwtDecode from "jwt-decode";
import { SessionProvider } from "next-auth/react";


import store from "../store";

import "@/styles/globals.css";
import "@/styles/challengeModal.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "react-responsive-pagination/themes/classic.css";

import { useEffect } from "react";

export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  const router = useRouter();
  const currentUrl = router.asPath;

  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined" || !localStorage) {
      return "";
    }
    return window.localStorage.getItem(key);
  };
  const token = getFromLocalStorage("token");
  const currentUser: any = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (currentUrl.indexOf("/game?cid=") > -1) {
      if (!currentUser || Object.keys(currentUser).length === 0) {
        // router.push("/");
        window.localStorage.setItem("redirectedFromGame", "true");
        window.localStorage.setItem("redirectedFromGameLink", "true");
        window.location.replace("/");
      } else {
        document
          .getElementById("right-panel-container")
          ?.classList.add("flow-y-none");
      }
    } else {
      document
        .getElementById("right-panel-container")
        ?.classList.remove("flow-y-none");
    }
  }, [currentUrl]);

  return (
    <Provider store={store}>
      <div className="flex xl:bg-primary-50 bg-primary-100 min-h-screen font-Rajdhani">
        <DesktopNav />
        <div
          className="max-h-screen overflow-auto w-full"
          id="right-panel-container"
        >
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </div>
      </div>
    </Provider>
  );
}
