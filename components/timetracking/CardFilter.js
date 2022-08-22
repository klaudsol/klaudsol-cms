import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CardFilter = () => {
  const [startDate, setStartDate] = useState(new Date("2022/04/10"));
  const [endDate, setEndDate] = useState(new Date("2022/04/11"));
  const CustomDatepicker = React.forwardRef(({ value, onClick }, ref) => (
    <button className="btn btn-success btn_datePicker" onClick={onClick} ref={ref}>
     {value}
    </button>
    
  ));
  CustomDatepicker.displayName = 'ExamplecustomInput';
    return ( 
        <>
            <div className="card_general card_filter">
              <h1 className='txt_general txt_filter text-center'> F I L T E R </h1>
              <div className="container-fluid">
           
                <div className='container_filterDay'>
                       <span className='txt_general txt_filterDay'> START DATE: </span>
                     </div>
                     <div className="container_filterDay">
                     <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          customInput={<CustomDatepicker/>}
                        />
                     </div>
    
                     <div className='container_endDay'>
                        <span className='txt_general txt_filterDay'> END DATE:   </span>
                    </div>
                     <div className="container_datePicker">

                     <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        customInput={<CustomDatepicker/>}
                      />
                     </div>
                     
                     <div className='container_export'>
                       <button className='btn btn-success btn-export'>
                           EXPORT
                       </button> 
                     </div>
                   
                   </div>
                   </div>
        </>
     );
}
 
export default CardFilter;