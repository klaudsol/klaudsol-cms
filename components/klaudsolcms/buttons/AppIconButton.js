const AppIconButton = ({ icon, onClick, selected, ...props }) => {
    return <button className='btn_icon' onClick={onClick} style={{borderColor: selected ? 'black' : ''}} {...props}> {icon} </button>
}
 
export default AppIconButton;
