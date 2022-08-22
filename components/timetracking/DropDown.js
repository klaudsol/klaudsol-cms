import Dropdown from 'react-select';

const DropDown = ({options, defaultValue, handleOnChange, isDisabled, styles}) => {
    return ( 
        <>
            <Dropdown options={options} defaultValue={defaultValue}
                      onChange={handleOnChange}
                      isClearable={false}
                      isSearchable={false}
                      isDisabled={isDisabled}
                      styles={{
                      ...styles,
                      control: (base, state) => ({
                        ...base,
                        '&:hover': { borderColor: 'gray' }, // border style on hover
                        border: '1px solid lightgray', // default border color
                        boxShadow: 'none', // no box-shadow
                        marginRight: '10px',
                        }),
                    }} 
            /> 
        </>
     );
}
 
export default DropDown;