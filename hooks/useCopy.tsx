import React from "react";
import copy from "copy-to-clipboard";

import { Copy } from "@/public/icons";

export default function useCopy(
  resetInterval = 3000,
  initial = <Copy />,
  final = <div className="text-xs text-white font-medium">Copied</div>
) {
  const [isCopied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback((text: string | number) => {
    if (typeof text === "string" || typeof text == "number") {
      copy(text.toString());
      setCopied(true);
    } else {
      setCopied(false);
      console.error(
        `Cannot copy typeof ${typeof text} to clipboard, must be a string or number.`
      );
    }
  }, []);

  const render = isCopied ? final : initial;

  React.useEffect(() => {
    let timeout: any;
    if (isCopied && resetInterval) {
      timeout = setTimeout(() => setCopied(false), resetInterval);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied, resetInterval]);

  return { isCopied, handleCopy, render } as const;
}
