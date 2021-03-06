const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const roleChoice = ["Manager","Intern","Engineer"]

//an Array to store employees in 
let employees = [];


// Questions for all Employees
var e_questions = [
    {
      type: 'input',
      name: 'e_name',
      message: "Enter Employee Name:",
      validate: function (e_name) {
        valid = /([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/.test(e_name)
        if (valid) {
            return true;
        } else {
            return 'Enter a valid name must include first and last name';
        }
        } 

    },
    {
      type: 'input',
      name: 'e_email',
      message: "What's the employee email:",
      validate: function (e_email) {
        valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e_email)
        if (valid) {
            return true;
        } else {
            return 'Enter a valid email';
        }
        }  
    },
    {
      name: 'e_role',
      type: 'list',
      message: "\nPlease select the user Role:\n",  
      choices: roleChoice
      }
];
// Function that asks the employee questions
function askEmployeeInfo(){
  let ans = [];
  let employee = {};
  console.clear();
  inquirer.prompt(e_questions)
.then(ans = async (ans) => {
    switch (ans.e_role) {
    case 'Manager':
        
        roleChoice.shift();
        
        ans.uField = "officeNumber";
        return ans;  
    case "Engineer":
       ans.uField = "github";
       return ans;
    case "Intern":   
       ans.uField = "school";
       return ans;
    }
    })
.then(ans = async(ans) => {
let pop = await lastQ(ans);
return pop;
})
.then(res = async(res) => {
  
let cur_id = employees.length + 1;

let nm =capitalizeFirstLetter(res.e_name)
switch (res.e_role) {
    case 'Manager':
    employee = new Manager(nm,cur_id,res.e_email,res.officeNumber);
    break;  
    case 'Engineer':
    employee = new Engineer(nm,cur_id,res.e_email,res.github);
    break; 
    case 'Intern':   
    employee = new Intern(nm,cur_id,res.e_email,res.school);
    break; 
}
employees.push(employee);
//This calls the function that asks if there are more employees
await moreEmployees();
})
.catch(err => {console.log(err)})
}


async function lastQ(ans){
    let var1 = '',question=[];
    if (ans.e_role === 'Manager'){
        question = {
            type: 'input',
            name: 'uniqueVal',
            message: `Please Enter the information for the office number using the format Bld#-Room# field:`,
            validate: function (uniqueVal) {
                valid = /([0-9]{1,}-[0-9]{1,})/.test(uniqueVal)
                if (valid) {
                    return true;
                } else {
                    return 'Please enter a valid office number should use format Bld#-Room#';
                }
                }  
            }
    } else { 
        question = {
            type: 'input',
            name: 'uniqueVal',
            message: `Please Enter the information for the ${ans.uField} field: ` 
        }
    }
    

    await inquirer.prompt([question])
    .then(res => {
    var1 = res.uniqueVal;    
    return(ans)
    })
    ans[ans.uField] = var1;
    return(ans);
}


async function moreEmployees(){
    
    inquirer.prompt([{
        type: 'confirm',
        name: 'askAgain',
        message: 'Is there aonther Employee: ',
        default: true,
       }])
       .then(res => {
        if(res.askAgain){
            askEmployeeInfo()    
        } else {
        createOutput(employees);    
        return res}
       })

}


function capitalizeFirstLetter(string) {
    let newString ="";
    let spString = string.split(" ");
    for (let i=0; i< spString.length; i++ ){
        let string1 =  spString[i];
        let string2 = string1.charAt(0).toUpperCase() + string1.slice(1);
        newString += string2 + " ";
    }       
    return newString;
}


function createOutput(employees){  
    console.clear();
    fs.writeFile(outputPath, render(employees), (err) =>
    err ? console.error(err) : console.log(`File Successfully written to ${outputPath}`)
        ); 
}

askEmployeeInfo()



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
