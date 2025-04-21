import { useState, useEffect } from "react";

export default function ToggleActiveTestsButton() {
    const [isVisible, setIsVisible] = useState<boolean>(
        localStorage.getItem("activeTestsVisible") === "true"
    );

    const toggleVisibility = () => {
        const newState = !isVisible;
        localStorage.setItem("activeTestsVisible", newState.toString());
        setIsVisible(newState);
        window.dispatchEvent(new Event("activeTestsVisibilityChanged"));
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(localStorage.getItem("activeTestsVisible") === "true");
        };

        window.addEventListener("activeTestsVisibilityChanged", handleVisibilityChange);
        return () => {
            window.removeEventListener("activeTestsVisibilityChanged", handleVisibilityChange);
        };
    }, []);

    return (
        <div className="flex flex-row justify-start">
            
            <button
                onClick={toggleVisibility}
                className={`relative inline-flex h-5 w-8 mr-3 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isVisible ? 'bg-intelQEDarkBlue' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isVisible ? 'translate-x-3' : 'translate-x-0'
                        }`}
                />
            </button>
            <span className="text-sm">Show Active Tests</span>
            
        </div>
    );
}
