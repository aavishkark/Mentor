'use client';
import './searchinput.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();;
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';

    const [searchQuery, setSearchQuery] = useState(query);
    const paramsString = searchParams.toString();

    useEffect(()=>{

        const delayDebounceFn = setTimeout(()=>{
            if(searchQuery){
                const newUrl = formUrlQuery({
                    params: paramsString,
                    key: "topic",
                    value: searchQuery,
                });
                router.push(newUrl);
            }
            else{
                if(pathname === '/mentors'){
                    const newUrl = removeKeysFromUrlQuery({
                        params: paramsString,
                        keysToRemove: ["topic"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }   
        }, 1000)

        return () => clearTimeout(delayDebounceFn);
        
    },[searchQuery, router, paramsString, pathname]);

    useEffect(()=>{
        setSearchQuery(query);
    }, [query]);
  return (
    <div className='searchinput relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
        <Image src="/icons/search.svg" alt='search' width={15} height={15}  />
        <input placeholder='Search Companions...'
            className='outline-none'
            value={searchQuery}
            onChange={(e)=> setSearchQuery(e.target.value)}
        />
    </div>
  );
};

export default SearchInput;