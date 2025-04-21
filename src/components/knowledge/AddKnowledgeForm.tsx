import React, { useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';
import { API_URL } from '../../data';
import toast from 'react-hot-toast';
import { KnowledgeItem } from '../../types';
import { emitter } from '../../utils/eventEmitter';

type FormData = {
  name: string;
  description: string;
  global: boolean;
};

type AddKnowledgeFormProps = {
  knowledge: KnowledgeItem | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const AddKnowledgeForm: React.FC<AddKnowledgeFormProps> = ({ knowledge, isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    description: '',
    global: false,
  });

  useEffect(() => {
    if (knowledge) {
      setFormData({
        name: knowledge.name || "",
        description: knowledge.description || "",
        global: knowledge.global || false,
      });
    }
  }, [knowledge]);

  const handleSetFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const submitForm = async() => {
    console.log('Form Submitted:', formData);
    if(knowledge && knowledge.id > 0){

      const response = await fetch(`${API_URL}/knowledgebase/update`, {
        method: "PUT",
        body: JSON.stringify({
          knowledgeId: knowledge.id,
          update_seq_no: knowledge.update_seq_no,
          name: formData.name,
          desc: formData.description
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await response.json();
  
      if (data.success) {
        toast.success('Knowledge Update Successfully!');
        emitter.emit('refreshKnowledgeList')
        onClose();
        setStep(1); 
      }

    }else{

      const response = await fetch(`${API_URL}/addKnowledge`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          src: "",
          taskType: "User",
          desc: formData.description,
          instruction: "",
          isGlobal: formData.global
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data = await response.json();
  
      if (data.success) {
        toast.success('Knowledge Created Successfully!');
        emitter.emit('refreshKnowledgeList')
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
        <h1 className="title1 items-center text-center">Add Knowledge</h1>
        {step === 1 && (
          <Step1 formData={formData} setFormData={handleSetFormData} nextStep={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={handleSetFormData}
            prevStep={() => setStep(1)}
            nextStep={() => setStep(3)} 
            isEdit={(knowledge !== undefined)}          
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

export default AddKnowledgeForm;
