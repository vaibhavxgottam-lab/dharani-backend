const mongoose = require("mongoose")

const PropertySchema = new mongoose.Schema({

propertyId:{
type:String,
required:true
},

location:{
type:String
},

ownerWallet:{
type:String
},

documentHash:{
type:String
},

qrCode:{
type:String
},

history:[
{
owner:String,
date:Date
}
]

})

module.exports = mongoose.model("Property",PropertySchema)