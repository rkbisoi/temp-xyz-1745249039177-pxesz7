import React from 'react';

interface ProjectSidebarProps {
  options: string[];
  icons: JSX.Element[]; 
  onOptionClick: (option: string) => void;
  activeOption: string;
  isCollapsed: boolean;
  // toggleSidebar: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  options,
  icons,
  onOptionClick,
  activeOption,
  isCollapsed,
  // toggleSidebar,
}) => {
  return (
    <div
      className={`bg-gray-50 text-gray-800 items-center transition-all duration-300 ${
        isCollapsed ? 'w-12 flex flex-col items-center' : 'w-40'
      }`}
    >
      {/* <div
        className={`p-2 flex items-center justify-between h-16 bg-gray-100 rounded-t cursor-pointer ${isCollapsed ? 'w-11' : 'w-full'}`}
        onClick={toggleSidebar}
      >
        {!isCollapsed && (
          <span className="text-sm font-semibold ml-2">Project Name</span>
        )}
        {isCollapsed ? (
          <ArrowRightToLine  className="size-4 text-gray-600 ml-1" />
        ) : (
          <ArrowLeftToLine  className="size-4 text-gray-600" />
        )}
      </div> */}
      <nav className="bg-gray-100 rounded border border-gray-100">
        {options.map((option, index) => (
          <button
          key={option}
          onClick={() => onOptionClick(option)}
          className={`w-full flex flex-row text-gray-700 justify-start px-3 py-4 hover:bg-white transition-colors relative
            ${activeOption === option ? 'bg-white text-black' : ' '}`}
        >
          <span
            className={`absolute left-0 top-0 h-full w-[4px] bg-intelQEBlue rounded-r-sm ${
              activeOption === option ? '' : 'hidden'
            }`}
          ></span>
          <span className={`text-sm w-5 h-5 flex justify-start ${activeOption === option ? 'text-intelQEDarkBlue' : ''} ${isCollapsed ? '' : ' ml-2'}` }>{icons[index]}</span>
          {!isCollapsed && (<span className={`ml-3 mt-1 tracking-wide text-[12px] ${activeOption === option ? 'font-bold text-intelQEDarkBlue' : ''}`}>
            {option}
          </span>)}
        </button>
        ))}
      </nav>
    </div>
  );
};

export default ProjectSidebar;


