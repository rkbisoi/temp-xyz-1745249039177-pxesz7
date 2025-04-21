// import React from 'react';

// type Step3Props = {
//   formData: { description: string };
//   setFormData: (data: { description: string }) => void;
//   prevStep: () => void;
//   submitForm: () => void;
// };

// const Step3: React.FC<Step3Props> = ({ formData, setFormData, prevStep, submitForm }) => {
//   return (
//     <div className="p-2 bg-white">
//       <h2 className="title3">Description</h2>
//       <textarea
//         placeholder="Enter knowledge description"
//         value={formData.description}
//         onChange={(e) => setFormData({ description: e.target.value })}
//         className="w-full h-60 p-2 border border-gray-300 rounded mb-4"
//       />
//       <div className="flex justify-between">
//         <button
//           onClick={prevStep}
//           className="btn2"
//         >
//           Back
//         </button>
//         <button
//           onClick={submitForm}
//           className="btn1"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Step3;


import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

type Step3Props = {
  formData: { file: File | null };
  setFormData: (data: Partial<{ file: File | null }>) => void;
  prevStep: () => void;
  submitForm: () => void;
};

const Step3: React.FC<Step3Props> = ({ formData, prevStep, submitForm }) => {
  const [tableData, setTableData] = useState<string[][]>([]);

  useEffect(() => {
    if (formData.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

        setTableData(jsonData.slice(0, 6)); 
      };
      reader.readAsArrayBuffer(formData.file);
    }
  }, [formData.file]);

  return (
    <div className="p-2 bg-white">
      <h2 className="title3">Preview Data</h2>
      {tableData.length > 0 ? (
        <div className="overflow-auto border border-gray-300 rounded mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {tableData[0].map((col, index) => (
                  <th key={index} className="border p-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 p-4 mb-4">No preview available</p>
      )}
      <div className="flex justify-between">
        <button onClick={prevStep} className="btn2">
          Back
        </button>
        <button onClick={submitForm} className="btn1">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step3;
