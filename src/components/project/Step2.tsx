import React from 'react';

type Step2Props = {
  formData: { type: string };
  setFormData: (data: { type: string }) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const Step2: React.FC<Step2Props> = ({ formData, setFormData, prevStep, nextStep }) => {
  return (
    <div className="p-2 bg-white">
        <h2 className="title3">Project Type</h2>
      <select
        value={formData.type}
        onChange={(e) => setFormData({ type: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="">Select Type</option>
        <option value="Functional Testing">Functional Testing</option>
        <option value="Performance Testing">Performance Testing</option>
        <option value="Security Testing">Security Testing</option>
        <option value="API Testing">API Testing</option>
        <option value="Mobile Testing">Mobile Testing</option>
        <option value="Data Conversion Testing">Data Conversion Testing</option>
        <option value="Other">Other</option>
      </select>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="btn2"
        >
          Back
        </button>
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

export default Step2;
