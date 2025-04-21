import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface Instruction {
  id: string;
  content: string;
}

interface InstructionTabsProps {
  selectedInstruction: string;
  onInstructionChange: (instructionId: string) => void;
  onInstructionContentChange: (id: string, content: string) => void;
  instructionContents?: Instruction[]; // Make this a prop passed from parent
}

const MAX_INSTRUCTIONS = 10;

const InstructionTabs = ({
  selectedInstruction,
  onInstructionChange,
  onInstructionContentChange,
  instructionContents = [{ id: "Master", content: "" }], // Default value
}: InstructionTabsProps) => {
  // console.log("Instructions From Instruction Tab : ", instructionContents)
  const [instructions, setInstructions] = useState<Instruction[]>(instructionContents);

  // Sync with parent state when instructionContents changes
  useEffect(() => {
    // console.log("Syncing instructions with instructionContents:", instructionContents);
    setInstructions(instructionContents);
  }, [instructionContents]);

  const addNewInstruction = () => {
    if (instructions.length >= MAX_INSTRUCTIONS) return; // Prevent adding more than 10

    const newId = `Instruction ${instructions.length}`;
    const newInstruction: Instruction = {
      id: newId,
      content: ""
    };

    setInstructions((prev) => {
      const updatedInstructions = [...prev, newInstruction];
      return updatedInstructions;
    });

    // Update parent state
    onInstructionContentChange(newId, "");
    
    // Ensure the new instruction is selected
    setTimeout(() => onInstructionChange(newId), 0);
  };

  const deleteInstruction = (id: string) => {
    if (id === "Master") return;
    const newInstructions = instructions.filter((inst) => inst.id !== id);

    setInstructions(newInstructions);

    // Auto-select the previous instruction or fallback to "Master"
    if (selectedInstruction === id) {
      const newSelection =
        newInstructions.length > 0 ? newInstructions[newInstructions.length - 1].id : "Master";
      onInstructionChange(newSelection);
    }
  };

  const handleContentChange = (id: string, content: string) => {
    setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, content } : inst))
    );
    onInstructionContentChange(id, content);
  };

  const selectedInstructionData = instructions.find((i) => i.id === selectedInstruction);

  return (
    <div className="flex h-[550px] p-2">
      {/* Sidebar */}
      <div className="w-44 bg-gray-50 border border-gray-200 p-2 h-[423px] rounded overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">Instructions</h3>
          <button
            onClick={addNewInstruction}
            className="p-1 rounded hover:bg-gray-200"
            title="Add new instruction"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1">
          {instructions.map((instruction) => (
            <div
              key={instruction.id}
              className={`flex items-center justify-between rounded px-2 py-1.5 text-sm ${
                selectedInstruction === instruction.id
                  ? "bg-intelQEDarkBlue text-white"
                  : "hover:bg-gray-200 text-gray-700 bg-gray-200"
              }`}
            >
              <button
                className="flex-1 text-left"
                onClick={() => onInstructionChange(instruction.id)}
              >
                {instruction.id}
              </button>
              {instruction.id !== "Master" && (
                <button
                  onClick={() => deleteInstruction(instruction.id)}
                  className={`p-0.5 rounded ${
                    selectedInstruction === instruction.id
                      ? "hover:bg-sky-700 text-white"
                      : "hover:bg-gray-300 text-gray-500"
                  }`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 pl-2">
        {selectedInstructionData ? (
          <textarea
            value={selectedInstructionData.content}
            onChange={(e) => handleContentChange(selectedInstruction, e.target.value)}
            placeholder={"Enter test instructions here..."}
            className="w-full h-[79%] p-2 text-sm border rounded focus:outline-none focus:none focus:none"
          />
        ) : (
          <p className="text-sm text-gray-500">Select an instruction to edit.</p>
        )}
      </div>
    </div>
  );
};

export default InstructionTabs;