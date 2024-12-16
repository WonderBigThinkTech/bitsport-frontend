import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AirDropPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    router.push("/farmearn");
  }, []);
  return <div></div>;
};

export default AirDropPage;
