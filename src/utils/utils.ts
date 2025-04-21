import { TestSuite } from "../components/test/types";
import { Item } from "../types";
import { DateTime } from "luxon";

export function getItemType(item: Item): string {
  if ('instruction' in item) {
    return 'ProjectItem';
  }
  if ('global' in item) {
    return 'KnowledgeItem';
  }
  if ('role' in item && 'lastLogin' in item) {
    return 'UserItem';
  }
  if ('role' in item && 'sentBy' in item) {
    return 'InvitationItem';
  }
  if ('dataExample' in item){
    return 'DataItem'
  }
  if ('execute_after_in_ms' in item) {
    return 'ScheduledTaskItem';
  }
  if ('type' in item) {
    return 'ApplicationItem';
  }
  
  return 'Unknown';
}

export function getInviteStatus(dateTimeStr: string, isUsed: boolean): string {
  const inputDate = new Date(dateTimeStr.split("/").reverse().join("-"));
  const currentDate = new Date();

  if (isUsed) return "accepted";
  return inputDate < currentDate ? "expired" : "pending";
}


export function getStatusColor(status: string): string {
  switch (status) {
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Planning':
      return 'bg-yellow-100 text-yellow-800';
    case 'Review':
      return 'bg-green-100 text-green-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'running':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'Pass':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'Fail':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


export function convertDateTime(input: string): string {
  const inputDate = new Date(input);

  if (isNaN(inputDate.getTime())) {
    console.error("Invalid date input:", input);
    return "";
  }

  return `${inputDate.getDate().toString().padStart(2, '0')}/` +
         `${(inputDate.getMonth() + 1).toString().padStart(2, '0')}/` +
         `${inputDate.getFullYear()} ` +
         `${inputDate.getHours().toString().padStart(2, '0')}:` +
         `${inputDate.getMinutes().toString().padStart(2, '0')}:00`;
}


export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Passed':
      return 'bg-green-100 text-green-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Running':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function getTestSuiteStatus(testSuite: TestSuite): string {
  if (testSuite.totalTestSuiteLogs === 0) {
    return "No Tests"; // Optional: Handle empty test suites
  }

  const hasFailed = testSuite.totalFailed > 0;
  if (hasFailed) return "Failed";

  return "Passed"; // If no failed or pending tests, all must be passed
}


export const getTimeAgo = (dateString: string): string => {
  const dateParts = dateString.split(/[/ :]/);
  const [day, month, year, hours, minutes, seconds] = dateParts.map(Number);

  // Convert to a Date object (month is zero-based in JS)
  const pastDate = new Date(year, month - 1, day, hours, minutes, seconds);
  const currentDate = new Date();

  const diffInSeconds = Math.floor((currentDate.getTime() - pastDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else if (diffInSeconds < 31536000) {
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  } else {
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }
};


export const htmlToText = (html: string): string => {
  if(html === ''){
    return ''
  }
  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Process specific elements to maintain some structure
  // Replace headings with their text + newlines
  const headings = temp.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const text = heading.textContent;
    const newHeading = document.createTextNode(`${text}\n\n`);
    heading.parentNode?.replaceChild(newHeading, heading);
  });
  
  // Handle lists (both ordered and unordered)
  const lists = temp.querySelectorAll('ul, ol');
  lists.forEach(list => {
    const items = list.querySelectorAll('li');
    const listTexts: string[] = [];
    
    items.forEach((item, index) => {
      if (list.tagName === 'OL') {
        // For ordered lists, add numbers
        listTexts.push(`${index + 1}. ${item.textContent}`);
      } else {
        // For unordered lists, add bullets
        listTexts.push(`• ${item.textContent}`);
      }
    });
    
    const textNode = document.createTextNode(listTexts.join('\n') + '\n\n');
    list.parentNode?.replaceChild(textNode, list);
  });
  
  // Handle paragraphs
  const paragraphs = temp.querySelectorAll('p');
  paragraphs.forEach(p => {
    const text = p.textContent;
    const newText = document.createTextNode(`${text}\n\n`);
    p.parentNode?.replaceChild(newText, p);
  });
  
  // Get the plain text and clean up extra whitespace
  let text = temp.textContent || '';
  text = text.replace(/\n{3,}/g, '\n\n'); // Replace 3+ newlines with 2
  return text.trim();
};



export const formatDateToId = () => {
  const now = new Date();
  
  const day = String(now.getDate()).padStart(2, '0'); 
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};

export function convertGMTToLocal(gmtTimeStr: string): string {
  // Get the system's local timezone
  const localZone = DateTime.local().zoneName;

  // Parse the string as GMT
  const gmtDateTime = DateTime.fromFormat(gmtTimeStr, "dd/MM/yyyy HH:mm:ss", { zone: "UTC" });

  // Convert to system's local timezone
  const localDateTime = gmtDateTime.setZone(localZone);

  // Format back to the original string format
  return localDateTime.toFormat("dd/MM/yyyy HH:mm:ss");
}


export function convertLocalToGMT(localTimeStr: string): string {
  // Get the system's local timezone dynamically
  const localZone = DateTime.local().zoneName;

  // Parse the string in the local timezone
  const localDateTime = DateTime.fromFormat(localTimeStr, "dd/MM/yyyy HH:mm:ss", { zone: localZone });

  // Convert to GMT (UTC)
  const gmtDateTime = localDateTime.setZone("UTC");

  // Format back to the original string format
  return gmtDateTime.toFormat("dd/MM/yyyy HH:mm:ss");
}

export function convertGMTToLocal2(gmtTimeStr: string): string {
  // Get the system's local timezone
  const localZone = DateTime.local().zoneName;

  // Parse the GMT string
  const gmtDateTime = DateTime.fromFormat(gmtTimeStr, "yyyy-MM-dd HH:mm:ss", { zone: "UTC" });

  // Convert to system's local timezone
  const localDateTime = gmtDateTime.setZone(localZone);

  // Return formatted local time
  return localDateTime.toFormat("yyyy-MM-dd HH:mm:ss");
}


export function convertLocalToGMT2(localTimeStr: string): string {
  // Get the system's local timezone dynamically
  const localZone = DateTime.local().zoneName;

  // Parse the local time string
  const localDateTime = DateTime.fromFormat(localTimeStr, "yyyy-MM-dd HH:mm:ss", { zone: localZone });

  // Convert to GMT (UTC)
  const gmtDateTime = localDateTime.setZone("UTC");

  // Return formatted GMT time
  return gmtDateTime.toFormat("yyyy-MM-dd HH:mm:ss");
}


export function extractTestSuiteId(input: string): number | null {
  console.log("Test Suite ID : ", input)
  const match = input.match(/\[WSS\]-\[DATA\]-\[[^\]]*?_(\d+)\]-36/);
  return match ? parseInt(match[1], 10) : null;
}


export function formatUserName(fullName: string): string {
  const nameParts = fullName.trim().split(" ");
  if (nameParts.length < 2) {
    return fullName; // Return the same name if there’s no last name
  }
  return `${nameParts[0]} ${nameParts[1].charAt(0).toUpperCase()}`;
}
