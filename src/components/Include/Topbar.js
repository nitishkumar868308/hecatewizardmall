import React from 'react'


const Topbar = () => {
    return (
        <div className="w-full bg-black text-white">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="flex items-center justify-center py-2 md:py-3">
                    <h1 className="font-libreBaskerville tracking-wide text-base sm:text-lg md:text-2xl  uppercase">
                        hecate wizard mall
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Topbar

// "use client";
// import Marquee from "react-fast-marquee";

// export default function Topbar() {
//     return (
//         <div className="w-full bg-black text-white">
//             <Marquee
//                 speed={60}
//                 gradient={false}
//                 pauseOnHover={true}
//             >
//                 <h1 className="font-semibold tracking-wide  py-2 md:py-3 text-base sm:text-lg md:text-2xl leading-none select-none uppercase mx-8">
//                     hecate wizard mall
//                 </h1>
//             </Marquee>
//         </div>
//     );
// }
