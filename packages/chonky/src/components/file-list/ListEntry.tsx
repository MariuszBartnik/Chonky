import React, { useContext, useMemo } from 'react';

import { Checkbox } from '@material-ui/core';
import { DndEntryState, FileEntryProps } from '../../types/file-list.types';
import { useLocalizedFileEntryStrings } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { TextPlaceholder } from '../external/TextPlaceholder';
import {
  useDndIcon,
  useFileEntryHtmlProps,
  useFileEntryState,
} from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, useCommonEntryStyles } from './GridEntryPreview';
import { FileHelper } from '../../util/file-helper';

interface StyleState {
    entryState: FileEntryState;
    dndState: DndEntryState;
    isSelectVisible: boolean;
}

export const ListEntry: React.FC<FileEntryProps> = React.memo(
  ({ file, selected, focused, dndState, selectedFiles, selectFiles  }) => {
    const entryState: FileEntryState = useFileEntryState(file, selected, focused);
    const dndIconName = useDndIcon(dndState);
    const isSelectVisible = !!selectedFiles;

    const { fileModDateString, fileSizeString } = useLocalizedFileEntryStrings(
      file
    );
    const styleState = useMemo<StyleState>(
      () => ({
        entryState,
        dndState,
        isSelectVisible
      }),
      [dndState, entryState]
    );
    const classes = useStyles(styleState);
    const commonClasses = useCommonEntryStyles(entryState);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);
    const isDir = FileHelper.isDirectory(file);
    const isSelected = FileHelper.isSelected(file, selectedFiles);

    return (
      <div
        className={classes.listFileEntry}
        {...fileEntryHtmlProps}
      >
        {!isSelectVisible && (
          <div className={commonClasses.focusIndicator} />
        )}
        <div
          className={c([
            commonClasses.selectionIndicator,
            classes.listFileEntrySelection,
          ])}
        />
        {selectedFiles && selectFiles && (
          <div className={classes.listFileEntryCheckbox}>
            <Checkbox
              color='primary'
              disabled={isDir}
              checked={isSelected}
              onChange={(e) => selectFiles(e.target.checked, file?.id)}
            />
          </div>
        )}
        <div className={classes.listFileEntryIcon}>
          <ChonkyIcon
            icon={dndIconName ?? entryState.icon}
            spin={dndIconName ? false : entryState.iconSpin}
            fixedWidth
          />
        </div>
        <div
          className={classes.listFileEntryName}
          title={file ? file.name : undefined}
        >
          <FileEntryName file={file} />
        </div>
        <div className={classes.listFileEntryProperty}>
          {file
            ? (
              fileModDateString ?? <span>—</span>
            )
            : (
              <TextPlaceholder
                minLength={5}
                maxLength={15}
              />
            )}
        </div>
        <div className={classes.listFileEntryProperty}>
          {file
            ? (
              fileSizeString ?? <span>—</span>
            )
            : (
              <TextPlaceholder
                minLength={10}
                maxLength={20}
              />
            )}
        </div>
      </div>
    );
  }
);

const useStyles = makeLocalChonkyStyles(theme => ({
  listFileEntry: {
    fontSize: theme.listFileEntry.fontSize,
    color: ({ dndState }: StyleState) =>
      dndState.dndIsOver
        ? dndState.dndCanDrop
          ? theme.dnd.canDropColor
          : theme.dnd.cannotDropColor
        : 'inherit',
    alignItems: 'center',
    position: 'relative',
    display: 'flex',
    padding: [10, 0],
    height: '100%',
  },
  listFileEntrySelection: {
    opacity: ({ isSelectVisible }: StyleState) => isSelectVisible ? 0 : 0.6,
  },
  listFileEntryIcon: {
    color: ({ entryState, dndState }: StyleState) =>
      dndState.dndIsOver
        ? dndState.dndCanDrop
          ? theme.dnd.canDropColor
          : theme.dnd.cannotDropColor
        : entryState.color,
    fontSize: theme.listFileEntry.iconFontSize,
    boxSizing: 'border-box',
    padding: [2, 4],
    zIndex: 20,
  },
  listFileEntryName: {
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    flex: '1 1 300px',
    paddingLeft: 8,
    zIndex: 20,
  },
  listFileEntryProperty: {
    fontSize: theme.listFileEntry.propertyFontSize,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: [2, 8],
    zIndex: 20,
  },
  listFileEntryCheckbox: {
    fontSize: 20,
    boxSizing: 'border-box',
    padding: [14, 8, 14, 0],
    zIndex: 20,

    '& span': {
      padding: 0
    }
  }
}));
