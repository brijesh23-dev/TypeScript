"use strict";
//Union
Object.defineProperty(exports, "__esModule", { value: true });
let sub = "1M";
let apiRequestStatus = "success";
apiRequestStatus = "pending"; //so only three available options
let Student;
Student = "present";
//any
//let currentCount;  //so ts infer it as a any=>i.e i don't care assign whatever you want.just try to avoid any.no need to  check i.e typenarrowing.
function Checktype(obj) {
    if (obj.type == 'String') {
        return 'this is a string type.';
    }
    if (obj.type === 'object') {
        return obj;
    }
    return "can't determined";
}
let currentCount; //use annotation
//unknown it is simillar to any.its used in api call.unknown intialy not requried to assign but after fetching date we need to narrow down it and assign type
function ischai(obj) {
    if (typeof obj === "string") {
        return "this is a string object";
    }
    if (typeof obj === "object") {
        return obj;
    }
    return undefined;
}
//# sourceMappingURL=UnionAndany.js.map