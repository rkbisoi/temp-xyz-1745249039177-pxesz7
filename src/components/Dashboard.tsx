// import { Trash } from "lucide-react";
// import React from "react";

// type DashboardCardProps = {
//   title: string;
//   description: string;
//   count: number;
//   onClick: () => void;
// };

// const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, count, onClick }) => (
//   <div
//     className="relative p-4 m-2 bg-white border border-sky-200 rounded shadow-b text-center cursor-pointer hover:bg-sky-100"
//     onClick={onClick}
//   >
//     {/* Circle with Icon */}
//     <div className="absolute top-2 left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center rounded-full">
//       < Trash />
//     </div>
//     <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//     <p className="text-4xl font-extrabold text-intelQEDarkBlue mb-2">{count}</p>
//     <p className="text-gray-600">{description}</p>
//   </div>
// );

// const Dashboard: React.FC = () => {
//   const handleCardClick = (section: string) => {
//     alert(`Navigating to ${section}`);
//   };

//   const sections = [
//     { title: "Projects", description: "Manage your test projects", count: 12 },
//     { title: "Applications", description: "Track and test applications", count: 8 },
//     { title: "Knowledge", description: "Access knowledge bases", count: 20 },
//     { title: "Data", description: "View test data", count: 15 },
//   ];

//   return (
//     <div className="mt-2 mx-auto p-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
//       {sections.map((section) => (
//         <DashboardCard
//           key={section.title}
//           title={section.title}
//           description={section.description}
//           count={section.count}
//           onClick={() => handleCardClick(section.title)}
//         />
//       ))}
//     </div>
//   );
// };

// export default Dashboard;


import React from "react";
import { BookOpen, Boxes, Database, FolderKanban } from "lucide-react"; 
import { BarGraph } from "./Icons";

type DashboardCardProps = {
  title: string;
  description: string;
  count: number;
  color: string;
  icon: React.ElementType; 
  onClick: () => void;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  count,
  color,
  icon: Icon,
  onClick,
}) => (
  <div
    className="relative p-4 py-7 m-2 bg-white rounded-[30px] drop-shadow-lg text-start pl-16 cursor-pointer max-w-80"
    onClick={onClick}
  >
    
    <div className={`absolute top-9 -left-8 w-16 h-16 text-gray-600 flex items-center justify-center rounded-full`} style={{ backgroundColor: color }}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-gray-500 mb-1 tracking-wider">{title}</h3>
    <p className="text-4xl font-extrabold text-gray-500 mb-3">{count}</p>
    <p className="text-gray-500 text-xs tracking-wider">{description}</p>
    <div className="flex flex-row mt-4">
    <BarGraph /><BarGraph /><BarGraph />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const handleCardClick = (section: string) => {
    alert(`Navigating to ${section}`);
  };

  const sections = [
    { title: "PROJECTS", description: "MANAGE YOUR TEST PROJECTS", count: 12, icon: FolderKanban, color:"#63d2ff"},
    { title: "APPLICATIONS", description: "TRACK AND TEST APPLICATIONS", count: 8, icon: Boxes, color:"#78d5d7"},
    { title: "KNOWLEDGE", description: "ACCESS KNOWLEDGE BASES", count: 20, icon: BookOpen,color:"#d7d9db" },
    { title: "DATA", description: "VIEW TEST DATA", count: 15, icon: Database, color:"#bed8d4"},
  ];

  return (
    <>
    <div className="mt-2 mx-auto p-8 px-52 px-32 grid grid-cols-1 sm:grid-cols-2 gap-y-12">
      {sections.map((section) => (
        <DashboardCard
          key={section.title}
          title={section.title}
          description={section.description}
          count={section.count}
          icon={section.icon}
          onClick={() => handleCardClick(section.title)}
          color={section.color}
        />
      ))}
    </div>
    </>
  );
};

export default Dashboard;
