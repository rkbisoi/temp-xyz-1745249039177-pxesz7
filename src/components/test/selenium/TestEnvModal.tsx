import { Minimize2 } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

interface TestEnvModalProps {
    isMinimized: boolean;
    url: string;
    onClose: () => void;


}

const TestEnvModal: React.FC<TestEnvModalProps> = ({
    isMinimized,
    url,
    onClose
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Auto-scroll to the bottom when output changes (if needed)
        // if (iframeRef.current) {
        //   iframeRef.current.scrollTop = iframeRef.current.scrollHeight;
        // }
    }, [url]);

    if (isMinimized) {
        return <></>
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[100vh] p-2 px-4">
                <div className="flex flex-row items-center mb-1 text-background justify-between mb-2">
                    <div className="flex flex-row">
                        <p className="ml-1 font-semibold text-intelQEDarkBlue">Selenium Test Environment</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-300"
                        title="Minimize"
                    >
                        <Minimize2 className="h-4 w-4 text-gray-500" />
                    </button>
                </div>

                <iframe
                    ref={iframeRef}
                    src={url}
                    width="100%"
                    height="500px"
                    className="border border-background rounded"
                    title="TestEnv Content"
                ></iframe>

                <div className="text-center mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-background text-white py-1 px-2 text-sm rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

};

export default TestEnvModal;
