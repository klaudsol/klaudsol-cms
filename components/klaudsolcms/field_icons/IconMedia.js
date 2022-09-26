import { MdPermMedia } from 'react-icons/md'
const IconMedia = ({name, description}) => {
    return (
        <div className="d-flex align-items-center justify-content-start mx-0 px-0 py-2 my-0">
            <div className='icon_media'> <MdPermMedia style={{fontSize: '15px'}}/> </div>
            <p style={{fontSize: '10px'}}> <b style={{fontSize: '12px', marginTop: '5px'}}> {name} </b> <br></br>
                {description}
             </p>
        
        </div>
    );
}
 
export default IconMedia;