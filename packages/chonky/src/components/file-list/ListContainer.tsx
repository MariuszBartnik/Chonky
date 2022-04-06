/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { CSSProperties, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';

import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewMode } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { SmartFileEntry } from './FileEntry';

export interface FileListListProps {
    width: number;
    height: number;
    selectFiles?: (value: boolean, id?: string) => void;
    selectedFiles?: string[];
}

export const ListContainer: React.FC<FileListListProps> = React.memo(props => {
  const { width, height } = props;

  const viewConfig = useSelector(selectFileViewConfig);

  const listRef = useRef<FixedSizeList>();

  const displayFileIds = useSelector(selectors.getDisplayFileIds);
  const displayFileIdsRef = useInstanceVariable(displayFileIds);
  const getItemKey = useCallback(
    (index: number) => displayFileIdsRef.current[index] ?? `loading-file-${index}`,
    [displayFileIdsRef]
  );

  return useMemo(() => {
    // When entry size is null, we use List view
    const rowRenderer = (data: { index: number; style: CSSProperties }) => {
      return (
        <div style={data.style}>
          <SmartFileEntry
            fileId={displayFileIds[data.index] ?? null}
            displayIndex={data.index}
            fileViewMode={FileViewMode.List}
            selectFiles={props.selectFiles}
            selectedFiles={props.selectedFiles}
          />
        </div>
      );
    };

    return (
      <FixedSizeList
        ref={listRef as any}
        itemSize={viewConfig.entryHeight}
        height={height}
        itemCount={displayFileIds.length}
        width={width}
        itemKey={getItemKey}
      >
        {rowRenderer}
      </FixedSizeList>
    );
  }, [
    viewConfig.entryHeight,
    height,
    displayFileIds,
    width,
    getItemKey,
    props.selectedFiles,
    props.selectFiles
  ]);
});
