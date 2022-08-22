import Link from 'next/link';

const CardPerformance = () => {
    return ( 
        <>
            <div className="card_general card_performance">
              <h1 className='txt_general txt_performance text-center'> P E R F O R M A N C E </h1>

              <div className='container'>
              <div className='container_filterDay'>
                  <h2 className='txt_general'> Hi, Patrick </h2>
                  <p className='txt_general txt_pStatus'> You`&apos;`ve been <b className='btxt_pStatus'>busy </b> for these past few days.</p>
                  <p className='txt_general txt_pProductivityRate'> Your average productivity rate is <b className='btxt_hours'> 8.23 hours </b>per day.</p>
                  <p className='txt_general txt_pTotalHours'> You have worked for a total of <b className='btxt_hours'> 245.32 hours </b> for the past month.</p>

                        </div>
                     <div className='container_export'>
                         <Link href="/app/timetracking/my-performance">
                            <a className='btn btn-success btn-performance'>
                                SEE MY PERFORMANCE
                            </a> 
                         </Link>
                       
                     </div>
              </div>
                
                   

                   </div>
        </>
     );
}
 
export default CardPerformance;