import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt="Banner" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="Banner" className='w-full md:hidden' />

      <div className="absolute top-1/3 left-5 md:left-24 text-black space-y-5">
        <h1 className="text-2xl md:text-4xl font-bold max-w-md">Freshness You Can Trust, Savings You Will Love</h1>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          <Link
            to="/products"
            className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'
          >
            Show Now
            <img
              className='md:hidden transition group-hover:translate-x-1'
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to="/products"
            className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'
          >
            Explore deals
            <img
              className='transition group-hover:translate-x-1'
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
