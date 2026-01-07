import { toast } from "react-hot-toast";
import Link from "next/link";

export const showPlatformToast = (platformName, linkUrl) => {
    toast.custom(
        (t) => (
            <div
                className={`${t.visible ? "animate-enter" : "animate-leave"
                    } max-w-sm w-full bg-white border-l-4 border-yellow-500 shadow-lg rounded-lg p-4 flex flex-col gap-2 pointer-events-auto`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
                        <span className="text-yellow-500 text-lg">⚠️</span>
                        <p className="text-sm text-gray-800">
                            You can only update this item on the{" "}
                            <span className="font-semibold">{platformName}</span>{" "}
                            tab.
                        </p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                        ✕
                    </button>
                </div>

                <Link
                    href={linkUrl}
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                >
                    Click here to go to {platformName} tab
                </Link>
            </div>
        ),
        {
            duration: 1000, // 4 seconds
            position: "top-right",
        }
    );
};
