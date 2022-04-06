/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';

import { selectors } from '../../redux/selectors';
import { getI18nId, I18nNamespace } from '../../util/i18n';
import { important, makeGlobalChonkyStyles } from '../../util/styles';

export interface ToolbarInfoProps {}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = React.memo(() => {
  const classes = useStyles();

  const displayFileIds = useSelector(selectors.getDisplayFileIds);

  const intl = useIntl();
  const fileCountString = intl.formatMessage(
    {
      id: getI18nId(I18nNamespace.Toolbar, 'visibleFileCount'),
      defaultMessage: `{fileCount, plural,
                =0 {# items}
                one {# item}
                other {# items}
            }`,
    },
    { fileCount: displayFileIds.length }
  );

  return (
    <div className={classes.infoContainer}>
      <Typography
        className={classes.infoText}
        variant="body1"
      >
        {fileCountString}
      </Typography>
    </div>
  );
});

const useStyles = makeGlobalChonkyStyles(theme => ({
  infoContainer: {
    height: theme.toolbar.size,
    display: 'flex',
  },
  infoText: {
    lineHeight: important(theme.toolbar.lineHeight),
    fontSize: important(theme.toolbar.fontSize),
    marginLeft: important(12),
    height: theme.toolbar.size,
  },
  extraInfoSpan: {
    marginRight: important(8),
    marginLeft: important(8),
    opacity: 0.8,
  },
  selectionSizeText: {
    color: theme.colors.textActive,
  },
  hiddenCountText: {},
}));
