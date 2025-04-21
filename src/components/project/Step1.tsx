import React from 'react';

type Step1Props = {
  formData: { name: string };
  setFormData: (data: { name: string }) => void;
  nextStep: () => void;
};

const Step1: React.FC<Step1Props> = ({ formData, setFormData, nextStep }) => {
  return (
    <div className="p-2 bg-white">
      <h2 className="title3">Name</h2>
      <input
        type="text"
        placeholder="Enter project name"
        value={formData.name}
        onChange={(e) => setFormData({ name: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="flex justify-end">
      <button
        onClick={nextStep}
        className="btn1"
      >
        Next
      </button>
      </div>
      
    </div>
  );
};

export default Step1;
