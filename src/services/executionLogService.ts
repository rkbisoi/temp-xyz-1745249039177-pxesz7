import { API_URL } from "../data";

export const deleteExecutionLogs = async (ids: number[]): Promise<boolean> => {
    try {
        for (const id of ids) {
            const response = await fetch(`${API_URL}/execution-log/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error deleting  ${id}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Execution Log ${id} deleted successfully`, data);
        }
        return true; // Return true if all projects are deleted successfully
    } catch (error) {
        console.error("Error deleting execution logs", error);
        return false; // Return false if any deletion fails
    }
};