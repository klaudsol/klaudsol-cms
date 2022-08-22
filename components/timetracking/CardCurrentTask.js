const CardCurrentTask = ({txt_currentTask, txt_startTime, sec, description, bgColor, textColor, icon, startEndColor, isDisabled, endTime, startTime, isEndTimeBlank, iconColor, clientName}) => {
    return ( 
        <>
           <div className="card_general card_current_task row " style={{backgroundColor: bgColor}}>
                <div className="col-xl-11 col-lg-11 col-md-10 col-sm-6">
                    <h3 className='txt_general txt_task_title' style={{color: textColor}}> {txt_currentTask} {description} </h3>
                    <h3 className='txt_general txt_task_startTime' style={{color: textColor}}> Client: {clientName} </h3>
                    <h3 className='txt_general txt_task_startTime' style={{color: textColor}}> Start Time: {txt_startTime}  </h3>
                    <h3 className='txt_general txt_task_duration' style={{color: textColor}}> Duration: 
                        <span className="span_duration"> {("0" + Math.floor((sec / 3600000) %24)).slice(-2)} hrs </span> 
                        <span className="span_duration"> {("0" + Math.floor((sec / 60000) % 60)).slice(-2)} mins </span> 
                        <span className="span_duration"> {("0" + Math.floor((sec / 1000) % 60)).slice(-2)} seconds </span> 
                    </h3>
                </div>
                
                <div className="col-xl-1 col-lg-1 col-md-2 col-sm-6 text-center d-flex align-items-center justify-content-center container p-0">
                <button className="btn btn_startTime" style={{backgroundColor: startEndColor, color: iconColor}} disabled={isDisabled} onClick={isEndTimeBlank ? endTime : startTime}> {icon}  </button>
                </div>                    
            </div>
        </>
     );
}
export default CardCurrentTask;