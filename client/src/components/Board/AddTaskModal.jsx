import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onAdd, defaultStatus }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Dev');
    const [assignee, setAssignee] = useState('Unassigned');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({
            title,
            type,
            assignee,
            status: defaultStatus || 'todo'
        });
        setTitle('');
        setType('Dev');
        setAssignee('Unassigned');
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all border border-gray-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                                            Create Issue
                                        </Dialog.Title>
                                        <p className="text-sm text-gray-500 mt-1">Add a new task to your board</p>
                                    </div>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Fix navigation latency"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                <Tag size={14} className="text-gray-400" /> Type
                                            </label>
                                            <select
                                                className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                <option value="Dev">Dev</option>
                                                <option value="Bug">Bug</option>
                                                <option value="Research">Research</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                <User size={14} className="text-gray-400" /> Assignee
                                            </label>
                                            <select
                                                className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                                value={assignee}
                                                onChange={(e) => setAssignee(e.target.value)}
                                            >
                                                <option value="Unassigned">Unassigned</option>
                                                <option value="Alex">Alex</option>
                                                <option value="Sam">Sam</option>
                                                <option value="Jordan">Jordan</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!title.trim()}
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Create Task
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddTaskModal;
