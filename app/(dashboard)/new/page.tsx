import { NewChatUpload } from "@/components/dashboard/new-chat-upload";
import Logo from "@/components/logo";
import { requireUser } from "@/lib/session-helper";
import { getGreeting } from "@/lib/time-utils";

export default async function NewChat() {
  const user = await requireUser();
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="flex items-center justify-center mt-32 gap-5">
        <Logo width={40} height={40} />
        <h1 className="font-medium xl:text-5xl md:text-4xl text-2xl font-serif tracking-tight">
          {getGreeting()}, {user.name}
        </h1>
      </div>
      <NewChatUpload />
    </div>
  );
}
