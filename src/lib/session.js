// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

// // Save session (set cookie)
// export function setSession(user) {
//   const token = jwt.sign(
//     { id: user.id, name: user.name, email: user.email, role: user.role, gender: user.gender, phone: user.phone, address: user.address, profileImage: user.profileImage },
//     SECRET,
//     { expiresIn: "7d" }
//   );


//   // local
//   // cookies().set("session", token, {
//   //   httpOnly: true,
//   //   secure: process.env.NODE_ENV === "production",
//   //   sameSite: "strict",
//   //   maxAge: 60 * 60 * 24 * 7,
//   //   path: "/",
//   // });

//   cookies().set("session", token, {
//     httpOnly: true,
//     secure: false, // testing ke liye
//     sameSite: "lax",
//     maxAge: 60 * 60 * 24 * 7,
//     path: "/",
//   });
//   console.log("TOKEN:", token.slice(0, 20) + "...");
//   console.log("SECRET env:", process.env.JWT_SECRET);
//   console.log("SECRET fallback:", SECRET);


//   return token;
// }

// export function getSession() {
//   const token = cookies().get("session")?.value;
//   if (!token) return null;

//   try {
//     return jwt.verify(token, SECRET);
//   } catch {
//     return null;
//   }
// }

// // Clear session
// export function clearSession() {
//   cookies().set("session", "", { maxAge: 0, path: "/" });
// }


// lib/session.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not set");

// Create token
export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    SECRET,
    { expiresIn: "7d" }
  );
}

// Verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Save session in NextResponse cookie
export function setSession(user, res) {
  const token = createToken(user);

  // Attach cookie to response
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  console.log("Session token set:", token.slice(0, 20) + "...");
  return token;
}

// Get session from request cookies
export function getSession() {
  const cookieStore = cookies(); // ✅ This is the correct way
  const token = cookieStore.get("session")?.value;
  console.log("token from cookies()", token);
  if (!token) return null;
  return verifyToken(token);
}

// Clear session
export function clearSession(cookieStore) {
  cookieStore.set("session", "", { maxAge: 0, path: "/" });
}
