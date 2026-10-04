const MySQL = require('../models/db');

//Method to simplify our JWT:
const extractQueryInfo = async(req, res, next) => {
    console.log("controller::authorization::extractQueryInfo");

    if(req.auth == null)
    {
        console.log("   No Token data found.");
        var example = await MySQL.makeEqualCondition('publicity',true);
        req.query = [example];
        console.log("   Condition is:", example);
        next();
        return;
    }


    req.userId = req.auth.id;
    console.log("   The given user ID is:" + req.userId);

    try
    {
        var admin = await MySQL.viewRowConditional(
            'user_has_role', 
            [
                await MySQL.makeEqualCondition('userID',req.userId),
                await MySQL.makeEqualCondition('role','admin')
            ] 
        );

        if(admin)
        {
            req.query = ["1 = 1"];
            next();
            return;
        }
    }
    catch(err)
    {

    }

    /*
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
    */

            // Uncomment the following line to show results of query
            // on the console.
            // console.log(q);

    req.query = [await MySQL.makeConditionsOrJoined(
        [await MySQL.makeEqualCondition('publicity',true),await MySQL.makeEqualCondition('author',req.userId)]
    )];
            /*
    req.query = {... req.query , ... {$or:
                        [
                            {publicity: true},
                            {author: req.userId},
                            {editors: req.userId}
                        ]}};
        */
    next();
}

/*

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

*/

const extractUserInfo = async(req, res, next) => {
    console.log("controller::authorization::extractUserInfo");
    if(req.auth == null)
    {
        console.log("   No Token data found.");
        //req.edit = { $and: [{name:"correct"},{name:"incorrect"}] };
        next();
        return;
    }


    req.userId = req.auth.id;
    console.log("   The given user ID is:" + req.userId);

    next();
}

const extractEditInfo = async(req, res, next) => {
    console.log("controller::authorization::extractEditInfo");

    if(req.auth == null)
    {
        console.log("No Token data found.");
        req.edit = await MySQL.makeConditionsAndJoined(
                [
                    await MySQL.makeEqualCondition('code','MMMM000000'),
                    await MySQL.makeEqualCondition('code','MMMM000001')
                ]
            );
        next();
        return;
    }


    req.userId = req.auth.id;
    console.log("The given user ID is:" + req.userId);

    try
    {
        var admin = await MySQL.viewRowConditional(
            'user_has_role', 
            [
                await MySQL.makeEqualCondition('userID',req.userId),
                await MySQL.makeEqualCondition('role','admin')
            ] 
        );

        if(admin != null)
        {
            console.log("   Got Admin Role!");
            req.edit = ["1 = 1"];
            next();
            return;
        }
    }
    catch(err)
    {

    }

    req.edit = [await MySQL.makeEqualCondition('author',req.userId)];



    next();

    /*

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
    */
}
    

module.exports = {
    extractQueryInfo,
    extractUserInfo,
    //extractAdvancedQueryInfo,
    extractEditInfo
};
