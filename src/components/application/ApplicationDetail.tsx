import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { ApplicationItem } from '../../types';
import { convertGMTToLocal, getTimeAgo } from '../../utils/utils';

interface ApplicationDetailProps {
    app: ApplicationItem | undefined;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ app }) => {

    return (
        <div>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
                        <span className={`px-3 py-1 rounded-full bg-gray-100 text-sm`}>{app?.type}</span>

                    </div>
                    <div className="flex text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1 mt-0.5" />
                        <span>{app?.createdByUser}</span>
                    </div>
                </div>
                
                    <div className="flex flex-row justify-between space-x-2 text-xs text-gray-500 mb-4">
                        <div className="flex items-center mr-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Created: {app?.createDate}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {app?.lastUpdated && <span>Updated: {getTimeAgo(convertGMTToLocal(app?.lastUpdated))}</span>}
                        </div>
                    </div>
                


                <div className="mb-8">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Description</label>
                    <textarea
                        className="w-full min-h-[300px] p-2 text-sm rounded border border-gray-100 bg-gray-50"
                        disabled
                        value={app?.description}
                    />
                </div>

            </div>
        </div>
    );
};

export default ApplicationDetail;
