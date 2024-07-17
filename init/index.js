const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../Models/listing.js");
main()
.then(()=>{
    console.log("connection build successfully");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initDb=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"668fd5d809636bbb636c25ea"}));
    await Listing.insertMany(initdata.data);
}

initDb();