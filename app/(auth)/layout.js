import { logout } from "@/actions/auth-action";
import "../globals.css";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

export default async ({ children }) => {
  // middleware.js에서 실행하려 하였으나 엣지환경에서는 lucia가 지원되지 않음.
  const { session } = await verifyAuth();

  if (!session) {
    redirect("/");
  }
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  );
};
