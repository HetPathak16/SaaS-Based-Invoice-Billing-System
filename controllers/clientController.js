const  { clientSchema }=require('../validation/clientValidation');
const { selectData , insertData , updateData ,deleteData } =require('../models/dbFunction');
const { sendResponse } =require('../models/responsehandler');

exports.clientsListing= async (req ,res)=>{
    try {
        const allclients =await selectData('clients');
        return sendResponse(res,200,'clients getting successfully',allclients);
    } catch (error) {
        return sendResponse(res,500,'internal server error ',error.message)
    }
}

exports.clientCreate =async (req,res) =>{
    const { error, value } = clientSchema.validate(req.body);
    if(error){
        return sendResponse(res,400,'error in validation',error.details[0].message)
    }
    const {name,email,address,company,created_by} =value;
    try {
        const client =await selectData('clients',{email})
        if(client.length) return sendResponse(res,400,'client already exist')
        const newclient =await insertData('clients',{name,email,address,company,created_by});
        return sendResponse(res,201,'client created successfully',newclient)
    } catch (error) {
        return sendResponse(res,500,'internal server error',error.message)
    }
}

exports.clientDetails = async (req,res)=>{
    const { id } =req.params;
    try {
        const client =await selectData('clients',{id});
        if(!client.length) return sendResponse(res,400,'client not found');
        return sendResponse(res,200,'getting client data successfully',client)
    } catch (error) {
        return sendResponse(res,500,'internal server error',error.message)
    }
}

exports.updateClient = async (req,res )=>{
    const {id} =req.params
    const {error,value} = clientSchema.validate(req.body)
    if(error) return sendResponse(res,400,'error in update client validaiton')
        const {name,email,address,company }= value;
    
    try {
        const client =await selectData('clients',{id});
        if(!client.length) return sendResponse(res,400,'client not found');
        const updatedclients =await updateData('clients',{name,email,address,company},{id})
        return sendResponse(res,200,'client updated successfully',updatedclients)
    } catch (error) {
        return sendResponse(res,500,'internal server error',error.message)
    }
}

exports.deleteClient = async (req,res) =>{
    const {id} = req.params;
    try {
        const client = await selectData('clients',{ id })
        if(!client.length) return sendResponse(res , 400 , 'client not found' );
        const deletedClient = await deleteData('clients',{id});
        return sendResponse(res , 200 , 'client deleted successfully', deletedClient )
    } catch (error) {
        return sendResponse( res ,500,'internal server error',error.message)
    }
}