"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getData(kind) {
    if (typeof kind === "string") {
        return `data successfully fetched: ${kind}`; //sure that type is string
    }
    return `data fetch from api is: ${kind}`; //sure that type is number
}
function getMessage(msg) {
    if (msg)
        return msg; //it insure msg must revieve
    return "msg not recieved"; //no msg recieve
}
function orderChai(size) {
    if (size === "small")
        return "small cutting chai...";
    if (size === "medium" || size === "large")
        return "make a large chai";
    return `chai amount is : ${size}`;
}
class cutting {
    serve() {
        return "serving cutting chai";
    }
}
class tea {
    serve() {
        return "serving tea";
    }
}
function serving(chai) {
    if (chai instanceof cutting)
        return chai.serve();
    if (chai instanceof tea)
        return chai.serve();
}
function isArtist(Profession) {
    switch (Profession.type) {
        case "hip hop":
            return "can sing hip-hop";
        case "choriography":
            return " a goof show ";
    }
}
//# sourceMappingURL=typeNarrowing.js.map