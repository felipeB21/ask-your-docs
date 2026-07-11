import { getRecentChats } from "@/actions/chats";

export default async function RecentChats() {
  return (
    <div>
      <ul>{getRecentChats.length}</ul>
    </div>
  );
}
