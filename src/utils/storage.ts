export const getUserId = (): number | null => {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const parsedData = JSON.parse(userData);
    return parsedData.userId || null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const isUserAdmin = (): boolean => {
  const userData = localStorage.getItem("user");
  if (!userData) return false;

  try {
    const parsedData = JSON.parse(userData);
    return parsedData.admin || false;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return false;
  }
};

export const getUserUpdSeqNo = (): number => {
  const userData = localStorage.getItem("user");
  if (!userData) return -1;

  try {
    const parsedData = JSON.parse(userData);
    return parsedData.updateSeqNo || null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return -1;
  }
};

export const getUserName = (): string | null => {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const parsedData = JSON.parse(userData);
    const lastNameInitial = parsedData.lastName ? parsedData.lastName.charAt(0).toUpperCase() + '.' : '';
    return `${parsedData.firstName} ${lastNameInitial}`;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};



