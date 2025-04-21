import { useState } from 'react';
import { Users, Square, CheckSquare, MoreHorizontal, RefreshCw, Play, Pause } from 'lucide-react';
import { ListConfig } from './types';
import { ApplicationItem, InvitationItem, Item, ProjectItem } from '../../types';
import ListHeader from './ListHeader';
import ListFilters from './ListFilter';
import ListItemCard from './ListItemCard';
import ListPagination from './ListPagination';
import BulkActions from './BulkActions';
import { getItemType, getStatusColor } from '../../utils/utils';
import { deleteProjects, fetchAllProjects } from '../../services/projectService';
import toast from 'react-hot-toast';
import { deleteKnowledges, delinkKnowledgesFromProjects } from '../../services/knowledgeService';
import { useDialog } from './DialogProvider';
import LinkEntitiesForm from './LinkEntitiesForm';
import { getUserId } from '../../utils/storage';
import { ReinviteUsers } from '../../services/inviteService';
import { ActivateUsers, delinkUserFromApplication, delinkUserFromProjects } from '../../services/userService';
import { deleteTestData, delinkDataFromProjects } from '../../services/dataService';
import { deleteSchedule } from '../../services/scheduleService';
import { deleteApplication, delinkProjectsFromApplication, fetchAllApplication } from '../../services/applicationService';

interface ListViewProps {
  items: Item[];
  config: ListConfig;
  onItemView: (id: number) => void;
  onAddItem: () => void;
  projectId: number,
  applicationId: number,
  isApp: boolean,
  defaultView?: 'grid' | 'list';
}

export default function ListView({ items, config, onItemView, onAddItem, projectId = -1, applicationId = -1, isApp = true, defaultView = 'grid' }: ListViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>(config.sortOptions?.[0]?.key || 'name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const { showDialog } = useDialog();
  const [isKnowledgeLinkFormOpen, setKnowledgeLinkFormOpen] = useState(false);
  const [isProjectLinkFormOpen, setProjectLinkFormOpen] = useState(false);
  const [isDataLinkFormOpen, setDataLinkFormOpen] = useState(false);
  const [isUserLinkFormOpen, setUserLinkFormOpen] = useState(false);
  const [isUserLinkAppFormOpen, setUserLinkAppFormOpen] = useState(false);
  const [allUserProjects, setAllUserProjects] = useState<ProjectItem[]>([]);
  const [allApplication, setAllApplication] = useState<ApplicationItem[]>([]);
  const [sourceIds, setSourceIds] = useState<number[]>([]);

  const itemsPerPage = 9;

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        ((item as InvitationItem).email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesStatus = !statusFilter || ('status' in item && item.status === statusFilter);
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      }
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleItemSelection = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map(item => item.id)));
    }
  };

  const handleLinkAction = async () => {
    const selectedItemList = items
      .filter(item => selectedItems.has(item.id))
      .map(item => (item.id));


    console.log("Source IDs to link : ", selectedItemList)

    if (getItemType(items[0]) === 'ProjectItem') {
      const userId = getUserId();
      if (!userId) {
        console.warn("User ID is missing");
        return;
      }

      const fetchedApplications = await fetchAllApplication();

      if (fetchedApplications.length > 0) {
        setAllApplication(fetchedApplications);
        setSourceIds(selectedItemList)
        setProjectLinkFormOpen(true)
      }
    } else if (getItemType(items[0]) === 'KnowledgeItem') {
      const userId = getUserId();
      if (!userId) {
        console.warn("User ID is missing");
        return;
      }

      const fetchedProjects = await fetchAllProjects();

      if (fetchedProjects.length > 0) {
        setAllUserProjects(fetchedProjects);
        setSourceIds(selectedItemList)
        setKnowledgeLinkFormOpen(true)
      }
    } else if (getItemType(items[0]) === 'DataItem') {
      const userId = getUserId();
      if (!userId) {
        console.warn("User ID is missing");
        return;
      }

      const fetchedProjects = await fetchAllProjects();

      if (fetchedProjects.length > 0) {
        setAllUserProjects(fetchedProjects);
        setSourceIds(selectedItemList)
        setDataLinkFormOpen(true)
      }
    } else if (getItemType(items[0]) === 'UserItem') {
      const userId = getUserId();
      if (!userId) {
        console.warn("User ID is missing");
        return;
      }

      if (isApp) {
        const fetchedApplications = await fetchAllApplication();

        if (fetchedApplications.length > 0) {
          setAllApplication(fetchedApplications);
          setSourceIds(selectedItemList)
          setUserLinkAppFormOpen(true)
        }
      } else {
        const fetchedProjects = await fetchAllProjects();

        if (fetchedProjects.length > 0) {
          setAllUserProjects(fetchedProjects);
          setSourceIds(selectedItemList)
          setUserLinkFormOpen(true)
        }
      }

    }

  }


  const handleDelinkAction = async () => {
    const selectedItemList = items
      .filter(item => selectedItems.has(item.id))
      .map(item => (item.id));

    showDialog({
      title: 'Confirm Delink',
      message: 'Are you sure you want to delink this item?',
      type: 'confirm',
      confirmLabel: 'Delink',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          console.log(`Performing Delink on:`, selectedItems);

          if (!items || items.length === 0) {
            toast.error("No items selected for delink.");
            return;
          }

          const typ = getItemType(items[0]);
          console.log(`Item Type: ${typ}`);

          let success = false;

          switch (typ) {
            case "ProjectItem":
              if (isApp && applicationId > 0) {
                success = await delinkProjectsFromApplication(applicationId, selectedItemList);
              }
              break;
            case "KnowledgeItem":
              if (!isApp && projectId > 0) {
                success = await delinkKnowledgesFromProjects(projectId, selectedItemList);
              }
              break;
            case "DataItem":
              if (!isApp && projectId > 0) {
                success = await delinkDataFromProjects(projectId, selectedItemList);
              }
              break;
            case "UserItem":
              if (!isApp && projectId > 0) {
                success = await delinkUserFromProjects([projectId], selectedItemList);
              } else if (isApp && applicationId > 0) {
                success = await delinkUserFromApplication([applicationId], selectedItemList);
              }
              break;
            default:
              toast.error("Unknown item type. Delinking failed.");
              return;
          }

          if (success) {
            toast.success("Items delinked successfully!");
            setSelectedItems(new Set());
          } else {
            toast.error("Failed to delink some or all items.");
          }
        } catch (error) {
          console.error("Error delinking items:", error);
          toast.error("An unexpected error occurred during delink.");
        }
      }
    });
  }


  const handleDeleteAction = async () => {
    const selectedItemList = items
      .filter(item => selectedItems.has(item.id))
      .map(item => ({ id: item.id, update_seq_no: item.update_seq_no }));

    showDialog({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      type: 'confirm',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          console.log(`Performing Delete on:`, selectedItems);

          if (!items || items.length === 0) {
            toast.error("No items selected for deletion.");
            return;
          }

          const typ = getItemType(items[0]);
          console.log(`Item Type: ${typ}`);

          let success = false;

          switch (typ) {
            case "ApplicationItem":
              success = await deleteApplication(selectedItemList);
              break;
            case "ProjectItem":
              success = await deleteProjects(selectedItemList);
              break;
            case "KnowledgeItem":
              success = await deleteKnowledges(selectedItemList);
              break;
            case "DataItem":
              success = await deleteTestData(selectedItemList);
              break;
            case "ScheduledTaskItem":
              success = await deleteSchedule(selectedItemList);
              break;
            default:
              toast.error("Unknown item type. Deletion failed.");
              return;
          }

          if (success) {
            toast.success("Items deleted successfully!");
            setSelectedItems(new Set());
          } else {
            toast.error("Failed to delete some or all items.");
          }
        } catch (error) {
          console.error("Error deleting items:", error);
          toast.error("An unexpected error occurred during deletion.");
        }
      }
    });
  }

  const handleReinviteteAction = async () => {
    const selectedItemList = items
      .filter(item => selectedItems.has(item.id))
      .map(item => (item.id));

    showDialog({
      title: 'Confirm Reinvite',
      message: 'Are you sure you want to reinvite this user?',
      type: 'confirm',
      confirmLabel: 'Reinvite',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        console.log(`Performing Reinvite on:`, selectedItems);

        const typ = getItemType(items[0]);
        console.log(typ);

        var success = await ReinviteUsers(selectedItemList);


        if (success) {
          toast.success("Users reinvited successfully!");
          setSelectedItems(new Set());
        } else {
          toast.error("Failed to reinvite some or all users.");
        }
      }
    })
  }

  const handleActivateAction = async () => {
    const selectedItemList = items
      .filter(item => selectedItems.has(item.id))
      .map(item => ({ id: item.id, update_seq_no: item.update_seq_no }));

    showDialog({
      title: 'Confirm Activate',
      message: 'Are you sure you want to activate this user?',
      type: 'confirm',
      confirmLabel: 'Activate',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        console.log(`Performing Activate on:`, selectedItems);

        const typ = getItemType(items[0]);
        console.log(typ);

        var success = await ActivateUsers(true, selectedItemList);


        if (success) {
          toast.success("Users activated successfully!");
          setSelectedItems(new Set());
        } else {
          toast.error("Failed to activate some or all users.");
        }
      }
    })
  }


  const handleDeActivateAction = async () => {
    const selectedItemList = items
      .filter(item => selectedItems.has(item.id))
      .map(item => ({ id: item.id, update_seq_no: item.update_seq_no }));

    showDialog({
      title: 'Confirm Dectivate',
      message: 'Are you sure you want to deactivate this user?',
      type: 'confirm',
      confirmLabel: 'Deactivate',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        console.log(`Performing Deactivate on:`, selectedItems);

        const typ = getItemType(items[0]);
        console.log(typ);

        var success = await ActivateUsers(false, selectedItemList);


        if (success) {
          toast.success("Users deactivated successfully!");
          setSelectedItems(new Set());
        } else {
          toast.error("Failed to deactivate some or all users.");
        }
      }
    })
  }

  const handleBulkAction = (action: string) => {

    if (action === "delete") {
      handleDeleteAction()
    } else if (action === "link") {
      handleLinkAction()
    } else if (action === "reinvite") {
      handleReinviteteAction()
    } else if (action === "activate") {
      handleActivateAction()
    } else if (action === "deactivate") {
      handleDeActivateAction()
    } else if (action === "delink") {
      handleDelinkAction()
    }

  };

  var filteredBulkActions = config?.bulkActions?.filter(action =>
    // action.action !== 'delink' || (!isApp && projectId > 0) || (isApp && applicationId > 0)
    action.action !== 'delink' || (projectId > 0) || (applicationId > 0)
  );

  filteredBulkActions = filteredBulkActions?.filter(action =>
    action.action !== 'link' || (!isApp && projectId === -1)
  );

  return (
    <div>
      <div className="max-w-8xl mx-auto">
        <ListHeader
          title={config.title}
          addButtonText={config.addButtonText}
          onAddItem={onAddItem}
        />

        <ListFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={config.searchPlaceholder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={toggleSort}
          sortOrder={sortOrder}
          config={config}
        />

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                config={config}
                isSelected={selectedItems.has(item.id)}
                onSelect={toggleItemSelection}
                onView={onItemView}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 px-6 py-3">
                    <button
                      onClick={toggleAllSelection}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {selectedItems.size === paginatedItems.length ? (
                        <CheckSquare className="h-5 w-5 text-intelQEDarkBlue" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {config.title}
                  </th>
                  {config.showStatus && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  )}
                  {config.showProgress && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  )}
                  {config.showMembers && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                  )}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th> */}

                  {config.showRole && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  )}

                  {(config.showSchedule || config.showType || config.showGlobal) && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  )}

                  {config.showSchedule &&
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start
                    </th>
                  }
                  {config.showSchedule &&
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End
                    </th>
                  }
                  {config.showSchedule &&
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last
                    </th>
                  }
                  {config.showSchedule &&
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next
                    </th>
                  }

                  {items.length > 0 && items[0].createDate && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Create Date
                    </th>
                  )}
                  {items.length > 0 && items[0].createdByUser && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onItemView(item.id)}>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleItemSelection(item.id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        {selectedItems.has(item.id) ? (
                          <CheckSquare className="h-5 w-5 text-intelQEDarkBlue" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 max-w-[500px]">
                      {(getItemType(item) === 'InvitationItem' && 'email' in item) ? (
                        <div className="flex flex-col">
                          <div className="font-medium text-gray-900">{item.email}</div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                          <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
                        </div>
                      )}

                    </td>
                    {'status' in item && config.showStatus && getStatusColor && typeof item.status === 'string' && (
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    )}
                    {"completed" in item && getStatusColor && (
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.completed ? 'completed' : 'pending')}`}>
                          {item.completed ? 'completed' : 'pending'}
                        </span>
                      </td>

                    )}
                    {'progress' in item && config.showProgress && typeof item.progress === 'number' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-intelQEDarkBlue rounded-full h-2"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{item.progress}%</span>
                        </div>
                      </td>
                    )}
                    {'members' in item && config.showMembers && typeof item.members === 'number' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{item.members}</span>
                        </div>
                      </td>
                    )}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{item.lastUpdated}</span>
                      </div>
                    </td> */}
                    {"role" in item && config.showRole && (
                      <td className="px-6 py-4">

                        <span className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-800">
                          {item.role === "admin" ? "Admin" : "User"}
                        </span>

                      </td>
                    )}

                    {"global" in item && config.showGlobal && (
                      <td className="px-6 py-4">

                        <span className={`px-2 py-1 text-xs rounded-full ${item.global ? "bg-sky-100 text-sky-800" : "bg-gray-100 text-gray-800"} `}>
                          {item.global ? "Global" : "Private"}
                        </span>

                      </td>
                    )}

                    {"type" in item && config.showType && (
                      <td className="px-4 py-4">

                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {item.type}
                        </span>

                      </td>
                    )}
                    {"role" in item && config.showType && (
                      <td className="px-4 py-4">

                        <span className={`px-2 py-1 text-xs rounded-full ${item.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.role}
                        </span>

                      </td>
                    )}
                    {"repeat_schedule" in item && (
                      <td className="px-2 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          <span>{item.repeat_schedule ? 'Repeating' : 'One-time'}</span>
                        </div>
                      </td>

                    )}

                    {(config.showSchedule && 'schStartTime' in item) && (
                      <td className="px-2 py-4">
                        <span className='text-sm text-gray-500'>{item.schStartTime ? item.schStartTime : 'N.A.'}</span>
                      </td>
                    )}

                    {(config.showSchedule && 'runSchTillDate' in item) && (
                      <td className="px-2 py-4">
                        <span className='text-sm text-gray-500'>{item.runSchTillDate ? item.runSchTillDate : 'N.A.'}</span>
                      </td>
                    )}

                    {('last_execution_time' in item && config.showSchedule) && (
                      <td className="px-2 py-4">
                        <span className='text-sm text-gray-500'>{item.last_execution_time ? item.last_execution_time : 'N.A.'}</span>
                      </td>
                    )}

                    {('next_execution_time' in item && config.showSchedule) && (
                      <td className="px-2 py-4">
                        <span className='text-sm text-gray-500'>{item.next_execution_time ? item.next_execution_time : 'N.A.'}</span>
                      </td>
                    )}



                    {'createDate' in item && item.createDate && (
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {item.createDate}
                      </td>
                    )}

                    {item.createdByUser && "global" in item && "type" in item && (
                      <td className={`px-6 py-4 text-sm ${item.type === 'Flame' ? 'text-intelQEDarkBlue' : 'text-gray-600 '}`}>
                        {item.type === 'Flame' ? 'IntelQE' : item.createdByUser}
                      </td>
                    )}

                    {item.createdByUser && !("global" in item) && (
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.createdByUser}
                      </td>
                    )}

                    <td className={`px-4 py-4 text-right ${config.showSchedule ? 'pr-4' : 'pr-10'}`} onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        {config.showSchedule && (("pause" in item && item.pause) ? (
                          <button
                            className="p-2 mr-2 border border-gray-100 shadow-md text-green-600 rounded-full hover:bg-green-50"
                            title="Run Now"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            className="p-2 mr-2 border border-gray-100 shadow-md text-red-600 rounded-full hover:bg-red-50"
                            title="Run Now"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        ))}

                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === item.id ? null : item.id)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-5 w-5 text-intelQEDarkBlue" />
                        </button>
                        {dropdownOpen === item.id && (
                          <div className="absolute top-4 right-0 mt-2 w-28 bg-white border rounded shadow-md z-49">
                            <ul>
                              <li
                                onClick={() => {
                                  onItemView(item.id);
                                  setDropdownOpen(null);
                                }}
                                className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
                              >
                                View
                              </li>
                              <hr />
                              <li
                                onClick={() => setDropdownOpen(null)}
                                className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
                              >
                                Link
                              </li>
                              <hr />
                              <li
                                onClick={() => setDropdownOpen(null)}
                                className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
          startIndex={startIndex}
          itemsName={config.itemsName}
          onPageChange={setCurrentPage}
        />

        <BulkActions
          selectedItems={items.filter(item => selectedItems.has(item.id))}
          onAction={handleBulkAction}
          actions={filteredBulkActions}
        />
        <LinkEntitiesForm
          isOpen={isKnowledgeLinkFormOpen}
          onClose={() => setKnowledgeLinkFormOpen(false)}
          sourceType="knowledge"
          sourceIds={sourceIds}
          targetType="project"
          availableItems={allUserProjects}
          linkedItems={[]}
          title="Link Knowledges To Projects"
          onLink={(selectedIds) => {
            // Handle linking logic here
            console.log('Linking items with IDs:', selectedIds);
          }}
        />

        <LinkEntitiesForm
          isOpen={isDataLinkFormOpen}
          onClose={() => setDataLinkFormOpen(false)}
          sourceType="data"
          sourceIds={sourceIds}
          targetType="project"
          availableItems={allUserProjects}
          linkedItems={[]}
          title="Link Data To Projects"
          onLink={(selectedIds) => {
            // Handle linking logic here
            console.log('Linking items with IDs:', selectedIds);
          }}
        />

        <LinkEntitiesForm
          isOpen={isUserLinkFormOpen}
          onClose={() => setUserLinkFormOpen(false)}
          sourceType="user"
          sourceIds={sourceIds}
          targetType="project"
          availableItems={allUserProjects}
          linkedItems={[]}
          title="Link Users To Projects"
          onLink={(selectedIds) => {
            // Handle linking logic here
            console.log('Linking items with IDs:', selectedIds);
          }}
        />
        <LinkEntitiesForm
          isOpen={isUserLinkAppFormOpen}
          onClose={() => setUserLinkAppFormOpen(false)}
          sourceType="user"
          sourceIds={sourceIds}
          targetType="application"
          availableItems={allApplication}
          linkedItems={[]}
          title="Link Users To Application"
          onLink={(selectedIds) => {
            // Handle linking logic here
            console.log('Linking items with IDs:', selectedIds);
          }}
        />
        <LinkEntitiesForm
          isOpen={isProjectLinkFormOpen}
          onClose={() => setProjectLinkFormOpen(false)}
          sourceType="project"
          sourceIds={sourceIds}
          targetType="application"
          availableItems={allApplication}
          linkedItems={[]}
          title="Link Users To Application"
          onLink={(selectedIds) => {
            // Handle linking logic here
            console.log('Linking items with IDs:', selectedIds);
          }}
        />
      </div>
    </div>
  );
}