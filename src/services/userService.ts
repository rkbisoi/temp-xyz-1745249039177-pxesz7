import { API_URL } from "../data";

export const createUser = async (username: string, email: string, password: string) => {
  try {

    const response = await fetch(`${API_URL}/registerUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage = responseData.error || responseData.message || 'Failed to create user';
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Re-throw the specific error to be handled by the calling function
  }
};


export const ActivateUsers = async (
  active: boolean,
  users: { id: number; update_seq_no: number }[]
): Promise<boolean> => {
  try {
    const requests = users.map(({ id, update_seq_no }) =>
      fetch(`${API_URL}/activateUserById/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          isActivate: active
          , update_seq_no
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Error activating ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`User ${id} activated successfully`, data);
      })
    );

    await Promise.all(requests);
    return true; // All users activated successfully
  } catch (error) {
    console.error("Error activating users", error);
    return false; // If any request fails
  }
};

export async function linkUsersToProjects(
  projectsIds: number[],
  userIds: number[]
): Promise<void> {
  try {
    const requests = userIds.map((userId) => {
      return fetch(`${API_URL}/linkProjectsToUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId, projectsIds }),
      });
    });

    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to link user to project. Status: ${response.status}`);
      }
    }

    console.log("Users successfully linked to projects");
  } catch (error) {
    console.error("Error linking users to projects:", error);
  }
}

export async function linkUsersToApplications(
  applicationIds: number[],
  userIds: number[]
): Promise<void> {
  try {
    const requests = userIds.map((userId) => {
      return fetch(`${API_URL}/linkApplicationsToUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId, applicationIds }),
      });
    });

    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to link user to applications. Status: ${response.status}`);
      }
    }

    console.log("Users successfully linked to applications");
  } catch (error) {
    console.error("Error linking users to applications:", error);
  }
}


export async function delinkUserFromProjects(
  projectIds: number[],
  userIds: number[]
): Promise<boolean> {
  try {
    const requests = userIds.map((userId) => {
      return fetch(`${API_URL}/deLinkUserProjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId, prjIdsToDeLink: projectIds }),
      });
    });

    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to delink user from project. Status: ${response.status}`);
      }
    }

    console.log("User successfully delinked from project");
    return true

  } catch (error) {
    console.error("Error delinking users from project:", error);
    return false
  }
}

export async function delinkUserFromApplication(
  projectIds: number[],
  userIds: number[]
): Promise<boolean> {
  try {
    const requests = userIds.map((userId) => {
      return fetch(`${API_URL}/deLinkUserApplications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId, appIdsToDeLink: projectIds }),
      });
    });

    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to delink user from application. Status: ${response.status}`);
      }
    }

    console.log("User successfully delinked from application");
    return true

  } catch (error) {
    console.error("Error delinking users from application:", error);
    return false
  }
}

export const getUserNameById = async (userId: number): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/GetUserProfile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response format");
    }

    const { firstName, lastName } = result.data;
    const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() + "." : "";

    return `${firstName} ${lastNameInitial}`;
  } catch (error) {
    console.error(`Error fetching user profile for userId ${userId}:`, error);
    return null;
  }
};




