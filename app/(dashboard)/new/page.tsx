import Logo from "@/components/logo";
import { requireUser } from "@/lib/session-helper";
import { getGreeting } from "@/lib/time-utils";

export default async function NewChat() {
  const user = await requireUser();
  return (
    <div>
      <div className="flex items-center justify-center mt-32 gap-5">
        <Logo width={40} height={40} />
        <h1 className="font-medium text-5xl font-serif tracking-tight">
          {getGreeting()}, {user.name}
        </h1>
      </div>
    </div>
  );
}
