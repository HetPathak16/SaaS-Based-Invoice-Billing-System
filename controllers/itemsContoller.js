const { itemSchema } =require('../validation/itemsValidation');
const { sendResponse } =require('../models/responsehandler')
const { insertData , selectData , updateData , deleteData} =require('../models/dbFunction')

exports.itemList = async (req, res) => {
    try {
        const items = await selectData('items');
        console.log(items)
        if(!items.length){
            return sendResponse(res,400,'error in fetching data')
        }
        return sendResponse(res, 200, 'Products fetched successfully', { items });
    } catch (error) {
        return sendResponse(res, 500, 'Error fetching products', null, error.message);    }
};

exports.createItem = async (req, res) => {
    const {error, value} = itemSchema.validate(req.body);
    if (error){
        return sendResponse(res, 400, error.details[0].message);
    }
    const {name,price,category,quantity} = value; 
    try {
        const item = await selectData('items',{name})
        if(item.length) return sendResponse(res,400,'item already exist')
        const newitems = await insertData('items',{name, price,category,quantity});
        console.log(newitems)
        return sendResponse(res, 201, 'Product created successfully', {newitems});
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, 'Error creating product', null, error.message);
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await selectData('items',{id});
        if (!item.length) {
            return sendResponse(res, 400, 'Product not found');
        }
        await deleteData('items',{ id });
        return sendResponse(res, 200, 'Product deleted successfully',item[0].Name);
    } catch (error) {
        return sendResponse(res, 500, 'Error deleting product', null, error.message);
    }
};

exports.UpdateItem = async (req, res) => {
    const {id} = req.params;
    const {error, value} = itemSchema.validate(req.body);
    if (error) {
        return sendResponse(res, 400, error.details[0].message);
    }
    const { name, price, category } = value;
    try {
        const existingProduct = await selectData('items', {id} );
        console.log(existingProduct)
        if (!existingProduct.length) {
            return sendResponse(res, 400, 'item not found');
        }
        const updateditem= await updateData('items',{name, price, category},{id});
        console.log(updateditem)
        return sendResponse(res, 200, 'Product updated successfully',updateditem);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 'Server error', null, error.message);
    }
};

exports.getItemDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await selectData('items', { id });
        if (!item.length) return sendResponse(res, 400, 'Product not found');
        return sendResponse(res, 200, 'Product details', item[0]);
    } catch (error) {
        return sendResponse(res, 500, 'Error fetching product', null, error.message);
    }
};
