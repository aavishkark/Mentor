'use client'
import './topicfilter.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects } from '../MentorForm/MentorForm';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';


const TopicFilter = () => {

    const router = useRouter();;
    const searchParams = useSearchParams();
    const query = searchParams.get('subject') || '';

    const [subject, setSubject] = useState(query);

    useEffect(()=>{
      let newUrl = "";
      if(subject === "all"){
        newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["subject"],
        });
      }else {
        newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "subject",
            value: subject,
        });
      }
      router.push(newUrl, { scroll: false });  
        
    },[subject]);
  return (
    <Select
        onValueChange={setSubject}>
        <SelectTrigger className="select-trigger">
            <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
            {subjects.map((subject)=>(
                <SelectItem 
                    value={subject}
                    key={subject}
                    className="capitalize"
                >
                    {subject}
                    </SelectItem>
            ))}
        </SelectContent>
    </Select>
  );
};

export default TopicFilter;