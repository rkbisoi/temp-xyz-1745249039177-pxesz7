import React from 'react';

type Step3Props = {
  formData: { description: string };
  setFormData: (data: { description: string }) => void;
  prevStep: () => void;
  submitForm: () => void;
};

const Step3: React.FC<Step3Props> = ({ formData, setFormData, prevStep, submitForm }) => {
  return (
    <div className="p-2 bg-white">
      <h2 className="title3">Description</h2>
      <textarea
        placeholder="Enter application description"
        value={formData.description}
        onChange={(e) => setFormData({ description: e.target.value })}
        className="w-full h-60 p-2 border border-gray-300 rounded mb-4"
      />
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="btn2"
        >
          Back
        </button>
        <button
          onClick={submitForm}
          className="btn1"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step3;
