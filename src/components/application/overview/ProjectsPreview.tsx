import { Project } from '../interface';

interface ProjectsPreviewProps {
  projects: Project[];
}

export default function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button className="text-blue-600 text-sm hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{project.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {project.type}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {project.testsCount} tests · Last run: {project.lastRun}
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${project.passRate}%` }}
                />
              </div>
              <span className="ml-2 text-sm font-medium">{project.passRate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}