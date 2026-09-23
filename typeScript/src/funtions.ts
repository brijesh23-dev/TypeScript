function printhello():void{
    console.log("hello ! how are  you")
}

function order(orderId:number,item:string){
    return `orderid of ${item} is ${orderId}`
}

//with return type
function add(a:number,b:number):number{
    return a+b;
}

add(23,2)

function getData(data?:string){
    return "we get data successfully."
}
