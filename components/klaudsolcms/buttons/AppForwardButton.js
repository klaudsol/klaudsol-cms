import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
const AppForwardButton = ({ link, onClick, text, noLink }) => {
    if (noLink) {
        return (
            <button onClick={onClick} className="btn_back">
                <FaArrowRight className='icon_general' />
                {text ?? 'Next'}
            </button>
        )
    }

    return (
        <Link href={link ?? '/'}>
            <button onClick={onClick} className="btn_back">
                <FaArrowRight className='icon_general' />
                {text ?? 'Next'}
            </button>
        </Link>
    )
}

export default AppForwardButton;
