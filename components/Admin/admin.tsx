import { SERVER_URI } from "@/config";
import axios from "axios";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { FcCheckmark } from "react-icons/fc";
import { FaCheck } from "react-icons/fa";
import { notification } from "antd";

interface DataProps {
  content: string;
  endTime: number;
  tweetType: string;
  tweetId: string;
  imageLink: string;
  _id: string;
}

export default function Admin({
  setAdmin,
}: {
  setAdmin: (data: boolean) => void;
}) {
  const [dataList, setDataList] = useState<DataProps[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  const [viewField, setViewField] = useState<boolean>(false);
  const [type, setType] = useState<string>("Farm");
  const [content, setContent] = useState<string>("");
  const [tweetId, setTweetId] = useState<string>("");
  const [preContent, setPreContent] = useState<string>("");
  const [imageLink, setImageLink] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [changeType, setChangeType] = useState<number>(-1);
  const [edit, setEdit] = useState<boolean>(false);

  const [normalLike, setNomalLike] = useState<number>(0);
  const [normalRepost, setNomalRepost] = useState<number>(0);
  const [normalReplies, setNomalReplies] = useState<number>(0);
  const [normalQuotes, setNomalQuotes] = useState<number>(0);
  const [farmearnLike, setFarmearnLike] = useState<number>(0);
  const [farmearnRepost, setFarmearnRepost] = useState<number>(0);
  const [farmearnReplies, setFarmearnReplies] = useState<number>(0);
  const [farmearnQuotes, setFarmearnQuotes] = useState<number>(0);
  const [boosterLike, setBoosterLike] = useState<number>(0);
  const [boosterRepost, setBoosterRepost] = useState<number>(0);
  const [boosterReplies, setBoosterReplies] = useState<number>(0);
  const [boosterQuotes, setBoosterQuotes] = useState<number>(0);

  const [refreshTime, setRefreshTime] = useState<number>(0);
  const [refPoint, setRefPoint] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(`${SERVER_URI}/getEarn`);
      if (data) {
        setDataList(data.data);
      }
      const bonus = await axios.get(`${SERVER_URI}/getBonus`);
      if (bonus && bonus.data.length > 0) {
        setNomalLike(bonus.data[0].matrix[0][0]);
        setNomalRepost(bonus.data[0].matrix[0][1]);
        setNomalReplies(bonus.data[0].matrix[0][2]);
        setNomalQuotes(bonus.data[0].matrix[0][3]);
        setFarmearnLike(bonus.data[0].matrix[1][0]);
        setFarmearnRepost(bonus.data[0].matrix[1][1]);
        setFarmearnReplies(bonus.data[0].matrix[1][2]);
        setFarmearnQuotes(bonus.data[0].matrix[1][3]);
        setBoosterLike(bonus.data[0].matrix[2][0]);
        setBoosterRepost(bonus.data[0].matrix[2][1]);
        setBoosterReplies(bonus.data[0].matrix[2][2]);
        setBoosterQuotes(bonus.data[0].matrix[2][3]);
      }
      const content = await axios.get(`${SERVER_URI}/getPost`);
      if (content && content.data.length > 0) {
        setPreContent(content.data[0].content);
      }
      const refresh = await axios.get(`${SERVER_URI}/refreshTime`);
      console.log("getting refresh time ==> ", refresh.data.refreshTime);
      if (refresh) {
        setRefreshTime(refresh.data.refreshTime);
      }
      const refpoint = await axios.get(`${SERVER_URI}/getRefPoint`);
      console.log("getting refPoint time ==> ", refpoint.data.refPoint);
      if (refpoint) {
        setRefPoint(refpoint.data.refPoint);
      }
    };
    getData();
  }, []);

  //   useEffect(() => {
  //     if (toggle) {
  //       setViewField(false);
  //       setSelected(-1);
  //     }
  //   }, [toggle]);

  const getTime = (time: number) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTime = `${
      date.getMonth() + 1
    }/${date.getDate()}, ${hours}:${formattedMinutes}`;
    return formattedTime;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    const formattedDateString = `${year}-${month}-${day}T${hour}:${minute}`;

    return formattedDateString;
  };

  const formatContent = (data: string) => {
    return data.length >= 15 ? data.slice(0, 8) + "..." + data.slice(-5) : data;
  };

  const editHandler = () => {
    if (selected === -1) return;
    setType(dataList[selected].tweetType);
    setContent(dataList[selected].content);
    setTweetId(dataList[selected].tweetId);
    setTime(formatTimestamp(dataList[selected].endTime));
    setViewField(true);
  };

  const createHandler = async () => {
    setType("Farm");
    setViewField(true);
    setSelected(-1);
  };

  const deleteHandler = async () => {
    if (selected === -1) return;
    const res = await axios.post(`${SERVER_URI}/delEarn`, {
      id: dataList[selected]._id,
    });
    if (res) {
      setDataList((prev) => {
        let temp = [...prev];
        temp = temp.filter((item) => item._id !== res.data._id);
        return temp;
      });
    }
  };

  const exitHandler = () => {
    setAdmin(true);
  };

  const submitHandler = async () => {
    if (selected === -1) {
      const res = await axios.post(`${SERVER_URI}/addearnTweet`, {
        content: content,
        endTime: new Date(time).getTime(),
        tweetId: tweetId,
        tweetType: type,
        imageLink: imageLink,
      });

      if (res) {
        setDataList((prev) => [
          ...prev,
          {
            content: res.data.content,
            endTime: res.data.endTime,
            tweetType: res.data.tweetType,
            tweetId: res.data.tweetId,
            imageLink: res.data.imageLink,
            _id: res.data._id,
          },
        ]);
      }
      setViewField(false);
    } else {
      const res = await axios.post(`${SERVER_URI}/updateEarn`, {
        id: dataList[selected]._id,
        content: content,
        endTime: new Date(time).getTime(),
        tweetId: tweetId,
        tweetType: type,
        imageLink: imageLink,
      });

      if (res) {
        setDataList((prev) => {
          const temp = [...prev];
          temp[selected].content = res.data.content;
          temp[selected].endTime = res.data.endTime;
          temp[selected].tweetType = res.data.tweetType;
          temp[selected].tweetId = res.data.tweetId;
          temp[selected].imageLink = res.data.imageLink;
          return temp;
        });
      }
      setViewField(false);
    }
  };

  const submitPreContent = async () => {
    //preContent
    const res = await axios.post(`${SERVER_URI}/createPost`, {
      content: preContent,
    });
    if (res) {
      notification.success({ message: "New prepost successfully set!" });
    }
  };

  const submitRefreshTime = async () => {
    try {
      //preContent
      const res = await axios.post(`${SERVER_URI}/setRefreshTime`, {
        newTime: refreshTime,
      });
      if (res) {
        notification.success({ message: "Refresh time successfully set!" });
      }
    } catch (error) {
      console.log("setting refresh time erro ==> ", error);
    }
  };

  const submitRefPoint = async () => {
    try {
      //preContent
      const res = await axios.post(`${SERVER_URI}/setRefPoint`, {
        newPoint: refPoint,
      });
      if (res) {
        notification.success({ message: "Referral point successfully set!" });
      }
    } catch (error) {
      console.log("setting referral point error ==> ", error);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const editPriceHandler = () => {
    setEdit(!edit);
  };

  const submitPriceHandler = async () => {
    const bonus = await axios.post(`${SERVER_URI}/saveBonus`, {
      matrix: [
        [normalLike, normalRepost, normalReplies, normalQuotes],
        [farmearnLike, farmearnRepost, farmearnReplies, farmearnQuotes],
        [boosterLike, boosterRepost, boosterReplies, boosterQuotes],
      ],
    });

    console.log(bonus.data.matrix);

    setNomalLike(bonus.data.matrix[0][0]);
    setNomalRepost(bonus.data.matrix[0][1]);
    setNomalReplies(bonus.data.matrix[0][2]);
    setNomalQuotes(bonus.data.matrix[0][3]);
    setFarmearnLike(bonus.data.matrix[1][0]);
    setFarmearnRepost(bonus.data.matrix[1][1]);
    setFarmearnReplies(bonus.data.matrix[1][2]);
    setFarmearnQuotes(bonus.data.matrix[1][3]);
    setBoosterLike(bonus.data.matrix[2][0]);
    setBoosterRepost(bonus.data.matrix[2][1]);
    setBoosterReplies(bonus.data.matrix[2][2]);
    setBoosterQuotes(bonus.data.matrix[2][3]);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl">
      <div className="w-[600px] rounded-lg p-8 bg-slate-700 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-3xl font-bold m-0">
            {!toggle ? "Post content management" : "Edit value"}
          </h2>
          <div
            className="w-[44px] h-[20px] relative rounded-full flex items-center p-[2px] bg-gray-500 cursor-pointer"
            onClick={() => setToggle(!toggle)}
          >
            <div
              className={`w-4 h-4 rounded-full bg-green-600 duration-300 ${
                toggle ? "translate-x-[24px]" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        {!toggle ? (
          <>
            <div className="h-[300px] rounded-lg bg-zinc-200 overflow-hidden p-5 grid grid-rows-[auto_1fr]">
              <div className="grid grid-cols-[5%_30%_15%_25%_25%] border-b-2 border-b-black w-full">
                <h1></h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0">
                  Content
                </h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0">
                  Type
                </h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0">
                  End Time
                </h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0">
                  Tweet ID
                </h1>
              </div>
              <div className="overflow-y-scroll h-full w-full flex flex-col">
                {dataList.map((data, index) => (
                  <div
                    className="grid grid-cols-[5%_30%_15%_20%_30%] border-b border-b-black py-1 border-opacity-40"
                    key={index}
                  >
                    <div
                      className="flex items-center justify-center w-4 h-4 rounded-sm bg-slate-300 justify-self-center self-center cursor-pointer"
                      onClick={() => setSelected(index)}
                    >
                      {selected === index && <FcCheckmark size={24} />}
                    </div>
                    <h1 className="text-gray-900 text-xl font-semibold m-0">
                      {formatContent(data.content)}
                    </h1>
                    <h1 className="text-gray-900 text-xl font-semibold m-0">
                      {data.tweetType}
                    </h1>
                    <h1 className="text-gray-900 text-xl font-semibold m-0">
                      {getTime(data.endTime)}
                    </h1>
                    <h1 className="text-gray-900 text-xl font-semibold m-0">
                      {formatContent(data.tweetId)}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                className="rounded-sm cursor-pointer bg-lime-700 text-2xl py-1 font-bold"
                onClick={editHandler}
              >
                Edit
              </button>
              <button
                className="rounded-sm cursor-pointer bg-sky-700 text-2xl py-1 font-bold"
                onClick={createHandler}
              >
                Create
              </button>
              <button
                className="rounded-sm cursor-pointer bg-red-700 text-2xl py-1 font-bold"
                onClick={deleteHandler}
              >
                Delete
              </button>
              <button
                className="rounded-sm cursor-pointer bg-orange-700 text-2xl py-1 font-bold"
                onClick={exitHandler}
              >
                Exit
              </button>
            </div>
            {viewField && (
              <div className="flex flex-col gap-4 items-center">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid grid-rows-[auto_1fr] gap-1">
                    <h2 className="text-2xl font-semibold text-white m-0">
                      Type
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="grid grid-cols-[auto_1fr] gap-2 cursor-pointer self-center"
                        onClick={() => setType("Farm")}
                      >
                        <div className="rounded-full bg-slate-300 w-4 h-4 self-center justify-self-center">
                          {type === "Farm" && (
                            <FaCheck size={20} color="green" />
                          )}
                        </div>
                        <h2 className="text-white text-2xl m-0">Farm</h2>
                      </div>
                      <div
                        className="grid grid-cols-[auto_1fr] gap-2 cursor-pointer self-center"
                        onClick={() => setType("Booster")}
                      >
                        <div className="rounded-full bg-slate-300 w-4 h-4 self-center justify-self-center">
                          {type === "Booster" && (
                            <FaCheck size={20} color="green" />
                          )}
                        </div>
                        <h2 className="text-white text-2xl m-0">Booster</h2>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-white m-0">
                      End Time
                    </h2>
                    <input
                      type="datetime-local"
                      className="bg-white rounded-sm p-2 text-2xl text-gray-700"
                      onChange={(e) => setTime(e.target.value)}
                      value={time}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-2xl font-semibold text-white m-0">
                      Content
                    </h2>
                    <input
                      type="text"
                      className="bg-white rounded-sm p-2 text-2xl text-gray-700"
                      placeholder="Please input post ID."
                      onChange={(e) => setContent(e.target.value)}
                      value={content}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-2xl font-semibold text-white m-0">
                      Id
                    </h2>
                    <input
                      type="text"
                      className="bg-white rounded-sm p-2 text-2xl text-gray-700"
                      placeholder="Please input post ID."
                      onChange={(e) => setTweetId(e.target.value)}
                      value={tweetId}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <h2 className="text-2xl font-semibold text-white m-0">
                    ImageLink
                  </h2>
                  <input
                    type="text"
                    className="bg-white rounded-sm p-2 text-2xl text-gray-700"
                    placeholder="Please input your image link."
                    onChange={(e) => setImageLink(e.target.value)}
                    value={imageLink}
                  />
                </div>
                <button
                  className="rounded-sm text-white font-bold uppercase text-3xl py-2 [width:fit-content] px-4 bg-lime-600 m-0"
                  onClick={submitHandler}
                >
                  submit
                </button>
              </div>
            )}
            <div className="grid grid-cols-[4fr_1fr] gap-3">
              <div className="flex flex-col gap-1 w-full">
                <h2 className="text-2xl font-semibold text-white m-0">
                  Content
                </h2>
                <textarea
                  // @ts-ignore
                  cols="30"
                  // @ts-ignore
                  rows="3"
                  className="bg-white rounded-sm p-2 text-2xl text-gray-700 font-medium"
                  onChange={(e) => setPreContent(e.target.value)}
                  value={preContent}
                />
              </div>
              <button
                className="rounded-sm text-white font-bold uppercase text-3xl py-2 px-4 bg-lime-600 m-0 self-end"
                onClick={submitPreContent}
              >
                submit
              </button>
            </div>
            <div className="grid grid-cols-[4fr_1fr] gap-3">
              <div className="flex flex-col gap-1 w-full">
                <h2 className="text-2xl font-semibold text-white m-0">
                  Refresh Time
                </h2>
                <input
                  className="bg-white rounded-sm p-2 text-2xl text-gray-700 font-medium"
                  onChange={(e: any) => setRefreshTime(e.target.value)}
                  type="number"
                  value={refreshTime}
                />
              </div>
              <button
                className="rounded-sm text-white font-bold uppercase text-3xl py-2 px-4 bg-lime-600 m-0 self-end"
                onClick={submitRefreshTime}
              >
                submit
              </button>
            </div>
            <div className="grid grid-cols-[4fr_1fr] gap-3">
              <div className="flex flex-col gap-1 w-full">
                <h2 className="text-2xl font-semibold text-white m-0">
                  Referral Point
                </h2>
                <input
                  className="bg-white rounded-sm p-2 text-2xl text-gray-700 font-medium"
                  onChange={(e: any) => setRefPoint(e.target.value)}
                  type="number"
                  value={refPoint}
                />
              </div>
              <button
                className="rounded-sm text-white font-bold uppercase text-3xl py-2 px-4 bg-lime-600 m-0 self-end"
                onClick={submitRefPoint}
              >
                submit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="h-[300px] rounded-lg bg-zinc-200 overflow-hidden p-2 grid grid-rows-[repeat(4,1fr)]">
              <div className="grid grid-cols-[repeat(4,1fr)] border border-black border-b-0">
                <h1 className="text-gray-900 text-xl font-semibold m-0 justify-self-center self-center">
                  Likes
                </h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0 justify-self-center self-center">
                  Repost
                </h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0 justify-self-center self-center">
                  Replies
                </h1>
                <h1 className="text-gray-900 text-xl font-semibold m-0 justify-self-center self-center">
                  Quotes
                </h1>
              </div>
              <div
                className={`relative grid grid-cols-[repeat(4,1fr)] border border-black border-b-0 cursor-pointer ${
                  changeType === 0
                    ? edit
                      ? "bg-yellow-300"
                      : "bg-yellow-200"
                    : "bg-yellow-100"
                }`}
              >
                <input
                  type="text"
                  className={`w-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 0 && edit)}
                  value={normalLike}
                  onChange={(e) => setNomalLike(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 0 && edit)}
                  value={normalRepost}
                  onChange={(e) => setNomalRepost(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 0 && edit)}
                  value={normalReplies}
                  onChange={(e) => setNomalReplies(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-none focus:outline-none`}
                  disabled={!(changeType === 0 && edit)}
                  value={normalQuotes}
                  onChange={(e) => setNomalQuotes(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className={`absolute top-0 left-0 right-0 bottom-0 peer ${
                    edit && "hidden"
                  }`}
                  onClick={() => {
                    if (!edit) setChangeType(0);
                  }}
                ></div>
              </div>
              <div
                className={`relative grid grid-cols-[repeat(4,1fr)] border border-black border-b-0 cursor-pointer ${
                  changeType === 1
                    ? edit
                      ? "bg-lime-300"
                      : "bg-lime-200"
                    : "bg-lime-100"
                }`}
              >
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 1 && edit)}
                  value={farmearnLike}
                  onChange={(e) => setFarmearnLike(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 1 && edit)}
                  value={farmearnRepost}
                  onChange={(e) => setFarmearnRepost(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 1 && edit)}
                  value={farmearnReplies}
                  onChange={(e) => setFarmearnReplies(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-none focus:outline-none`}
                  disabled={!(changeType === 1 && edit)}
                  value={farmearnQuotes}
                  onChange={(e) => setFarmearnQuotes(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className={`absolute top-0 left-0 right-0 bottom-0 peer ${
                    edit && "hidden"
                  }`}
                  onClick={() => {
                    if (!edit) setChangeType(1);
                  }}
                ></div>
              </div>
              <div
                className={`relative grid grid-cols-[repeat(4,1fr)] border border-black cursor-pointer ${
                  changeType === 2
                    ? edit
                      ? "bg-cyan-300"
                      : "bg-cyan-200"
                    : "bg-cyan-100"
                }`}
              >
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 2 && edit)}
                  value={boosterLike}
                  onChange={(e) => setBoosterLike(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 2 && edit)}
                  value={boosterRepost}
                  onChange={(e) => setBoosterRepost(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-r border-black focus:outline-none`}
                  disabled={!(changeType === 2 && edit)}
                  value={boosterReplies}
                  onChange={(e) => setBoosterReplies(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  className={`w-full h-full px-4 py-2 bg-transparent text-center text-gray-900 font-semibold border-none focus:outline-none`}
                  disabled={!(changeType === 2 && edit)}
                  value={boosterQuotes}
                  onChange={(e) => setBoosterQuotes(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className={`absolute top-0 left-0 right-0 bottom-0 peer ${
                    edit && "hidden"
                  }`}
                  onClick={() => {
                    if (!edit) setChangeType(2);
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="rounded-sm cursor-pointer bg-lime-700 text-2xl py-1 font-bold"
                onClick={editPriceHandler}
              >
                {edit ? "Change" : "Edit"}
              </button>
              <button
                className="rounded-sm cursor-pointer bg-sky-700 text-2xl py-1 font-bold"
                onClick={submitPriceHandler}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
