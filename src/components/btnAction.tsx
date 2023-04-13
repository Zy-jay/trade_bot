import { Button } from "@mui/material"

function BtnAction (clickFunction: any, title: string){
return(
<Button onClick={clickFunction}>
        {title}
    </Button>
    
)
}
export default BtnAction