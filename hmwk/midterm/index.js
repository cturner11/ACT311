async function fillDropdown(){
    const responce = await fetch("/users/cturner11/act311/hmwk/hmwk06/CSMP.json")
    const classes = await responce.json()
    return classes;
}


fillDropdown().then(classes => {
   console.log(classes)
    var instructors = [];
    var currentInst = "";
    for(x in classes){
        currentInst = classes[x]["instructor"]
        if(!instructors.includes(currentInst)){
            instructors.push(currentInst);
        }
    }
    var sel = document.querySelector("#mySelect");
    for(i in instructors){
       var option = document.createElement("option");
       option.text = instructors[i];
       option.id = instructors[i];
       sel.add(option); 
    }
})

//if name = "" then forloop through classes to pull all info that contains that instructors name
//list of courses
//sorted by day
//then time (AM PM sensitave)
//display some course data
function getClasses(butts){
    var name =  butts.options[butts.selectedIndex].id
    fillDropdown().then(classes => {
        var theClasses = [];
        document.getElementById("dataField").innerHTML = "";
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

