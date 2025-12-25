"use client";

import React, { useState, useEffect } from "react";
import { Plus, GripVertical, Calendar, User, Trash2, Edit2, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ChannelTask {
    id: string;
    channel_id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: string;
    assigned_user?: { id: string; full_name: string; avatar_url?: string };
    due_date?: string;
    position: number;
    created_at: string;
}

const COLUMNS = [
    { id: 'todo', label: 'To Do', labelNe: 'गर्नुपर्ने', color: 'bg-slate-100' },
    { id: 'in_progress', label: 'In Progress', labelNe: 'प्रगतिमा', color: 'bg-blue-50' },
    { id: 'review', label: 'Review', labelNe: 'समीक्षा', color: 'bg-yellow-50' },
    { id: 'done', label: 'Done', labelNe: 'सम्पन्न', color: 'bg-green-50' },
];

const PRIORITY_COLORS = {
    low: 'bg-slate-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
};

interface KanbanBoardProps {
    channelId: string;
    canEdit: boolean;
    canDelete: boolean;
}

export default function KanbanBoard({ channelId, canEdit, canDelete }: KanbanBoardProps) {
    const { t, language } = useLanguage();
    const [tasks, setTasks] = useState<ChannelTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedTask, setDraggedTask] = useState<ChannelTask | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState<ChannelTask | null>(null);
    const [addToColumn, setAddToColumn] = useState<string>('todo');

    useEffect(() => {
        fetchTasks();
    }, [channelId]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/discussions/tasks?channel_id=${channelId}`);
            if (!res.ok) throw new Error('Failed to load');
            const { tasks } = await res.json();
            setTasks(tasks || []);
        } catch (err) {
            console.error('Fetch tasks error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, task: ChannelTask) => {
        if (!canEdit) return;
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        if (!draggedTask || !canEdit) return;

        if (draggedTask.status === newStatus) {
            setDraggedTask(null);
            return;
        }

        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === draggedTask.id ? { ...t, status: newStatus as ChannelTask['status'] } : t
        ));

        try {
            await fetch('/api/discussions/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: draggedTask.id, status: newStatus }),
            });
        } catch (err) {
            console.error('Update task error:', err);
            fetchTasks(); // Rollback
        }

        setDraggedTask(null);
    };

    const handleAddTask = (columnId: string) => {
        setAddToColumn(columnId);
        setEditingTask(null);
        setShowAddModal(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm(t('के तपाईं यो कार्य मेटाउन चाहनुहुन्छ?', 'Delete this task?'))) return;

        setTasks(prev => prev.filter(t => t.id !== taskId));

        try {
            await fetch(`/api/discussions/tasks?id=${taskId}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Delete task error:', err);
            fetchTasks();
        }
    };

    const getTasksByColumn = (status: string) =>
        tasks.filter(t => t.status === status).sort((a, b) => a.position - b.position);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {COLUMNS.map(column => (
                    <div
                        key={column.id}
                        className={`rounded-lg ${column.color} p-3 min-h-[300px]`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-sm text-slate-700">
                                {language === 'ne' ? column.labelNe : column.label}
                                <span className="ml-2 text-xs text-slate-500">
                                    ({getTasksByColumn(column.id).length})
                                </span>
                            </h3>
                            {canEdit && (
                                <button
                                    onClick={() => handleAddTask(column.id)}
                                    className="p-1 hover:bg-white/50 rounded text-slate-500 hover:text-brand-blue"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Task Cards */}
                        <div className="space-y-2">
                            {getTasksByColumn(column.id).map(task => (
                                <Card
                                    key={task.id}
                                    className={`bg-white shadow-sm cursor-${canEdit ? 'grab' : 'default'} hover:shadow-md transition-shadow`}
                                    draggable={canEdit}
                                    onDragStart={(e) => handleDragStart(e, task)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            {canEdit && (
                                                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-1">
                                                    <h4 className="text-sm font-medium text-slate-800 line-clamp-2">
                                                        {task.title}
                                                    </h4>
                                                    <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]} flex-shrink-0`} />
                                                </div>

                                                {task.description && (
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-0.5">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(task.due_date).toLocaleDateString('ne-NP')}
                                                        </span>
                                                    )}
                                                    {task.assigned_user && (
                                                        <span className="flex items-center gap-0.5">
                                                            <User className="w-3 h-3" />
                                                            {task.assigned_user.full_name?.split(' ')[0]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                {(canEdit || canDelete) && (
                                                    <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                                                        {canEdit && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingTask(task);
                                                                    setShowAddModal(true);
                                                                }}
                                                                className="p-1 text-slate-400 hover:text-brand-blue rounded"
                                                            >
                                                                <Edit2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                className="p-1 text-slate-400 hover:text-red-500 rounded"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Task Modal */}
            {showAddModal && (
                <TaskModal
                    channelId={channelId}
                    task={editingTask}
                    defaultStatus={addToColumn}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingTask(null);
                    }}
                    onSuccess={() => {
                        fetchTasks();
                        setShowAddModal(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
}

// Task Modal Component
function TaskModal({
    channelId,
    task,
    defaultStatus,
    onClose,
    onSuccess
}: {
    channelId: string;
    task: ChannelTask | null;
    defaultStatus: string;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { t } = useLanguage();
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState(task?.priority || 'medium');
    const [dueDate, setDueDate] = useState(task?.due_date || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            const method = task ? 'PUT' : 'POST';
            const body = task
                ? { id: task.id, title, description, priority, due_date: dueDate || null }
                : { channel_id: channelId, title, description, priority, status: defaultStatus, due_date: dueDate || null };

            const res = await fetch('/api/discussions/tasks', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error('Failed to save');
            onSuccess();
        } catch (err) {
            console.error('Save task error:', err);
            alert(t('बचत गर्न असफल', 'Failed to save'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-bold text-lg text-brand-navy">
                        {task ? t('कार्य सम्पादन', 'Edit Task') : t('नयाँ कार्य', 'New Task')}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('शीर्षक', 'Title')} *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            placeholder={t('कार्यको शीर्षक', 'Task title')}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('विवरण', 'Description')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            placeholder={t('विवरण', 'Description')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t('प्राथमिकता', 'Priority')}
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as ChannelTask['priority'])}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="low">{t('कम', 'Low')}</option>
                                <option value="medium">{t('मध्यम', 'Medium')}</option>
                                <option value="high">{t('उच्च', 'High')}</option>
                                <option value="urgent">{t('अत्यावश्यक', 'Urgent')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t('अन्तिम मिति', 'Due Date')}
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('रद्द', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                            {t('सुरक्षित', 'Save')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
