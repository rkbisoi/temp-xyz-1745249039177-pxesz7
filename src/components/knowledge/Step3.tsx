import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

type Step3Props = {
  formData: { description: string };
  setFormData: (data: { description: string }) => void;
  prevStep: () => void;
  submitForm: () => void;
};

const Step3: React.FC<Step3Props> = ({ formData, setFormData, prevStep, submitForm }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await submitForm(); // Ensure submitForm is async
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-2 bg-white">
      <h2 className="title3">Description</h2>
      <textarea
        placeholder="Enter knowledge description"
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
          onClick={handleSubmit}
          className="btn1"
          disabled={isSaving}
        >

          {isSaving ? <div className='flex flex-row justify-between'>
            <Loader2 className='h-4 w-4 animate-spin mt-0.5 mr-1' />
            <span>Saving</span>
          </div> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Step3;
