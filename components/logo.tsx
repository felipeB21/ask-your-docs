import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 24, height = 24 }: LogoProps) {
  return (
    <Link href="/">
      <Image
        src="/icon.svg"
        alt="AskYourDocs"
        width={width}
        height={height}
        className="invert dark:invert-0"
      />
    </Link>
  );
}
