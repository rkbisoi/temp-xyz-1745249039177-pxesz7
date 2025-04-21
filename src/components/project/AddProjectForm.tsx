import React, { useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../data';
import { ProjectItem } from '../../types';
import { emitter } from '../../utils/eventEmitter';

type FormData = {
  name: string;
  description: string;
  type: string;
};

type AddProjectFormProps = {
  project: ProjectItem | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const AddProjectForm: React.FC<AddProjectFormProps> = ({ project, isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    description: '',
    type: '',
  });

  useEffect(() => {
      if (project) {
        setFormData({
          name: project.name || "",
          description: project.description || "",
          type: project.type || "",
        });
      }
    }, [project]);

  const handleSetFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const submitForm = async () => {
    console.log('Form Submitted:', formData);
    if(project && project.id > 0){

      const response = await fetch(`${API_URL}/projects/update`, {
        method: "PUT",
        body: JSON.stringify({
          projectId: project.id,
          update_seq_no: project.update_seq_no,
          name: formData.name,
          projType: formData.type,
          // projType: "Other",
          desc: formData.description,
          instruction: ""
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await response.json();
  
      if (data.success) {
        toast.success('Project Update Successfully!');
        emitter.emit('refreshProjectList')
        onClose();
        setStep(1); 
      }

    }else{

      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          projType: formData.type,
          //projType: "Other",
          desc: formData.description,
          instruction: "",
          is_global_kb_allowed: true
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data = await response.json();
  
      if (data.success) {
        toast.success('Project Created Successfully!');
        emitter.emit('refreshProjectList');
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
        <h1 className="title1 items-center text-center">Add Project</h1>
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

export default AddProjectForm;
