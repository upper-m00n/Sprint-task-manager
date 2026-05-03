import React from 'react'
import { Plus } from 'lucide-react'
import { useWorkItem } from '../../context/WorkItemContext'


const CreateBtn = () => {
    const { openModal } = useWorkItem();
    return (
        <button
            onClick={openModal}
            className="flex items-center gap-1.5 bg-primary-deep hover:bg-primary-deep/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-[0_4px_14px_0_rgba(0,0,128,0.2)] active:scale-95"
        >
            <Plus className="h-4 w-4" />
            <span>Create</span>
        </button>
    )
}


export default CreateBtn
