const authRouter =require('./authRoute.js');
const clientRoute =require('./clientRoute.js')
const itemRoute =require('./itemsRoute.js');
const invoiceRoute =require('./invoiceRoute.js');
const taxesRoute = require('./taxesRoute.js');
const paymentRoute =require('./paymentRoute.js');
const reportsRoute = require('./reportRoute.js');
const adminSettingRoute= require('./adminSettingRoute.js')
const { authenticate } =require('../middleware/authMiddleware')

const express =require('express');
const app =express();

app.use('/auth',authRouter);    
app.use('/clients',authenticate,clientRoute);
app.use('/items',authenticate,itemRoute);
app.use('/invoice',invoiceRoute)
app.use('/taxes',authenticate,taxesRoute)
app.use('/payment',authenticate,paymentRoute)
app.use('/reports',authenticate,reportsRoute);
app.use('/settings',authenticate,adminSettingRoute)

module.exports =app;