import { FaPlay } from 'react-icons/fa';

export default function SkeletonTask(){
    return (
        <> 
           <div className="card_general card_current_task row" style={{backgroundColor: '#fff'}}>
                <div className="col-xl-11 col-lg-11 col-md-10 col-sm-6">
                    <h3 className='skeleton_definite_title'> No task as of the moment</h3>
                    <h3 className='txt_general txt_task_startTime' style={{color: '#324b4e'}}> Client: <b className='skeleton_definite_text'> Client name here</b> </h3>
                    <h3 className='txt_general txt_task_startTime' style={{color: '#324b4e'}}> Start Time: <b className='skeleton_definite_text'> Start time here</b>  </h3>
                    <h3 className='txt_general txt_task_duration' style={{color: '#324b4e'}}> Duration: 
                        <span className="span_duration"> <b className='skeleton_definite_text'> 00 </b>hrs </span> 
                        <span className="span_duration"> <b className='skeleton_definite_text'> 00 </b>mins </span> 
                        <span className="span_duration"> <b className='skeleton_definite_text'> 00 </b>seconds </span> 
                    </h3>
                </div>
                
                <div className="col-xl-1 col-lg-1 col-md-2 col-sm-6 text-center d-flex align-items-center justify-content-center container p-0">
                    <button className="btn btn_startTime" style={{backgroundColor: '#019867', color: '#fff'}}  disabled> <FaPlay/>  </button>
                </div>                    
            </div>
        </>
    )
}