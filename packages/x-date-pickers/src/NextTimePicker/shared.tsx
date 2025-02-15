import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '../internals/models/helpers';
import { TimeView } from '../TimeClock';
import { useUtils } from '../internals/hooks/useUtils';
import {
  TimeClockSlotsComponent,
  TimeClockSlotsComponentsProps,
  ExportedTimeClockProps,
} from '../TimeClock/TimeClock.types';
import { BaseNextPickerInputProps } from '../internals/models/props/basePickerProps';
import { BaseTimeValidationProps } from '../internals/hooks/validation/models';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  TimePickerToolbarProps,
  ExportedTimePickerToolbarProps,
  TimePickerToolbar,
} from '../TimePicker/TimePickerToolbar';
import { TimeValidationError } from '../internals/hooks/validation/useTimeValidation';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { TimeViewRendererProps } from '../timeViewRenderers';
import { applyDefaultViewProps } from '../internals/utils/views';
import { uncapitalizeObjectKeys, UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface BaseNextTimePickerSlotsComponent<TDate> extends TimeClockSlotsComponent {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default TimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimePickerToolbarProps<TDate>>;
}

export interface BaseNextTimePickerSlotsComponentsProps extends TimeClockSlotsComponentsProps {
  toolbar?: ExportedTimePickerToolbarProps;
}

export interface BaseNextTimePickerProps<TDate>
  extends BaseNextPickerInputProps<TDate | null, TDate, TimeView, TimeValidationError>,
    ExportedTimeClockProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: BaseNextTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: BaseNextTimePickerSlotsComponentsProps;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseNextTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseNextTimePickerSlotsComponentsProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<TDate | null, TimeView, TimeViewRendererProps<TDate, TimeView>, {}>
  >;
}

type UseNextTimePickerDefaultizedProps<
  TDate,
  Props extends BaseNextTimePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  Omit<
    DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseTimeValidationProps>,
    'components' | 'componentsProps'
  >
>;

export function useNextTimePickerDefaultizedProps<
  TDate,
  Props extends BaseNextTimePickerProps<TDate>,
>(props: Props, name: string): UseNextTimePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      timePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const slots = themeProps.slots ?? uncapitalizeObjectKeys(themeProps.components);
  const slotProps = themeProps.slotProps ?? themeProps.componentsProps;
  return {
    ...themeProps,
    ampm,
    localeText,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ['hours', 'minutes'],
      defaultOpenTo: 'hours',
    }),
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    slots: {
      toolbar: TimePickerToolbar,
      ...slots,
    },
    slotProps: {
      ...slotProps,
      toolbar: {
        ampm,
        ampmInClock: themeProps.ampmInClock,
        ...slotProps?.toolbar,
      },
    },
  };
}
