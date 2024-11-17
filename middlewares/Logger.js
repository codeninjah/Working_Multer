// using this to track the ip of visitor and their activity
module.exports = (req,res,next) => {
    // Following code is for tracking the ip number of the visistor
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    console.log("Ip number is: ", ip); // Prints the ip number
    console.log("Visiting the :", req.method, req.path) // Prints the visited endpoint
    next()
}