import React, { useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../data';
import { DataItem } from '../../types';
import { emitter } from '../../utils/eventEmitter';

type FormData = {
  name: string;
  file: File | null;
};

type AddDataFormProps = {
  data: DataItem | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const AddDataForm: React.FC<AddDataFormProps> = ({ data, isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    file: null
  });

   useEffect(() => {
      if (data) {
        setFormData({
          name: data.name || "",
          file: null 
        });
      }
    }, [data]);

  const handleSetFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const submitForm = async () => {
    console.log('Form Submitted:', formData);
    if(data && data.id > 0){
  
      try {
        const formDataToSend = new FormData();

        formDataToSend.append("name", formData.name);
        formDataToSend.append("dataId", data.id.toString());
        formDataToSend.append("update_seq_no", data.update_seq_no.toString());

        if (formData.file) {
          formDataToSend.append("upFile", formData.file);
        }
        
        const response = await fetch(`${API_URL}/testdata/update`, {
          method: "PUT",
          body: formDataToSend,
          credentials: "include",
        });
    
        const responseData = await response.json();
    
        if (responseData.success) {
          toast.success("Test Data Uploaded Successfully!");
          emitter.emit('refreshTestDataList');
          emitter.emit('refreshDataDetail');
          onClose();
          setStep(1);
        } else {
          toast.error(responseData.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error uploading test data:", error);
        toast.error("Error uploading test data.");
      }
    }else{
      try {
        if (!formData.file) {
          toast.error("Please upload a file before submitting.");
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("upFile", formData.file);
    
        const response = await fetch(`${API_URL}/testdata/create`, {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        });
    
        const responseData = await response.json();
    
        if (responseData.success) {
          toast.success("Test Data Uploaded Successfully!");
          emitter.emit('refreshTestDataList');
          emitter.emit('refreshDataDetail');
          onClose();
          setStep(1);
        } else {
          toast.error(responseData.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error uploading test data:", error);
        toast.error("Error uploading test data.");
      }
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-4 rounded-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-intelQEDarkBlue"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="title1 items-center text-center">Add Test Data</h1>
        {step === 1 && (
          <Step1 formData={formData} setFormData={handleSetFormData} nextStep={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={handleSetFormData}
            prevStep={() => setStep(1)}
            nextStep={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={handleSetFormData}
            prevStep={() => setStep(2)}
            submitForm={submitForm}
          />
        )}
      </div>
    </div>
  );
};

export default AddDataForm;
