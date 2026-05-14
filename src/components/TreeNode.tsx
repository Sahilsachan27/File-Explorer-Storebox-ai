import { useState, useRef, useEffect } from 'react';
import type { FileNode } from '../types';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';

interface TreeNodeProps {
  node: FileNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  depth?: number;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  selectedId,
  onSelect,
  onRename,
  onDelete,
  onToggle,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(node.name === '');
  const [editValue, setEditValue] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== '') {
      onRename(node.id, editValue);
      setIsEditing(false);
    } else {
      // If it was just created and we save empty, maybe delete it or revert?
      if (node.name === '') {
        onDelete(node.id);
      } else {
        setEditValue(node.name);
        setIsEditing(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      if (node.name === '') {
        onDelete(node.id);
      } else {
        setEditValue(node.name);
        setIsEditing(false);
      }
    }
  };

  const isSelected = selectedId === node.id;

  return (
    <div className="tree-node-container">
      <div
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div className="tree-node-left">
          {node.isFolder ? (
            <span
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
            >
              {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span className="icon-spacer"></span>
          )}
          
          {node.isFolder ? (
            <Folder size={16} fill="#3b82f6" stroke="#3b82f6" className="node-icon" />
          ) : (
            <FileText size={16} className="node-icon file-icon" />
          )}

          {isEditing ? (
            <input
              ref={inputRef}
              className="rename-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="node-name">{node.name}</span>
          )}
        </div>

        {!isEditing && (
          <div className="tree-node-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {node.isFolder && node.isOpen && node.children && (
        <div className="tree-node-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
