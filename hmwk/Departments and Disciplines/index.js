const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url="https://aps4.missouriwestern.edu/schedule/?tck=202210"

let departments = [];
let disciplines = [];

axios.get(url)
.then(resp => {
    const html = resp.data;
    const $ = cheerio.load(html);
    getDisciplines($);
    getDepartments($);
})
.catch(err => console.log("Error fetching:", err));


function getDisciplines($){
    const select = $("#subject");
    select.children().each((i, e)=>{
        //console.log(i,"::",$(e).attr("value"),"::",$(e).text()
        let value = $(e).attr("value");
        let text = $(e).text();
        let discipline = {};
        discipline.value = value;
        discipline.text = text;
        disciplines.push(discipline);
    })
    fs.writeFile('./disciplines.json',JSON.stringify(disciplines),err=>{
        if(err){
            console.log("Error writing file".err);
        }else{
            console.log("department.json file was created");
        }
    })
}

function getDepartments($){
    const select = $("#department");
    select.children().each((i, e)=>{
        //console.log(i,"::",$(e).attr("value"),"::",$(e).text())
        let value = $(e).attr("value");
        let text = $(e).text();
        let department = {};
        department.value = value;
        department.text = text;
        departments.push(department);
    })
    fs.writeFile('./departments.json',JSON.stringify(departments),err=>{
        if(err){
            console.log("Error writing file".err);
        }else{
            console.log("department.json file was created");
        }
    })
}