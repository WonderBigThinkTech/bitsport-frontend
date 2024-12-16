import { Swap as SwapI, SwapArrow, SwapIcon, SwapTo } from "@/public/icons";
import Image from "next/image";
import QIC from "@/public/qc.png";
import USDT from "@/public/usdt.png";
import Paypal from "@/public/paypal.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";
import CAKE from "@/public/cake.png";
import SuccessIcon from "@/public/success.png";
import FailedIcon from "@/public/failed.png";
import { useEffect, useRef, useState } from "react";
import Select from "@/components/Select";
import Axios from "axios";
import { useSelector } from "react-redux";
import { IState } from "@/store";
import { SERVER_URI } from "@/config";
import { notification } from "antd";
import { getCake } from "@/service/helper";

const itemsFrom = [
  {
    icon: BUSD,
    name: "BUSD",
    ratio: 1,
  },
  {
    icon: USDT,
    name: "USDT",
    ratio: 1,
  },
  {
    icon: CAKE,
    name: "CAKE",
    ratio: 2,
  },
  {
    icon: Paypal,
    name: "USD",
    ratio: 1,
  },
  {
    icon: BITP,
    name: "BITP",
    ratio: 0.06,
  },
];

const itemsTo = [
  {
    icon: BUSD,
    name: "BUSD",
    ratio: 1,
  },
  {
    icon: USDT,
    name: "USDT",
    ratio: 1,
  },
  {
    icon: CAKE,
    name: "CAKE",
    ratio: 2,
  },
  {
    icon: Paypal,
    name: "USD",
    ratio: 1,
  },
  {
    icon: BITP,
    name: "BITP",
    ratio: 0.06,
  },
  {
    icon: QIC,
    name: "Quest Credit",
    ratio: 3,
  },
];

const Swap = () => {
  const [step, setStep] = useState(0);

  const next = (num?: number) => {
    if (num !== undefined) {
      setStep(step - 1);
    } else {
      setStep(step + 1);
    }
  };

  const components = [
    // eslint-disable-next-line react/jsx-key
    <SwapCoin next={next} />,
    // eslint-disable-next-line react/jsx-key
    <Success next={next} isSuccessful={true} />,
    // eslint-disable-next-line react/jsx-key
    <Success next={next} isSuccessful={false} />,
    // eslint-disable-next-line react/jsx-key
    <SwapTransactions />,
  ];
  return <div className="w-full xl:px-3">{components[step]}</div>;
};

export default Swap;

const SwapCoin = ({ next }: { next: (num?: number) => void }) => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [coinFrom, setCoinFrom] = useState("BUSD");
  const [coinTo, setCoinTo] = useState("BUSD");
  // const iconFrom = useRef<object>({});
  const [iconFrom, setIconFrom] = useState<any>();
  // const iconTo = useRef<Object>({});
  const [iconTo, setIconTo] = useState<any>();
  const [fromTokenAmount, setFromTokenAmount] = useState(0);
  const [toTokenAmount, setToTokenAmount] = useState(0);
  const [cakePrice, setCakePrice] = useState(1);

  useEffect(() => {
    setIconFrom(itemsFrom.filter((f) => f.name === coinFrom)[0].icon);
    setIconTo(itemsTo.filter((f) => f.name === coinTo)[0].icon);
  }, [coinFrom, coinTo]);

  useEffect(() => {
    getCakePrice();
  }, []);

  useEffect(() => {
    itemsFrom[2].ratio = cakePrice;
    itemsTo[2].ratio = cakePrice;
  }, [cakePrice]);

  const getCakePrice = async () => {
    getCake().then((price) => {
      setCakePrice(price);
    });
  };

  useEffect(() => {
    let ratioFrom = itemsFrom.filter((item) => item.name == coinFrom)[0].ratio;
    let ratioTo = itemsTo.filter((item) => item.name == coinTo)[0].ratio;
    let toTokenVal = (fromTokenAmount * ratioFrom) / ratioTo;
    setToTokenAmount(toTokenVal);
  }, [fromTokenAmount, coinFrom]);

  useEffect(() => {
    let ratioFrom = itemsFrom.filter((item) => item.name == coinFrom)[0].ratio;
    let ratioTo = itemsTo.filter((item) => item.name == coinTo)[0].ratio;
    let fromTokenVal = (toTokenAmount * ratioTo) / ratioFrom;
    setFromTokenAmount(fromTokenVal);
  }, [toTokenAmount, coinTo]);

  const onRefreshHandler = () => {
    setFromTokenAmount(0);
    setToTokenAmount(0);
    setCoinFrom("BUSD");
    setCoinTo("BUSD");
  };

  const onSwapButtonClicked = () => {
    if (coinFrom == coinTo) {
      notification.warning({
        message: "Warning!",
        description: "Please choose differnt coins to swap",
      });
      return;
    }
    if (fromTokenAmount == 0) {
      notification.warning({
        message: "Warning!",
        description: "Please input token amount",
      });
      return;
    } else if (fromTokenAmount < 0) {
      notification.warning({
        message: "Warning!",
        description: "Invalid token amount",
      });
      return;
    }
    const swapinfo = {
      user: currentUser.id,
      coinFrom,
      fromTokenAmount,
      coinTo,
      toTokenAmount,
    };

    Axios.post(`${SERVER_URI}/swap`, swapinfo).then((res) => {
      if (res.data.success) {
        notification.success({
          message: "Success!",
          description: res.data.message,
        });
      } else {
        notification.warning({
          message: "Warning!",
          description: res.data.message,
        });
      }
    });
    // next();
  };

  const onSwapInputValueHandler = () => {
    setCoinFrom(coinTo);

    setCoinTo(coinFrom);
    setFromTokenAmount(toTokenAmount);
    setToTokenAmount(fromTokenAmount);
  };

  return (
    <div>
      <div className="lg:text-2xl text-xl font-bold text-primary-900">SWAP</div>
      <div className="relative">
        <div className="mt-4 flex justify-between items-center">
          <div className="lg:text-lg text-base font-bold text-primary-450">
            SWAP TOKENS IN AN INSTANT
          </div>
          <div onClick={() => onRefreshHandler()}>
            <SwapI />
          </div>
        </div>
        <div className="absolute opacity-40 right-0 lg:-left-8 mt-5 lg:w-modal w-full thin-line bg-white" />
      </div>
      <div className="mt-24 flex items-center justify-between gap-2">
        <Select
          key={0}
          name={coinFrom}
          icon={
            iconFrom
              ? iconFrom
              : itemsFrom.filter((f) => f.name === coinFrom)[0].icon
          }
          handleChange={(value) => {
            setCoinFrom(value);
          }}
          items={itemsFrom}
          label="SWAP FROM"
        />
        <input
          type="number"
          placeholder="0.00"
          className="bg-secondary-400 text-xl text-right px-4 h-12 lg:w-60 lg:h-14 placeholder:text-white placeholder:font-medium font-medium text-white rounded border-none outline-none"
          value={fromTokenAmount}
          onChange={(e) => setFromTokenAmount(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-center items-center mt-14">
        <div onClick={() => onSwapInputValueHandler()}>
          <SwapIcon />
        </div>
      </div>
      <div className="mt-14 flex items-center justify-between gap-2">
        <Select
          key={0}
          name={coinTo}
          icon={
            iconTo ? iconTo : itemsTo.filter((f) => f.name === coinTo)[0].icon
          }
          handleChange={(value) => {
            setCoinTo(value);
          }}
          items={itemsTo}
          label="SWAP TO"
        />
        <input
          type="number"
          placeholder="0.00"
          className="bg-secondary-400 text-xl text-right px-4 h-12 lg:w-60 lg:h-14 placeholder:text-white placeholder:font-medium font-medium text-white rounded border-none outline-none"
          value={toTokenAmount}
          onChange={(e) => setToTokenAmount(Number(e.target.value))}
        />
      </div>

      <button
        onClick={() => onSwapButtonClicked()}
        className="mt-14 bg-secondary-300 text-white w-full rounded font-bold text-xl h-14"
      >
        SWAP
      </button>
    </div>
  );
};

const Success = ({
  next,
  isSuccessful,
}: {
  next: (num?: number) => void;
  isSuccessful: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="lg:w-96 flex flex-col justify-center items-center">
        <Image
          className="h-20 mt-10 w-20 lg:h-28 lg:w-28 object-contain"
          priority={true}
          src={isSuccessful ? SuccessIcon : FailedIcon}
          alt="success"
        />
        <h3 className="text-primary-900 mt-10 font-bold text-3xl">
          {isSuccessful ? "SWAP SUCCESSFUL" : "SWAP UNSUCCESSFUL"}
        </h3>
        <p className="mt-3 text-sm font-bold text-primary-450 text-center">
          THE TRANSACTION HAS BEEN SUCCESSFULLY PROCESSED. THE TRANSFER MAY
          STILL BE IN PROCESS. PLEASE CHECK THE TRANSACTION RECORD LATER.
        </p>
        <div className="pb-7 gap-10 mt-3 flex justify-between px-5 items-center">
          <div>
            <p className="mt-3 text-left text-sm font-bold text-primary-450">
              FROM
            </p>
            <p className="text-white font-medium lg:text-xl text-base">
              0.00 BUSD
            </p>
          </div>
          <SwapTo />
          <div>
            <p className="mt-3 text-left text-sm font-bold text-primary-450">
              TO
            </p>
            <p className="text-white font-medium lg:text-xl text-base">
              0.00 USDT
            </p>
          </div>
        </div>
        <div className="opacity-40 w-full thin-line bg-white" />
      </div>
      <div className="mt-16 flex justify-between gap-5">
        <button
          onClick={() => next(0)}
          className=" bg-secondary-300 px-5 lg:px-8 rounded font-bold text-base h-12"
        >
          BACK TO SWAP
        </button>
        <button
          onClick={() => next()}
          className=" bg-primary-1150 whitespace-nowrap px-5 lg:px-8 rounded font-bold text-base h-12"
        >
          VIEW SWAP HISTORY
        </button>
      </div>
    </div>
  );
};

const SwapTransactions = () => {
  return (
    <div className="pb-32">
      <div className="lg:text-2xl text-xl font-bold text-primary-900">
        SWAP TO QUEST CREDIT
      </div>
      <div className="relative">
        <div className="mt-4 flex justify-between items-center">
          <div className="lg:text-lg text-base font-bold text-primary-450">
            RECENT TRANSACTION
          </div>
          <SwapI />
        </div>
        <div className="absolute opacity-40 right-0 lg:-left-8 mt-5 lg:w-modal w-full thin-line bg-white" />
      </div>

      <div className="mt-14 w-full">
        <div className="flex gap-7 items-center font-bold text-xs text-primary-1100">
          <div className="hidden lg:block">COIN</div>
          <div>COIN NAME</div>
          <div>AMOUNT</div>
          <SwapTo />
          <div className="hidden lg:block">COIN</div>
          <div>COIN NAME</div>
          <div>AMOUNT</div>
        </div>

        <div className="grid grid-cols-5 lg:grid-cols-7 mt-5 items-center font-medium text-sm text-white">
          <Image
            className="h-6 hidden lg:block w-7 lg:h-8 lg:w-9 object-contain"
            priority={true}
            src={BUSD}
            alt="coin"
          />
          <div>BUSD</div>
          <div className="ml-4 lg:ml-3">20.00</div>
          <div className="ml-2.5 lg:ml-3.5">
            <SwapTo />
          </div>
          <Image
            className="h-6 hidden lg:block w-7 lg:-ml-3 lg:h-8 lg:w-9 object-contain"
            priority={true}
            src={QIC}
            alt="quest credit"
          />
          <div>QUEST</div>
          <div>2.00</div>
        </div>
      </div>
    </div>
  );
};
