var moment = require('moment');

module.exports = function(date, format){
    console.log(date,format,moment(date).format(format))
    return moment(date).format(format)
}