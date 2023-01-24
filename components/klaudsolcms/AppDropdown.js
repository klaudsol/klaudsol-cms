import Dropdown from 'react-bootstrap/Dropdown';
const AppDropdown = ({title, items, id, isCheckbox}) => {
    return ( 
        <>
         {/* <Dropdown>
              <Dropdown.Toggle variant="light" id={id} size="sm">
              {title}
              </Dropdown.Toggle>
              <Dropdown.Menu id="dropdown_general_menu">
                {items.map((item, i) => (<Dropdown.Item key={i}>{isCheckbox ? <input type="checkbox" className='mr-2' checked={true} /> : null} &nbsp; {item.displayName}</Dropdown.Item>))}
              </Dropdown.Menu>
            </Dropdown> */}
        </>
     );
}
 
export default AppDropdown;