import logoutIcon from '@/public/assets/logout-icon.svg'
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    return (
        <header>
            <nav className="flex items-center justify-between bg-ternary_color px-4 sm:px-20 backdrop-blur-md h-12">
                <div className="text-2xl font-bold">
                    <h1><Link href="/">Cerebro</Link></h1>
                </div>
                <div>
                    <button
                        className='flex justify-around px-4 py-1 border-0 font-bold text-sm rounded-lg bg-red-500 hover:bg-red-600'
                    >                       
                        <Image src={logoutIcon} alt="logout" /><span>&nbsp;Log Out</span>
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar