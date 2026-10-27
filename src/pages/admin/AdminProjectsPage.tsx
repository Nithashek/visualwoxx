import React, { useState, useEffect } from 'react';
import {
  FolderKanban, Kanban, Table, Plus, Calendar, Clock,
  CheckCircle2, Circle, AlertCircle, Sparkles, Users, UserCheck,
  ExternalLink, ChevronRight, X, Trash2, Edit
} from 'lucide-react';
import { Project, ProjectTask } from '../../types';
import {
  fetchProjects, createProject, updateProject,
  createProjectTask, toggleTaskCompleted, deleteTask
} from '../../services/api';

const STATUS_COLUMNS = [
  { id: 'inquiry_received', label: 'Inquiry Received', color: 'border-purple-600/40 bg-purple-950/20' },
  { id: 'planning', label: 'Planning & Pre-prod', color: 'border-blue-600/40 bg-blue-950/20' },
  { id: 'in_progress', label: 'In Progress (Shooting/Editing)', color: 'border-cyan-600/40 bg-cyan-950/20' },
  { id: 'client_review', label: 'Client Review', color: 'border-amber-600/40 bg-amber-950/20' },
  { id: 'revisions', label: 'Revisions & Polish', color: 'border-pink-600/40 bg-pink-950/20' },
  { id: 'completed', label: 'Completed', color: 'border-emerald-600/40 bg-emerald-950/20' },
  { id: 'on_hold', label: 'On Hold', color: 'border-slate-600/40 bg-slate-950/20' },
  { id: 'cancelled', label: 'Cancelled', color: 'border-red-600/40 bg-red-950/20' },
];

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // New Project Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  // Task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newClientName) return;

    try {
      await createProject({
        projectName: newProjectName,
        clientName: newClientName,
        description: newDescription,
        deadline: newDeadline,
        priority: newPriority,
        services: ['General Creative'],
        status: 'planning',
        progressPct: 15
      });
      setCreateModalOpen(false);
      setNewProjectName('');
      setNewClientName('');
      setNewDescription('');
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to create project');
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const proj = projects.find((p) => p.id === projectId);
      if (!proj) return;
      await updateProject(projectId, {
        ...proj,
        status: newStatus,
        updateNote: `Moved to ${newStatus.replace('_', ' ')}`
      });
      loadData();
      if (selectedProject?.id === projectId) {
        setSelectedProject((prev) => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to update project status');
    }
  };

  const handleProgressChange = async (newProgress: number) => {
    if (!selectedProject) return;
    try {
      await updateProject(selectedProject.id, {
        ...selectedProject,
        progressPct: newProgress
      });
      setSelectedProject((prev) => prev ? { ...prev, progressPct: newProgress } : null);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to update progress');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newTaskTitle) return;

    try {
      await createProjectTask(selectedProject.id, {
        title: newTaskTitle,
        assignedTo: newTaskAssignee
      });
      setNewTaskTitle('');
      setNewTaskAssignee('');
      // Reload project
      const updated = await fetchProjects();
      setProjects(updated);
      setSelectedProject(updated.find((p) => p.id === selectedProject.id) || null);
    } catch (e: any) {
      alert(e.message || 'Failed to add task');
    }
  };

  const handleToggleTask = async (task: ProjectTask) => {
    try {
      await toggleTaskCompleted(task.id, !task.isCompleted);
      const updated = await fetchProjects();
      setProjects(updated);
      if (selectedProject) {
        setSelectedProject(updated.find((p) => p.id === selectedProject.id) || null);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to toggle task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      const updated = await fetchProjects();
      setProjects(updated);
      if (selectedProject) {
        setSelectedProject(updated.find((p) => p.id === selectedProject.id) || null);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to delete task');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Projects & Work Progress Command
            </h2>
            <span className="text-xs text-slate-400">
              Track multi-disciplinary production sprints, deadlines, and deliverables
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-purple-900/30">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-brand-purple text-white shadow-glow-subtle'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-brand-purple text-white shadow-glow-subtle'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-electric flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Main View: Kanban vs Table */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {STATUS_COLUMNS.map((col) => {
            const colProjects = projects.filter((p) => p.status === col.id);
            return (
              <div
                key={col.id}
                className="w-80 shrink-0 bg-dark-900/70 border border-purple-900/30 rounded-2xl flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b ${col.color} rounded-t-2xl flex items-center justify-between`}>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-dark-950/80 px-2 py-0.5 rounded-full">
                    {colProjects.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1">
                  {colProjects.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-600 border border-dashed border-purple-900/20 rounded-xl">
                      No projects
                    </div>
                  ) : (
                    colProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className="p-4 rounded-xl bg-dark-950 border border-purple-900/30 hover:border-brand-violet cursor-pointer card-hover-lift space-y-3 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white text-xs block leading-snug">
                            {p.projectName}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            p.priority === 'urgent'
                              ? 'bg-red-950 text-red-300 border border-red-800/40'
                              : p.priority === 'high'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                              : 'bg-purple-950 text-purple-300'
                          }`}>
                            {p.priority}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>{p.clientName}</span>
                          {p.deadline && (
                            <span className="flex items-center gap-1 font-mono text-cyan-400">
                              <Calendar className="w-3 h-3" />
                              <span>{p.deadline}</span>
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Progress</span>
                            <span className="font-bold text-white">{p.progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-purple to-cyan-400 rounded-full"
                              style={{ width: `${p.progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Tasks Count */}
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-purple-900/20">
                          <span>
                            {p.tasks.filter((t) => t.isCompleted).length}/{p.tasks.length} Tasks
                          </span>
                          <span className="text-brand-electric font-semibold">Details →</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-dark-900 border border-purple-900/30 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 border-b border-purple-900/30 uppercase text-[10px] tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="p-4">Project Name</th>
                <th className="p-4">Client</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Progress</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="hover:bg-purple-950/20 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-bold text-white">{p.projectName}</td>
                  <td className="p-4 text-slate-400">{p.clientName}</td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-cyan-300 border border-purple-800/40">
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 font-bold uppercase text-[10px]">{p.priority}</td>
                  <td className="p-4 font-mono text-slate-400">{p.deadline || 'Flexible'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-dark-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-violet rounded-full"
                          style={{ width: `${p.progressPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px]">{p.progressPct}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(p);
                      }}
                      className="text-brand-electric hover:text-white font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Details Modal / Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-dark-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-xs text-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-purple-900/30 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-neon uppercase">
                  {selectedProject.id}
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  {selectedProject.projectName}
                </h3>
                <span className="text-slate-400 text-xs">
                  Client: <strong className="text-white">{selectedProject.clientName}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Progress Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-dark-950/70 border border-purple-900/30">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Kanban Status
                </label>
                <select
                  value={selectedProject.status}
                  onChange={(e) => handleStatusChange(selectedProject.id, e.target.value)}
                  className="w-full bg-dark-900 border border-purple-900/30 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-brand-violet"
                >
                  {STATUS_COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">Progress Percentage</label>
                  <span className="font-mono font-bold text-brand-neon">{selectedProject.progressPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedProject.progressPct}
                  onChange={(e) => handleProgressChange(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Description & Crew */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scope & Specifications
              </h4>
              <p className="p-3.5 rounded-xl bg-dark-950/50 border border-purple-900/20 text-slate-300 leading-relaxed">
                {selectedProject.description || 'No description provided.'}
              </p>
            </div>

            {/* Tasks & Subtasks Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Tasks and Subtasks Checklist</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedProject.tasks.filter((t) => t.isCompleted).length} / {selectedProject.tasks.length} Completed
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedProject.tasks.length === 0 ? (
                  <p className="text-slate-500 italic py-2">No tasks created yet.</p>
                ) : (
                  selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        task.isCompleted
                          ? 'bg-dark-950/40 border-purple-900/20 text-slate-500 line-through'
                          : 'bg-dark-950/80 border-purple-900/30 text-white'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="flex items-center gap-2.5 text-left flex-1"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="text-xs font-medium">{task.title}</span>
                      </button>

                      {task.assignedTo && (
                        <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded text-cyan-300">
                          {task.assignedTo}
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Task Sub-form */}
              <form onSubmit={handleAddTask} className="flex gap-2 pt-1">
                <input
                  type="text"
                  required
                  placeholder="Add new task / milestone item..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
                <input
                  type="text"
                  placeholder="Assignee (e.g. Rohit)"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-36 bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
                <button
                  type="submit"
                  className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0"
                >
                  Add Task
                </button>
              </form>
            </div>

            {/* Deliverables Links */}
            {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-purple-900/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deliverable Files & Master Links
                </h4>
                <div className="space-y-1.5">
                  {selectedProject.deliverables.map((d, idx) => (
                    <a
                      key={idx}
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-cyan-300 hover:text-white flex items-center justify-between text-xs"
                    >
                      <span>{d.title}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-dark-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-lg font-bold font-display text-white">
                Initialize New Project
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Project Name <span className="text-brand-neon">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Lumina Fashion Week 2026"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Client / Brand Name <span className="text-brand-neon">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Lumina Lifestyle Ltd"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Scope & Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Project overview, equipment needed, and key milestones..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-6 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
