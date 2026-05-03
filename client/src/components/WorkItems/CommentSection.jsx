import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getIssueComments, addComment, deleteComment } from '../../api';
import { Trash2, MessageSquare, Loader2 } from 'lucide-react';

const CommentSection = ({ issueId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (issueId) {
            fetchComments();
        }
    }, [issueId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await getIssueComments(issueId);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const response = await addComment(issueId, newComment);
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await deleteComment(issueId, commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Comments ({comments.length})
            </h3>

            {/* Comment List */}
            <div className="flex flex-col gap-5 mb-6">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center py-4">No comments yet.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-primary-deep text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {getInitials(comment.author?.name)}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100/50">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-sm text-gray-900">{comment.author?.name}</span>
                                        <span className="text-xs font-semibold text-gray-400">{formatTime(comment.created_at)}</span>
                                    </div>
                                    {user && (comment.author?.id === user.id || user.is_system_admin) && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            title="Delete comment"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Input Box */}
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-saffron text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {getInitials(user?.name)}
                </div>
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full text-sm rounded-xl border border-gray-200 p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary-deep/20 focus:border-primary-deep transition-all resize-y"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="bg-primary-deep text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Comment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CommentSection;
