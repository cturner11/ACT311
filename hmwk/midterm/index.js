async function errorCheck(x){
    const resp = await fetch("/users/cturner11/act311/hmwk/midterm/jsons/"+x);
    //onsole.log(resp);
    if (resp.status >= 200 && resp.status < 300) {
        //console.log("good");
        return true;
    } else {
        //console.log("bad");
        return false;
    }
}

async function addType(){
    const departments = await fillFirstDropdown();
    var type = [];
    currentType = "";
    for(x in departments){
        var err = await errorCheck(departments[x]["filename"]);
        if(err){
            currentType = departments[x];
            if(!type.includes(currentType)){
                type.push(currentType);
            }
        }
    }
    var uniquetypes = [];
    var sel = document.querySelector("#myType");
    for (i in type) {
        var data = await fillDropdown(type[i]["filename"]);
        for(j in data){
            var classType = data[j]["type"];
            if(!uniquetypes.includes(classType)){
                uniquetypes.push(classType);
                var option = document.createElement("option");
                option.text = classType;
                option.id = classType;
                sel.add(option);
            }
        }

    }
    //console.log(uniquetypes);
    sel.classList.remove("d-none");
}

async function addDpt(){
    
    const departments = await fillFirstDropdown();
    var dpt = [];
    var currentdpt = "";
    for(x in departments){
        var err = await errorCheck(departments[x]["filename"]);
        if(err){
            currentdpt = departments[x];
            if(!dpt.includes(currentdpt)){
                dpt.push(currentdpt);
            }
        }else{
            var ul = document.getElementById("dataField");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode("Bad Files "+departments[x]["filename"]));
            li.classList.add("list-group-item");

            ul.appendChild(li);
        }
    }
    var sel = document.querySelector("#myDept");
    for(i in dpt){
       var option = document.createElement("option");
       option.text = dpt[i]["dept"];
       option.id = dpt[i]["filename"];
       sel.add(option); 
    }
    sel.classList.remove("d-none");
}

async function fillDropdown(x){
    const responce = await fetch("/users/cturner11/act311/hmwk/midterm/jsons/"+x);
    const classes = await responce.json();
    return classes;
}

async function fillFirstDropdown(){
    const responce = await fetch("/users/cturner11/act311/hmwk/midterm/jsons/bad.json");
    const departments = await responce.json();
    return departments;
}

function addTeachers(dpt){
    //console.log(dpt);
    var selected= dpt.options[dpt.selectedIndex];
    
    fillDropdown(selected.id).then(classes => {
    console.log(classes);
    var instructors = [];
    var currentInst = "";
    for(x in classes){
        currentInst = classes[x]["instructor"];
        if(!instructors.includes(currentInst)){
            instructors.push(currentInst);
        }
    }
    var sel = document.querySelector("#mySelect");
    sel.innerHTML = "";
    for(i in instructors){
       var option = document.createElement("option");
       option.text = instructors[i];
       option.id = instructors[i];
       sel.add(option); 
    }
    sel.classList.remove("d-none");
});
}

async function getclassesByType(classType){
    const departments = await fillFirstDropdown();
    var selectedType = classType.options[classType.selectedIndex].id
    
    var type = [];
    currentType = "";
    for (x in departments) {
        var err = await errorCheck(departments[x]["filename"]);
        if (err) {
            currentType = departments[x];
            if (!type.includes(currentType)) {
                type.push(currentType);
            }
        }
    }
    var uniquetypes = [];
    var sel = document.querySelector("#myType");
    var div = document.getElementById("container2");
    var inner = "<div class='col-3 text-white bg-dark'>course</div><div class='col-3 text-white bg-dark'>class title</div><div class='col-2 text-white bg-dark'>\n\
                        days</div><div class='col-2 text-white bg-dark'>times</div><div class='col-2 text-white bg-dark'>CRN</div>";
    for (i in type) {
        var data = await fillDropdown(type[i]["filename"]);
        for (j in data) {
            var classType = data[j]["type"];
            if (classType == selectedType){
                inner+="<div class='col-3'>"+data[j]["course"]+"</div><div class='col-3'>"+data[j]["title"]+"</div><div class='col-2'>"+data[j]["days"]+
                        "</div><div class='col-2'>"+data[j]["times"]+"</div><div class='col-2'>"+data[j]["crn"]+"</div>";
            }
        }
    }
    div.innerHTML = inner;
}

function getClasses(butts){
    var name =  butts.options[butts.selectedIndex].id;
    console.log(name);
    var department = document.querySelector("#myDept");
    var file = department.options[department.selectedIndex].id;
    fillDropdown(file).then(classes => {
        var theClasses = [];
        for(i in classes){
            if(classes[i]["instructor"]==name){
                var string = classes[i]["course"]+"::"+classes[i]["title"]+"::"+classes[i]["days"][0]+"::"+classes[i]["times"][0]+"::"+classes[i]["crn"];
                theClasses.push(string);   
            }  
        }
        sortDay(theClasses);
        console.log(theClasses);
        var div = document.getElementById("container2");
        var inner = "<div class='col-3 text-white bg-dark'>course</div><div class='col-3 text-white bg-dark'>class title</div><div class='col-2 text-white bg-dark'>\n\
                        days</div><div class='col-2 text-white bg-dark'>times</div><div class='col-2 text-white bg-dark'>CRN</div>";
        for(i in theClasses){
            var cut = theClasses[i].split("::");
            if(cut[3]=="-"){
                cut[3] = "Online"
            }
            inner+="<div class='col-3'>"+cut[0]+"</div><div class='col-3'>"+cut[1]+"</div><div class='col-2'>"+cut[2]+"</div><div class='col-2'>"+cut[3]+"</div><div class='col-2'>"+cut[4]+"</div>";
        }
        div.innerHTML = inner;
    })   
}

function sortDay(list){
    //console.log(list);
    for(i in list){
        var splitList = list[i].split("::");
        //console.log(splitList);
    }
    list.sort(function(a,b){
        var splitLista = a.split("::");
        var splitListb = b.split("::");
        
        let myMap = new Map();
        myMap['M'] = 0;
        myMap['T'] = 1;
        myMap['W'] = 2;
        myMap['R'] = 3;
        myMap[""] = 4;
        
        var x = splitLista[2].charAt(0);
        var y = splitListb[2].charAt(0);

        //console.log(splitLista[2],splitListb[2]);
        if(myMap[x]>myMap[y]){
            return 1;
        }else if(myMap[x]<myMap[y]){
            return -1;
        }else{
            return sortTime(splitLista[3],splitListb[3]);
        }
        
    });
    //console.log(list);
}

function sortTime(a,b){
    var splitLista = a.split("-");
    var splitListb = b.split("-");
    
    let myMap = new Map();
        myMap['AM'] = 0;
        myMap['PM'] = 1;
        
    var x = splitLista[0];
    var y = splitListb[0];
    
    if(myMap[x]>myMap[y]){
        return 1;
    }else if(myMap[x]<myMap[y]){
        return -1;
    }else{
        var d = splitLista[0].split(":");
        var e = splitListb[0].split(":");
        console.log(d[0],"  ",e[0]);
        if(d[0]>e[0]){
            return 1;
        }else if(d[0]<e[0]){
            return -1;
        }else{
            return 0;
        }
    }
}

