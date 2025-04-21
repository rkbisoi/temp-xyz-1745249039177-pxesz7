// // DropdownPortal.tsx
// import { useEffect, useState } from 'react';
// import { createPortal } from 'react-dom';

// interface DropdownPortalProps {
//   isOpen: boolean;
//   children: React.ReactNode;
//   buttonRef: {
//     current: HTMLButtonElement | null;
//   };
// }

// export default function DropdownPortal({ isOpen, children, buttonRef }: DropdownPortalProps) {
//   const [position, setPosition] = useState({ top: 0, left: 0 });
  
//   // Always use useEffect, never conditionally
//   useEffect(() => {
//     if (isOpen && buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       // Position the dropdown while ensuring it stays within viewport
//       setPosition({
//         top: rect.bottom + window.scrollY,
//         left: Math.max(0, rect.right - 150 + window.scrollX), // Align to right edge, but don't go off screen
//       });
//     }
//   }, [isOpen, buttonRef.current]); // Include buttonRef.current in dependencies
  
//   // Early return pattern that doesn't break hooks rules
//   if (!isOpen) return null;
  
//   return createPortal(
//     <div 
//       style={{
//         position: 'absolute',
//         top: `${position.top}px`,
//         left: `${position.left}px`,
//         zIndex: 9999,
//       }}
//       className="w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {children}
//     </div>,
//     document.body
//   );
// }


import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownPortalProps {
  isOpen: boolean;
  buttonRef: {
    current: HTMLButtonElement | null;
  };
  buttonLabel: string; // Name of the button
  menuItems: DropdownItem[]; // List of actions with labels and handlers
}

export default function DropdownPortal({
  isOpen,
  buttonRef,
  buttonLabel,
  menuItems,
}: DropdownPortalProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Update position when the dropdown is opened or the button reference changes
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 150; // Fixed width for the dropdown
      const dropdownHeight = menuItems.length * 40 + 16; // Dynamic height based on items

      // Calculate position ensuring the dropdown stays within the viewport
      const top = rect.bottom + window.scrollY;
      const left = Math.max(
        0,
        Math.min(rect.right - dropdownWidth + window.scrollX, window.innerWidth - dropdownWidth)
      );

      // Ensure dropdown doesn't overflow vertically
      const bottomSpace = window.innerHeight - (top - window.scrollY);
      const adjustedTop = bottomSpace < dropdownHeight ? rect.top - dropdownHeight + window.scrollY : top;

      setPosition({ top: adjustedTop, left });
    }
  }, [isOpen, buttonRef.current, menuItems.length]);

  // Early return if the dropdown is not open
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from propagating
    >
      {/* Dropdown Items */}
      <ul className="py-1">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              item.onClick(); // Call the handler for the clicked item
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
}