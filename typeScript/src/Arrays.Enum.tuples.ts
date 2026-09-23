//arrays

const name:string[] = ["alok","aryan","w"];
const price:number[] = [1,3,4,5];

const marks:Array<number> = [34,45,990];

type employee = {
    name:string,
    empId:number
}

const employees:employee[] = [
    {name:"zordan",empId:23},
    {name:"scjoza",empId:45}
]

const passwords:readonly string[] = ["djflsd34","erjoit345"]
//passwords.push("bhaiya..") can't push bcz it is readonly

//tupels
//order should be  same as  we define types.

let student:[name:string,marks:number] = ["raju",86];
student = ["rahul",90];

let chomu:[string,number,boolean?]
chomu = ["chomu",493089];
chomu = ["chomu",493089,true];

let safe:readonly[string]=["gen-z"];

//enum

enum StatusCodes  {
    SUCCESS = 200,
    PENDING = 400,
    FAIL = 500
}

const size = StatusCodes.SUCCESS;

// Function fetchData(type:StatusCodes){
//     if(StatusCodes){
//         return `data get fetch with status${StatusCodes}`
//     }
// }
// fetchData()

enum Subject {
    DBMS,
    OOPS,
    CN,
    OS,
    CO
}

const favSub = Subject.OOPS;