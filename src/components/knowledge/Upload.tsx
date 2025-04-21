import toast from 'react-hot-toast';
import { LLM_URL } from '../../data';

export async function uploadFiles(files: File[], knowledgeBaseId: string): Promise<boolean> {
  if (files.length === 0) {
    toast.error('No file uploaded!');
    return false;
  }

  if (!knowledgeBaseId) {
    toast.error('Please provide both files and a knowledge base ID.');
    return false;
  }

  const formData = new FormData();
  formData.append('knowledge_base_id', knowledgeBaseId);
  files.forEach((file) => formData.append('files', file));

  try {
    const response = await fetch(LLM_URL +'/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(data.message);
      return true
    //   eventEmitter.emit('refreshDocList')
    } else {
      const errorData = await response.json();
      toast.error(errorData.detail);
      return false
    }
  } catch (error) {
    toast.error('Error uploading files: ' + (error as Error).message);
    return false
  }
}
