// // // import React, { useState } from 'react';

// // // type Step2Props = {
// // //   setFormData: (data: { testScript: string }) => void;
// // //   prevStep: () => void;
// // //   nextStep: () => void;
// // // };

// // // const Step2: React.FC<Step2Props> = ({ setFormData, prevStep, nextStep }) => {
// // //   const [fileName, setFileName] = useState<string | null>(null);

// // //   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = event.target.files?.[0];
// // //     if (file && file.name.endsWith('.py')) {
// // //       const reader = new FileReader();
// // //       reader.readAsText(file);
// // //       reader.onload = () => {
// // //         setFormData({ testScript: reader.result as string });
// // //         setFileName(file.name);
// // //       };
// // //     } else {
// // //       alert('Please upload a valid .py file');
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-4 bg-white rounded-lg shadow-md">
// // //       <h2 className="text-lg font-semibold mb-4">Upload Test Script</h2>

// // //       <input type="file" accept=".py" onChange={handleFileUpload} className="mb-4" />
// // //       {fileName && <p className="text-sm text-gray-600">Uploaded: {fileName}</p>}

// // //       <div className="flex justify-between">
// // //         <button onClick={prevStep} className="btn2">
// // //           Back
// // //         </button>
// // //         <button onClick={nextStep} className="btn1" disabled={!fileName}>
// // //           Next
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Step2;

// // import React, { useState } from 'react';
// // import { TestSuiteFormData } from './TestSuiteForm';

// // type Step2Props = {
// //   setFormData: (data: Partial<TestSuiteFormData>) => void;
// //   prevStep: () => void;
// //   nextStep: () => void;
// // };

// // const Step2: React.FC<Step2Props> = ({ setFormData, prevStep, nextStep }) => {
// //   const [fileName, setFileName] = useState<string | null>(null);

// //   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (file && file.name.endsWith('.py')) {
// //       setFormData({ testScript: file });
// //       setFileName(file.name);
// //     } else {
// //       alert('Please upload a valid .py file');
// //     }
// //   };

// //   return (
// //     <div className="p-4 bg-white rounded-lg shadow-md">
// //       <h2 className="text-lg font-semibold mb-4">Upload Test Script</h2>

// //       <input type="file" accept=".py" onChange={handleFileUpload} className="mb-4" />
// //       {fileName && <p className="text-sm text-gray-600">Uploaded: {fileName}</p>}

// //       <div className="flex justify-between">
// //         <button onClick={prevStep} className="btn2">
// //           Back
// //         </button>
// //         <button onClick={nextStep} className="btn1" disabled={!fileName}>
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Step2;

// import React, { useState } from 'react';
// import { TestSuiteFormData } from './TestSuiteForm';

// type Step2Props = {
//   formData: TestSuiteFormData;
//   setFormData: (data: Partial<TestSuiteFormData>) => void;
//   prevStep: () => void;
//   nextStep: () => void;
// };

// const Step2: React.FC<Step2Props> = ({ formData, setFormData, prevStep, nextStep }) => {
//   const [fileName, setFileName] = useState<string | null>(formData.testScript?.name || null);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && file.name.endsWith('.py')) {
//       setFormData({ testScript: file });
//       setFileName(file.name);
//     } else {
//       alert('Please upload a valid .py file');
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg">
//       <h2 className="text-lg font-semibold mb-4">Upload Test Script</h2>

//       <input type="file" accept=".py" onChange={handleFileUpload} className="mb-4" />
//       {fileName && <p className="text-sm text-gray-600">Uploaded: {fileName}</p>}

//       <div className="flex justify-between">
//         <button onClick={prevStep} className="btn2">Back</button>
//         {/* <button onClick={nextStep} className="btn1" disabled={!fileName}>Next</button> */}
//         <button onClick={nextStep} className="btn1">Next</button>
//       </div>
//     </div>
//   );
// };

// export default Step2;
