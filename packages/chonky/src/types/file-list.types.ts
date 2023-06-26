import { Nullable } from 'tsdef';

import { FileData } from './file.types';

export interface DndEntryState {
  dndIsDragging?: boolean;
  dndIsOver?: boolean;
  dndCanDrop?: boolean;
}

export interface FileEntryProps {
  file: Nullable<FileData>;
  selected: boolean;
  focused: boolean;
  dndState: DndEntryState;
  selectFiles?: (value: boolean, id?: string) => void;
  selectedFiles?: string[];
  checkboxColor?: string;
}
