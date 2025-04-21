import { API_URL } from "../data";

export const deleteTestData = async (data: { id: number; update_seq_no: number }[]): Promise<boolean> => {
    try {
        for (const { id, update_seq_no } of data) {
            const response = await fetch(`${API_URL}/testdata/${id}?update_seq_no=${update_seq_no}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            
            if (!response.ok) {
                throw new Error(`Error deleting test data ${id}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Test Data ${id} deleted successfully`, data);
        }
        return true; // Return true if all projects are deleted successfully
    } catch (error) {
        console.error("Error deleting test data", error);
        return false; // Return false if any deletion fails
    }
};


export async function linkDataToProjects(
    projectIds: number[],
    testDataIds: number[]
  ): Promise<void> {
    try {
      const requests = projectIds.map((projectId) => {
        return fetch(`${API_URL}/testdata/link-to-project`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ testDataIds, projectId }),
        });
      });
  
      const responses = await Promise.all(requests);
  
      for (const response of responses) {
        if (!response.ok) {
          throw new Error(`Failed to link data to project. Status: ${response.status}`);
        }
      }
      
      console.log("Data successfully linked to projects");
    } catch (error) {
      console.error("Error linking data to projects:", error);
    }
  }


  export async function delinkDataFromProjects(
    projectId: number,
    testDataIds: number[]
  ): Promise<boolean> {
    try {
  
      const response = await fetch(`${API_URL}/testdata/delink-from-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ testDataIds, projectId }),
      });
  
  
      if (!response.ok) {
        throw new Error(`Failed to delink test data from project. Status: ${response.status}`);
      }
      console.log("Test Data successfully delinked from project");
      return true
  
    } catch (error) {
      console.error("Error delinking test data from project:", error);
      return false
    }
  }