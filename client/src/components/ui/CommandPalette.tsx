import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Command, LayoutDashboard, GraduationCap, Layers, FolderOpen, FileText, Users, Settings, Activity, Plus, Upload } from "lucide-react";
import clsx from "clsx";

interface Command {
  id: string;
  name: string;
  description?: string;
  icon: React.ComponentType<{ size?: number }>;
  category: "Navigation" | "Actions";
  action: () => void;
  shortcut?: string;
}

const COMMANDS: Command[] = [
  // Navigation
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Go to dashboard overview",
    icon: LayoutDashboard,
    category: "Navigation",
    action: () => {},
    shortcut: "D",
  },
  {
    id: "classes",
    name: "Classes",
    description: "Manage class sections",
    icon: GraduationCap,
    category: "Navigation",
    action: () => {},
    shortcut: "C",
  },
  {
    id: "grades",
    name: "Grades",
    description: "Manage grade levels",
    icon: Layers,
    category: "Navigation",
    action: () => {},
    shortcut: "G",
  },
  {
    id: "students",
    name: "Students",
    description: "Manage student accounts",
    icon: Users,
    category: "Navigation",
    action: () => {},
    shortcut: "S",
  },
  {
    id: "folders",
    name: "Folders",
    description: "Browse content folders",
    icon: FolderOpen,
    category: "Navigation",
    action: () => {},
    shortcut: "F",
  },
  {
    id: "content",
    name: "Content",
    description: "View uploaded content",
    icon: FileText,
    category: "Navigation",
    action: () => {},
    shortcut: "O",
  },
  {
    id: "activity",
    name: "Activity",
    description: "View recent activity",
    icon: Activity,
    category: "Navigation",
    action: () => {},
    shortcut: "A",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Manage account settings",
    icon: Settings,
    category: "Navigation",
    action: () => {},
    shortcut: "T",
  },
  // Actions
  {
    id: "create-class",
    name: "Create Class",
    description: "Add a new class section",
    icon: Plus,
    category: "Actions",
    action: () => {},
  },
  {
    id: "create-folder",
    name: "Create Folder",
    description: "Add a new content folder",
    icon: FolderOpen,
    category: "Actions",
    action: () => {},
  },
  {
    id: "upload-content",
    name: "Upload Content",
    description: "Upload new content",
    icon: Upload,
    category: "Actions",
    action: () => {},
  },
  {
    id: "manage-students",
    name: "Manage Students",
    description: "Go to student management",
    icon: Users,
    category: "Actions",
    action: () => {},
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(COMMANDS);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Update command actions with navigation
  useEffect(() => {
    COMMANDS[0].action = () => navigate("/dashboard");
    COMMANDS[1].action = () => navigate("/dashboard/classes");
    COMMANDS[2].action = () => navigate("/dashboard/grades");
    COMMANDS[3].action = () => navigate("/dashboard/students");
    COMMANDS[4].action = () => navigate("/dashboard/folders");
    COMMANDS[5].action = () => navigate("/dashboard/content");
    COMMANDS[6].action = () => navigate("/dashboard/activity");
    COMMANDS[7].action = () => navigate("/dashboard/settings");
    COMMANDS[8].action = () => navigate("/dashboard/classes");
    COMMANDS[9].action = () => navigate("/dashboard/folders");
    COMMANDS[10].action = () => navigate("/dashboard/content");
    COMMANDS[11].action = () => navigate("/dashboard/students");
  }, [navigate]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
      setFilteredCommands(COMMANDS);
    }
  }, [isOpen]);

  // Filter commands based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredCommands(COMMANDS);
      setSelectedIndex(0);
      return;
    }

    const filtered = COMMANDS.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [query]);

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const flatCommands = Object.values(groupedCommands).flat();

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < flatCommands.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [groupedCommands, selectedIndex, onClose]
  );

  const handleCommandClick = (command: Command) => {
    command.action();
    onClose();
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex > 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const selectedItem = items[selectedIndex] as HTMLElement;
      selectedItem?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 bg-gradient-to-r from-white to-slate-50">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            autoFocus
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
            <Command size={12} />
            <span>K</span>
          </kbd>
        </div>

        {/* Commands List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto py-2" role="listbox">
          {filteredCommands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">No commands found</p>
              <p className="mt-1 text-xs text-slate-500">Try a different search term</p>
            </div>
          ) : (
            <div className="px-2">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="mb-4">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {category}
                  </p>
                  {commands.map((command, index) => {
                    const Icon = command.icon;
                    if (!Icon) return null;
                    const flatIndex = Object.entries(groupedCommands)
                      .slice(0, Object.keys(groupedCommands).indexOf(category))
                      .reduce((sum, [, cmds]) => sum + cmds.length, 0) + index;
                    const isSelected = selectedIndex === flatIndex;

                    return (
                      <button
                        key={command.id}
                        type="button"
                        onClick={() => handleCommandClick(command)}
                        className={clsx(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                          isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                        )}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 shadow-sm">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{command.name}</p>
                          {command.description && (
                            <p className="text-xs text-slate-500">{command.description}</p>
                          )}
                        </div>
                        {command.shortcut && (
                          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
                            {command.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">↑↓</kbd>
              <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">↵</kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">esc</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
