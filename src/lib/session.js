import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

// Save session (set cookie)
export function setSession(user) {
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, gender: user.gender, phone: user.phone, address: user.address, profileImage: user.profileImage },
    SECRET,
    { expiresIn: "7d" }
  );


  // local
  // cookies().set("session", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   maxAge: 60 * 60 * 24 * 7,
  //   path: "/",
  // });

  cookies().set("session", token, {
    httpOnly: true,
    secure: false, // testing ke liye
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  console.log("TOKEN:", token.slice(0, 20) + "...");
  console.log("SECRET env:", process.env.JWT_SECRET);
  console.log("SECRET fallback:", SECRET);


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
