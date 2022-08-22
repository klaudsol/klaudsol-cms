import Clock from 'react-live-clock';

const CardDate = () => {
    var today= new Date();
       var date_sent = today.toLocaleString()
    return ( 
        <>
            <div className="card_general card_date">
                <h3 className='txt_general txt_today'> TODAY IS</h3>
                <Clock className='txt_general txt_date'
                    format={'| dddd, MMMM D'}
                    ticking={true}
                > 
                 </Clock>
                 <h3 className='txt_general txt_time'>
                 <Clock 
                        style={{background: 'transparent'}}
                        format={'h:mm:ss A'}
                        ticking={true}
                    >
                    </Clock>
                 </h3>
                    
                
            </div>
        </>
     );
}
 
export default CardDate;