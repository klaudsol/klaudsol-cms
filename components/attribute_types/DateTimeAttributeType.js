import AttributeType from '@/components/attribute_types/AttributeType';
import { useFormikContext, useField } from "formik";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment'; 

const DateTimeAttributeReadOnlyComponent = ({ text }) => {
  const parsedDate = new Date(text);
  const formattedDate = moment(parsedDate).format('MMM. D, YYYY - hh:mm A');
  return <>{formattedDate}</>;
};
  
const DateTimeAttributeEditableComponent = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  const [{ value }] = useField(name);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date()); // Set initial selected date to today

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD HH:mm');
      setFieldValue(name, formattedDate);
    } else {
      setFieldValue(name, null);
    }
  }, [selectedDate, name, setFieldValue]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      showTimeSelect
      timeFormat="hh:mm aa"
      dateFormat="MMM. d, yyyy - hh:mm aa"
    />
  );
};

export default class DateTimeAttributeType extends AttributeType {
  readOnlyComponent() {
    return DateTimeAttributeReadOnlyComponent;
  }

  editableComponent() {
    return DateTimeAttributeEditableComponent;
  }
}