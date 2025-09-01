import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret"; // change in .env

// Save session (set cookie)
export function setSession(user) {
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "7d" } // 7 days session
  );

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return token;
}

// Get session (read cookie)
// export function getSession() {
//   const token = cookies().get("session")?.value;
//   if (!token) return null;

//   try {
//     return jwt.verify(token, SECRET);
//   } catch (err) {
//     return null;
//   }
// }

// Clear session
export function clearSession() {
  cookies().set("session", "", { maxAge: 0, path: "/" });
}
