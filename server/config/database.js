const mongoose = require ("mongoose");

require ("dotenv").config();
exports.dbConnect=()=>{
   mongoose.connect(process.env.MONGODB_URL,{
    //  useNewUrlParser: true,
    //  useUnifiedTopology: true, 
   })
   .then(console.log("db connection Successful"))
   .catch((err)=>{
     console.log("Db connection issues");
     console.error(err);
     process.exit(1);
   });
}
