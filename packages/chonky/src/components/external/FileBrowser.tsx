import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import merge from 'deepmerge';
import React, { ReactNode, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'react-jss';
import { Provider as ReduxProvider } from 'react-redux';
import { nanoid } from 'nanoid';

import { useChonkyStore } from '../../redux/store';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { defaultConfig } from '../../util/default-config';
import { getValueOrFallback } from '../../util/helpers';
import { useStaticValue } from '../../util/hooks-helpers';
import { ChonkyFormattersContext, defaultFormatters } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import {
  darkThemeOverride,
  lightTheme,
  mobileThemeOverride,
  useIsMobileBreakpoint,
} from '../../util/styles';
import { ChonkyBusinessLogic } from '../internal/ChonkyBusinessLogic';
import { ChonkyIconPlaceholder } from '../internal/ChonkyIconPlaceholder';
import { ChonkyPresentationLayer } from '../internal/ChonkyPresentationLayer';

export const FileBrowser = React.forwardRef<
    FileBrowserHandle,
    FileBrowserProps & { children?: ReactNode }
>((props, ref) => {
  const { instanceId, iconComponent, children } = props;
  const disableDragAndDrop = getValueOrFallback(
    props.disableDragAndDrop,
    defaultConfig.disableDragAndDrop,
    'boolean'
  );
  const disableDragAndDropProvider = getValueOrFallback(
    props.disableDragAndDropProvider,
    defaultConfig.disableDragAndDropProvider,
    'boolean'
  );
  const darkMode = getValueOrFallback(
    props.darkMode,
    defaultConfig.darkMode,
    'boolean'
  );
  const i18n = getValueOrFallback(props.i18n, defaultConfig.i18n);
  const formatters = useMemo(() => ({ ...defaultFormatters, ...i18n?.formatters }), [
    i18n,
  ]);

  const chonkyInstanceId = useStaticValue(() => instanceId ?? nanoid());
  const store = useChonkyStore(chonkyInstanceId);

  const isMobileBreakpoint = useIsMobileBreakpoint();
  const theme = useMemo(() => {
    const muiTheme = createMuiTheme({
      palette: { type: darkMode ? 'dark' : 'light', primary: { main: props.checkboxColor ?? '#7532b8' } },
    });
    const combinedTheme = merge(
      muiTheme,
      merge(lightTheme, darkMode ? darkThemeOverride : {})
    );

    return isMobileBreakpoint
      ? merge(combinedTheme, mobileThemeOverride)
      : combinedTheme;
  }, [darkMode, isMobileBreakpoint, props.checkboxColor]);

  const chonkyComps = (
    <>
      <ChonkyBusinessLogic
        ref={ref}
        {...props}
      />
      <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
    </>
  );

  return (
    <IntlProvider
      locale="en"
      defaultLocale="en"
      {...i18n}
    >
      <ChonkyFormattersContext.Provider value={formatters}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <MuiThemeProvider theme={theme}>
              <ChonkyIconContext.Provider
                value={
                  iconComponent ??
                                    defaultConfig.iconComponent ??
                                    ChonkyIconPlaceholder
                }
              >
                {disableDragAndDrop || disableDragAndDropProvider
                  ? (
                    chonkyComps
                  )
                  : (
                    <DndProvider backend={HTML5Backend}>
                      {chonkyComps}
                    </DndProvider>
                  )}
              </ChonkyIconContext.Provider>
            </MuiThemeProvider>
          </ThemeProvider>
        </ReduxProvider>
      </ChonkyFormattersContext.Provider>
    </IntlProvider>
  );
});
FileBrowser.displayName = 'FileBrowser';
