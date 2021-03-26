const cheerio = require('cheerio');
const fs = require('fs');
let classes = [];

main();

function main(){
    var files = ["AF","BIO","BUS", "CHE", "CJLG", "COM", "CON1", "CSMP", "EDU", "ET", "FIN", "HON", "HP", "MIL", "NURS", "PSY", "SSH"]
    
    
    for (var file in files) {
        console.log(files[file]);
        getData(files[file]); 
    }
    console.log(classes);
    createJson();
}

//
function getData(filename){
    var data = cheerio.load(fs.readFileSync("htmlPages/"+filename+".html"));
    //console.log(data(".detail_row").html());
    parseData(data)
}

function parseData(data){
    //console.log(data);

    var detailRowList = [];
    data('.results').find('tbody > .detail_row' ).each(function (index, element) {
      detailRowList.push(data(element));
    });
    //pareseDetailRows(data, detailRowList);

    var listRowList = [];
    data('.results').find('tbody > .list_row' ).each(function (index, element) {
        listRowList.push(data(element));
    });

    listRowList = fixListCount(listRowList);
    //console.log("got into parseData")
    for( var x in listRowList){
        parseRows(data, listRowList[x], detailRowList[x])
    }

}

function fixListCount(list){
    var all = []
    var ver = []
    for (var x in list){
        //console.log(ver)
        if(list[x].children().html() === "&nbsp;"){
            ver.push(list[x]);
            continue;
        }
        if(x!=0){
            all.push(ver);
        }
        ver = []
        ver.push(list[x]);
    } 
    all.push(ver);
    return all
}

function parseRows(data, listRow, details){
    
    var courseSeats = "";
    var courseFull = "";
    var courseDesc = "";
    var courseMess = "";
    var courseTerm = "";
    var courseBegin = "";
    var courseEnd = "";

    var i;

    details.find(".course_enrollment > .course_seats").each(function (index, element) {
        //console.log(data(element).html());
        courseSeats = data(element).text().trim().split("\t");
        courseSeats = courseSeats.filter(function (item, pos) {
            return courseSeats.indexOf(item) == pos;
        })
        courseSeats = courseSeats.filter(function (item) {
            return item !== '\n';
        })
        courseSeats = courseSeats.filter(function (item) {
            return item !== '';
        })
        for (var i in courseSeats) {
            courseSeats[i] = courseSeats[i].replace('\n', '');
        }
    });

    details.find(".course_enrollment > .course_full").each(function (index, element) {
        //console.log(data(element).html());
        courseFull = data(element).text().trim();

    });

    details.find(".detail_cell").each(function (index, element) {
        //console.log(data(element).text().trim());
        courseDesc = data(element).text().trim();

    });
    details.find('.course_enrollment').remove();
    details.find('.course_messages').remove();
    details.find('.course_term').remove();
    details.find('.course_dates').remove();
    details.not('detail_cell').each(function (index, element) {
        //console.log(data(element).html());
        courseDesc = data(element).text().trim().split('\t');
        courseDesc = courseDesc.filter(function (item, pos) {
            return courseDesc.indexOf(item) == pos;
        })
        courseDesc = courseDesc.filter(function (item) {
            return item !== '\n'
        })
        courseDesc = courseDesc.filter(function (item) {
            return item !== ''
        })

        for (var enn in courseDesc) {
            courseDesc[enn] = courseDesc[enn].replace('\n', '')
        }
        courseDesc = courseDesc.join(" ")


    });

    details.find(".course_messages > .course_xl").each(function (index, element) {
        //console.log(data(element).html());
        courseMess = data(element).text().trim().split("\t");
        courseMess = courseMess.filter(function (item, pos) {
            return courseMess.indexOf(item) == pos;
        })
        courseMess = courseMess.filter(function (item) {
            return item !== '\n';
        })
        courseMess = courseMess.filter(function (item) {
            return item !== '';
        })
        for (var i in courseMess) {
            courseMess[i] = courseMess[i].replace('\n', '');
        }
    });

    details.find(".course_term").each(function (index, element) {
        //console.log(data(element).html());
        courseTerm = data(element).text().trim();

    });

    details.find(".course_dates > .course_begins").each(function (index, element) {
        //console.log(data(element).html());
        courseBegin = data(element).text().trim();

    });

    details.find(".course_dates > .course_ends").each(function (index, element) {
        //console.log(data(element).html());
        courseEnd = data(element).text().trim();

    });

    //dont run the next line of code unless you hate yourself
    //console.log(courseSeats, courseFull, courseDesc, courseMess, courseTerm, courseBegin, courseEnd);

    //-----------------------------list row data parseing-----------------------------------
    var crn = data(listRow[0].find("td")[0]).text().trim()
    var course = data(listRow[0].find("td")[1]).text().trim()
    var sec = data(listRow[0].find("td")[2]).text().trim()
    var type = data(listRow[0].find("td")[3]).text().trim()
    var title = data(listRow[0].find("td")[4]).text().trim()
    var hours = data(listRow[0].find("td")[5]).text().trim()
    var days = [data(listRow[0].find("td")[6]).text().trim()]
    var times = [data(listRow[0].find("td")[7]).text().trim()]
    var rooms = [data(listRow[0].find("td")[8]).text().trim()]
    var instructor = data(listRow[0].find("td")[9]).text().trim()
    var getdepts = getdept(course)
    var subject= getdepts[0]
    var subjectName = getdepts[1]
    var department = getdepts[2]
    var departmentName = getdepts[3]

    //console.log(crn,course,sec,type,title,hours,days,times,rooms,instructors)
    
    for(var i = 1;i<listRow.length;i++){
        //console.log(data(listRow[i].find("td")[1]).text())
        days.push(data(listRow[i].find("td")[1]).text())
        times.push(data(listRow[i].find("td")[2]).text())
        rooms.push(data(listRow[i].find("td")[3]).text())
    } 


    console.log("----------new part of the list --------------")
    courseSeats = "";
    courseFull = "";
    courseDesc = "";
    courseMess = "";
    courseTerm = "";
    courseBegin = "";
    courseEnd = "";

    let finalArr = {};
    finalArr.crn = crn;
    finalArr.course = course;
    finalArr.sec = sec;
    finalArr.type = type;
    finalArr.title = title;
    finalArr.hours = hours;
    finalArr.days = days;
    finalArr.times = times;
    finalArr.rooms = rooms;
    finalArr.instructor = instructor;
    finalArr.subject = subject;
    finalArr.subjectName = subjectName;
    finalArr.department = department;
    finalArr.departmentName = departmentName;
    finalArr.courseSeats = courseSeats;
    finalArr.courseDesc = courseDesc;
    finalArr.courseMess = courseMess;
    finalArr.courseTerm = courseTerm;
    finalArr.courseBegin = courseBegin;
    finalArr.courseEnd = courseEnd;
    classes.push(finalArr);
        //console.log(finalArr)

}

function getdept(course){
    var subject= ""
    var subjectName = ""
    var department = ""
    var departmentName = ""
    if(course.includes("LDR")){
        subject= "LDR"
        subjectName = "Leadership"
        department = "AF"
        departmentName = "Academic Affairs"
    }
    else if(course.includes("RDG")){
        subject= "RDG"
        subjectName = "Reading"
        department = "AF"
        departmentName = "Academic Affairs"
    }
    else if(course.includes("UNV")){
        subject= "UNV"
        subjectName = "University Orientation"
        department = "AF"
        departmentName = "Academic Affairs"
    }
    else if(course.includes("BIO")){
        subject= "BIO"
        subjectName = "Biology"
        department = "BIO"
        departmentName = "Biology"
    }
    else if(course.includes("ESC")){
        subject= "ESC"
        subjectName = "Earth Science"
        department = "BIO"
        departmentName = "Biology"
    }
    else if(course.includes("GEO")){
        subject= "GEO"
        subjectName = "Geography"
        department = "BIO"
        departmentName = "Biology"
    }
    else if(course.includes("ACC")){
        subject= "ACC"
        subjectName = "Accounting"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("ENT")){
        subject= "ENT"
        subjectName = "Entrepreneurship"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("FIN")){
        subject= "FIN"
        subjectName = "Finance"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("GBA")){
        subject= "GBA"
        subjectName = "General Business"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("MIM")){
        subject= "MIM"
        subjectName = "Information Management"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("MGT")){
        subject= "MGT"
        subjectName = "Management"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("MKT")){
        subject= "MKT"
        subjectName = "Manufacturing Engineering Tech"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("SCM")){
        subject= "SCM"
        subjectName = "Supply Chain Management"
        department = "BUS"
        departmentName = "Business"
    }
    else if(course.includes("CHE")){
        subject= "CHE"
        subjectName = "Chemistry"
        department = "CHE"
        departmentName = "Chemistry"
    }
    else if(course.includes("CLS")){
        subject= "CLS"
        subjectName = "Clinical Laboratory Science"
        department = "CHE"
        departmentName = "Chemistry"
    }
    else if(course.includes("MTE")){
        subject= "MTE"
        subjectName = "Medical Technology"
        department = "CHE"
        departmentName = "Chemistry"
    }
    else if(course.includes("LAW")){
        subject= "MTE"
        subjectName = "Medical Technology"
        department = "CJLG"
        departmentName = "Crim Justice & Legal Studies"
    }
    else if(course.includes("LAT")){
        subject= "LAT"
        subjectName = "Legal Assistant"
        department = "CJLG"
        departmentName = "Crim Justice & Legal Studies"
    }
    else if(course.includes("POL")){
        subject= "POL"
        subjectName = "Policing"
        department = "CJLG"
        departmentName = "Crim Justice & Legal Studies"
    }
    else if(course.includes("COM")){
        subject= "COM"
        subjectName = "Communication Studies"
        department = "COM"
        departmentName = "Communication"
    }
    else if(course.includes("ENG")){
        subject= "ENG"
        subjectName = "English"
        department = "COM"
        departmentName = "Communication"
    }
    else if(course.includes("ETC")){
        subject= "ETC"
        subjectName = "English Technical Communication"
        department = "COM"
        departmentName = "Communication"
    }
    else if(course.includes("JOU")){
        subject= "JOU"
        subjectName = "Journalism"
        department = "COM"
        departmentName = "Communication"
    }
    else if(course.includes("SPA")){
        subject= "SPA"
        subjectName = "Spanish"
        department = "COM"
        departmentName = "Communication"
    }
    else if(course.includes("CED")){
        subject= "CED"
        subjectName = "Continuing Education (WI)"
        department = "CON"
        departmentName = "Western Institute"
    }
    else if(course.includes("ACT")){
        subject= "ACT"
        subjectName = "Applications of Computer Tech"
        department = "CSMP"
        departmentName = "Comp Science, Math & Physics"
    }
    else if(course.includes("CSC")){
        subject= "CSC"
        subjectName = "Computer Science"
        department = "CSMP"
        departmentName = "Comp Science, Math & Physics"
    }
    else if(course.includes("MAT")){
        subject= "MAT"
        subjectName = "Mathematics"
        department = "CSMP"
        departmentName = "Comp Science, Math & Physics"
    }
    else if(course.includes("PHY")){
        subject= "PHY"
        subjectName = "Physics"
        department = "CSMP"
        departmentName = "Comp Science, Math & Physics"
    }
    else if(course.includes("MAS")){
        subject= "MAS"
        subjectName = "Applied Science"
        department = "EDU"
        departmentName = "Education"
    }
    else if(course.includes("EDU")){
        subject= "MAS"
        subjectName = "Education"
        department = "EDU"
        departmentName = "Education"
    }
    else if(course.includes("TSL")){
        subject= "TSL"
        subjectName = "Teaching Second Language"
        department = "EDU"
        departmentName = "Education"
    }
    else if(course.includes("CET")){
        subject= "CET"
        subjectName = "Construction Engineering Techn"
        department = "ET"
        departmentName = "Engineering Technology"
    }
    else if(course.includes("EET")){
        subject= "EET"
        subjectName = "Electronics Engineering Technology"
        department = "ET"
        departmentName = "Engineering Technology"
    }
    else if(course.includes("EGT")){
        subject= "EGT"
        subjectName = "Engineering Technology"
        department = "ET"
        departmentName = "Engineering Technology"
    }
    else if(course.includes("MET")){
        subject= "MET"
        subjectName = "Manufacturing Engineering Tech"
        department = "ET"
        departmentName = "Engineering Technology"
    }
    else if(course.includes("ART")){
        subject= "ART"
        subjectName = "Art"
        department = "FIN"
        departmentName = "Fine Arts"
    }
    else if(course.includes("CIN")){
        subject= "CIN"
        subjectName = "Cinema"
        department = "FIN"
        departmentName = "Fine Arts"
    }
    else if(course.includes("MUS")){
        subject= "MUS"
        subjectName = "Music"
        department = "FIN"
        departmentName = "Fine Arts"
    }
    else if(course.includes("THR")){
        subject= "THR"
        subjectName = "Theatre"
        department = "FIN"
        departmentName = "Fine Arts"
    }
    else if(course.includes("HON")){
        subject= "HON"
        subjectName = "Honors Program"
        department = "HON"
        departmentName = "Honors Program"
    }
    else if(course.includes("ALH")){
        subject= "ALH"
        subjectName = "Allied Health"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("HDA")){
        subject= "HDA"
        subjectName = "Health Data Analytics"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("HIF")){
        subject= "HIF"
        subjectName = "Health Information Management"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("PED")){
        subject= "PED"
        subjectName = "Physical Education"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("PTA")){
        subject= "PTA"
        subjectName = "Physical Therapist Assistant"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("RSM")){
        subject= "RSM"
        subjectName = "Recreation Sport Management"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("SWK")){
        subject= "SWK"
        subjectName = "Social Work"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("SFM")){
        subject= "SFM"
        subjectName = "Sport and Fitness Management"
        department = "HP"
        departmentName = "Health Professions"
    }
    else if(course.includes("MIL")){
        subject= "MIL"
        subjectName = "Sport and Fitness Management"
        department = "MIL"
        departmentName = "Military Science"
    }
    else if(course.includes("MIL")){
        subject= "MIL"
        subjectName = "Sport and Fitness Management"
        department = "MIL"
        departmentName = "Military Science"
    }
    else if(course.includes("NUR")){
        subject= "NUR"
        subjectName = "Nursing"
        department = "NUR"
        departmentName = "Nursing"
    }
    else if(course.includes("PSY")){
        subject= "PSY"
        subjectName = "Psychology"
        department = "PSY"
        departmentName = "Psychology"
    }
    else if(course.includes("ECO")){
        subject= "ECO"
        subjectName = "Economics"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    else if(course.includes("HIS")){
        subject= "HIS"
        subjectName = "History"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    else if(course.includes("HUM")){
        subject= "HUM"
        subjectName = "Humanities"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    else if(course.includes("PHL")){
        subject= "PHL"
        subjectName = "Philosophy"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    else if(course.includes("PSC")){
        subject= "PSC"
        subjectName = "Political Science"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    else if(course.includes("REL")){
        subject= "REL"
        subjectName = "Religion"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    else if(course.includes("SOC")){
        subject= "SOC"
        subjectName = "Sociology"
        department = "SSH"
        departmentName = "Social Sciences & Humanities"
    }
    return [subject,subjectName,department,departmentName]
    
}



console.log("*********************new item in array******************************")

function createJson(){
    fs.writeFile('classes.json',JSON.stringify(classes),err=>{
        if(err){
            console.log("Error Writing File:", err)
        }else{
            console.log("semester.json file created")
        }
    })
}
