const jwt = require('jsonwebtoken'); //Enable JSON Web Tokens
const mongoose = require('mongoose');
const UserModel = mongoose.model('users');
const RoleModel = mongoose.model('roles');
const TripModel = mongoose.model('trips');

//Method to simplify our JWT:
const extractQueryInfo = async(req, res, next) => {
    console.log("controller::authorization::extractQueryInfo");

    if(req.auth == null)
    {
        console.log("   No Token data found.");
        req.query = { ... req.query , ... {publicity: true} };
        next();
        return;
    }


    req.userId = req.auth._id;
    console.log("   The given user ID is:" + req.userId);

    const roleQuery = await RoleModel.findOne({role: "admin"}).exec();

    console.log("   Asked for roll information");
    console.log("   ", roleQuery);


    const userQuery = await UserModel.findOne({_id: req.userId}).exec();

    if(userQuery.roles != null && roleQuery != null && userQuery.roles.includes(roleQuery._id))
    {
        if(req.query == null)
        {
            req.query = {};
        }
        next();
        return;
    }

            // Uncomment the following line to show results of query
            // on the console.
            // console.log(q);
    req.query = {... req.query , ... {$or:
                        [
                            {publicity: true},
                            {author: req.userId},
                            {editors: req.userId}
                        ]}};

    next();
}

const extractAdvancedQueryInfo = async(req, res, next) => {
    console.log("controller::authorization::extractAdvancedQueryInfo");

    if(req.body == null)
    {
        next();
        return;
    }

    req.query = {start: {}, perPerson: {}};

    if(req.body.beginAcceptableDate != null && req.body.beginAcceptableDate != '')
    {
        console.log("   Has Begin Date");
        Object.assign(req.query.start,{"$gte": req.body.beginAcceptableDate});
    }

    if(req.body.endAcceptableDate != null && req.body.endAcceptableDate != '')
    {
        console.log("   Has End Date");
        Object.assign(req.query.start,{"$lte": req.body.endAcceptableDate});
    }

    if(Object.keys(req.query.start).length == 0)
    {
        delete req.query.start;
    }

    next();
}

const extractEditInfo = async(req, res, next) => {
    console.log("controller::authorization::extractUserInfo");

    if(req.auth == null)
    {
        console.log("No Token data found.");
        req.edit = { $and: [{name:"correct"},{name:"incorrect"}] };
        next();
        return;
    }


    req.userId = req.auth._id;
    console.log("The given user ID is:" + req.userId);

    const roleQuery = await RoleModel.findOne({role: "admin"}).exec();

    console.log("Asked for roll information");
    console.log(roleQuery);


    const userQuery = await UserModel.findOne({_id: req.userId}).exec();

    if(userQuery.roles != null && roleQuery != null && userQuery.roles.includes(roleQuery._id))
    {
        req.edit = { };
        next();
        return;
    }

            // Uncomment the following line to show results of query
            // on the console.
            // console.log(q);
    req.edit = { $or:
                        [
                            {author: req.userId},
                            {editors: req.userId}
                        ]};

    next();
}

module.exports = {
    extractQueryInfo,
    extractAdvancedQueryInfo,
    extractEditInfo
};