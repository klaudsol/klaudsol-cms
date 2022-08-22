import TimeModal from './TimeModal';
import { useState } from 'react';
const CardTimesheet = () => {
      /** constants for TIMESHEET TABLE */

  const [startDateTime, setStartDateTime] = useState('');
  const data = [
    {start_time: 'Tue Apr 05 2022 at 11:00:43 AM', end_time: 'Tue Apr 05 2022 at 11:31:00 AM', duration:'0.50 hours', description: 'Daily Standup'},
    {start_time: 'Tue Apr 05 2022 at 9:51:43 PM', end_time: 'Tue Apr 05 2022 at 9:51:43 PM', duration:'0.50 hours', description: 'Edited and organized the code for time tracking application ; researched about DNS and other record types'},
    // ...
  ]

  const columns = [
    { id: 1, title: "Start Time", accessor: "start_time" },
    { id: 2, title: "End Time", accessor: "end_time" },
    { id: 2, title: "Duration", accessor: "duration" },
    { id: 4, title: "Description", accessor: "description" }
    
  ];


  function onclk_startTime() {
    var today= new Date();
    var sent_time = today.toLocaleTimeString();
    var sent_date = today.toDateString();
    var start_date_time = sent_date + ' at ' + sent_time;
    setShowModal(true);
    setStartDateTime(start_date_time);
  }
  const [showModal, setShowModal] = useState(false);
    return (  
        <>
        <div className="card_general card_timesheet">
        <TimeModal show={showModal} onClose={() => setShowModal(false)} start_time={startDateTime}/>
            <div className="d-flex flex-row-reverse"> {/** row for button start */}
                <button className='btn btn-danger d-flex flex-row-reverse mr-5 btn_endTime' disabled> End Time</button>
                <button className='btn btn-success d-flex flex-row-reverse mr-5 btn_startTime' onClick={onclk_startTime}> Start Time </button>
            </div> {/** row for button end */}

            <div className='table_container'>
                <table id="time_table">
                    <thead> {/*table head*/}
                        <tr>
                        {columns.map((col) => (
                            <th key={col.id}>{col.title}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody> {/*table body*/}
                        {data.map((user, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                            <td key={col.id}>{user[col.accessor]}</td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
        </div>
        </>
    );
}
 
export default CardTimesheet;