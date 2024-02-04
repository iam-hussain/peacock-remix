import type { Session } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function commitSession(session: Session) {
  return sessionStorage.commitSession(session);
}

export async function setSessionToast(
  request: Request,
  message: string,
  type: "info" | "success" | "warning" | "error" | "default"
) {
  const session = await getSession(request);
  session.flash("toastMessage", message);
  session.flash("toastType", type);
  return {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

export async function getIsLoggedIn(request: Request): Promise<Boolean> {
  const session = await getSession(request);
  const isAdmin = session.get("IS_ADMIN");
  return Boolean(isAdmin);
}

export async function requireAdmin(request: Request) {
  const isLoggedIn = await getIsLoggedIn(request);
  if (isLoggedIn) return isLoggedIn;
  throw await logout(request);
}

export async function login(request: Request) {
  const session = await getSession(request);
  session.set("IS_ADMIN", true);
  return redirect("/home", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 2,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/home", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function setSessionData(
  request: Request,
  key: string,
  value: any,
  path?: string
) {
  const session = await getSession(request);
  session.set(key, value);
  return redirect(path || "/home", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 2,
      }),
    },
  });
}

export async function getSessionData(
  request: Request,
  key: string
): Promise<any> {
  const session = await getSession(request);
  return session.get(key);
}
