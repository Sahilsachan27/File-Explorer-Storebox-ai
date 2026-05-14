import type { FileNode } from './types';
import { v4 as uuidv4 } from 'uuid';

export const addNode = (tree: FileNode[], parentId: string | null, isFolder: boolean): FileNode[] => {
  const newNode: FileNode = {
    id: uuidv4(),
    name: '',
    isFolder,
    children: isFolder ? [] : undefined,
    isOpen: isFolder ? true : undefined,
  };

  if (!parentId) {
    return [...tree, newNode];
  }

  return tree.map((node) => {
    if (node.id === parentId && node.isFolder) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        isOpen: true, // ensure parent opens when adding
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, isFolder),
      };
    }
    return node;
  });
};

export const deleteNode = (tree: FileNode[], id: string): FileNode[] => {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return { ...node, children: deleteNode(node.children, id) };
      }
      return node;
    });
};

export const renameNode = (tree: FileNode[], id: string, newName: string): FileNode[] => {
  return tree.map((node) => {
    if (node.id === id) {
      return { ...node, name: newName };
    }
    if (node.children) {
      return { ...node, children: renameNode(node.children, id, newName) };
    }
    return node;
  });
};

export const toggleFolder = (tree: FileNode[], id: string): FileNode[] => {
  return tree.map((node) => {
    if (node.id === id) {
      return { ...node, isOpen: !node.isOpen };
    }
    if (node.children) {
      return { ...node, children: toggleFolder(node.children, id) };
    }
    return node;
  });
};
