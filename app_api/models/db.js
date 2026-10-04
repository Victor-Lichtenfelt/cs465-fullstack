//const mongoose = require('mongoose');
//const host = process.env.DB_HOST || '127.0.0.1';
//const dbURI = `${host}/travlr`;
const readLine = require('readline');
const mysql = require('mysql2');



class easyMySQLInteract
{
    //Build the connection string and set the connection timeout.
    // timeout is in milliseconds.
    constructor(inputHost, inputUser, inputPassword, inputDatabase)
    {
        this.con = mysql.createConnection({
            host: inputHost,
            user: inputUser,
            password: inputPassword,
            database: inputDatabase
        });

        setTimeout(() => this.con.connect(
            function(err) {
                if (err) throw err;
                console.log("Connected!");
            }
        ));
    }

    gracefulShutdown(msg)
    {
        this.con.end(
            err => {
                if (err) console.error('Error closing connection:', err, '\nWould be through:', msg);
                else console.log(`Connection closed through ${msg}`);
            }
        );
    }

    async insertSingleRow(table, row)
    {
        console.log(mysql.format('INSERT INTO ?? SET ?', [table, row]));
        await this.con.promise().query('INSERT INTO ?? SET ?', 
            [table, row]
        );
    }

    async viewSingleRowByTrait(table, trait, desired)
    {
        var [rowResults] = await this.con.promise().query('SELECT * FROM ?? WHERE ?? = ? LIMIT 1', 
            [table, trait, desired]
        );

        if(rowResults.length == 0)
        {
            return null;
        }

        return rowResults[0];
    }

    async deleteTable(table)
    {
        await this.con.promise().query('DELETE TABLE IF EXISTS ??', [table]);
    }

    async removeAllRows(table)
    {
        await this.con.promise().query('DELETE FROM ??', [table]);
    }

    async updateRowsByTrait(table, row, trait, desired)
    {
        console.log(mysql.format('UPDATE ?? SET ? WHERE ?? = ?', [table, row, trait, desired]));
        
        await this.con.promise().query('UPDATE ?? SET ? WHERE ?? = ?', 
            [table, row, trait, desired]
        );
    }

    async viewRowsByTrait(table, trait, desired)
    {
        var [rowResults] = await this.con.promise().query('SELECT * FROM ?? WHERE ?? = ?', 
            [table, trait, desired],
        );

        if(rowResults.length == 0)
        {
            return null;
        }

        return rowResults;
    }

    async makeEqualCondition(trait, desired)
    {
        let str = mysql.format('?? = ?', [trait, desired]);
        console.log("SQLString Condition: ", str);
        return str;
    }

    async makeConditionsAndJoined(conditions)
    {
        var conditionsString = "(1 = 1";
        for(let i = 0; i < conditions.length; i++)
        {
            conditionsString += ") AND (";
            conditionsString += conditions[i];
            console.log("   SQLString Condition: ", conditions[i]);
        }
        conditionsString += ")";

        return conditionsString;
    }

    async makeConditionsOrJoined(conditions)
    {
        var conditionsString = "(1 = 2";
        for(let i = 0; i < conditions.length; i++)
        {
            conditionsString += ") OR (";
            conditionsString += conditions[i];
            console.log("   SQLString Condition: ", conditions[i]);
        }
        conditionsString += ")";

        return conditionsString;
    }

    async updateRowsConditional(table, row, conditions)
    {
        var mySQLString = mysql.format('UPDATE ?? SET ? WHERE ', [table,row]);
        var conditionsString = await this.makeConditionsAndJoined(conditions);

        mySQLString += conditionsString;

        console.log("   SQLString(updateRows): ", mySQLString);

        await this.con.promise().query(mySQLString);
    }



    async viewRowConditional(table, conditions)
    {
        var mySQLString = mysql.format('SELECT * FROM ?? WHERE ', [table]);
        var conditionsString = await this.makeConditionsAndJoined(conditions);

        mySQLString += conditionsString;
        mySQLString += " LIMIT 1";

        console.log("   SQLString(viewRow): ", mySQLString);

        var rowResults;


        [rowResults] = await this.con.promise().query(mySQLString);

        if(rowResults.length == 0)
        {
            return null;
        }

        return rowResults[0];
    }

    async viewRowsConditional(table, conditions)
    {
        var mySQLString = mysql.format('SELECT * FROM ?? WHERE ', table);
        var conditionsString = await this.makeConditionsAndJoined(conditions);

        mySQLString += conditionsString;

        console.log("   SQLString(viewRows): ", mySQLString);

        var rowResults;


        [rowResults] = await this.con.promise().query(mySQLString);

        if(rowResults.length == 0)
        {
            return null;
        }

        return rowResults;
    }

    async viewAllRows(table)
    {
        var [rowResults] = await this.con.promise().query('SELECT * FROM ??', [table]);

        if(rowResults.length == 0)
        {
            return null;
        }

        return rowResults;
    }
}



// Windows specific listener
if(process.platform === 'win32') {
    const r1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    r1.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}


//Instance Of easyMySQLInteract To Export:
let caseOf = new easyMySQLInteract('localhost',"root","1PastOldLongNodeZoneFood$"/*process.env.MYSQL_USER,process.env.MYSQL_PASS*/,'travlr');


//Event Listeners to process graceful shutdowns

//Shutdown invoked by nodemon signal:
process.once('SIGUSR2', () => {
    caseOf.gracefulShutdown('nodemon restart');
    process.kill(process.pid,'SIGUSR2');
});

//Shutdown invoked by app termination
process.on('SIGINT', () => {
    caseOf.gracefulShutdown('app termination');
    process.exit(0);
});

//Shutdown invoked by container termination:
process.on('SIGTERM', () => {
    caseOf.gracefulShutdown('app shutdown');
    process.exit(0);
});

//Export for other files to use.
module.exports = caseOf;