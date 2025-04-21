import { API_URL } from "../data";
import { ProjectItem } from "../types";
import { emitter } from "../utils/eventEmitter";
import { convertGMTToLocal, formatUserName, getTimeAgo } from "../utils/utils";


export const fetchAllProjects = async (): Promise<ProjectItem[]> => {
    try {
        const response = await fetch(`${API_URL}/getAllProjects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Project List Response:", data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((proj: any) => ({
                id: proj.projID,
                name: proj.projName,
                description: proj.projDesc,
                type: proj.projType,
                update_seq_no: proj.updateSeqNo,
                lastUpdated: proj.last_updated, 
                progress: proj.progress ?? 0, 
                members: proj.members ?? 0, 
                createdBy: proj.createdBy,
                instruction: proj.instruction,
                createdByUser: formatUserName(proj.createdByUser.userName),
                updatedByUser: proj.updatedByUser === null ? '' : formatUserName(proj.updatedByUser.userName) ,
                createDate: getTimeAgo(convertGMTToLocal(proj.projCrtDt))
            }));
        } else {
            console.warn("Invalid response structure:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const deleteProjects = async (projects: { id: number; update_seq_no: number }[]): Promise<boolean> => {
    try {
        for (const { id, update_seq_no } of projects) {
            const response = await fetch(`${API_URL}/DelProj/${id}?update_seq_no=${update_seq_no}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error deleting project ${id}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Project ${id} deleted successfully`, data);
        }

        emitter.emit('refreshProjectList')
        return true; // Return true if all projects are deleted successfully
    } catch (error) {
        console.error("Error deleting projects", error);
        return false; // Return false if any deletion fails
    }
};

export const fetchProjectsByAppId = async (appId: number): Promise<ProjectItem[]> => {
    try {
        const response = await fetch(`${API_URL}/application/${appId}/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Knowledge Project List Response:", data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((proj: any) => ({
                id: proj.projID,
                name: proj.projName,
                description: proj.projDesc,
                type: proj.projType,
                update_seq_no: proj.updateSeqNo,
                lastUpdated: proj.last_updated, // Ensure correct format
                progress: proj.progress ?? 0, // Default to 0 if missing
                members: proj.members ?? 0, // Default to 0 if missing
                // status: proj.status ?? "Unknown", // Default if missing
            }));
        } else {
            console.warn("Invalid response structure:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};


export const fetchKnowledgeProjects = async (knowledgeId: number): Promise<ProjectItem[]> => {
    try {
        const response = await fetch(`${API_URL}/knowledgebase/${knowledgeId}/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Knowledge Project List Response:", data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((proj: any) => ({
                id: proj.projID,
                name: proj.projName,
                description: proj.projDesc,
                type: proj.projType,
                update_seq_no: proj.updateSeqNo,
                lastUpdated: proj.last_updated, // Ensure correct format
                progress: proj.progress ?? 0, // Default to 0 if missing
                members: proj.members ?? 0, // Default to 0 if missing
                // status: proj.status ?? "Unknown", // Default if missing
            }));
        } else {
            console.warn("Invalid response structure:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};


export const fetchDataProjects = async (dataId: number): Promise<ProjectItem[]> => {
    try {
        const response = await fetch(`${API_URL}/testdata/${dataId}/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Knowledge Project List Response:", data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((proj: any) => ({
                id: proj.projID,
                name: proj.projName,
                description: proj.projDesc,
                type: proj.projType,
                update_seq_no: proj.updateSeqNo,
                lastUpdated: proj.last_updated, // Ensure correct format
                progress: proj.progress ?? 0, // Default to 0 if missing
                members: proj.members ?? 0, // Default to 0 if missing
                // status: proj.status ?? "Unknown", // Default if missing
            }));
        } else {
            console.warn("Invalid response structure:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};


export const getProjectNameById = async (projectId: number): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/getProjectById/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data?.data) {
            return data.data.projName;
        } else {
            console.warn("Invalid response structure:", data);
            return 'Unknown/Deleted';
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return 'Unknown/Deleted';
    }
};


export const getProjectById = async (projectId: number): Promise<ProjectItem | null> => {
    try {
        const response = await fetch(`${API_URL}/getProjectById/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Project Name Response:", data.data.projName);

        if (data?.data) {
            
                const convertedProject: ProjectItem = {
                  id: data.data.projID,
                  name: data.data.projName,
                  description: data.data.projDesc,
                  type: data.data.projType,
                  lastUpdated: data.data.projCrtDt,
                  createDate: data.data.projCrtDt,
                  progress: data.data.progress ?? 0,
                  members: data.data.members ?? 0,
                  // status: data.data.status ?? "Unknown",
                  update_seq_no: data.data.updateSeqNo,
                  createdBy: data.data.createdBy,
                  instruction: data.data.instruction
                };

                return convertedProject;
      
        } else {
            console.warn("Invalid response structure:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return null;
    }
};


