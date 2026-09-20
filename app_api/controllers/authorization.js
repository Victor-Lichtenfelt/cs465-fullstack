const jwt = require('jsonwebtoken'); //Enable JSON Web Tokens
const mongoose = require('mongoose');
const UserModel = mongoose.model('users');
const RoleModel = mongoose.model('roles');
const TripModel = mongoose.model('trips');

//Method to simplify our JWT:
const extractUserInfo = async(req, res, next) => {
    console.log("DoesThisEvenPrint?");

    if(req.auth == null)
    {
        console.log("No Token data found.");
        next();
        return;
    }


    req.userId = req.auth._id;
    console.log("The given user ID is:" + req.userId);

    const roleQuery = await RoleModel.findOne({role: "admin"}).exec();

    console.log("Asked for roll information");
    console.log(roleQuery);


    const userQuery = await UserModel.countDocuments({_id: req.userId, roles: roleQuery._id});

            // Uncomment the following line to show results of query
            // on the console.
            // console.log(q);
    console.log("The amount with that is:" + userQuery);

    req.admin = (userQuery > 0);
    console.log("The result of admin is:" + req.admin);

    next();
}

module.exports = {
    extractUserInfo
};