import { Download, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TestScriptDetailProps {
  testScript: string;
  onClose: () => void;
}


export default function TestScriptDetail({ testScript, onClose }: TestScriptDetailProps) {
  const script = testScript.slice(9,-3)//cleanScript(testScript);

  const handleDownload = () => {
    const blob = new Blob([script], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "script.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-49">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-intelQEDarkBlue mb-4">Test Script</h2>

        {/* Script Info & Download Button */}
        <div className="mt-4 mb-2 flex justify-between space-x-3">
          <p className="text-sm">Python Selenium Script</p>
          <button onClick={handleDownload} className="btn1 flex items-center">
            <Download className="h-4 w-4 mr-2" /> <span>Download Script</span>
          </button>
        </div>

        {/* Script Display */}
        <div className="bg-gray-900 rounded-lg">
          <SyntaxHighlighter language="python" style={oneDark}>
            {script}
          </SyntaxHighlighter>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between space-x-3">
          <button onClick={onClose} className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Close
          </button>
          <button onClick={handleDownload} className="btn1 flex items-center">
            <Download className="h-4 w-4 mr-2" /> <span>Download Script</span>
          </button>
        </div>
      </div>
    </div>
  );
}
