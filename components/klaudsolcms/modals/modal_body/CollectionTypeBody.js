import { useState } from 'react';
const CollectionTypeBody = () => {
    const [displayName, setDisplayName] = useState('');
    const [slug, setSlug] = useState('');
    return ( 
    <>
        <div>
            <div className="d-flex justify-content-between align-items-center">
            <h6 className="mx-3"> Configurations </h6>
            <div>
            <button className="btn_modal_settings"> Basic settings </button>
 
            </div>
          
            </div>
            <div className="block_bar"></div>
            <div className="row">
              <div className="col">
               <p className="mt-2"> Display Name </p>
               <input type="text" className="input_text" onChange={e => {setDisplayName(e.target.value), setSlug(e.target.value.toLowerCase())}} value={displayName} /> 
        
              </div>
              <div className="col">
               <p className="mt-2"> API ID &#40;Slug&#41; </p>
               <input type="text" className="input_text" value={slug}/> 
               <p className="mt-1" style={{fontSize: '10px'}}> The UID is used to generate the API routes and databases tables/collections </p>
              </div>
            </div>
        </div>
    </> );
}
 
export default CollectionTypeBody;