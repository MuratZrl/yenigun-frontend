// Credit offers link component
import React from "react";

type Props = {
  text: string;
  href?: string;
  onClick?: () => void;
};

export default function CreditOffersLink({ text, href, onClick }: Props) {
  return (
    <a
      href={href || "#"}
      onClick={(e) => {
        if (!href) e.preventDefault();
        onClick?.();
      }}
      className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline whitespace-nowrap transition-colors duration-200"
    >
      {text}
    </a>
  );
}
