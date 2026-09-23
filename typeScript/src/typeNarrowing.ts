function getData(kind: string | number) {
  if (typeof kind === "string") {
    return `data successfully fetched: ${kind}`; //sure that type is string
  }
  return `data fetch from api is: ${kind}`; //sure that type is number
}

function getMessage(msg?: string) {
  if (msg) return msg; //it insure msg must revieve
  return "msg not recieved"; //no msg recieve
}

function orderChai(size: "small" | "medium" | "large" | number) {
  if (size === "small") return "small cutting chai...";
  if (size === "medium" || size === "large") return "make a large chai";
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

function serving(chai:cutting | tea){
    if(chai instanceof cutting)     return chai.serve();
    if(chai instanceof tea)         return chai.serve()
}

type Dancer  = {type:"hip hop",Rating:number};
type Singer = {type:"classical",Rating:number};
type Drama = {type:"choriography",Rating:number};

type Artist = Dancer | Singer | Drama;
function isArtist(Profession:Artist){
  switch(Profession.type){
    case "hip hop":
      return "can sing hip-hop";
      case "choriography":
        return " a goof show "
  }
}

