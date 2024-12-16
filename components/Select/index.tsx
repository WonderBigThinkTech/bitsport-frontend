import Image from "next/image";
import { motion } from "framer-motion";

import { SwapArrow } from "@/public/icons";
import classNames from "classnames";
import { useEffect, useState } from "react";
import useCopy from "@/hooks/useCopy";

interface ISelect {
  icon?: any;
  name: string;
  label?: string;
  handleChange?: (value: string) => void;
  items?: { icon?: any; name: string }[];
  hasCopy?: boolean;
  bordered?: boolean;
}

const Select = (props: ISelect) => {
  const { handleCopy, render } = useCopy();

  const [selected, setSelected] = useState({
    icon: props.icon,
    name: props.name,
  });
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onChange = (data: any) => {
    setSelected({
      icon: data.icon,
      name: data.name,
    });

    if (props.handleChange) props.handleChange(data.name);

    toggle();
  };

  useEffect(() => {
    setSelected({
      icon: props.icon,
      name: props.name,
    });
  }, [props]);
  return (
    <div className="relative w-full mb-7">
      <div
        className={classNames(
          "text-primary-1100 font-bold lg:text-base text-sm mb-1",
          {
            hidden: !props.label,
          }
        )}
      >
        {props.label}
      </div>
      <div
        className={`rounded px-5 xl:px-8 h-16 bg-secondary-400 outline-none flex items-center justify-between ${
          props.bordered ? "border border-[#ffffff20]" : ""
        }`}
        onClick={props.hasCopy ? () => {} : toggle}
      >
        <div className="flex items-center gap-4">
          <Image
            priority={true}
            height={44}
            width={38}
            src={selected.icon}
            alt="icon"
            className={classNames({
              hidden: !props.icon,
            })}
          />
          <div className="text-white font-medium text-sm xl:text-lg">
            {props.name}
          </div>
        </div>
        {props.hasCopy ? (
          <div
            onClick={() => handleCopy(props.name)}
            className="cursor-pointer pl-4"
          >
            {render}
          </div>
        ) : (
          <div onClick={toggle} className="cursor-pointer">
            <SwapArrow />
          </div>
        )}
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 w-full bg-primary-800 p-4 rounded max-h-56 overflow-y-auto mt-2"
        >
          {props.items?.map((item) => (
            <motion.div
              onClick={() => onChange(item)}
              transition={{ duration: 0.2 }}
              key={item.name}
              className="font-bold text-white hover:text-primary-100 flex items-center gap-4 text-base cursor-pointer p-2.5 rounded w-full hover:bg-primary-900"
            >
              {item.icon && (
                <Image
                  priority={true}
                  height={44}
                  width={38}
                  src={item.icon}
                  alt="icon"
                />
              )}
              <div>{item.name}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Select;
