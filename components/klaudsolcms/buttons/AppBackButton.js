import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
const AppBackButton = ({ link, onClick, noLink }) => {
    if (noLink) {
        return (
            <button onClick={onClick} className="btn_back">
                <FaArrowLeft className='icon_general' /> Back
            </button>
        )
    }

    return <Link href={link ? link : '/'} passHref><button onClick={onClick} className="btn_back"> <FaArrowLeft className='icon_general' /> Back </button></Link>
}

export default AppBackButton;
