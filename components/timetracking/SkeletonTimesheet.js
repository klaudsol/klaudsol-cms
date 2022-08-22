import { FaDownload, FaPlus, FaSave, FaEdit, FaTrash } from 'react-icons/fa';
import DropDown from '@/components/timetracking/DropDown';

export default function SkeletonTimesheet(){
        const columns = [
                { id: "start_time", displayName: "Start Time", accessor: "start_time" },
                { id: "end_time", displayName: "End Time", accessor: "end_time" },
                { id: "duration", displayName: "Duration", accessor: "duration" },
                { id: "client_name", displayName: "Client", accessor: "client_name" },
                { id: "description", displayName: "Description", accessor: "description" },
                { id: "buttons", displayName: "", accessor: "" },
              ];
             
              const skeleton_timesheet = [
                {start_time: "start_time date", end_time: "end_time date", duration: "duration", client_name: "client name", description: "the description of each task here"},
                {start_time: "start_time date", end_time: "end_time date", duration: "duration", client_name: "client name", description: "the description of each task here"},
                {start_time: "start_time date", end_time: "end_time date", duration: "duration", client_name: "client name", description: "the description of each task here"},
                {start_time: "start_time date", end_time: "end_time date", duration: "duration", client_name: "client name", description: "the description of each task here"},
                {start_time: "start_time date", end_time: "end_time date", duration: "duration", client_name: "client name", description: "the description of each task here"},
                {start_time: "start_time date", end_time: "end_time date", duration: "duration", client_name: "client name", description: "the description of each task here"},
              ];        
    return (
                <>
                      <div className="card_general card_timesheet">
                        <div className='row gx-4'>
                          <div className=' col-md-8'>
                              <div className='d-flex'>
                                <p className='d-inline-flex txt_client'> CLIENT: </p>
                                <DropDown  isDisabled />
                                <DropDown  isDisabled />
                                <p className='d-inline-flex txt_hawrs'> Total: <b className='skeleton_hours_text'> hours </b> HRS </p>
                                <p className='d-inline-flex txt_hawrs'> Average/Day: <b className='skeleton_hours_text'> hours </b> HRS  </p>
                              </div>
                            </div> 
                          <div className="d-flex flex-row-reverse col-md-4"> {/** row for button start */}
                            <button className='btn_download'  disabled> <FaDownload/> </button>
                            <button className='btn_add_time'  disabled> <FaPlus/> </button>
                            <h3 className='skeleton_definite_text'> Date and time here </h3>
                        </div> {/** row for button end */}
                      </div>

                      <div className='table_container' style={{visibility: 'visible'}}>
                        <table id="time_table">
                          <thead> {/*table head*/}
                            <tr>
                              {columns.map((col) => (
                                <th key={col.id}>{col.displayName}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody> {/*table body*/}
                            {skeleton_timesheet.map((user, i) => (
                              <tr key={i}> 
                                {columns.map((col) =>   (
                                  <td key={col.id}>
                                    <b className='skeleton_text_table'> {user[col.accessor]} </b>
                                    {
                                      col.id == 'buttons' && (
                                        <>
                                          <div>
                                            <button className='btn_save' style={{visibility: 'hidden'}} disabled>
                                              <FaSave/>
                                             </button>
                                            <button className='btn_edit'  disabled>
                                              <FaEdit/>
                                             </button>
                                            <button className='btn_delete' disabled>
                                              <FaTrash/>
                                             </button>
                                          </div>
                                        </>
                                      )
                                    }
                                  </td>                   
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div> 
                    </div> {/* end of timesheet container*/}
                    </>
    )
}