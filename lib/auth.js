import { Lucia, TimeSpan } from "lucia";
import { cookies } from "next/headers";
import { pool } from "./db";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";

const adapter = new NodePostgresAdapter(pool, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "h"),
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const createAuthSession = async (userId) => {
  console.log(userId.toString());
  const session = await lucia.createSession(userId.toString(), {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookie = await cookies();
  cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
};

export const verifyAuth = async () => {
  const sessionCookie = await cookies();
  const sessionCookieName = sessionCookie.get(lucia.sessionCookieName);

  if (!sessionCookieName) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionId = sessionCookieName.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return result;
};

export const destorySession = async () => {
  const { session } = await verifyAuth();

  if (!session) {
    return {
      error: "Unauthorized!",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};
