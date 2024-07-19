import logoutIcon from '@/public/assets/logout-icon.svg'
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    return (
        <header>
            <nav className="flex items-center justify-between bg-nav-color px-4 sm:px-20 backdrop-blur-md h-12">
                <div className="text-3xl font-bold">
                    <h1><Link href="/">Cerebro</Link></h1>
                </div>
                <div>
                    <button
                        className='flex justify-around px-4 py-1 border-0 font-bold text-sm rounded-lg navbar-btn-red'
                    >                       
                        <Image src={logoutIcon} alt="logout" /><span className='hidden sm:block'>&nbsp;Log Out</span>
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar