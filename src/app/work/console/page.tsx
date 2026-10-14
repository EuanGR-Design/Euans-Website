import { redirect } from "next/navigation";

// Console now lives at /work/legalesign. Keeps old links working.
export default function ConsoleRedirect() {
  redirect("/work/legalesign");
}
