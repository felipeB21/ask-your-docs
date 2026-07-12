import Image from "next/image";

export default function ChatPanel({ username }: { username: string }) {
  return (
    <div className="bg-accent p-5 rounded-lg">
      <div className="flex gap-3 items-start">
        <Image
          src="/icon.svg"
          alt="AI"
          width={12}
          height={12}
          className="mt-1"
        />
        <span className="text-sm">
          Hi, <strong>{username}</strong>! <br /> How can i help you with?
        </span>
      </div>
    </div>
  );
}
