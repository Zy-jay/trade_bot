import { useMemo, useState } from "react";

export function useActiveTabIndex(index?: number){
   const [active, setActive] = useState(1); 
   if(index){
   setActive(index)
   }

   console.log(active)
  
   return useMemo(()=>{return {setActive, active}},[active]) 
}