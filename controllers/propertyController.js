const Property = require("../models/Property")
const { v4: uuidv4 } = require("uuid")
const QRCode = require("qrcode")

exports.registerProperty = async (req,res)=>{

const {location,ownerWallet,documentHash} = req.body

const propertyId = uuidv4()

const qr = await QRCode.toDataURL(propertyId)

const property = new Property({

propertyId,
location,
ownerWallet,
documentHash,
qrCode:qr,
history:[
{
owner:ownerWallet,
date:new Date()
}
]

})

await property.save()

res.json(property)

}



exports.transferOwnership = async (req,res)=>{

const {propertyId,newOwner} = req.body

const property = await Property.findOne({propertyId})

property.ownerWallet = newOwner

property.history.push({
owner:newOwner,
date:new Date()
})

await property.save()

res.json(property)

}



exports.getProperty = async (req,res)=>{

const property = await Property.findOne({propertyId:req.params.id})

res.json(property)

}



exports.getHistory = async (req,res)=>{

const property = await Property.findOne({propertyId:req.params.id})

res.json(property.history)

}