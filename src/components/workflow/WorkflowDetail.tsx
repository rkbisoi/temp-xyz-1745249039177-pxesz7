import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Connection,
  addEdge,
  NodeProps,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X } from 'lucide-react';
import WorkflowSidebar from './WorkflowSidebar';
import { WorkflowItem } from '../../types';
import * as Icons from 'lucide-react';

// Node Modal Component
const NodeModal = ({ node, onClose, onSave }: any) => {
  const [description, setDescription] = useState(node.description || '');
  const [instructions, setInstructions] = useState(node.instructions || '');

  const handleSave = () => {
    onSave(node.id, {
      description,
      instructions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Node: {node.label}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-intelQEDarkBlue text-white rounded-md text-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Node Component
const CustomNode = ({ id, data }: NodeProps) => {
  const IconComponent = data.icon && (Icons as any)[data.icon] ? (Icons as any)[data.icon] : Icons.Box;

  return (
    <div
      className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200 cursor-pointer"
      onClick={() => data.onNodeClick(data)}
    >
      {/* Source Handle */}
      <Handle type="source" position={Position.Right} style={{ background: '#fff', border: '1px solid #ccc' }} />

      {/* Target Handle */}
      <Handle type="target" position={Position.Left} style={{ background: '#fff', border: '1px solid #ccc' }} />

      <div className="flex items-center">
        <IconComponent className="h-4 w-4 mr-2 text-gray-600" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs text-gray-500 mt-1 truncate max-w-40">{data.description}</div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface WorkflowDetailProps {
  workflowId: number;
  isOpen: boolean;
  onClose: () => void;
}

const mockWorkflows: WorkflowItem[] = [
  {
    id: 1,
    name: 'Test Automation Flow',
    description: 'End-to-end test automation workflow',
    type: 'Test Automation',
    status: 'active',
    lastUpdated: '2h ago',
    createDate: '2024-03-20',
    update_seq_no: 1,
  },
];

export default function WorkflowDetail({ workflowId, isOpen, onClose }: WorkflowDetailProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const workflow = mockWorkflows.find((wf) => wf.id === workflowId);

  useEffect(() => {
    if (isOpen && nodes.length === 0) {
      const initialNodes = [
        {
          id: 'start-node',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: {
            label: 'Start',
            icon: 'PlayCircle',
            description: 'Starting point of the workflow',
            onNodeClick: handleNodeClick,
          },
        },
        {
          id: 'end-node',
          type: 'custom',
          position: { x: 250, y: 300 },
          data: {
            label: 'End',
            icon: 'StopCircle',
            description: 'Ending point of the workflow',
            onNodeClick: handleNodeClick,
          },
        },
      ];
  
      console.log('Initializing nodes:', initialNodes); // Debugging line
      setNodes(initialNodes);
    }
  }, [isOpen, nodes, setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${nodeData.type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          ...nodeData.data,
          onNodeClick: handleNodeClick,
        },
      };
      

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowWrapper, setNodes]
  );

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-2 border-b">
          <h2 className="text-lg font-bold text-intelQEDarkBlue ml-2">
            {workflow ? workflow.name : 'Unknown Workflow'}
          </h2>
          <div className="flex items-center gap-2">
            <button className="btn2">Save Draft</button>
            <button className="btn1">Publish</button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden p-1">
          <div
            ref={reactFlowWrapper}
            className="flex-1 p-1 border border-gray-100 rounded-lg ml-1"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
          <WorkflowSidebar />
        </div>

        {selectedNode && (
          <NodeModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSave={handleNodeUpdate}
          />
        )}
      </div>
    </div>
  );
}