"use strict";
//arrays
Object.defineProperty(exports, "__esModule", { value: true });
const name = ["alok", "aryan", "w"];
const price = [1, 3, 4, 5];
const marks = [34, 45, 990];
const employees = [
    { name: "zordan", empId: 23 },
    { name: "scjoza", empId: 45 }
];
const passwords = ["djflsd34", "erjoit345"];
//passwords.push("bhaiya..") can't push bcz it is readonly
//tupels
//order should be  same as  we define types.
let student = ["raju", 86];
student = ["rahul", 90];
let chomu;
chomu = ["chomu", 493089];
chomu = ["chomu", 493089, true];
let safe = ["gen-z"];
//enum
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["SUCCESS"] = 200] = "SUCCESS";
    StatusCodes[StatusCodes["PENDING"] = 400] = "PENDING";
    StatusCodes[StatusCodes["FAIL"] = 500] = "FAIL";
})(StatusCodes || (StatusCodes = {}));
const size = StatusCodes.SUCCESS;
// Function fetchData(type:StatusCodes){
//     if(StatusCodes){
//         return `data get fetch with status${StatusCodes}`
//     }
// }
// fetchData()
var Subject;
(function (Subject) {
    Subject[Subject["DBMS"] = 0] = "DBMS";
    Subject[Subject["OOPS"] = 1] = "OOPS";
    Subject[Subject["CN"] = 2] = "CN";
    Subject[Subject["OS"] = 3] = "OS";
    Subject[Subject["CO"] = 4] = "CO";
})(Subject || (Subject = {}));
const favSub = Subject.OOPS;
//# sourceMappingURL=Arrays.Enum.tuples.js.map