
module.exports=getDate;

function getDate () {
 let today = new Date();
    
const options = {
 day: "numeric",
 weekday: "long",
 month: "long",
 year: "numeric",
}

let Day = today.toLocaleDateString("en-US", options);
return Day;

}