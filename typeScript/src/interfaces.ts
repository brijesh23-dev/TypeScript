type chai = {
  type: "masala chai" | "giger chai";
  amount: number;
  size: number;
};
//for custmize type object can't be implemented;

class servechai implements chai {
  type: "masala chai" | "giger chai" = "masala chai";
  amount = 34;
  size = 98;
}

type human = {
  name: string;
  age: number;
  gender: "male" | "female" | "others";
};

class User implements human {
  name = "ashok";
  age = 23;
  gender: "male" | "female" | "others" = "male";
}


//with interface
interface chai1 {
  type: "masala chai" | "giger chai";
  amount: number;
  size: number;
}

class servechai1 implements chai {
  type: "masala chai" | "giger chai" = "masala chai";
  amount = 34;
  size = 98;
}
interface human1 {
  name: string;
  age: number;
  gender: "male" | "female" | "others";
}

class User1 implements human {
  name = "ashok";
  age = 23;
  gender: "male" | "female" | "others" = "male";
}

type Artist = {
    profession:"dancer" | "singer" | "comedy";
}

class actor implements Artist {
    profession: "dancer" | "singer" | "comedy" = "singer";
}

type developer = {
    stack:"mern-stack" | "mean-stack" |"full-stack";
}
type ProblemSolver = {
    plateform: "codechef"|"leetcode"|"codeforce";
}

type placement = developer & ProblemSolver;

const isRequired:placement = {
    stack:
}