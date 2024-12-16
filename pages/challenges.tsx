import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import PoolComponent from "@/components/PoolChallenge";
import { SERVER_URI } from "@/config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { poolchallengeActions } from "@/store/poolchallenge";
import { IState } from "@/store";
import isEmpty from "@/validation/is-empty";

const challenges = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [data, setData] = useState<object[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useSelector((state: IState) => state.auth);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { model } = useSelector((state: IState) => state.poolchallenge);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPoolChallengeData = () => {
    axios.get(`${SERVER_URI}/pool-game/index`).then((res) => {
      dispatch(poolchallengeActions.setModalData(res.data.models));
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getPoolChallengeData();
  }, [getPoolChallengeData]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log(model);
    setData(model);
  }, [model]);

  const filteredMyData = data.filter((item: any) => {
    return currentUser.id === item?.create_userid?._id;
  });

  const filteredOtherData = data.filter((item: any) => {
    return currentUser.id !== item?.create_userid?._id;
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tabflag, setTabflag] = useState(false);

  return (
    <div className="w-full">
      <Header />
      <section
        className="mt-6 px-3 xl:px-3 xl:mt-0 xl:container xl:mx-auto"
        style={{ marginTop: "1.5rem" }}
      >
        <h3 className="xl:text-2xl text-xl text-white font-bold ">
          Pool Challenges
        </h3>
        <p className="text-secondary-200 xl:text-sm text-xs">
          Accept and play some of the below F2E (Free to Earn) modes, earn $BITP
          and other Crypto
        </p>

        <div className="challenge-modal-tab w-[400px] mt-10 relative">
          <div
            className={`bg-[#1e2126] h-12 w-[200px] rounded-lg absolute ${
              !tabflag ? "left-0" : "left-[200px]"
            }`}
            style={{ transition: "all 0.3s" }}
          ></div>
          <div
            className={`challenge-modal-tab-item text-xl font-medium ${
              !tabflag ? "challenge-modal-tab-item-active" : ""
            } h-12 text-primary-750`}
            onClick={() => setTabflag(false)}
          >
            Pool Arena
          </div>
          <div
            className={`challenge-modal-tab-item text-xl font-medium ${
              tabflag ? "challenge-modal-tab-item-active" : ""
            } h-12 text-primary-750`}
            onClick={() => setTabflag(true)}
          >
            My Game Center
          </div>
        </div>

        <div className="mt-5 xl:gap-11 flex w-full flex-col xl:flex-row  items-start justify-between">
          <div className="flex w-full flex-col gap-2">
            {tabflag ? (
              <>
                {filteredMyData.length > 0 &&
                  filteredMyData.map((item: any, index) => {
                    if (item.status_num <= 1) {
                      return (
                        <PoolComponent
                          key={index}
                          quest={item}
                          index={index}
                          tabflag={tabflag}
                        />
                      );
                    }
                  })}
              </>
            ) : (
              <>
                {filteredOtherData.length > 0 &&
                  filteredOtherData.map((item: any, index) => {
                    if (item.status_num <= 1) {
                      return (
                        <PoolComponent
                          key={index}
                          quest={item}
                          index={index}
                          tabflag={tabflag}
                        />
                      );
                    }
                  })}
              </>
            )}

            {/* {!isEmpty(data) &&
              data.map((item: any, index) => {
                if (item.status_num <= 1)
                  return (
                    <PoolComponent key={index} quest={item} index={index} />
                  );
              })} */}

            <Pagination />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default challenges;
