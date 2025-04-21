import { useState, useEffect } from 'react';
import { 
  Search,
  ChevronRight,
  ChevronDown,
  FolderKanban,
  BookOpen,
  Database,
  Code,
  TestTube,
  Bot,
  BrainCircuit,
  Zap,
  LayoutDashboard,
  Loader2
} from 'lucide-react';
import { API_URL } from '../../data';

interface ComponentNode {
  id: string | number;
  type: string;
  label: string;
  icon: string;
  iconComponent?: any;
  data?: any;
}

interface Category {
  id: string;
  label: string;
  icon: any;
  items: ComponentNode[];
  loading?: boolean;
  error?: string;
}

export default function WorkflowSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['projects', 'tools', 'ai']);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      items: [],
      loading: true
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: BookOpen,
      items: [],
      loading: true
    },
    {
      id: 'data',
      label: 'Test Data',
      icon: Database,
      items: [],
      loading: true
    },
    {
      id: 'tools',
      label: 'Testing Tools',
      icon: TestTube,
      items: [
        { id: 'selenium', type: 'tool', label: 'Selenium Test', icon: 'TestTube', iconComponent: TestTube },
        { id: 'api', type: 'tool', label: 'API Test', icon: 'Code', iconComponent: Code },
        { id: 'performance', type: 'tool', label: 'Performance Test', icon: 'Zap', iconComponent: Zap }
      ]
    },
    {
      id: 'ai',
      label: 'AI Components',
      icon: BrainCircuit,
      items: [
        { id: 'llm', type: 'ai', label: 'LLM Processing', icon: 'BrainCircuit', iconComponent: BrainCircuit },
        { id: 'chatbot', type: 'ai', label: 'AI Assistant', icon: 'Bot', iconComponent: Bot },
        { id: 'analysis', type: 'ai', label: 'AI Analysis', icon: 'LayoutDashboard', iconComponent: LayoutDashboard }
      ]
    }
  ]);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock API responses (replace with actual fetch when API is ready)
        // Fetch Projects
                    const projectsResponse = await fetch(`${API_URL}/getAllProjects`, {
                      credentials: 'include'
                    });
                    const projectsData = await projectsResponse.json();
                    
                    // Fetch Knowledge Base
                    const knowledgeResponse = await fetch(`${API_URL}/knowledgebases`, {
                      credentials: 'include'
                    });
                    const knowledgeData = await knowledgeResponse.json();
                    
                    // Fetch Test Data
                    const dataResponse = await fetch(`${API_URL}/testdata/fetchAll/`, {
                      credentials: 'include'
                    });
                    const dataData = await dataResponse.json();

        setCategories(prev => prev.map(category => {
          if (category.id === 'projects') {
            return {
              ...category,
              loading: false,
              items: projectsData.data.map((project: any) => ({
                id: project.projID,
                type: 'project',
                label: project.projName,
                icon: 'FolderKanban',
                iconComponent: FolderKanban,
                data: project
              }))
            };
          }
          if (category.id === 'knowledge') {
            return {
              ...category,
              loading: false,
              items: knowledgeData.data.map((knowledge: any) => ({
                id: knowledge.kb_ID,
                type: 'knowledge',
                label: knowledge.kb_Name,
                icon: 'BookOpen',
                iconComponent: BookOpen,
                data: knowledge
              }))
            };
          }
          if (category.id === 'data') {
            return {
              ...category,
              loading: false,
              items: dataData.data.map((data: any) => ({
                id: data.dataId,
                type: 'data',
                label: data.dataName,
                icon: 'Database',
                iconComponent: Database,
                data: data
              }))
            };
          }
          return category;
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories(prev => prev.map(category => {
          if (['projects', 'knowledge', 'data'].includes(category.id)) {
            return {
              ...category,
              loading: false,
              error: 'Failed to load data'
            };
          }
          return category;
        }));
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: ComponentNode) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: node.type,
      data: {
        label: node.label,
        icon: node.icon,
        type: node.type,
        ...node.data
      }
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: (category.items || []).filter(item =>
      item?.label?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0 || category.loading);

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-4 rounded-lg">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-intelQEDarkBlue focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {filteredCategories.map(category => (
          <div key={category.id} className="rounded-lg overflow-hidden">
            <button
              className="flex items-center justify-between w-full p-2 text-left text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center">
                <category.icon className="h-4 w-4 mr-2 text-gray-600" />
                <span>{category.label}</span>
              </div>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedCategories.includes(category.id) && (
              <div className="mt-1 space-y-1 pl-2">
                {category.loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : category.error ? (
                  <div className="text-sm text-red-500 py-2 px-4">
                    {category.error}
                  </div>
                ) : (
                  category.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-move transition-all"
                      draggable
                      onDragStart={(e) => onDragStart(e, item)}
                    >
                      {item.iconComponent && <item.iconComponent className="h-4 w-4 mr-2 text-gray-600" />}
                      <span className="flex-1 truncate">{item.label}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}