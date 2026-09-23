//Union

let sub: number | string = "1M";
let apiRequestStatus: "success" | "error" | "pending" = "success";
apiRequestStatus = "pending"; //so only three available options
let Student: "present" | "absent" | "bunk";
Student = "present";

//any
//let currentCount;  //so ts infer it as a any=>i.e i don't care assign whatever you want.just try to avoid any.no need to  check i.e typenarrowing.
function Checktype(obj: any) {
  if (obj.type == "String") {
    return "this is a string type.";
  }
  if (obj.type === "object") {
    return obj;
  }
  return "can't determined";
}
let currentCount: string | undefined; //use annotation
//unknown it is simillar to any.its used in api call.unknown intialy not requried to assign but after fetching date we need to narrow down it and assign type
function ischai(obj: undefined) {
  if (typeof obj === "string") {
    return "this is a string object";
  }
  if (typeof obj === "object") {
    return obj;
  }
  return undefined;
}

let ProjectStatus: "pending" | "completed" | "progress" = "completed";

function checkStatus(): string {
  if (ProjectStatus == "completed") {
    return "project is done";
  }
  if (ProjectStatus == "pending") {
    return "project is pending";
  }

  return  "its take time";
}
