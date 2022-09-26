import IconText from '@/components/klaudsolcms/field_icons/IconText';
import IconNumber from '@/components/klaudsolcms/field_icons/IconNumber';
import IconMedia from '@/components/klaudsolcms/field_icons/IconMedia';

const AddFieldBody = () => {
    return ( 
    <>
        <div>
            <h6 className="mx-3 my-4"> Select a field for your collection type</h6>
            <div className="block_bar"></div>

            <div className="row">
              <div className="col">
                <div className="container_field_type">
                    <IconText name='Text' description='Small or long text like title or description' /> 
                </div>
                <div className="container_field_type">
                    <IconMedia name='Media' description='Files like images, videos, etc' /> 
                </div>
              </div>
              <div className="col">
                <div className="container_field_type">
                    <IconNumber name='Number' description='Numbers (Integer, float, decimal)' /> 
                </div>
               
              </div>
              
            </div>
        </div>
    </> );
}
 
export default AddFieldBody;