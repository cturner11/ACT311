function fillTable(){
    console.log(courses);
    var pickTable = "";
    courses.forEach(x =>{
        if(x.course.includes("CSC")){
            //console.log(courses.course);
            pickTable = "CSCTable";
        }
        if(x.course.includes("ACT")){
            pickTable = "ACTTable";
        }
        if(x.course.includes("MAT")){
            pickTable = "MATTable";
        }
        if(x.course.includes("PHY")){
            pickTable = "PHYTable";
        }

        var table = document.getElementById(pickTable);
        var row = table.insertRow(-1);
        row.insertCell(0).innerHTML = x.course;
        row.insertCell(1).innerHTML = x.crn;
        row.insertCell(2).innerHTML = x.title;
        if(x.times[0] == "-"){
            row.insertCell(3).innerHTML = "Online";
        }else{row.insertCell(3).innerHTML = x.days[0]+" "+x.times[0];}
        row.insertCell(4).innerHTML = x.instructor;

        if(x.type == "Lab"){
            row.classList.add("bg-warning");
        }
    });


    //courses.forEach(i =>console.log(i.course));

}