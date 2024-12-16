import { Lock } from "@/public/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const items = [
  { title: "Terms and Condition", url: "https://bitsport.gg/terms-condition/" },
  { title: "Privacy Policy", url: "https://bitsport.gg/privacy-policy/" },
  { title: "Disclaimer", url: "https://bitsport.gg/disclaimer/" },
  { title: "FAQ", url: "https://bitsport.gg/faq/" },
];

const socials = [
  {
    title: "Telegram",
    img: "https://i.imgur.com/kmXfdnU.png",
    url: "https://t.me/bitsport_finance",
  },
  {
    title: "Discord",
    img: "https://i.imgur.com/DD4rYRe.png",
    url: "https://discord.gg/g85V9YkPGd",
  },
  {
    title: "Twitter",
    img: "https://i.imgur.com/ELQWoid.png",
    url: "https://twitter.com/bitsportgaming",
  },
];

const Footer = (props: { farm?: boolean }) => {
  const { farm } = props;
  const router = useRouter();
  const isNftRoute = router.route.includes("/nft");

  return (
    <footer className="w-full flex justify-center pt-5">
      <div
        className={`py-6 flex flex-col lg:flex-row ${
          farm ? "w-full" : "container"
        } lg:justify-between lg:items-center border-t border-primary-600 px-4 justify-center items-center gap-10`}
      >
        <div className="text-primary-650 text-xl font-Poppins">
          BitPool @ 2023 By BitSport
        </div>
        <div className="flex items-center gap-8">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="text-primary-650 text-lg font-Poppins hover:text-primary-400"
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-650 text-lg font-Poppins hover:text-primary-400"
            >
              <Image
                src={social.img}
                width={32}
                height={32}
                alt={social.title}
              />
              <span>{social.title}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
