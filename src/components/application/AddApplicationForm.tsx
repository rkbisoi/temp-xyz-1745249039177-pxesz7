import React, { useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';
import { ApplicationItem } from '../../types';
import toast from 'react-hot-toast';
import { emitter } from '../../utils/eventEmitter';
import { API_URL } from '../../data';

type FormData = {
  name: string;
  description: string;
  type: string;
};

type AddApplicationFormProps = {
  app: ApplicationItem | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const AddApplicationForm: React.FC<AddApplicationFormProps> = ({ app, isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    description: '',
    type: '',
  });

  useEffect(() => {
        if (app) {
          setFormData({
            name: app.name || "",
            description: app.description || "",
            type: app.type || "",
          });
        }
      }, [app]);

  const handleSetFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const submitForm = async() => {
    console.log('Form Submitted:', formData);
    
    if(app && app.id > 0){

      const response = await fetch(`${API_URL}/application/update`, {
        method: "PUT",
        body: JSON.stringify({
          applicationId: app.id,
          update_seq_no: app.update_seq_no,
          name: formData.name,
          appType: formData.type,
          desc: formData.description
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await response.json();
  
      if (data.success) {
        toast.success('Application Update Successfully!');
        emitter.emit('refreshApplicationList')
        onClose();
        setStep(1); 
      }

    }else{

      const response = await fetch(`${API_URL}/addApplication`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          appType: formData.type,
          desc: formData.description,
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data = await response.json();
  
      if (data.success) {
        toast.success('Application Created Successfully!');
        emitter.emit('refreshApplicationList');
        onClose();
        setStep(1); 
      }

    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-4 rounded-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-intelQEDarkBlue"
        >
          <X className="w-5 h-5"/>
        </button>
        <h1 className="title1 items-center text-center">Add Application</h1>
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

export default AddApplicationForm;
