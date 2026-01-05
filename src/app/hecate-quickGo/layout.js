import LandingModal from "@/components/LandingModal/LandingModal";

export default function XpressLayout({ children }) {
    return (
        <>
            <LandingModal />
            {children}
        </>
    );
}
