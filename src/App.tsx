import { useState } from 'react';
import type { FileNode } from './types';
import { addNode, deleteNode, renameNode, toggleFolder } from './utils';
import { TreeNode } from './components/TreeNode';
import { Button } from './components/Button';
import './App.css';

const initialTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    isFolder: true,
    isOpen: true,
    children: [
      {
        id: '2',
        name: 'components',
        isFolder: true,
        isOpen: true,
        children: [
          { id: '3', name: 'Button.tsx', isFolder: false },
          { id: '4', name: 'Tree.tsx', isFolder: false },
          { id: '5', name: 'TreeNode.tsx', isFolder: false },
        ],
      },
      { id: '6', name: 'App.tsx', isFolder: false },
      { id: '7', name: 'main.tsx', isFolder: false },
      { id: '8', name: 'index.css', isFolder: false },
    ],
  },
  {
    id: '9',
    name: 'public',
    isFolder: true,
    isOpen: false,
    children: [],
  },
  { id: '10', name: 'package.json', isFolder: false },
  { id: '11', name: 'README.md', isFolder: false },
];

function App() {
  const [tree, setTree] = useState<FileNode[]>(initialTree);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddFile = () => {
    setTree((prev) => addNode(prev, selectedId, false));
  };

  const handleAddFolder = () => {
    setTree((prev) => addNode(prev, selectedId, true));
  };

  const handleDelete = (id: string) => {
    setTree((prev) => deleteNode(prev, id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleRename = (id: string, newName: string) => {
    setTree((prev) => renameNode(prev, id, newName));
  };

  const handleToggle = (id: string) => {
    setTree((prev) => toggleFolder(prev, id));
  };

  return (
    <div className="app-container" onClick={() => setSelectedId(null)}>
      <div className="header">
        <div className="window-controls">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="title">File Explorer</div>
      </div>

      <div className="toolbar" onClick={(e) => e.stopPropagation()}>
        <Button variant="primary" onClick={handleAddFile}>
          + New File
        </Button>
        <Button variant="outline" onClick={handleAddFolder}>
          + New Folder
        </Button>
      </div>

      <div className="explorer-content" onClick={(e) => e.stopPropagation()}>
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRename={handleRename}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
