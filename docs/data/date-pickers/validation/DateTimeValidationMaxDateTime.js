import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

const todayAtNoon = dayjs().set('hour', 12).startOf('hour');
const todayAt9AM = dayjs().set('hour', 9).startOf('hour');

export default function DateTimeValidationMaxDateTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="DateTimePicker">
          <NextDateTimePicker defaultValue={todayAtNoon} maxDateTime={todayAt9AM} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
