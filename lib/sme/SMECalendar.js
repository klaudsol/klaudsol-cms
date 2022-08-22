
import Calendar from 'react-calendar';
//import '@sme/scss/SMECalendar.scss';
import SMEFormInput from '@sme/SMEFormInput';
import { useState, useEffect, useRef } from 'react';
import { format, parseISO, parse, formatISO9075 } from 'date-fns';
import SMESkeleton from '@sme/SMESkeleton';
import cx from 'classnames';

/*
  value: Date - SMECalendar expects a date object as input. It also emits a Date object on change.
*/

//This is how we want dates to be displayed and seen by the user
export const SME_DATE_DISPLAY_FORMAT = 'MM/dd/yyyy';

export const formatISODateToDisplay = (dateString) => {
  return format(parseISO9075(dateString), SME_DATE_DISPLAY_FORMAT);
}

export const parseISOQuietly = (dateString) => {
  const result =  parseISO(dateString);  
  //eslint-disable-next-line
  return (result == 'Invalid Date' ? null : result);
}


//WHy don't they have this?
export const parseISO9075 = (dateString) => {
  return parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());  
};

/**
 * value - an ISO9075 date string
 * 
 */

const SMECalendar = ({loading, value, className, onChange, ...props}) => {
  
  //alert(value);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const onClick = (evt) => {
    setShowCalendar((show) => !show);  
  };
  
  const onCalendarChange = (newDate) => {
    setShowCalendar(false);
    onChange(formatISO9075(newDate));
  };
  
  const calendarRef = useRef();
  const inputRef = useRef();
  
  useEffect(() => {
    
    const onClickOutside = (evt) => {
      if(calendarRef.current && !calendarRef.current.contains(evt.target) && !inputRef.current.contains(evt.target)) {
        setShowCalendar(false);  
      }    
    };
  
    window.addEventListener('click', onClickOutside);
    
    return () => {
      window.removeEventListener('click', onClickOutside);
    }
      
    
  }, [setShowCalendar]);
  
  useEffect(() => {
    if (!value) {
      onChange(formatISO9075(new Date()));
    }
  //eslint-disable-next-line
  }, [value]);
  
  return (
    <>
        <SMESkeleton className={className} loading={loading} style={{position: 'relative'}} >
          <span ref={inputRef} className={cx(className)} {...props}>
            <SMEFormInput value={format(parseISO9075(value), SME_DATE_DISPLAY_FORMAT)} onClick={onClick} />
          </span>
          
          
          {showCalendar && (
              <div ref={calendarRef} style={{position: 'absolute', zIndex: '100'}}>
                <Calendar value={parseISO9075(value)}  onChange={onCalendarChange} />
              </div>
          )}
          
        </SMESkeleton>
    </>
  )
  
} 
SMECalendar.defaultProps = {
  loading: false,
  onChange: () => {},
  value: formatISO9075(new Date())
}
export default SMECalendar;