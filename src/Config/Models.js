const mongoose = require('mongoose')
// Course Modal Schema
const chartSchema = new mongoose.Schema({ 
    Region:String
});
    // Creating model objects
const Charts = mongoose.model('chartdetails', chartSchema);
const DataInsert = mongoose.model('charts', chartSchema);
// app.listen(5000)
module.exports = {
    Charts,DataInsert
}