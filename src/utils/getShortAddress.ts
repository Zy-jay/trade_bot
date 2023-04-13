export function getShortAddress(address?: string){
   if(!address) return ""
   return address.substring(0, 6)+ "..."+ address.substring(38, 41)
}
export {}