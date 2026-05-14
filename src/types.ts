export type FileNode = {
  id: string;
  name: string;
  isFolder: boolean;
  children?: FileNode[];
  isOpen?: boolean;
};
