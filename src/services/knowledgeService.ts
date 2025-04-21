import { API_URL } from "../data";
import { emitter } from "../utils/eventEmitter";

export const deleteKnowledges = async (knowledges: { id: number; update_seq_no: number }[]): Promise<boolean> => {
  try {
    for (const { id, update_seq_no } of knowledges) {
      const response = await fetch(`${API_URL}/knowledgebase/${id}?update_seq_no=${update_seq_no}`, {
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
    emitter.emit('refreshKnowledgeList')
    return true; // Return true if all projects are deleted successfully
  } catch (error) {
    console.error("Error deleting projects", error);
    return false; // Return false if any deletion fails
  }
};


export async function linkKnowledgesToProjects(
  projectIds: number[],
  knowledgeIds: number[]
): Promise<void> {
  try {
    const requests = projectIds.map((projectId) => {
      return fetch(`${API_URL}/knowledgebase/link-to-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ knowledgeIds, projectId }),
      });
    });

    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to link knowledge to project. Status: ${response.status}`);
      }
    }

    console.log("Knowledge successfully linked to projects");
  } catch (error) {
    console.error("Error linking knowledge to projects:", error);
  }
}


export async function delinkKnowledgesFromProjects(
  projectId: number,
  knowledgeIds: number[]
): Promise<boolean> {
  try {

    const response = await fetch(`${API_URL}/knowledgebaseDelink`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ knowledgeIds, projectId }),
    });


    if (!response.ok) {
      throw new Error(`Failed to delink knowledge from project. Status: ${response.status}`);
    }
    console.log("Knowledges successfully delinked from project");
    return true

  } catch (error) {
    console.error("Error delinking knowledges from project:", error);
    return false
  }
}