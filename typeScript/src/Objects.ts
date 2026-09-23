let  tea :{
    name:string;
    price:number;
    ingredients:string[]
}

tea = {
    name:"tanduri chai",
    price:50,
    ingredients:["milk","sugar","chaileaves"]
}

type Tea = {
    name:string,
    price:number,
    isHot:boolean
}

const kulladh:Tea = {
    name:"kulladh chai",
    price:60,
    isHot:true
}

type User = {
    name:string,
    password:string,
    email:string
}

const u1:User = {
    name:"anil",
    password:"rdslfjjd",
    email:"anil@23gamil.com"
}