module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getProjects(res, mysql, context, complete){
        mysql.pool.query("SELECT Pnumber, Pname FROM PROJECT", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.projects  = results;
            complete();
        });
    }

    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT Fname, Lname, Salary, Dno FROM EMPLOYEE ", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            complete();
        });
    }

    function getEmployeeByProject(req, res, mysql, context, complete){
      var query = "SELECT Fname, Lname, Salary, Dno FROM WORKS_ON, EMPLOYEE WHERE WORKS_ON.Essn = EMPLOYEE.Ssn and WORKS_ON.Pno = ?";
      console.log(req.params)
      var inserts = [req.params.project]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
    function getEmployeeWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT Fname, Lname, Salary, Dno FROM EMPLOYEE WHERE Fname LIKE " + mysql.pool.escape(req.params.s + '%');

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            complete();
        });
    }

    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT character_id as id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

    /*Display all employees. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [,"filteremployee.js","searchemployee.js"];
        var mysql = req.app.get('mysql');
        getEmployees(res, mysql, context, complete);
        getProjects(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('employee', context);
            }

        }
    });

    /*Display all employees for a given project. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:project', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filteremployee.js","searchemployee.js"];
        var mysql = req.app.get('mysql');
        getEmployeeByProject(req,res, mysql, context, complete);
        getProjects(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('employee', context);
            }

        }
    });

    /*Display all employees whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filteremployee.js","searchemployee.js"];
        var mysql = req.app.get('mysql');
        getEmployeeWithNameLike(req, res, mysql, context, complete);
        getProjects(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('employee', context);
            }
        }
    });


    return router;
}();
