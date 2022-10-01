import React, { useState, ChangeEvent, useEffect } from 'react';
import './DatePicker.css';

type Props = {
  setStart: (arg1: number) => void,
  setStartBoolean:(arg1: boolean) => void,
  setEnd:(arg1: number) => void,
  setEndBoolean:(arg1: boolean) => void,

};

function DatePicker({
  setStart,
  setStartBoolean,
  setEnd,
  setEndBoolean,
}: Props) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const dateChange = (
    e: ChangeEvent,
    setter: (arg0: string) => void,
  ): void => {
    const target = e.target as HTMLInputElement;
    setter(target.value);
  };

  useEffect(() => {
    if (startDate !== '' && startTime !== '') {
      setStart(Date.parse(`${startDate} ${startTime}`));
      setStartBoolean(true);
    }
  }, [startDate, startTime]);

  useEffect(() => {
    if (endDate !== '' && endTime !== '') {
      setEnd(Date.parse(`${endDate} ${endTime}`));
      setEndBoolean(true);
    }
  }, [endDate, endTime]);

  return (
    <div className="center-evenly">
      <div>
        <fieldset>
          <legend>Range start:</legend>
          <label htmlFor="start-date">
            Date:
            <input type="date" id="start-date" required onChange={(e: ChangeEvent) => dateChange(e, setStartDate)} />
          </label>
          <label htmlFor="start-time">
            Time:
            <input type="time" id="start-time" required onChange={(e: ChangeEvent) => dateChange(e, setStartTime)} />
          </label>
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>Range end:</legend>
          <label className="date-picker" htmlFor="end-date">
            Date:
            <input type="date" id="end-date" onChange={(e: ChangeEvent) => dateChange(e, setEndDate)} />
          </label>
          <label htmlFor="end-time">
            Time:
            <input type="time" id="end-time" onChange={(e: ChangeEvent) => dateChange(e, setEndTime)} />
          </label>
        </fieldset>
      </div>
    </div>
  );
}

export default DatePicker;
