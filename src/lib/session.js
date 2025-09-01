import { IronSession } from "iron-session";

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Edge Runtime session helper
export function getSession(req) {
  return new IronSession(req, sessionOptions);
}
