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
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not set");

// Save session
export async function setSession(user, res) {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
    },
    SECRET,
    { expiresIn: "7d" }
  );

  // If a response object is provided, set cookie on it
  if (res?.cookies) {
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } else {
    // fallback for server logs only
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  console.log("Session token set:", token.slice(0, 20) + "...");
  return token;
}

// ✅ Async getSession
export async function getSession() {
  const cookieStore = await cookies(); // await is required
  const token = cookieStore.get("session")?.value;
  console.log("token", token)
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { maxAge: 0, path: "/" });
  console.log("Session cleared");
}
