import { API_URL } from "../data";
import { ApplicationItem } from "../types";
import { emitter } from "../utils/eventEmitter";
import { convertGMTToLocal, formatUserName, getTimeAgo } from "../utils/utils";


export const fetchAllApplication = async (): Promise<ApplicationItem[]> => {
    try {
        const response = await fetch(`${API_URL}/applications`, {
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
            return data.data.map((app: any) => ({
                id: app.app_ID,
                name: app.app_Name,
                description: app.app_Desc,
                type: app.app_Type,
                update_seq_no: app.updateSeqNo,
                progress: app.progress ?? 0,
                members: app.members ?? 0,
                active: app.active,
                createdBy: app.createdBy,
                createdByUser: formatUserName(app.createdByUser.userName),
                updatedByUser: app.updatedByUser === null ? '' : formatUserName(app.updatedByUser.userName),
                createDate: getTimeAgo(convertGMTToLocal(app.createDate))
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

export const deleteApplication = async (applications: { id: number; update_seq_no: number }[]): Promise<boolean> => {
    try {
        for (const { id, update_seq_no } of applications) {
            const response = await fetch(`${API_URL}/application/${id}?update_seq_no=${update_seq_no}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error deleting applications ${id}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Application ${id} deleted successfully`, data);
        }

        emitter.emit('refreshApplicationList')
        return true; // Return true if all projects are deleted successfully
    } catch (error) {
        console.error("Error deleting applications", error);
        return false; // Return false if any deletion fails
    }
};


export const getApplicationById = async (appId: number): Promise<ApplicationItem | null> => {
    try {
        const response = await fetch(`${API_URL}/getApplicationById/${appId}`, {
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

            const convertedProject: ApplicationItem = {
                id: data.data.app_ID,
                name: data.data.app_Name,
                description: data.data.app_Desc,
                type: data.data.app_Type,
                lastUpdated: data.data.projCrtDt,
                createDate: data.data.projCrtDt,
                //members: data.data.members ?? 0,
                // status: data.data.status ?? "Unknown",
                update_seq_no: data.data.updateSeqNo,
                createdBy: data.data.createdBy,
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


export async function linkProjectsToApplication(
    applicationIds: number[],
    projectIds: number[]
): Promise<void> {
    try {

        const response = await fetch(`${API_URL}/application/link-project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ projectIds, applicationId: applicationIds[0] }),
        });


        if (!response.ok) {
            throw new Error(`Failed to link projects to application. Status: ${response.status}`);
        }


        console.log("Projects successfully linked to application");
    } catch (error) {
        console.error("Error linking projects to application:", error);
    }
}


export async function delinkProjectsFromApplication(
    applicationId: number,
    projectIds: number[]
  ): Promise<boolean> {
    try {
  
      const response = await fetch(`${API_URL}/DelinkapplicationProjects`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ projectIds, applicationId }),
      });
  
  
      if (!response.ok) {
        throw new Error(`Failed to delink project from application. Status: ${response.status}`);
      }
      console.log("Projects successfully delinked from application");
      emitter.emit('refreshProjectList')
      return true
  
    } catch (error) {
      console.error("Error delinking knowledges from project:", error);
      return false
    }
  }


