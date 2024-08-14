"use client";
import { deleteThread } from "@/lib/actions/thread.actions";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  userId: string;
}
function DeleteComponent({ threadId, userId }: Props) {
  const pathName = usePathname();
  const handleDelete = () => {
    deleteThread(threadId, userId, pathName);
  };
  return <Button onClick={handleDelete}>Delete</Button>;
}

export default DeleteComponent;
