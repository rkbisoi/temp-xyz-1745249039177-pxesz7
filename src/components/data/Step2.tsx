// import React from 'react';

// type Step2Props = {
//   formData: { type: string };
//   setFormData: (data: { type: string }) => void;
//   prevStep: () => void;
//   nextStep: () => void;
// };

// const Step2: React.FC<Step2Props> = ({ formData, setFormData, prevStep, nextStep }) => {
//   return (
//     <div className="p-2 bg-white">
//         <h2 className="title3">Type</h2>
//       <select
//         value={formData.type}
//         onChange={(e) => setFormData({ type: e.target.value })}
//         className="w-full p-2 border border-gray-300 rounded mb-4"
//       >
//         <option value="">Select Type</option>
//         <option value="Web App">Global</option>
//         <option value="Mobile App">Private</option>
//       </select>
      
//       <div className="flex justify-between">
//         <button
//           onClick={prevStep}
//           className="btn2"
//         >
//           Back
//         </button>
//         <button
//           onClick={nextStep}
//           className="btn1"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Step2;


import React from 'react';

type Step2Props = {
  formData: { file: File | null };
  setFormData: (data: Partial<{ file: File | null }>) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const Step2: React.FC<Step2Props> = ({ formData, setFormData, prevStep, nextStep }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ file: e.target.files[0] });
    }
  };

  return (
    <div className="p-2 bg-white">
      <h2 className="title3">Upload File</h2>
      <input
        type="file"
        accept=".csv, .xls, .xlsx"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="flex justify-between">
        <button onClick={prevStep} className="btn2">
          Back
        </button>
        <button 
          onClick={nextStep} 
          className="btn1"
          // disabled={!formData.file}
         >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
