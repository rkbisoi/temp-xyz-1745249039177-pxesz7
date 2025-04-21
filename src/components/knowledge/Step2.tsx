// import React from 'react';

// type Step2Props = {
//   formData: { global: boolean };
//   setFormData: (data: { global: boolean }) => void;
//   prevStep: () => void;
//   nextStep: () => void;
// };

// const Step2: React.FC<Step2Props> = ({ formData, setFormData, prevStep, nextStep }) => {
//   return (
//     <div className="p-2 bg-white">
//         <h2 className="title3">Type</h2>
//       <select
//         value={formData.global}
//         onChange={(e) => setFormData({ global: e.target.value })}
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


import React from "react";

type Step2Props = {
  formData: { global: boolean };
  isEdit: boolean;
  setFormData: (data: { global: boolean }) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const Step2: React.FC<Step2Props> = ({ formData, isEdit,  setFormData, prevStep, nextStep }) => {
  return (
    <div className="p-2 bg-white">
      <h2 className="title3">Type</h2>
      <select
        disabled={isEdit}
        value={formData.global ? "true" : "false"}
        onChange={(e) => setFormData({ global: e.target.value === "true" })}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="">Select Type</option>
        <option value="true">Global</option>
        <option value="false">Private</option>
      </select>

      <div className="flex justify-between">
        <button onClick={prevStep} className="btn2">
          Back
        </button>
        <button onClick={nextStep} className="btn1">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
