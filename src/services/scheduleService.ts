import { API_URL } from "../data";
import { emitter } from "../utils/eventEmitter";

export const deleteSchedule = async (data: { id: number; update_seq_no: number }[]): Promise<boolean> => {
    try {
        for (const { id, update_seq_no } of data) {
            const response = await fetch(`${API_URL}/schedule/${id}?update_seq_no=${update_seq_no}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            
            if (!response.ok) {
                throw new Error(`Error deleting schedule ${id}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Schedule ${id} deleted successfully`, data);
            emitter.emit('refreshScheduleList')
        }
        return true; // Return true if all projects are deleted successfully
    } catch (error) {
        console.error("Error deleting schedules", error);
        return false; // Return false if any deletion fails
    }
};