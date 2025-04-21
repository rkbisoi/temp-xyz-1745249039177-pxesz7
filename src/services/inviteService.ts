import { API_URL } from "../data";

export const ReinviteUsers = async (ids: number[]): Promise<boolean> => {
    try {
        const requests = ids.map((id) =>
            fetch(`${API_URL}/reInviteUser/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }).then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Error reinviting ${id}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(`User ${id} reinvited successfully`, data);
            })
        );

        await Promise.all(requests);
        return true; // Return true if all users are reinvited successfully
    } catch (error) {
        console.error("Error reinviting users", error);
        return false; // Return false if any reinvite fails
    }
};
