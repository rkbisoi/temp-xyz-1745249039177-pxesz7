import React from 'react';
import { TestSuiteFormData } from './TestSuiteForm';

type Step1Props = {
  formData: { name: string; project_id: number; description: string };
  setFormData: (data: Partial<TestSuiteFormData>) => void;
  nextStep: () => void;
};

const Step1: React.FC<Step1Props> = ({ formData, setFormData, nextStep }) => {
  const isNextDisabled = !formData.name.trim();

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg text-intelQEDarkBlue font-semibold mb-4">Test Suite Information</h2>

      <label className="block mb-2 text-sm text-gray-500">Test Suite Name</label>
      <input
        type="text"
        placeholder="Enter test suite name"
        value={formData.name}
        onChange={(e) => setFormData({ name: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <label className="block mb-2 text-sm text-gray-500">Description</label>
      <textarea
        placeholder="Enter test suite description"
        value={formData.description}
        onChange={(e) => setFormData({ description: e.target.value })}
        className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
      />

      <div className="flex justify-end">
        <button onClick={nextStep} className={`btn1 ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isNextDisabled}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1;
