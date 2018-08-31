
/*start by loading in the relevant JSON files, which were modified based on the original files by github user BTMorton, available here: https://github.com/BTMorton/dnd-5e-srd/tree/master/json*/


var classJSON;

/*specify location of a JSON file*/
var classRequestURL ="../data/classes.json";


/*initialize request which will be used for loading all of the JSON files*/
var classRequest = new XMLHttpRequest();

/*we'll start by getting the 5e races as a JSON*/
classRequest.open('GET', classRequestURL);

/*specify we're loading a JSON object*/
classRequest.responseType = 'json';

/*try to find the file*/
classRequest.send();


/*when the data loads, store it in the appropriate var*/
classRequest.onload = function(){
    classJSON= classRequest.response;
}



/*specify location of a JSON file*/
var raceRequestURL ="../data/races.json";

/*initialize request which will be used for loading all of the JSON files*/
var raceRequest = new XMLHttpRequest();

/*we'll start by getting the 5e races as a JSON*/
raceRequest.open('GET', raceRequestURL);

/*specify we're loading a JSON object*/
raceRequest.responseType = 'json';

/*try to find the file*/
raceRequest.send();

/*var to access the 5e race JSON in our functions later*/
var raceJSON;

/*when the data loads, store it in the appropriate var*/
raceRequest.onload = function(){
    raceJSON= raceRequest.response;
    
}


var spellJSON;

var spellRequestURL ="../data/spells.json";

var spellJSONRequest = new XMLHttpRequest();

spellJSONRequest.open('GET',spellRequestURL);

spellJSONRequest.responseType='json';

spellJSONRequest.send();

spellJSONRequest.onload = function(){
    spellJSON = spellJSONRequest.response;
}


//global var
var baseClass;

var proficiency;





/*this section of code adds event listeners to each of the buttons for spells we defined in our html. This makes those buttons display their content when clicked and hide it when clicked again*/
var coll = document.getElementsByClassName("mainCollapsible");

var j;

for (j = 0; j < coll.length; j++) {
    coll[j].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } 
        else {
            content.style.display = "block";
        }
    });
         
}


function generateChar(){
    

    var level;
    

    var finalClassPara = document.getElementById("final class");
    
    //var isMinStats = document.querySelector('input[name=stats]:checked').value;
    
    var charStats = generateStats();
    
    var race = document.getElementById('race').value;
    if(race=="rand"){
       race = randRace();
    }
    
    
    
    charStats = addRacialBonuses(charStats, race);
    
    var allStats = "";
    allStats+="Strength: " + charStats[0]+" ";
    allStats+="Dexterity: " + charStats[1]+" ";
    allStats+="Constitution: " + charStats[2]+" ";
    allStats+="Intelligence: " + charStats[3]+" ";
    allStats+="Wisdom: " + charStats[4]+" ";
    allStats+="Charisma: " + charStats[5]+" ";
    
    
    //level = document.getElementById('level').value;
    //level=level.value;
    var tempElement = document.getElementById('level');
    level = tempElement.value;
    if(level=="rand"){
        level=get1Through20();   
    }
    else{
        level=parseInt(level);
    }
    proficiency = getProficiency(level);
    
    //this happens if user never clicked on another class
    if(typeof baseClass=='undefined'||baseClass=="rand"){
        baseClass = generateClass();
    }
    

    
    finalClassPara.innerHTML=baseClass.charAt(0).toUpperCase()+baseClass.substring(1);  
    
    /*need this after assigning the base class when the base class is random, otherwise proficiences don't work*/
    addStatsToTable(charStats, baseClass, race, level);
    
    var hiddenList = document.getElementsByClassName("hidden");
    for(let val of hiddenList){
        val.style="display:inline";
    }
    
    
    //document.getElementById("ac").innerHTML=findAC(baseClass, race, charStats[0], findScoreBonus(charStats[1]), findScoreBonus(charStats[2]), findScoreBonus(charStats[4]));
    var totalACString=findAC(baseClass, race, charStats[0], findScoreBonus(charStats[1]), findScoreBonus(charStats[2]), findScoreBonus(charStats[4]));
    document.getElementById("ac").innerHTML=totalACString.charAt(0);
    if(totalACString.charAt(1)!=" "){
        document.getElementById("ac").innerHTML+=totalACString.charAt(1);
        document.getElementById("acType").innerHTML=totalACString.substring(3);
    }
    else{
        document.getElementById("acType").innerHTML=totalACString.substring(2);
    }
    
    
    document.getElementById("initiative").innerHTML=findInitiative(findScoreBonus(charStats[1]), baseClass, level, proficiency);
    document.getElementById("speed").innerHTML=findSpeed(race, baseClass, level);
    
    var health = findCharHealth(race, baseClass, level, findScoreBonus(charStats[2]));
    
    document.getElementById("health").innerHTML= health;
    
    
    document.getElementById("final level").innerHTML=level;
    
    
    
    displayRace(race);
    displayClass(baseClass, level);
    
    if(race=="highelf"){
        document.getElementById("final race").innerHTML="High Elf";   
    }
    if(race=="rockgnome"){
        document.getElementById("final race").innerHTML="Rock Gnome";   
    }
    if(race=="halfelf"){
        document.getElementById("final race").innerHTML="Half-Elf";   
    }
    if(race=="halforc"){
        document.getElementById("final race").innerHTML="Half Orc";   
    }
    if(race=="dragonborn"){
        var subrace=-1;
        var raceString="";
        if(document.getElementById("randSubrace").checked){
            subrace=get1Through10();   
        }
        
        if(document.getElementById("blackSubrace").checked || subrace==1){
            raceString+="Black";   
        }
        else if(document.getElementById("blueSubrace").checked || subrace==2){
            raceString+="Blue";   
        }
        else if(document.getElementById("brassSubrace").checked || subrace==3){
            raceString+="Brass";       
        }
        else if(document.getElementById("bronzeSubrace").checked || subrace==4){
            raceString+="Bronze";       
        }
        else if(document.getElementById("copperSubrace").checked || subrace==5){
            raceString+="Copper";   
        }
        else if(document.getElementById("goldSubrace").checked || subrace==6){
            raceString+="Gold";   
        }
        else if(document.getElementById("greenSubrace").checked || subrace==7){
            raceString+="Green";   
        }
        else if(document.getElementById("redSubrace").checked || subrace==8){
            raceString+="Red";   
        }
        else if(document.getElementById("silverSubrace").checked || subrace==9){
            raceString+="Silver";       
        }
        else if(document.getElementById("whiteSubrace").checked || subrace==10){
            raceString+="White";   
        }
        raceString+=" Dragonborn";
        document.getElementById("final race").innerHTML=raceString;   
    }
    if(race=="human"){
        document.getElementById("final race").innerHTML="Human";   
    }
    if(race=="lightfoothalfling"){
        document.getElementById("final race").innerHTML="Lightfoot Halfling";   
    }
    if(race=="tiefling"){
        document.getElementById("final race").innerHTML="Tiefling";   
    }
    if(race=="hilldwarf"){
        document.getElementById("final race").innerHTML="Hill Dwarf";   
    }
    
    updateCollapsibles(baseClass, level);
}

function getProficiency(level){
    if(level<=4){
        return 2;
    }
    else if(level<=8){
        return 3;    
    }
    else if(level<=12){
        return 4;        
    }
    else if(level<=16){
        return 5;  
    }
    return 6;
}

/*for each stat and affiliated saving throw/skill, we'll add those values to the table in the hmtl file*/
function addStatsToTable(arr, baseClass, race, level){
    addStrStats(arr, baseClass, level);
    addDexStats(arr, baseClass, level);
    addConStats(arr, baseClass, level);
    addIntStats(arr, baseClass, level);
    addWisStats(arr, baseClass, race, level);
    addChaStats(arr, baseClass, race, level);
}

/*finds the bonus from the given score. In D&D, there's an odd mechanic with stats in which the stat value isn't your bonus. Example: Someone with an 18 in strength doesn't have a +18 to their athletics check, but instead they have a +4.*/
function findScoreBonus(score){
    switch(score){
        case 1:
            return -5;
            break;
        
        case 2:
        case 3:
            return -4;
            break;
            
        case 4:
        case 5:
            return -3;
            break;
            
        case 6:
        case 7:
            return -2;
            break;
            
        case 8:
        case 9:
            return -1;
            break;
            
        case 10:
        case 11:
            return 0;
            break;
            
        case 12:
        case 13:
            return 1;
            break;
            
        case 14:
        case 15:
            return 2;
            break;
            
        case 16:
        case 17:
            return 3;
            break;
            
        case 18:
        case 19:
            return 4;
            break;
            
        case 20:
        case 21:
            return 5;
            break;
            
        case 22:
        case 23:
            return 6;
            break;
            
        case 24:
        case 25:
            return 7;
            break;
            
        case 26:
        case 27:
            return 8;
            break;
            
        case 28:
        case 29:
            return 9;
            break;
            
        case 30:
            return 10;
            break;
           }
}

function addSkillStyling(htmlElement, bonus){
    if(bonus>0){
        htmlElement.innerHTML="+"+bonus;
    }
    else{
        htmlElement.innerHTML=bonus;    
    }
}

function addStrStats(arr, baseClass, level){
    
    /*get the strength score from the array, and then find the stat bonus that score provides*/
    var score = arr[0];
    var bonus = findScoreBonus(score);
    
    /*find and change the elements we can without needing to do any math*/
    var tableScore = document.getElementById("str score");
    
    var tableBonus = document.getElementById("str bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableStrSave = document.getElementById("str save");
    var tableAthletics = document.getElementById("athletics");
    
    var strSave = bonus;
    
    
    /*if the user is one of these classes at level 1, add their proficiency bonus to the save. */
    if(baseClass=="barbarian" || baseClass=="fighter" || baseClass=="monk" || baseClass=="ranger"){
       strSave+=proficiency;
    }

    /*if the user has at least 6 levels in paladin, they can add their charisma bonus to all saves. This if block does not account for multiclassing at the moment, and neither does the Monk's level 14 ability nor the rogue's level 15 ability. */
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            strSave+=1;   
        }
        else{
            strSave+=chaBonus;
        }
    }
    
    /*add the values with a + or - in front to the table*/
    addSkillStyling(tableStrSave,strSave);
    
    //need to check if the user added athletics proficiency for a class skill, then changed classes. If we didn't have this, then a Cleric (or other classes) could get Athletics proficiency despite not clicking Athletics
    if(
        (document.getElementById("bardAthletics").checked && baseClass=="bard")||
        document.getElementById("bAthletics").checked||
        ((document.getElementById("cAthletics")!=null && document.getElementById("cAthletics").checked) && (baseClass=="barbarian"||baseClass=="paladin"||baseClass=="fighter"||baseClass=="rogue"||baseClass=="monk"||baseClass=="ranger"))){
        addSkillStyling(tableAthletics,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableAthletics,bonus);
    }
}

function addDexStats(arr, baseClass, level){
    var score = arr[1];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("dex score");
    
    var tableBonus = document.getElementById("dex bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableDexSave = document.getElementById("dex save");
    var tableAcrobatics = document.getElementById("acrobatics");
    var tableStealth = document.getElementById("stealth");
    
    var tableSleightOfHand = document.getElementById("sleight-of-hand");
    
    var dexSave = bonus;
        
    
    if(baseClass=="bard" || baseClass=="monk" || baseClass=="ranger" || baseClass=="rogue"){
       dexSave+=proficiency;
    }
    
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            dexSave+=1;   
        }
        else{
            dexSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableDexSave,dexSave);
    
    if(
        (document.getElementById("bardAcrobatics").checked && baseClass=="bard")||
        document.getElementById("bAcrobatics").checked||
        ((document.getElementById("cAcrobatics")!=null && document.getElementById("cAcrobatics").checked) && (baseClass=="monk"||baseClass=="rogue"||baseClass=="fighter"))){
        addSkillStyling(tableAcrobatics,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableAcrobatics,bonus);
    }
    
    if(
        (document.getElementById("bardStealth").checked && baseClass=="bard")||
        document.getElementById("bStealth").checked||
        ((document.getElementById("cStealth")!=null && document.getElementById("cStealth").checked) && (baseClass=="monk"||baseClass=="rogue"||baseClass=="ranger"))){
        addSkillStyling(tableStealth,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableStealth,bonus);
    }
    
    if(
        (document.getElementById("bardSleightOfHand").checked && baseClass=="bard")||
        document.getElementById("bSleightOfHand").checked||
        ((document.getElementById("cSleightOfHand")!=null && document.getElementById("cSleightOfHand").checked) && (baseClass=="rogue"))){
        addSkillStyling(tableSleightOfHand,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableSleightOfHand,bonus);
    }
}


function addConStats(arr, baseClass, level){
    var score = arr[2];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("con score");
    
    var tableBonus = document.getElementById("con bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableConSave = document.getElementById("con save");
    
    var conSave = bonus;
        
    
    if(baseClass=="barbarian" || baseClass=="fighter" || baseClass=="sorcerer" || (baseClass=="monk" && level>=14)){
       conSave+=proficiency;
    }
    
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            conSave+=1;   
        }
        else{
            conSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableConSave,conSave);  
}


function addIntStats(arr, baseClass, level){
    var score = arr[3];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("int score");
    
    var tableBonus = document.getElementById("int bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableIntSave = document.getElementById("int save");
    var tableArcana = document.getElementById("arcana");
    var tableHistory = document.getElementById("history");
    var tableNature = document.getElementById("nature");
    var tableInvestigation = document.getElementById("investigation");
    var tableReligion = document.getElementById("religion");
    
    var intSave = bonus;
        
    
    if(baseClass=="druid" || baseClass=="rogue" || baseClass=="wizard" || (baseClass=="monk" && level>=14)){
       intSave+=proficiency;
    }
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            intSave+=1;   
        }
        else{
            intSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableIntSave,intSave);
    
    
    if(
        (document.getElementById("bardArcana").checked && baseClass=="bard")||
        document.getElementById("bArcana").checked||
        ((document.getElementById("cArcana")!=null && document.getElementById("cArcana").checked) && (baseClass=="druid"||baseClass=="warlock"||baseClass=="wizard"||baseClass=="sorcerer"))){
        addSkillStyling(tableArcana,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableArcana,bonus);
    }
    
    if(
        (document.getElementById("bardHistory").checked && baseClass=="bard")||
        document.getElementById("bHistory").checked||
        ((document.getElementById("cHistory")!=null && document.getElementById("cHistory").checked) && (baseClass=="monk"||baseClass=="cleric"||baseClass=="fighter"||baseClass=="wizard"||baseClass=="warlock"))){
        addSkillStyling(tableHistory,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableHistory,bonus);
    }
    
    if(
        (document.getElementById("bardNature").checked && baseClass=="bard")||
        document.getElementById("bNature").checked||
        ((document.getElementById("cNature")!=null && document.getElementById("cNature").checked) && (baseClass=="barbarian"||baseClass=="druid"||baseClass=="ranger"||baseClass=="warlock"))){
        addSkillStyling(tableNature,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableNature,bonus);
    }
    
    if(
        (document.getElementById("bardInvestigation").checked && baseClass=="bard")||
        document.getElementById("bInvestigation").checked||
        ((document.getElementById("cInvestigation")!=null && document.getElementById("cInvestigation").checked) && (baseClass=="warlock"||baseClass=="rogue"||baseClass=="ranger"||baseClass=="wizard"))){
        addSkillStyling(tableInvestigation,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableInvestigation,bonus);
    }
    
    if(
        (document.getElementById("bardReligion").checked && baseClass=="bard")||
        document.getElementById("bReligion").checked||
        ((document.getElementById("cReligion")!=null && document.getElementById("cReligion").checked) && (baseClass=="monk"||baseClass=="sorcerer"||baseClass=="paladin"||baseClass=="wizard"||baseClass=="cleric"))){
        addSkillStyling(tableReligion,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableReligion,bonus);
    }
    
    
}

function addWisStats(arr, baseClass, race, level){
    var score = arr[4];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("wis score");
    
    var tableBonus = document.getElementById("wis bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableWisSave = document.getElementById("wis save");
    var tableAnimalHandling = document.getElementById("animal handling");
    var tableInsight = document.getElementById("insight");
    var tableMedicine = document.getElementById("medicine");
    var tablePerception = document.getElementById("perception");
    var tableSurvival = document.getElementById("survival");
    
    var wisSave = bonus;
        
    
    if(baseClass=="cleric" || baseClass=="druid" || baseClass=="paladin" || baseClass=="warlock" || baseClass=="wizard" || 
       (baseClass=="monk" && level>=14) || (baseClass=="rogue" && level>=15)){
       wisSave+=proficiency;
    }
    
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            wisSave+=1;   
        }
        else{
            wisSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableWisSave,wisSave);
    
    
    if(
        (document.getElementById("bardAnimalHandling").checked && baseClass=="bard")||
        document.getElementById("bAnimalHandling").checked||
        ((document.getElementById("cAnimalHandling")!=null && document.getElementById("cAnimalHandling").checked) && (baseClass=="fighter"||baseClass=="barbarian"||baseClass=="ranger"||baseClass=="druid"))){
        addSkillStyling(tableAnimalHandling,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableAnimalHandling,bonus);
    }
    
    if(
        (document.getElementById("bardInsight").checked && baseClass=="bard")||
        document.getElementById("bInsight").checked||
        ((document.getElementById("cInsight")!=null && document.getElementById("cInsight").checked) && (baseClass!="barbarian"||baseClass!="warlock"))){
        addSkillStyling(tableInsight,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableInsight,bonus);
    }
    
    if(
        (document.getElementById("bardMedicine").checked && baseClass=="bard")||
        document.getElementById("bMedicine").checked||
        ((document.getElementById("cMedicine")!=null && document.getElementById("cMedicine").checked) && (baseClass=="paladin"||baseClass=="cleric"||baseClass=="wizard"||baseClass=="druid"))){
        addSkillStyling(tableMedicine,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableMedicine,bonus);
    }
    
    if(
        (document.getElementById("bardPerception").checked && baseClass=="bard")||
        document.getElementById("bPerception").checked||
        ((document.getElementById("cPerception")!=null && document.getElementById("cPerception").checked) && (baseClass=="barbarian"||baseClass=="rogue"||baseClass=="ranger"||baseClass=="fighter"||baseClass=="druid"))){
        addSkillStyling(tablePerception,bonus+proficiency);   
    }
    else if(race=="highelf"){
        addSkillStyling(tablePerception,bonus+proficiency);   
    }
    else{
        addSkillStyling(tablePerception,bonus);
    }
    
    if(
        (document.getElementById("bardSurvival").checked && baseClass=="bard")||
        document.getElementById("bSurvival").checked||
        ((document.getElementById("cSurvival")!=null && document.getElementById("cSurvival").checked) && (baseClass=="barbarian"||baseClass=="fighter"||baseClass=="ranger"||baseClass=="druid"))){
        addSkillStyling(tableSurvival,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableSurvival,bonus);
    }
    
    
}

function addChaStats(arr, baseClass, race, level){
    var score = arr[5];
    var bonus = findScoreBonus(score);
    
    var tableScore = document.getElementById("cha score");
    
    var tableBonus = document.getElementById("cha bonus");
    
    tableScore.innerHTML=score;
    
    if(bonus<=0){
        tableBonus.innerHTML="("+bonus+")";
    }
    else if(bonus>0){
       tableBonus.innerHTML="(+"+bonus+")";
    }
    
    
    var tableChaSave = document.getElementById("cha save");
    var tablePerformance = document.getElementById("performance");
    var tablePersuasion = document.getElementById("persuasion");
    var tableDeception = document.getElementById("deception");
    var tableIntimidation = document.getElementById("intimidation");
    
    var chaSave = bonus;
        
    
    if(baseClass=="cleric" || baseClass=="paladin" || baseClass=="warlock" || baseClass=="sorcerer" || baseClass=="bard" || (baseClass=="monk" && level>=14)){
       chaSave+=proficiency;
    }
    if(baseClass=="paladin" && level>=6){
        var chaBonus = findScoreBonus(arr[5]);
        if(chaBonus<=0){
            chaSave+=1;   
        }
        else{
            chaSave+=chaBonus;
        }
    }
    
    
    addSkillStyling(tableChaSave,chaSave);
    
    
    if(
        (document.getElementById("bardPerformance").checked && baseClass=="bard")||
        document.getElementById("bPerformance").checked||
        ((document.getElementById("cPerformance")!=null && document.getElementById("cPerformance").checked) && (baseClass=="rogue"))){
        addSkillStyling(tablePerformance,bonus+proficiency);   
    }
    else{
        addSkillStyling(tablePerformance,bonus);
    }
    
    if(
        (document.getElementById("bardPersuasion").checked && baseClass=="bard")||
        document.getElementById("bPersuasion").checked||
        ((document.getElementById("cPersuasion")!=null && document.getElementById("cPersuasion").checked) && (baseClass=="cleric"||baseClass=="rogue"||baseClass=="paladin"||baseClass=="sorcerer"))){
        addSkillStyling(tablePersuasion,bonus+proficiency);   
    }
    else{
        addSkillStyling(tablePersuasion,bonus);
    }
    
    if(
        (document.getElementById("bardIntimidation").checked && baseClass=="bard")||
        document.getElementById("bIntimidation").checked||
        ((document.getElementById("cIntimidation")!=null && document.getElementById("cIntimidation").checked) && (baseClass=="barbarian"||baseClass=="paladin"||baseClass=="fighter"||baseClass=="sorcerer"||baseClass=="rogue"||baseClass=="warlock"))){
        addSkillStyling(tableIntimidation,bonus+proficiency);   
    }
    else if(race=="halforc"){
        addSkillStyling(tableIntimidation,bonus+proficiency); 
    }
    else{
        addSkillStyling(tableIntimidation,bonus);
    }
    
    if(
        (document.getElementById("bardDeception").checked && baseClass=="bard")||
        document.getElementById("bDeception").checked||
        ((document.getElementById("cDeception")!=null && document.getElementById("cDeception").checked) && (baseClass=="sorcerer"||baseClass=="rogue"||baseClass=="warlock"))){
        addSkillStyling(tableDeception,bonus+proficiency);   
    }
    else{
        addSkillStyling(tableDeception,bonus);
    }
}

function generateStats(){
    var arr = [10,10,10,10,10,10];
    return arr;
}




/*generate a number 1-20*/
function get1Through20(){
    return Math.floor(Math.random()*20+1);
}

function get1Through10(){
    return Math.floor(Math.random()*10+1);
}



function generateClass(){
    
    /*pick a class at random from the available 12*/
    var randClass = Math.floor(Math.random()*12);
    
    switch(randClass){
        case 0:
            return "barbarian";
        break;
        
        case 1:
            return "bard";
        break;
        
        case 2:
            return "cleric";
        break;
        
        case 3:
            return "druid";
        break;
        
        case 4:
            return "fighter";
        break;
        
        case 5:
            return "monk";
        break;
        
        case 6:
            return "paladin";
        break;
        
        case 7:
            return "ranger";
        break;
        
        case 8:
            return "rogue";
        break;
        
        case 9:
            return "sorcerer";
        break;
        
        case 10:
            return "warlock";
        break;
        
        case 11:
            return "wizard";
        break;
    }
}



/*based on the race the user selects, they can choose from other subraces in the SRD, or they can choose what stat some ability score bonuses go towards*/
function showOrHideRaceAttributes() {
    var selected = document.getElementById("race");
    if(selected.value=="halfelf"){
        var hide=false;
        if(document.getElementById("hiddenHalfElf").style.display=="inline"){
            hide=true;   
        }
        showOrHideHalfElfStats(hide);
        //need to add ability to select 2 additional skills
    }
    
    else{
        //need to remove ability to select 2 additional skills
    }
    
    if(selected.value=="dragonborn"){
       var hide=false;
        if(document.getElementById("hiddenDragonborn").style.display=="inline"){
            hide=true;   
        }
        showOrHideDragonbornSubraces(hide);
    }
    
    
    if(selected.value=="highelf"){
        document.getElementById("bPerception").checked=false;
        document.getElementById("bPerception").disabled=true;
        document.getElementById("bardPerception").checked=false;
        document.getElementById("bardPerception").disabled=true;
        if(document.getElementById("cPerception")!=null){
            document.getElementById("cPerception").checked=false;
            document.getElementById("cPerception").disabled=true; 
        }
    }
    else{
        document.getElementById("bPerception").disabled=false;
        document.getElementById("bardPerception").disabled=false;
        if(document.getElementById("cPerception")!=null){
            document.getElementById("cPerception").disabled=false; 
        }
    }
    
    if(selected.value=="halforc"){
        document.getElementById("bIntimidation").checked=false;
        document.getElementById("bIntimidation").disabled=true;
        document.getElementById("bardIntimidation").checked=false;
        document.getElementById("bardIntimidation").disabled=true;
        if(document.getElementById("cIntimidation")!=null){
            document.getElementById("cIntimidation").checked=false;
            document.getElementById("cIntimidation").disabled=true; 
        }
    }
    else{
        document.getElementById("bIntimidation").disabled=false;
        document.getElementById("bardIntimidation").disabled=false;
        if(document.getElementById("cIntimidation")!=null){
            document.getElementById("cIntimidation").disabled=false; 
        }
    }
    
}

/*show or hide the checkboxes to select or randomize the Half Elf's stat bonuses*/
function showOrHideHalfElfStats(hide){
    if(hide){
        document.getElementById("hiddenHalfElf").style="display:hidden";
    }
    else{
        document.getElementById("hiddenHalfElf").style="display:inline";
    }
    
}

/*ensure that only 2 elements are clicked at a time, since a Half-Elf can only distribute 2 separate +1 stat bonuses*/
function halfElfCheckedCount(){
    var checkCount=0;
    if(document.getElementById("rand1+1").checked){
        checkCount++;   
    }
    if(document.getElementById("rand2+1").checked){
        checkCount++;   
    }
    if(document.getElementById("str+1").checked){
        checkCount++;   
    }
    if(document.getElementById("dex+1").checked){
        checkCount++;   
    }
    if(document.getElementById("con+1").checked){
        checkCount++;   
    }
    if(document.getElementById("int+1").checked){
        checkCount++;   
    }
    if(document.getElementById("wis+1").checked){
        checkCount++;   
    }
    
    if(checkCount>2){
        return false;   
    }
}

/*show or hide the radio buttons to select or randomize the dragonborn subrace*/
function showOrHideDragonbornSubraces(hide){
    if(hide){
        document.getElementById("hiddenDragonborn").style="display:hidden";
    }
    else{
        document.getElementById("hiddenDragonborn").style="display:inline";
    }
}

/*makes sure only 2 are selected at once*/
function backgroundSkillsCheckedCount(){
    
    /*may be more efficient to use a loop and assign all of these a class, but this works too*/
    var checkCount=0;
    
    if(document.getElementById("bAthletics").checked){
        checkCount++;   
    }
    if(document.getElementById("bAcrobatics").checked){
        checkCount++;   
    }
    if(document.getElementById("bSleightOfHand").checked){
        checkCount++;   
    }
    if(document.getElementById("bStealth").checked){
        checkCount++;   
    }
    if(document.getElementById("bArcana").checked){
        checkCount++;   
    }
    if(document.getElementById("bHistory").checked){
        checkCount++;   
    }
    if(document.getElementById("bInvestigation").checked){
        checkCount++;   
    }
    if(document.getElementById("bNature").checked){
        checkCount++;   
    }
    if(document.getElementById("bReligion").checked){
        checkCount++;   
    }
    if(document.getElementById("bAnimalHandling").checked){
        checkCount++;   
    }
    if(document.getElementById("bInsight").checked){
        checkCount++;   
    }
    if(document.getElementById("bMedicine").checked){
        checkCount++;   
    }
    if(document.getElementById("bPerception").checked){
        checkCount++;   
    }
    if(document.getElementById("bSurvival").checked){
        checkCount++;   
    }
    if(document.getElementById("bDeception").checked){
        checkCount++;   
    }
    if(document.getElementById("bIntimidation").checked){
        checkCount++;   
    }
    if(document.getElementById("bPerformance").checked){
        checkCount++;   
    }
    if(document.getElementById("bPersuasion").checked){
        checkCount++;   
    }
    
    if(checkCount>2){
        return false;   
    }
}

/*bards can functionally have any 5.*/
function bardSkillsCheckedCount(){
    
    /*may be more efficient to use a loop and assign all of these a class, but this works too*/
    var checkCount=0;
    var bArr = document.getElementsByName("bardSkills");
    
    for(var i=0;i<bArr.length;i++){
        if(bArr[i].checked){
            checkCount++;
        }
    }
    
    if(checkCount>5){
        return false;   
    }
}

/*this function will be assigned to the onclick for the hiddenClassSkills div except bard, which gets its own.*/
function classSkillsCheckedCount(className){
    var maxCount;
    if(className=="rogue"){
        maxCount=4;
    }
    else if(className=="ranger"){
        maxCount=3;
    }
    else{
        maxCount=2;
    }
    
}

/*this function will hide certain background skills that are included in the class' skill div, and make all others visible. We also uncheck all skills made invisible - may change to later return set all checked values to check them pre-emptively in class skill list*/
function updateBackgroundSkills(className){
    var bgSkills = document.getElementsByClassName("bSkills");
    for(let s of bgSkills){
        s.style="display:inline";
    }
    
    var bLabels = document.getElementsByClassName("bL");
    for(let l of bLabels){
        l.style="display:inline";
    }
    
    
    /*
    [0] - Athletics
    [1] - Acrobatics
    [2] - Sleight of Hand
    [3] - Stealth
    [4] - Arcana
    [5] - History
    [6] - Investigation
    [7] - Nature
    [8] - Religion
    [9] - Animal Handling
    [10] - Insight
    [11] - Medicine
    [12] - Perception
    [13] - Survival
    [14] - Deception
    [15] - Intimidation
    [16] - Performance
    [17] - Persuasion
    */
    
    //special case for bard
    if(className=="bard"){
        for(let s of bgSkills){
            s.style="display:none";
        }
        for(let l of bLabels){
            l.style="display:none";
        }
    }
    
    
    
    //athletics
    if(className=="rogue"||className=="ranger"||className=="monk"||className=="fighter"||className=="barbarian"||className=="paladin"){
        bgSkills[0].style="display:none";
        bgSkills[0].checked=false;
        bLabels[0].style="display:none";
    }
    
    //acrobatics
    if(className=="rogue"||className=="fighter"||className=="monk"){
        bgSkills[1].style="display:none";
        bgSkills[1].checked=false;
        bLabels[1].style="display:none";
    }
    
    //sleight of hand
    if(className=="rogue"){
        bgSkills[2].style="display:none";
        bgSkills[2].checked=false;
        bLabels[2].style="display:none";
    }
    
    //stealth
    if(className=="monk"||className=="ranger"||className=="rogue"){
        bgSkills[3].style="display:none";
        bgSkills[3].checked=false;
        bLabels[3].style="display:none";
    }
    
    //arcana
    if(className=="druid"||className=="warlock"||className=="wizard"||className==""){
        bgSkills[4].style="display:none";
        bgSkills[4].checked=false;
        bLabels[4].style="display:none";
    }
    
    //history
    if(className=="monk"||className=="cleric"||className=="fighter"||className=="wizard"||className=="warlock"){
        bgSkills[5].style="display:none";
        bgSkills[5].checked=false;
        bLabels[5].style="display:none";
    }
    
    //investigation
    if(className=="ranger"||className=="rogue"||className=="warlock"||className=="wizard"){
        bgSkills[6].style="display:none";
        bgSkills[6].checked=false;
        bLabels[6].style="display:none";
    }
    
    //nature
    if(className=="barbarian"||className=="druid"||className=="ranger"||className=="warlock"){
        bgSkills[7].style="display:none";
        bgSkills[7].checked=false;
        bLabels[7].style="display:none";
    }
    
    //religion
    if(className=="sorcerer"||className=="monk"||className=="paladin"||className=="cleric"||className=="wizard"||
       className=="druid"||className=="warlock"){
        bgSkills[8].style="display:none";
        bgSkills[8].checked=false;
        bLabels[8].style="display:none";
    }
    
    //animal handling
    if(className=="fighter"||className=="barbarian"||className=="ranger"||className=="druid"){
        bgSkills[9].style="display:none";
        bgSkills[9].checked=false;
        bLabels[9].style="display:none";
    }
    
    //insight - 10/12 classes get this proficiency
    if(className!="barbarian"&&className!="warlock"){
        bgSkills[10].style="display:none";
        bgSkills[10].checked=false;
        bLabels[10].style="display:none";
    }
    
    //medicine
    if(className=="paladin"||className=="cleric"||className=="wizard"||className=="druid"){
        bgSkills[11].style="display:none";
        bgSkills[11].checked=false;
        bLabels[11].style="display:none";
    }
    
    //perception
    if(className=="barbarian"||className=="rogue"||className=="fighter"||className=="ranger"||className=="druid"){
        bgSkills[12].style="display:none";
        bgSkills[12].checked=false;
        bLabels[12].style="display:none";
    }
    
    //survival
    if(className=="barbarian"||className=="fighter"||className=="ranger"||className=="druid"){
        bgSkills[13].style="display:none";
        bgSkills[13].checked=false;
        bLabels[13].style="display:none";
    }
    
    //deception
    if(className=="sorcerer"||className=="rogue"||className=="warlock"){
        bgSkills[14].style="display:none";
        bgSkills[14].checked=false;
        bLabels[14].style="display:none";
    }
    
    //intimidation
    if(className=="barbarian"||className=="paladin"||className=="fighter"||className=="sorcerer"||className=="rogue"||className=="warlock"){
        bgSkills[15].style="display:none";
        bgSkills[15].checked=false;
        bLabels[15].style="display:none";
    }
    
    //performance
    if(className=="rogue"){
        bgSkills[16].style="display:none";
        bgSkills[16].checked=false;
        bLabels[16].style="display:none";
    }
    
    //persuasion
    if(className=="cleric"||className=="paladin"||className=="sorcerer"||className=="rogue"){
        bgSkills[17].style="display:none";
        bgSkills[17].checked=false;
        bLabels[17].style="display:none";
    }
    
}
/*adds inputs and labels to the class skills div based on the given player class*/
function addClassSkills(className){
    var skillString="";
    
    //actual radio button inputs below
    
    if(className!="bard"){
        
        //start with header for appropriate class
        skillString+="<h4>Choose from below:</h4>";
        
    }
    
    //now, onto actual skills, starting with athletics
    if(className=="rogue"||className=="ranger"||className=="monk"||className=="fighter"||className=="barbarian"||className=="paladin"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cAthletics\" value=\"cAthletics\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cAthletics\">Athletics</label><br>";
    }
    
    
    //acrobatics
    if(className=="rogue"||className=="fighter"||className=="monk"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cAcrobatics\" value=\"cAcrobatics\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cAcrobatics\">Acrobatics</label><br>";
    }
    
    //sleight of hand
    if(className=="rogue"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cSleightOfHand\" value=\"cSleightOfHand\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cSleightOfHand\">Sleight of Hand</label><br>";
    }
    
    //stealth
    if(className=="monk"||className=="ranger"||className=="rogue"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cStealth\" value=\"cStealth\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cStealth\">Stealth</label><br>";
    }
    
    //arcana
    if(className=="druid"||className=="warlock"||className=="wizard"||className=="sorcerer"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cArcana\" value=\"cArcana\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cArcana\">Arcana</label><br>";
    }
    
    //history
    if(className=="monk"||className=="cleric"||className=="fighter"||className=="wizard"||className=="warlock"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cHistory\" value=\"cHistory\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cHistory\">History</label><br>";
    }
    
    //investigation
    if(className=="ranger"||className=="rogue"||className=="warlock"||className=="wizard"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cInvestigation\" value=\"cInvestigation\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cInvestigation\">Investigation</label><br>";;
    }
    
    //nature
    if(className=="barbarian"||className=="druid"||className=="ranger"||className=="warlock"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cNature\" value=\"cNature\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cNature\">Nature</label><br>";
    }
    
    //religion
    if(className=="sorcerer"||className=="monk"||className=="paladin"||className=="cleric"||className=="wizard"||
       className=="druid"||className=="warlock"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cReligion\" value=\"cReligion\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cReligion\">Religion</label><br>";
    }
    
    //animal handling
    if(className=="fighter"||className=="barbarian"||className=="ranger"||className=="druid"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cAnimalHandling\" value=\"cAnimalHandling\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cStealth\">Animal Handling</label><br>";
    }
    
    //insight - 10/12 classes get this proficiency. Also need to hide when Bard
    if(className!="barbarian"&&className!="warlock" && className!="bard"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cInsight\" value=\"cInsight\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cInsight\">Insight</label><br>";
    }
    
    //medicine
    if(className=="paladin"||className=="cleric"||className=="wizard"||className=="druid"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cMedicine\" value=\"cMedicine\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cMedicine\">Medicine</label><br>";
    }
    
    //perception
    if(className=="barbarian"||className=="rogue"||className=="fighter"||className=="ranger"||className=="druid"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cPerception\" value=\"cPerception\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cPerception\">Perception</label><br>";
    }
    
    //survival
    if(className=="barbarian"||className=="fighter"||className=="ranger"||className=="druid"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cSurvival\" value=\"cSurvival\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cSurvival\">Survival</label><br>";
    }
    
    //deception
    if(className=="sorcerer"||className=="rogue"||className=="warlock"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cDeception\" value=\"cDeception\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cDeception\">Deception</label><br>";
    }
    
    //intimidation
    if(className=="barbarian"||className=="paladin"||className=="fighter"||className=="sorcerer"||className=="rogue"||className=="warlock"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cIntimidation\" value=\"cIntimidation\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cIntimidation\">Intimidation</label><br>";
    }
    
    //performance
    if(className=="rogue"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cPerformance\" value=\"cPerformance\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cPerformance\">Performance</label><br>";
    }
    
    //persuasion
    if(className=="cleric"||className=="paladin"||className=="sorcerer"||className=="rogue"){
        skillString+="<input type=\"checkbox\" class=\"cSkills\" name=\"cSkills\" id=\"cPersuasion\" value=\"cPersuasion\" onclick=\"return clasSkillsCheckedCount();\">";
        skillString+="<label for=\"cPersuasion\">Persuasion</label><br>";
    }
    
    
    
    document.getElementById("hiddenClassSkills").innerHTML=skillString;
    
    if(className=="bard"){
        document.getElementById("hiddenBardSkills").style.display="inline";
        document.getElementById("bgSkills").style.display="none";
    }
    else{
        document.getElementById("hiddenBardSkills").style.display="none";
        document.getElementById("bgSkills").style.display="inline";
    }
}

/*ensure that user can only select the valid # of skills based on their class, which is 3 for ranger, 4 for rogue, and 2 for everyone else excluding the bard*/
function clasSkillsCheckedCount(){
    var skillsArr = document.getElementsByClassName("cSkills");
    var counter=0;
    for(let s of skillsArr){
        if(s.checked){
            counter++;
        }
    }
    if(baseClass=="rogue"&&counter>4){
        return false;
    }
    if(baseClass=="ranger"&&counter>3){
        return false;
    }
    if(baseClass!="ranger"&&baseClass!="rogue"&&counter>2){
        return false;
    }
}

/*updates the class skill list and a global var*/
function updateClass(){
    
    /*the base class the user wants to play as*/
    baseClass = document.getElementById('baseclass').value;
    
    var isRand=false;
    
    if(baseClass=="rand"){
        baseClass = generateClass();
        isRand=true;
    }
    
    //if user selected random, we'll make it so they can't pick the class skills, as that would give away what class it is before generation
    if(!isRand){
        addClassSkills(baseClass);
        //updateBackgroundSkills(baseClass);
        document.getElementById("hiddenClassSkills").style="display:inline";
    }
    else{
        document.getElementById("hiddenClassSkills").style="display:none";
    }
}

/*uses helper functions to get the total amount of health for the character*/
function findCharHealth(race, baseClass, level, conMod){
    
    level = parseInt(level, 10);
    
    
    if(baseClass=="wizard" || baseClass=="sorcerer"){
        return getd6Health(level, conMod, baseClass, race);   
    }
    else if(baseClass=="barbarian"){
        return getd12Health(level, conMod, race);   
    }
    else if(baseClass=="paladin" || baseClass=="fighter" || baseClass=="ranger"){
        return getd10Health(level, conMod, race);        
    }
    else{
        return getd8Health(level, conMod, race);
    }
}

/*calculates the total health of a character with d12 hit die. The 1st level is always considered the max roll, i.e. 12 for a d12, + con mod. Other levels will consist of the average value of a d12 (7) + con mod*/
function getd12Health(level, conMod, race){
    
    if(race!="hilldwarf"){
        return (12+conMod)+((level-1)*(7+conMod));
    }
    else{
        return (12+conMod+1)+((level-1)*(7+conMod+1));
    }
    
}

/*calculates the total health of a character with d10 hit die. The 1st level is always considered the max roll, i.e. 10 for a d10, + con mod. Other levels will consist of the average value of a d10 (6) + con mod*/
function getd10Health(level, conMod, race){
    if(race!="hilldwarf"){
        return (10+conMod)+((level-1)*(6+conMod));
    }
    else{
        return (10+conMod+1)+((level-1)*(6+conMod+1));
    }
}

/*calculates the total health of a character with d8 hit die. The 1st level is always considered the max roll, i.e. 8 for a d8, + con mod. Other levels will consist of the average value of a d8 (5) + con mod*/
function getd8Health(level, conMod, race){
    if(race!="hilldwarf"){
        return (8+conMod)+((level-1)*(5+conMod));
    }
    else{
        return (8+conMod+1)+((level-1)*(5+conMod+1));
    }
}

/*calculates the total health of a character with d6 hit die. The 1st level is always considered the max roll, i.e. 6 for a d6, + con mod. Other levels will consist of the average value of a d6 (4) + con mod. If the class is a sorcerer, then we have to adjust the health, since the only 
srd sorcerer subclass gets a bonus to their health each level*/
function getd6Health(level, conMod, charClass, race){
    if(charClass=="wizard"){
        if(race!="hilldwarf"){
            return (6+conMod)+((level-1)*(4+conMod));
        }
        else{
            return (6+conMod+1)+((level-1)*(4+conMod+1));
        }
    }
    /*only other d6 hit die class is sorc*/
    else{
        if(race!="hilldwarf"){
            return (6+conMod+1)+((level-1)*(4+conMod+1));
        }
        else{
            return (6+conMod+2)+((level-1)*(4+conMod+2));
        }
    }
}

/*calculates initiative for the given character. For most cases in the SRD, the result is just a bonus equal to your dex bonus, i.e. 18 would be +4, and 9 would be -1. Bards have a bonus starting at level 2 due to Jack of all Trades, which adds half proficiency rounded down. Fighters (or at least, the only SRD fighter subclass, the Champion) can add half proficiency, rounding up starting at level 7.*/
function findInitiative(dexMod, charClass, level, proficiency){
    if(charClass != "bard" && charClass != "fighter"){
        if(dexMod<=0){
            return dexMod;
        }
        else{
            return "+" + dexMod;
        }
    }
    
    else{
        if(charClass=="bard" && level>=2){
            var initiative = dexMod + Math.floor(proficiency/2);
            if(initiative<=0){
               return initiative;
            }
            else{
               return "+" + initiative;
            }
        }
        else if(charClass == "bard"){
            if(dexMod<=0){
                return dexMod;
            }
            else{
                return "+" + dexMod;
            }    
        }
        
        /*must be a fighter*/
        else{
            if(level >=7){
                var initiative = dexMod + Math.ceil(proficiency/2);
                if(initiative<=0){
                    return initiative;
                }
                else{
                    return "+" + initiative;
                }
            }
            
            else{
                if(dexMod<=0){
                    return dexMod;
                }
                else{
                    return "+" + dexMod;
                }
            }
            
        }
    }
}



/*calculates the speed stat of the character. Barbrians get +10 at level 5, and monks get certain bonuses as they level.*/
function findSpeed(race, charClass, level){
    var speed;
    if(race=="hilldwarf"){
        speed=25;
    }
    
    else{
        /*all other SRD races have this speed value*/
        speed=30;
    }
    
    if(charClass=="barbarian" && level > 5){
       return speed+10;
    }
    else if(charClass=="monk" && level > 1){
       if(level<=5){
          return speed+10;
        }
        else if(level<=9){
           return speed+15;
        }
        else if(level<=13){
            return speed+20;
        }
        else if(level<=17){
            return speed+25;    
        }
        else{
            return speed+30;
        }
    }
    else{
        return speed;
    }
}

/*finds the best armor class score for each class/race combo. For simplicity's sake, it's assumed that the best armor of light and medium are the available options. For clerics, fighters, and paladins, heavy is the best if they can wear it with no speed penalty, i.e. they meet the strength requirements or are dwarves. */
function findAC(charClass, race, str, dexMod, conMod, wisMod){
    
    /*draconic resilience > nothing*/
    if(charClass=="sorcerer"){
        return (13+dexMod)+" Draconic Resilience";   
    }
    
    /*must not wear armor to gain most class features*/
    if(charClass=="monk"){
       return (10+dexMod+wisMod) + " Unarmored Defense";
    }
    
    /*no armor prof*/
    if(charClass=="wizard"){
       return (10+dexMod) + " None";
    }
    
    /*light armor only*/
    if(charClass=="bard" || charClass=="warlock" || charClass=="rogue"){
       return (12+dexMod) + " Studded Leather";
    }
    
    /*medium and light proficiency*/
    if(charClass=="ranger" || charClass=="druid"){
        
        /*at max dex, they're the same, so we'll go with the light armor to avoid the stealth disadvantage*/
        if(dexMod==5){
            return 17 + " Studded Leather";
        }
        
        /*medium is better in other cases*/
        else{
            var ac;
            if(dexMod>=2){
                /*medium only allows a +2 dex bonus at most*/
                ac = 17;
            }
            else{
                ac = 15+dexMod;
            }
            return ac + " Half Plate";
        }
    }
    
    /*barbarians can use either unarmored defense, light armor, or medium armor*/
    if(charClass=="barbarian"){
        var unarmored = 10+conMod+dexMod;
        var light = 12+dexMod;
        var med;
        if(dexMod>=2){
            med=17;       
        }
        else{
            med=15+dexMod;   
        }
        
        /*we'll default to unarmored defense since it's the cheapest*/
        if(unarmored>=light && unarmored>=med){
           return unarmored+" Unarmored Defense";
        }
        
        /*we'll then prioritize light over medium to avoid the stealth disadvantage*/
        else if(light>=med){
           return light + " Studded Leather";
        }
        
        else{
            return med + " Half Plate";
        }
    }
    
    /*all other classes that can wear platemail*/
    else{
        
        /*we go through all 4 types of heavy armor to see if they're better/same as other armor types.*/
        if(str>=15 || race=="hilldwarf"){
            return 18 + " Plate";
        }
        
        if((str>=17 || race=="hilldwarf") && dexMod<2){
            return 17 + " Splint";   
        }
        
        if((str>=17 || race=="hilldwarf") && dexMod<1){
           return 16 + " Chain Mail";
        }
        
        
        if((str>=17 || race=="hilldwarf") && dexMod<0){
           return 16 + " Ring Mail";
        }
        
        var light = 12+dexMod;
        var med;
        if(dexMod>=2){
            med=17;       
        }
        else{
            med=15+dexMod;   
        }
        
        if(light>=med){
           return light + " Studded leather";
        }
        else{
            return med + " Half plate";
        }
        
    }
    
}

/*randomly generates a race for the user*/
function randRace(){
    var rand = Math.floor(Math.random()*9);
    switch(rand){
        case 0:
            return "dragonborn";
            break;
        case 1:
            return "halfelf";
            break;
        case 2:
            return "halforc";
            break;
        case 3:
            return "highelf";
            break;
        case 4:
            return "hilldwarf";
            break;
        case 5:
            return "human";
            break;
        case 6:
            return "lightfoothalfling";
            break;
        case 7:
            return "rockgnome";
            break;
        case 8:
            return "tiefling";
            break;
    }
}

/*adds the racial bonuses to the stats generated, provided the bonuses do not make a stat exceed 20.*/
function addRacialBonuses(charStats, race){
    /*
    charStats:
    [0] - strength
    [1] - dexterity
    [2] - constitution
    [3] - intelligence
    [4] - wisdom
    [5] - charisma
    */
    if(race=="dragonborn"){
        charStats[0]+=2;
        charStats[5]+=1;
    }
    else if(race=="halfelf"){
        charStats[5]+=2;
        var strChanged=false, dexChanged=false, conChanged=false, intChanged=false, wisChanged=false;
        
        if(document.getElementById("str+1").checked){
            charStats[0]+=1;   
            strChanged=true;
        }
        if(document.getElementById("dex+1").checked){
            charStats[1]+=1; 
            dexChanged=true;
        }
        if(document.getElementById("con+1").checked){
            charStats[2]+=1; 
            conChanged=true;
        }
        if(document.getElementById("int+1").checked){
            charStats[3]+=1; 
            intChanged=true;
        }
        if(document.getElementById("wis+1").checked){
            charStats[4]+=1; 
            wisChanged=true;
        }
        
        /*for rand stats, we don't want to accidentally give any stat a +2, i.e. we don't want to increase a stat the player already chose to increase.
        */
        if(document.getElementById("rand1+1").checked){
            var randPos = -1;
            while(true){
                
                //returns 0-4
                randPos=Math.floor(Math.random()*5);
                if(randPos==0 && !strChanged){
                    charStats[0]+=1;   
                    strChanged=true;
                    break;
                }
                if(randPos==1 && !dexChanged){
                    charStats[1]+=1;   
                    dexChanged=true;
                    break;
                }
                if(randPos==2 && !conChanged){
                    charStats[2]+=1;   
                    conChanged=true;
                    break;
                }
                if(randPos==3 && !intChanged){
                    charStats[3]+=1;   
                    intChanged=true;
                    break;
                }
                if(randPos==4 && !wisChanged){
                    charStats[0]+=1;   
                    wisChanged=true;
                    break;
                }
            }
        }
        
        /*repeat for the other random stat, if necessary*/
        if(document.getElementById("rand2+1").checked){
            var randPos = -1;
            while(true){
                
                //returns 0-4
                randPos=Math.floor(Math.random()*5);
                if(randPos==0 && !strChanged){
                    charStats[0]+=1;   
                    strChanged=true;
                    break;
                }
                if(randPos==1 && !dexChanged){
                    charStats[1]+=1;   
                    dexChanged=true;
                    break;
                }
                if(randPos==2 && !conChanged){
                    charStats[2]+=1;   
                    conChanged=true;
                    break;
                }
                if(randPos==3 && !intChanged){
                    charStats[3]+=1;   
                    intChanged=true;
                    break;
                }
                if(randPos==4 && !wisChanged){
                    charStats[0]+=1;   
                    wisChanged=true;
                    break;
                }
            }
        }
        
    }
    else if(race=="halforc"){
        charStats[0]+=2;
        charStats[2]+=1;
    }
    else if(race=="highelf"){
        charStats[1]+=2;
        charStats[3]+=1;
    }
    else if(race=="hilldwarf"){
        charStats[2]+=2;
        charStats[4]+=1;
    }
    else if(race=="human"){
        for(var i=0;i<charStats.length;i++){
            charStats[i]+=1;
        }
    }
    else if(race=="lightfoothalfling"){
        charStats[2]+=1;
        charStats[5]+=1;
    }
    else if(race=="rockgnome"){
        charStats[3]+=2;
        charStats[2]+=1;
    }
    else if(race=="tiefling"){
        charStats[3]+=1;
        charStats[5]+=2;
    }
    
    
    return charStats;
}

/*update an element of our HTLM depending on what race the user selected*/
function displayRace(race){
    var raceElement = document.getElementsByClassName("racialBonuses")[0];
    var raceText="";
    
    raceElement.innerHTML="";
    
    if(race=="hilldwarf"){
        
        raceText+="<br><button class=\"collapsible\">Dwarf Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Darkvision</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][6]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Dwarven Resilience</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][7]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Dwarven Combat Training</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][8]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Tool Proficiency</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][9]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Stone Cunning</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][10]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['content'][11]+"</div><br>";
        
        raceText+="<br><button class=\"collapsible\">Hill Dwarf</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['Hill Dwarf']['content'][0]+"<br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['Hill Dwarf']['content'][1]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Dwarven Toughness</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dwarf']['Dwarf Traits']['Hill Dwarf']['content'][2]+"</div><br></div><br></div><br>";
        
        
    }
    else if(race=="highelf"){
        
        raceText+="<br><button class=\"collapsible\">Elf Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Darkvision</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][6]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Keen Senses</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][7]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Fey Ancestry</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][8]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Trance</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][9]+"<br>"+
            raceJSON['Races']['Elf']['Elf Traits']['content'][10]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['content'][11]+"</div><br>";
        
        raceText+="<br><button class=\"collapsible\">High Elf</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'][0]+"<br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'][1]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Elf Weapon Training</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'][2]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Cantrip</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'][3]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Extra Language</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'][4]+"</div><br></div><br></div><br>";
        
        
    }
    else if(race=="lightfoothalfling"){
        raceText+="<br><button class=\"collapsible\">Halfling Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Lucky</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][6]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Brave</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][7]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Halfling Nimbleness</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][8]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['content'][9]+"</div><br>";
        
        raceText+="<br><button class=\"collapsible\">Lightfoot Halfling</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'][0]+ " "
            +raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'][1]+"<br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'][2]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Naturally Stealthy</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'][3]+"</div><br></div><br></div><br>";
        
    }
    else if(race=="human"){
        raceText+="<br><button class=\"collapsible\">Human Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Human']['Human Traits']['content'][6]+"</div><br></div><br></div><br>";
    }
    else if(race=="dragonborn"){
        
        raceText+="<br><button class=\"collapsible\">Dragonborn Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Draconic Ancestry Table</button><div class=\"content\">";
        
        raceText+="<br><table>"+
        "<tr><th>Dragon</th><th>Damage Type</th><th>Breath Weapon</th></tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][0] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][0] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][0] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][1] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][1] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][1] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][2] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][2] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][2] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][3] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][3] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][3] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][4] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][4] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][4] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][5] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][5] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][5] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][6] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][6] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][6] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][7] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][7] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][7] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][8] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][8] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][8] + "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Dragon'][9] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Damage Type'][9] + "</td>"+
        "<td>" + raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['Breath Weapon'][9] + "</td>"+
        "</tr>"+
        "</table><br></div><br>";
        
        raceText+="<br><button class=\"collapsible\">Draconic Ancestry</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][8]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Breath Weapon</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][9]+"<br>"+
            raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][10]+"<br>"+
            raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][11]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Damage Resistance</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][12]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][13]+"</div><br></div><br></div><br>";
        
    }
    else if(race=="rockgnome"){
        
        raceText+="<br><button class=\"collapsible\">Gnome Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Darkvision</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][6]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Gnome Cunning</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][7]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['content'][8]+"</div><br>";
        
        raceText+="<br><button class=\"collapsible\">Rock Gnome</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'][0]+"<br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'][1]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Artificer's Lore</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'][2]+"</div><br>";
        raceText+="<br><button class=\"collapsible\">Tinker</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'][3]
            +raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'][4]
            +"<br>"+raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'][5].join("<br>")+"</div><br></div><br></div><br>";
    
        
    }
    else if(race=="halfelf"){
        
        raceText+="<br><button class=\"collapsible\">Half-Elf Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Darkvision</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][6]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Fey Ancestry</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][7]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Skill Versatility</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][8]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'][9]+"</div><br></div><br></div><br>";
    }
    else if(race=="halforc"){
        
        
        raceText+="<br><button class=\"collapsible\">Half-Orc Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][1]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][2]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][3]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][4]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][5]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Darkvision</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][6]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Menacing</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][7]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Relentless Endurance</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][8]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Savage Attacks</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][9]+"<br></div><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'][10]+"</div><br></div><br></div><br>";
    }
    
    /*other race must be tiefling*/
    else{
        raceText+="<br><button class=\"collapsible\">Tiefling Traits</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][0]+"<br><br>";
        raceText+="<br><button class=\"collapsible\">Ability Score Increase</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][1]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Age</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][2]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Alignment</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][3]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Size</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][4]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Speed</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][5]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Darkvision</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][6]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Hellish Resistance</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][7]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Infernal Legacy</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][8]+"</div><br><br>";
        raceText+="<br><button class=\"collapsible\">Languages</button><div class=\"content\">";
        raceText+="<br>"+raceJSON['Races']['Tiefling']['Tiefling Traits']['content'][9]+"</div><br></div><br></div><br>";
    }
    
    raceElement.innerHTML+=raceText;
    
}


/*update an element of our HTML depending on what class the user selected, as well as level.*/
function displayClass(charClass, level){
    var classPara = document.getElementById("class features");
    var classText="";
    
    /*fill in boilerplate with the class name*/
    var classSpan = document.getElementById("charClass");
    classSpan.innerHTML=charClass;
    
    var basicFeatures = document.getElementById("basic features");
    var basicFeaturesString = "";
    
    
    
    if(charClass=="barbarian"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Barbarian']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Barbarian']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Barbarian']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Barbarian']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Barbarian']['Class Features']['Equipment']['content'][1][2]+"<br>";
        
        
        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>Rages</th><th>Rage Damage</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Barbarian']['Class Features']['The Barbarian']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Barbarian']['Class Features']['The Barbarian']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Barbarian']['Class Features']['The Barbarian']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Barbarian']['Class Features']['The Barbarian']['table']['Rages'][i]+"</td>";
            tableString+="<td>"+classJSON['Barbarian']['Class Features']['The Barbarian']['table']['Rage Damage'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        var lvl1String="<br>";
        lvl1String+="<button class=\"collapsible\">Rage:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][0]+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][1]+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][2].join(" ")+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][3]+"<br>";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Rage']['content'][4]+"<br></div><br><br>";
        lvl1String+="<button class=\"collapsible\">Unarmored Defense:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Barbarian']['Class Features']['Unarmored Defense']+"</div><br><br>";
        

        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Reckless Attack:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Barbarian']['Class Features']['Reckless Attack']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Danger Sense:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Barbarian']['Class Features']['Danger Sense']['content'].join(" ")+"</div><br><br>";
        

            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Primal Path:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Barbarian']['Class Features']['Primal Path']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Frenzy:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Frenzy']+"</div><br><br></div><br><br>";
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Barbarian']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Extra Attack:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Barbarian']['Class Features']['Extra Attack']+"</div><br><br>";
            lvl5String+="<button class=\"collapsible\">Fast Movement:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Barbarian']['Class Features']['Fast Movement']+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Mindless Rage:</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Mindless Rage']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;

        }
        
        if(level>=7){
            var lvl7String="<br>";
            lvl7String+="<br><button class=\"collapsible\">Feral Instinct:</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Barbarian']['Class Features']['Feral Instinct']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;

        }
        

        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        /*Since barbarians have this same feature at level 13 and 17, it saves us from filling in those elements*/
        if(level>=9){
            
            var lvl9String="<br>";
            lvl9String+="<br><button class=\"collapsible\">Brutal Critical:</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Barbarian']['Class Features']['Brutal Critical']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[8].innerHTML=lvl9String;
        }
        
        
        if(level>=10){
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Intimidating Presence:</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Intimidating Presence']['content'].join(" ")+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=11){
            
            var lvl11String="<br>";
            lvl11String+="<br><button class=\"collapsible\">Relentless Rage:</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Barbarian']['Class Features']['Relentless Rage']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        
        }
        
        /*level 12 is an ASI, and level 13 is brutal critical again*/
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Path of the Berserker:</button><div class=\"content\">";
            lvl14String+="<br><button class=\"collapsible\">Retaliation:</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Barbarian']['Class Features']['Path of the Berserker']['Retaliation']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            
            var lvl15String="<br>";
            lvl15String+="<br><button class=\"collapsible\">Persistent Rage:</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Barbarian']['Class Features']['Persistent Rage']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        /*17 is brutal crit again*/
        
        if(level>=18){
            
            var lvl18String="<br>";
            lvl18String+="<br><button class=\"collapsible\">Indomitable Might:</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Barbarian']['Class Features']['Indomitable Might']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){

            var lvl20String="<br>";
            lvl20String+="<br><button class=\"collapsible\">Primal Champion:</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Barbarian']['Class Features']['Primal Champion']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
    }
    else if(charClass=="bard"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Bard']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Bard']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Bard']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Bard']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Bard']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        

        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=5 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>Cantrips Known</th><th>Spells Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th><th>7th</th><th>8th</th><th>9th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['Cantrips Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['Spells Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['5th'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['6th'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['7th'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['8th'][i]+"</td>";
            tableString+="<td>"+classJSON['Bard']['Class Features']['The Bard']['table']['9th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['content'].join(" ")+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spell Slots</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spell Slots']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spells Known of 1st Level and Higher</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Bardic Inspiration</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Bard']['Class Features']['Bardic Inspiration']['content'].join(" ")+"</div><br><br>";
        

        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            var lvl2String="<br>";
            
            lvl2String+="<button class=\"collapsible\">Jack of All Trades:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Bard']['Class Features']['Jack of All Trades']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Song of Rest:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Bard']['Class Features']['Song of Rest']['content'].join(" ")+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br><br>";
            lvl3String+="<button class=\"collapsible\">Expertise:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['Expertise']['content'].join(" ")+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Bard College:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['Bard College']['content'].join(" ")+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">College of Lore:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['content'].join(" ")+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Bonus Proficiencies:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['Bonus Proficiencies']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Cutting Words:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['Cutting Words']+"</div><br><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Bard']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }

        if(level>=5){
            var lvl5String="<br><br>";
            lvl5String+="<button class=\"collapsible\">Font of Inspiration:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Bard']['Class Features']['Font of Inspiration']+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            
            var lvl6String="<br><br>";
            lvl6String+="<button class=\"collapsible\">Countercharm:</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Bard']['Class Features']['Countercharm']+"</div><br><br>";
            lvl6String+="<button class=\"collapsible\">College of Lore:</button><div class=\"content\"><br>";
            lvl6String+="<button class=\"collapsible\">Additional Magic Secrets:</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Bard']['Class Features']['Font of Inspiration']+"</div><br><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
            
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=10){
            var lvl10String="<br><br>";
            lvl10String+="<button class=\"collapsible\">Magical Secrets:</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Bard']['Class Features']['Magical Secrets']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;

        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            var lvl14String="<br><br>";
            lvl14String+="<button class=\"collapsible\">College of Lore:</button><div class=\"content\"><br>";
            lvl14String+="<button class=\"collapsible\">Peerless Skill:</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Bard']['Class Features']['College of Lore']['Peerless Skill']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;

        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            var lvl20String="<br><br>";
            lvl20String+="<button class=\"collapsible\">Superior Inspiration:</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Bard']['Class Features']['Superior Inspiration']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        var bardCantrips = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['Cantrips (0 Level)'];
        var bardLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        /*calling the below function showed us that all of the spells are considered different attributes of the spell descriptions object. For example, how acid arrow works is held in the "acid arrow" attribute*/
        //console.log(Object.keys(allSpells));
        
        //below is an example of how we can use var to access json array values
        //var tempVar="Acid Splash";
        //console.log(allSpells[tempVar]);
        
        //var spellsElement = document.getElementById("final spells");
        var spellString="";
        var cantripString="<br><br>";
        
        //TODO - see if Vicious Mockery is in SRD, and add it to JSON if so
        for(var i=0;i<bardCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+bardCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[bardCantrips[i]]['content'].join("<br>")+"</div><br><br>";
            
        }
        
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        
        var spell1String="<br><br>";
        
        for(var i=0;i<bardLvl1Spells.length;i++){
            
            //this works for nested buttons
            spell1String+="<button class=\"collapsible\">"+bardLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[bardLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
            
        }

        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;

        
        if(level>=3){
            var bardLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<bardLvl2Spells.length;i++){
                
                spell2String+="<button class=\"collapsible\">"+bardLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[bardLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        
        if(level>=5){
            var bardLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<bardLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+bardLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[bardLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var bardLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<bardLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+bardLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[bardLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var bardLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<bardLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+bardLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[bardLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var bardLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<bardLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+bardLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[bardLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var bardLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<bardLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+bardLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[bardLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var bardLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<bardLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+bardLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[bardLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var bardLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Bard Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<bardLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+bardLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[bardLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
    }
    else if(charClass=="cleric"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Cleric']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Cleric']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Cleric']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Cleric']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Cleric']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=4 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>Cantrips Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th><th>7th</th><th>8th</th><th>9th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['Cantrips Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['5th'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['6th'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['7th'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['8th'][i]+"</td>";
            tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['9th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        

        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Preparing and Casting Spells:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Divine Domain</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Divine Domain']['content']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Domain Spells</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Divine Domain']['Domain Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['content']+"<br><br>";
        
        lvl1String+="<button class=\"collapsible\">Life Domain Spells</button><div class=\"content\">";
        lvl1String+="<br><table>"+
        "<tr>"+
        "<th>Cleric Level</th><th>Spells</th>"+    
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][0] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][0] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][1] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][1] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][2] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][2] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][3] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][3] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'][4] +"</td>"+
        "<td>"+ classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'][4] +"</td>"+
        "</tr>"+
        "</table><br><br>";
        lvl1String+="</div><br>";
        
        lvl1String+="<button class=\"collapsible\">Bonus Proficiency:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Bonus Proficiency']+"</div><br>";
        lvl1String+="<button class=\"collapsible\">Disciple of Life:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Disciple of Life']+"</div><br><br></div><br>";
        
        
        
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Channel Divinity:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Cleric']['Class Features']['Channel Divinity']['content'].join(" ")+"<br>";
            lvl2String+="<br><button class=\"collapsible\">Channel Divinity - Turn Undead</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Cleric']['Class Features']['Channel Divinity']['Channel Divinity: Turn Undead']['content'].join(" ")+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
            lvl2String+="<br><button class=\"collapsible\">Channel Divinity - Preserve Life</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Channel Divinity: Preserve Life']['content'].join(" ")+"</div><br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
            
        }
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Cleric']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Destroy Undead:</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Cleric']['Class Features']['Destroy Undead']['content'];
            lvl5String+="<table>"+
            "<tr>"+
            "<th>Cleric Level</th><th>Destroys Undead of CR...</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][0] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][1] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][2] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][2] +"</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][3] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][3] +"</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'][4] +"</td>"+
            "<td>"+ classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'][4] +"</td>"+"</tr>"+
            "</table></div><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        
        if(level>=6){
            
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Blessed Healer</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Blessed Healer']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        /*lvl 7 is spells*/
        if(level>=8){
            
            
            var lvl8String="<br>";
            lvl8String+="<button class=\"collapsible\">Divine Strike</button><div class=\"content\">";
            lvl8String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Divine Strike']+"<br></div>";
            lvl8String+=asiString;
            document.getElementsByClassName("lvlContent")[7].innerHTML=lvl8String;
        
        }
        
        if(level>=10){
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Divine Intervention</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Cleric']['Class Features']['Divine Intervention']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=12){
            
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        
        }
        
        /*all other levels aside from 17 are already defined or more spells*/
        if(level>=17){
            
            var lvl17String="<br>";
            lvl17String+="<button class=\"collapsible\">Life Domain</button><div class=\"content\">";
            lvl17String+="<br><button class=\"collapsible\">Supreme Healing</button><div class=\"content\">";
            lvl17String+="<br>"+classJSON['Cleric']['Class Features']['Life Domain']['Supreme Healing']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[16].innerHTML=lvl17String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        
        var clericCantrips = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['Cantrips (0 Level)'];
        var clericLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<clericCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+clericCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[clericCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<clericLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+clericLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[clericLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var clericLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<clericLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+clericLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[clericLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        
        
        if(level>=5){
            var clericLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<clericLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+clericLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[clericLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var spell3String="<br><br>";
            var clericLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['4th Level'];
            for(var i=0;i<clericLvl4Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+clericLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[clericLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var spell5String="<br><br>";
            var clericLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['5th Level'];
            for(var i=0;i<clericLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+clericLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[clericLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var spell6String="<br><br>";
            var clericLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['6th Level'];
            for(var i=0;i<clericLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+clericLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[clericLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var spell7String="<br><br>";
            var clericLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['7th Level'];
            for(var i=0;i<clericLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+clericLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[clericLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var spell8String="<br><br>";
            var clericLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['8th Level'];
            for(var i=0;i<clericLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+clericLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[clericLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var spell9String="<br><br>";
            var clericLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Cleric Spells']['9th Level'];
            for(var i=0;i<clericLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+clericLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[clericLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
        //spellsElement.innerHTML=spellString;
        
        
        
    }
    else if(charClass=="druid"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Druid']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Druid']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Druid']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Druid']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=4 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>Cantrips Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th><th>7th</th><th>8th</th><th>9th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['Cantrips Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['5th'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['6th'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['7th'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['8th'][i]+"</td>";
            tableString+="<td>"+classJSON['Druid']['Class Features']['The Druid']['table']['9th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Preparing and Casting Spells:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Druidic</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Druidic']+"</div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Sacred Plants and Wood</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Sacred Plants and Wood']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Druids and the Gods</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Druid']['Class Features']['Druids and the Gods']+"</div><br><br>";
        
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Wild Shape</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Wild Shape']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Wild Shape Table</button><div class=\"content\">";
            lvl2String+="<br>"+
                "<table>"+
            "<tr>"+
            "<th>Level</th><th>Max CR</th><th>Limitations</th><th>Example</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][0]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][0]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][1]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][1]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'][2]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'][2]+"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'][2] +"</td>"+
            "</tr>"+
            "</table><br>"+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Rules</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Rules']+
            "<br>"+classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['content'].join(" ")+"</div><br></div><br>";
            
            
            
             
            lvl2String+="<button class=\"collapsible\">Druid Circle</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Druidi Circle']+"</div><br>";
            lvl2String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Bonus Cantrip</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Bonus Cantrip']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Natural Recovery</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Natural Recovery']['content'].join(" ")+"</div><br><br>";
            
            
            
            
            
            lvl2String+="<button class=\"collapsible\">Circle Spells</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['content'].join(" ")+"<br>";
            
           
            
            
            
            /*artic*/
            lvl2String+="<button class=\"collapsible\">Artic</button><div class=\"content\">";
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            /*coast table*/
            lvl2String+="<button class=\"collapsible\">Coast</button><div class=\"content\">";
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            
            /*desert table*/
            lvl2String+="<button class=\"collapsible\">Desert</button><div class=\"content\">";
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            
            lvl2String+="<button class=\"collapsible\">Forest</button><div class=\"content\">";
            
            /*forest table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            lvl2String+="<button class=\"collapsible\">Grassland</button><div class=\"content\">";
            /*grassland table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            
            
            lvl2String+="<button class=\"collapsible\">Mountain</button><div class=\"content\">";
            /*mountain table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br>";
            
            lvl2String+="<button class=\"collapsible\">Swamp</button><div class=\"content\">";
            /*swamp table*/
            lvl2String+="<br><table>"+
            "<tr>"+
            "<th>Druid Level</th><th>Circle Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][0] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][0] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][1] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][1] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][2] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][2] +"</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'][3] +"</td>"+
            "<td>"+ classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'][3] +"</td>"+
            "</tr>"+
            "</table></div><br><br></div><br></div></div>";
            
            
            
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        /*3rd level is spells*/
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Druid']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        /*level 5 is spells*/
        if(level>=6){
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Land's Stride</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Lands Stride']['content'].join(" ")+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        /*nothing new until level 10*/
        if(level>=10){
            
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Nature's Ward</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Natures Ward']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        /*nothing until level 14*/
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Circle of the Land</button><div class=\"content\">";
            lvl14String+="<br><button class=\"collapsible\">Nature's Sanctuary</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Druid']['Class Features']['Circle of the Land']['Natures Sanctuary']['content'].join(" ")+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        /*nothing until level 18*/
        if(level>=18){
            
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Timeless Body</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Druid']['Class Features']['Timeless Body']+"</div><br><br>";
            lvl18String+="<button class=\"collapsible\">Beast Spells</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Druid']['Class Features']['Beast Spells']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
                
        if(level==20){
            
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Archdruid</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Druid']['Class Features']['Archdruid']['content'].join(" ")+"</div><br><br>";
            
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
        
        
        var druidCantrips = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['Cantrips (0 Level)'];
        var druidLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<druidCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+druidCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[druidCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<druidLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+druidLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[druidLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        
        if(level>=3){
            var druidLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<druidLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+druidLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[druidLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var druidLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<druidLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+druidLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[druidLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var druidLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<druidLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+druidLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[druidLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var druidLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<druidLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+druidLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[druidLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var druidLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<druidLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+druidLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[druidLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var druidLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<druidLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+druidLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[druidLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var druidLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<druidLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+druidLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[druidLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var druidLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Druid Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<druidLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+druidLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[druidLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
        
        
        
        
    }
    else if(charClass=="fighter"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Fighter']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Fighter']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Druid']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Fighter']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Fighter']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Fighter']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Fighter']['Class Features']['The Fighter']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Fighter']['Class Features']['The Fighter']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Fighter']['Class Features']['The Fighter']['table']['Features'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        
        
        var lvl1String="<br>";
        
        lvl1String+="<button class=\"collapsible\">Fighting Style</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Archery</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Archery']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Defense</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Defense']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Dueling</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Dueling']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Great Weapon Fighting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Great Weapon Fighting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Protection</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Protection']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Two-Weapon Fighting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Two-Weapon Fighting']+"</div><br></div><br>";
        
        lvl1String+="<button class=\"collapsible\">Second Wind</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Fighter']['Class Features']['Second Wind']+"</div><br><br>";
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Action Surge</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Action Surge']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Martial Archetype</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Class Features']['Martial Archetype']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Martial Archetypes</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Martial Archetypes']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Improved Critical</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Improved Critical']+"</div><br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        
        
        //use this string for levels 4, 6, 8, 12, 14, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Fighter']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Extra Attack</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Fighter']['Class Features']['Extra Attack']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            document.getElementsByClassName("lvlContent")[5].innerHTML=asiString;
        }
        
        if(level>=7){
            
            var lvl7String="<br>";
            lvl7String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl7String+="<br><button class=\"collapsible\">Remarkable Athlete</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Remarkable Athlete']['content'].join(" ")+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=9){
            
            
            var lvl9String="<br>";
            lvl9String+="<button class=\"collapsible\">Indomitable</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Fighter']['Class Features']['Indomitable']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[8].innerHTML=lvl9String;
        }
        
        if(level>=10){
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Additional Fighting Style</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Additional Fighting Style']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            document.getElementsByClassName("lvlContent")[13].innerHTML=asiString;
        }
        
        if(level>=15){
            
            var lvl15String="<br>";
            lvl15String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl15String+="<br><button class=\"collapsible\">Superior Critical</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Superior Critical']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=18){
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Champion</button><div class=\"content\">";
            lvl18String+="<br><button class=\"collapsible\">Remarkable Athlete</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Fighter']['Martial Archetypes']['Champion']['Survivor']+"</div><br><br></div><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        
        
        
        
        
    }
    else if(charClass=="monk"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Monk']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Monk']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Monk']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Monk']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Monk']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Martial Arts</th><th>Ki Points</th><th>Unarmored Movement</th><th>Features</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Monk']['Class Features']['The Monk']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Monk']['Class Features']['The Monk']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Monk']['Class Features']['The Monk']['table']['Martial Arts'][i]+"</td>";
            tableString+="<td>"+classJSON['Monk']['Class Features']['The Monk']['table']['Ki Points'][i]+"</td>";
            tableString+="<td>"+classJSON['Monk']['Class Features']['The Monk']['table']['Unarmored Movement'][i]+"</td>";
            tableString+="<td>"+classJSON['Monk']['Class Features']['The Monk']['table']['Features'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        
        var lvl1String="<br>";
        lvl1String+="<button class=\"collapsible\">Unarmored Defense</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Monk']['Class Features']['Unarmored Defense']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Martial Arts:</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Monk']['Class Features']['Martial Arts']['content'][0]+"<br>";
        lvl1String+=classJSON['Monk']['Class Features']['Martial Arts']['content'][1]+"<br>"
        lvl1String+=classJSON['Monk']['Class Features']['Martial Arts']['content'][2].join(" ")+" ";
        lvl1String+=classJSON['Monk']['Class Features']['Martial Arts']['content'][3]+"<br></div><br>";
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Ki</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Monk']['Class Features']['Ki']['content'].join(" ")+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Flurry of Blows</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Monk']['Class Features']['Ki']['Flurry of Blows']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Patient Defense</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Monk']['Class Features']['Ki']['Patient Defense']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Step of the Wind</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Monk']['Class Features']['Ki']['Step of the Wind']+"</div><br></div><br>";
            
            lvl2String+="<button class=\"collapsible\">Unarmored Movement</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Monk']['Class Features']['Unarmored Movement']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            
            var lvl3String="";
            lvl3String+="<br><button class=\"collapsible\">Deflect Missiles</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Monk']['Class Features']['Deflect Missiles']['content'].join(" ")+"</div><br><br>";
            
            lvl3String+="<button class=\"collapsible\">Monastic Tradition</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Monk']['Class Features']['Monastic Tradition']+"<br></div><br><br>";
            lvl3String+="<button class=\"collapsible\">Monastic Traditions</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Monk']['Monastic Traditions']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Way of the Open Hand</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Open Hand Technique</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'][0]+"<br><br>";
            lvl3String+="<br>"+classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'][1].join("<br>")+"<br></div><br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Cleric']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            var lvl4String = "<br>";
            lvl4String+=asiString;
            lvl4String+="<br><button class=\"collapsible\">Slow Fall</button><div class=\"content\">";
            lvl4String+="<br>"+classJSON['Monk']['Class Features']['Slow Fall']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[3].innerHTML=lvl4String;
        }
        
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<br><button class=\"collapsible\">Extra Attack</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Monk']['Class Features']['Extra Attack']+"<br></div><br>";
            lvl5String+="<br><button class=\"collapsible\">Stunning Strike</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Monk']['Class Features']['Stunning Strike']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            var lvl6String="<br>";
            lvl6String+="<br><button class=\"collapsible\">Ki-Empowered Strikes</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Monk']['Class Features']['Ki-Empowered Strikes']+"<br></div><br>";
            lvl6String+="<br><button class=\"collapsible\">Way of the Open Hand</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Wholeness of Body</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Wholeness of Body']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        if(level>=7){
            var lvl7String="<br>";
            lvl7String+="<br><button class=\"collapsible\">Evasion</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Monk']['Class Features']['Evasion']+"<br></div><br>";
            lvl7String+="<br><button class=\"collapsible\">Stillness of Mind</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Monk']['Class Features']['Stillness of Mind']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=10){
            var lvl10String="<br>";
            lvl10String+="<br><button class=\"collapsible\">Purity of Body</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Monk']['Class Features']['Purity of Body']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=11){
            var lvl11String="<br>";
            lvl11String+="<br><button class=\"collapsible\">Way of the Open Hand</button><div class=\"content\">";
            lvl11String+="<br><button class=\"collapsible\">Tranquility</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Tranquility']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=13){
            
            var lvl13String="<br>";
            lvl13String+="<br><button class=\"collapsible\">Tongue of the Sun and Moon</button><div class=\"content\">";
            lvl13String+="<br>"+classJSON['Monk']['Class Features']['Tongue of the Sun and Moon']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[12].innerHTML=lvl13String;
            
        }
        
        
        if(level>=14){
            var lvl14String="<br>";
            lvl14String+="<br><button class=\"collapsible\">Diamond Soul</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Monk']['Class Features']['Diamond Soul']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            var lvl15String="<br>";
            lvl15String+="<br><button class=\"collapsible\">Timeless Body</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Monk']['Class Features']['Timeless Body']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=17){
            
            var lvl17String="<br>";
            lvl17String+="<br><button class=\"collapsible\">Way of the Open Hand</button><div class=\"content\">";
            lvl17String+="<br><button class=\"collapsible\">Quivering Palm</button><div class=\"content\">";
            lvl17String+="<br>"+classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Quivering Palm']['content'].join(" ")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[16].innerHTML=lvl17String;
        }
        
        if(level>=18){
            
            
            var lvl18String="<br>";
            lvl18String+="<br><button class=\"collapsible\">Empty Body</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Monk']['Class Features']['Empty Body']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level>=20){
            
            var lvl20String="<br>";
            lvl20String+="<br><button class=\"collapsible\">Perfect Self</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Monk']['Class Features']['Perfect Self']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
    }
    else if(charClass=="paladin"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Paladin']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Paladin']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Paladin']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Paladin']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Paladin']['Class Features']['Equipment']['content'][1][2]+"<br>";
        
        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=3 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Paladin']['Class Features']['The Paladin']['table']['5th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        var lvl1String="<br>";
        lvl1String+="<br><button class=\"collapsible\">Divine Sense</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Paladin']['Class Features']['Divine Sense']['content'].join(" ")+"<br></div><br>";
        lvl1String+="<br><button class=\"collapsible\">Lay on Hands</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Paladin']['Class Features']['Lay on Hands']['content'].join(" ")+"<br></div><br>";
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Fighting Style</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Defense</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Defense']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Dueling</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Dueling']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Great Weapon Fighting</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Great Weapon Fighting']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Protection</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Fighter']['Class Features']['Fighting Style']['Protection']+"</div><br></div><br>";
            
            
            lvl2String+="<button class=\"collapsible\">Spellcasting:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Paladin']['Class Features']['Spellcasting']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Preparing and Casting Spells:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Paladin']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br>";
            
            lvl2String+="<button class=\"collapsible\">Divine Smite</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Paladin']['Class Features']['Divine Smite']+"<br></div><br>";
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Divine Health:</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Class Features']['Divine Health']+"</div><br><br>";
            
            lvl3String+="<button class=\"collapsible\">Sacred Oath</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Class Features']['Sacred Oath']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Oath Spells</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Class Features']['Sacred Oath']['Oath Spells']['content'].join(" ")+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Channel Divinity</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Class Features']['Sacred Oath']['Channel Divinity']['content'].join(" ")+"</div><br></div><br>";
            
            
            lvl3String+="<button class=\"collapsible\">Oath of Devotion</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Tenets of Devotion</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Tenets of Devotion']['content'].join("<br>")+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Oath Spells</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['content']+"<br><br>";
            
            
           
            
            /*oath spell table*/
            lvl3String+="<table>"+
            "<tr>"+
            "<th>Level</th><th>Paladin Spells</th>"+    
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][0] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][0] +
            "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][1] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][1] +
            "</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][2] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][2] +
            "</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][3] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][3] +
            "</td>"+"</tr>"+
            "<tr>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'][4] +"</td>"+
            "<td>"+ classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'][4] +
            "</td>"+"</tr>"+
            "</table><br></div><br>";

            
            
            
            lvl3String+="<button class=\"collapsible\">Channel Divinity</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Channel Divinity']['content'].join("<br><br>")+"</div><br></div><br></div>";  
            
            
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Paladin']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Extra Attack</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Paladin']['Class Features']['Extra Attack']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        if(level>=6){
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Aura of Protecetion</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Paladin']['Class Features']['Aura of Protection']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
            
        }
        
        if(level>=7){
            var lvl7String="<br>";
            lvl7String+="<button class=\"collapsible\">Oath of Devotion</button><div class=\"content\">";
            lvl7String+="<br><button class=\"collapsible\">Aura of Devotion</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Aura of Devotion']['content'].join(" ")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        if(level>=10){
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Aura of Courage</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Paladin']['Class Features']['Aura of Courage']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=11){
            var lvl11String="<br>";
            lvl11String+="<button class=\"collapsible\">Improved Divine Smite</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Paladin']['Class Features']['Improved Divine Smite']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        /*12 is ASI, 13 is spells*/
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Cleansing Touch</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Paladin']['Class Features']['Cleansing Touch']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            
            var lvl15String="<br>";
            lvl15String+="<button class=\"collapsible\">Oath of Devotion</button><div class=\"content\">";
            lvl15String+="<br><button class=\"collapsible\">Purity of Spirit</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Purity of Spirit']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Oath of Devotion</button><div class=\"content\">";
            lvl20String+="<br><button class=\"collapsible\">Holy Nimbus</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Holy Nimbus']['content'].join(" ")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
        
        
        var paladinLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        if(level>=2){
            for(var i=0;i<paladinLvl1Spells.length;i++){
                spell1String+="<button class=\"collapsible\">"+paladinLvl1Spells[i]+"</button><div class=\"content\">";
                spell1String+=allSpells[paladinLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        }
        
        if(level>=5){
            var paladinLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<paladinLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+paladinLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[paladinLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=9){
            var paladinLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<paladinLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+paladinLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[paladinLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=13){
            var paladinLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<paladinLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+paladinLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[paladinLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=17){
            var paladinLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Paladin Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<paladinLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+paladinLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[paladinLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        

        
    }
    else if(charClass=="ranger"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Ranger']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Ranger']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Ranger']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Ranger']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Ranger']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=3 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Ranger']['Class Features']['The Ranger']['table']['5th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        var lvl1String="<br>";
        lvl1String+="<button class=\"collapsible\">Favored Enemy</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Ranger']['Class Features']['Favored Enemy']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Natural Explorer</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Ranger']['Class Features']['Natural Explorer']['content'][0]+" ";
        lvl1String+="<br>"+classJSON['Ranger']['Class Features']['Natural Explorer']['content'][1]+"<br><br>";
        lvl1String+="<br>"+classJSON['Ranger']['Class Features']['Natural Explorer']['content'][2].join("<br>")+"<br><br>";
        lvl1String+="<br>"+classJSON['Ranger']['Class Features']['Natural Explorer']['content'][3] + "<br></div><br>";
        
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        /*core ranger class - SRD, not the Revised Ranger UA*/
        
        if(level>=2){
            
            lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Fighting Style</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Fighting Style']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Archery</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Fighting Style']['Archery']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Defense</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Fighting Style']['Defense']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Dueling</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Fighting Style']['Dueling']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Two-Weapon Fighting</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Fighting Style']['Two-Weapon Fighting']+"</div><br></div><br>";
            
            
            lvl2String+="<button class=\"collapsible\">Spellcasting:</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Spellcasting']['content']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Spells Known of 1st Level and Higher</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Ranger']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
            
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
            
            
        }
        
        if(level>=3){
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Primeval Awareness</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Ranger']['Class Features']['Primeval Awareness']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Ranger Archetype</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Ranger']['Class Features']['Ranger Archetype']+"</div><br><br>";
            
            lvl3String+="<button class=\"collapsible\">Ranger Archetypes</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Ranger']['Ranger Archetypes']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Hunter</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Ranger']['Ranger Archetypes']['Hunter']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Hunter's Prey</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Ranger']['Ranger Archetypes']['Hunter']['Hunters Prey']['content'].join("<br>")+"</div><br></div><br></div><br>";
            
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Ranger']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Extra Attack</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Ranger']['Class Features']['Extra Attack']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        /*level 6 is improvements on previously defined features.*/
        if(level>=7){
            
            var lvl7String="<br>";
            lvl7String+="<button class=\"collapsible\">Hunter</button><div class=\"content\">";
            lvl7String+="<br><button class=\"collapsible\">Defensive Tactics</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Ranger']['Ranger Archetypes']['Hunter']['Defensive Tactics']['content'].join("<br>")+"</div><br></div><br><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            var lvl8String="<br>";
            lvl8String+="<button class=\"collapsible\">Land's Stride</button><div class=\"content\">";
            lvl8String+="<br>"+classJSON['Ranger']['Class Features']['Lands Stride']['content'].join(" ")+"<br></div><br>";
            
            
            lvl8String="<br>";
            lvl8String+=asiString;
            document.getElementsByClassName("lvlContent")[7].innerHTML=lvl8String;
        
        }
        
        /*9 is spells*/
        
        if(level>=10){
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">Hide in Plain Sight</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Ranger']['Class Features']['Hide in Plain Sight']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        if(level>=11){
           
            var lvl11String="<br>";
            lvl11String+="<button class=\"collapsible\">Hunter</button><div class=\"content\">";
            lvl11String+="<br><button class=\"collapsible\">Multiattack</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Ranger']['Ranger Archetypes']['Hunter']['Multiattack']['content'].join("<br>")+"</div><br></div><br><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        /*12 is ASI, 13 is spells*/
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Vanish</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Ranger']['Class Features']['Vanish']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            
            var lvl15String="<br>";
            lvl15String+="<button class=\"collapsible\">Hunter</button><div class=\"content\">";
            lvl15String+="<br><button class=\"collapsible\">Superior Hunter's Defense</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Ranger']['Ranger Archetypes']['Hunter']['Superior Hunters Defense']['content'].join("<br>")+"</div><br></div><br><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        
        
        /*16 is ASI, 17 is spells*/
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        
        if(level>=18){
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Feral Senses</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Ranger']['Class Features']['Feral Senses']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        /*19 is ASI*/
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Foe Slayer</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Ranger']['Class Features']['Foe Slayer']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
        
        var rangerLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        
        if(level>=2){
            var spell1String="<br><br>";
            for(var i=0;i<rangerLvl1Spells.length;i++){
                spell1String+="<button class=\"collapsible\">"+rangerLvl1Spells[i]+"</button><div class=\"content\">";
                spell1String+=allSpells[rangerLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        }
        
        if(level>=5){
            var rangerLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<rangerLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+rangerLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[rangerLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=9){
            var rangerLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<rangerLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+rangerLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[rangerLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=13){
            var rangerLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<rangerLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+rangerLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[rangerLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=17){
            var rangerLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Ranger Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<rangerLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+rangerLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[rangerLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        

    }
    else if(charClass=="rogue"){
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Rogue']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Rogue']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Rogue']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Rogue']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Rogue']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Sneak Attack</th><th>Features</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            //tableString+="<td>"+classJSON['Cleric']['Class Features']['The Cleric']['content'][1]['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Rogue']['Class Features']['The Rogue']['content'][0]['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Rogue']['Class Features']['The Rogue']['content'][0]['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Rogue']['Class Features']['The Rogue']['content'][0]['table']['Sneak Attack'][i]+"</td>";
            tableString+="<td>"+classJSON['Rogue']['Class Features']['The Rogue']['content'][0]['table']['Features'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        
        var lvl1String="<br>";
        lvl1String+="<button class=\"collapsible\">Expertise</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Rogue']['Class Features']['Expertise']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Sneak Attack</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Rogue']['Class Features']['Sneak Attack']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Thieves' Cant</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Rogue']['Class Features']['Thieves Cant']['content'].join(" ")+"</div><br><br>";
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
                                                                
        
        if(level>=2){
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Cunning Action</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Rogue']['Class Features']['Cunning Action']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Roguish Archetype</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Rogue']['Class Features']['Roguish Archetype']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Roguish Arhchetypes</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Thief</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['Thief']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Fast Hands</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['Thief']['Fast Hands']+"</div><br><br>";
            lvl3String+="<button class=\"collapsible\">Second-Story Work</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['Thief']['Second-Story Work']['content'].join(" ")+"</div><br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 10, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Rogue']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Uncanny Dodge</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Rogue']['Class Features']['Uncanny Dodge']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        /*6 is more expertise*/
        
        if(level>=7){
            
            var lvl7String="<br>";
            lvl7String+="<button class=\"collapsible\">Evasion</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Rogue']['Class Features']['Evasion']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }

        if(level>=9){
            
            var lvl9String="<br>";
            lvl9String+="<button class=\"collapsible\">Thief</button><div class=\"content\">";
            lvl9String+="<br><button class=\"collapsible\">Supreme Sneak</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['Thief']['Supreme Sneak']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[8].innerHTML=lvl9String;
            
        }
        
        if(level>=10){
            document.getElementsByClassName("lvlContent")[9].innerHTML=asiString;
        }
        
        if(level>=11){
            var lvl11String="<br>";
            lvl11String+="<button class=\"collapsible\">Reliable Talent</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Rogue']['Class Features']['Reliable Talent']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=13){
            var lvl13String="<br>";
            lvl13String+="<button class=\"collapsible\">Thief</button><div class=\"content\">";
            lvl13String+="<br><button class=\"collapsible\">Use Magic Device</button><div class=\"content\">";
            lvl13String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['Thief']['Use Magic Device']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[12].innerHTML=lvl13String;
        }
        
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Blindsense</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Rogue']['Class Features']['Blindsense']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            
            var lvl15String="<br>";
            lvl15String+="<button class=\"collapsible\">Slippery Mind</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Rogue']['Class Features']['Slippery Mind']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=17){
            
            var lvl17String="<br>";
            lvl17String+="<button class=\"collapsible\">Thief</button><div class=\"content\">";
            lvl17String+="<br><button class=\"collapsible\">Thief's Reflexes</button><div class=\"content\">";
            lvl17String+="<br>"+classJSON['Rogue']['Roguish Archetypes']['Thief']['Thiefs Reflexes']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[16].innerHTML=lvl17String;
        }
        
        if(level>=18){
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Elusive</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Rogue']['Class Features']['Elusive']+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Stroke of Luck</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Rogue']['Class Features']['Stroke of Luck']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
    }
    else if(charClass=="sorcerer"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Sorcerer']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][4]+" ";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'][5]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Sorcerer']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Sorcerer']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Sorcerer']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Sorcerer']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=6 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Sorcery Points</th><th>Features</th><th>Cantrips Known</th><th>Spells Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th><th>7th</th><th>8th</th><th>9th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['Sorcery Points'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['Cantrips Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['Spells Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['5th'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['6th'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['7th'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['8th'][i]+"</td>";
            tableString+="<td>"+classJSON['Sorcerer']['Class Features']['The Sorcerer']['table']['9th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spell Slots</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Spellcasting']['Spell Slots']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spells Known of 1st Level and Higher</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Sorcerous Origin</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Class Features']['Sorcerous Origin']['content']+"<br></div><br>";
        
        
        
        
        lvl1String+="<button class=\"collapsible\">Sorcerous Origins</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Draconic Bloodline</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Dragon Ancestor</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['content']+"<br><br>";
        lvl1String+="<br><table>"+
            "<tr>"+
            "<th>Dragon</th>"+
            "<th>Damage Type</th>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][0] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][0] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][1] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][1] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][2] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][2] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][3] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][3] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][4] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][4] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][5] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][5] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][6] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][6] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][7] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][7] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][8] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][8] + "</td>"+
            "</tr>"+
            "<tr>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'][9] + "</td>"+
            "<td>" + classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'][9] + "</td>"+
            "</tr>"+
            
        "</table><br></div><br>"
        lvl1String+="<button class=\"collapsible\">Draconic Ancestry</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][1]+"<br></div><br></div><br>";
        lvl1String+="<button class=\"collapsible\">Dracoinc Resilience</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Resilience']['content'].join(" ")+"<br></div><br></div><br>";
        

        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Font of Magic</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Sorcerer']['Class Features']['Font of Magic']['content']+"<br>";
            lvl2String+="<button class=\"collapsible\">Sorcery Points</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Sorcerer']['Class Features']['Font of Magic']['Sorcery Points']+"<br><br>";
            lvl2String+="<button class=\"collapsible\">Flexible Casting</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['content'].join(" ")+"<br>";
            lvl2String+="<br><table>"+
            "<th>Spell Slot Level</th>"+
            "<th>Sorcery Point Cost</th>"+
                "<tr>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'][0] + "</td>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'][0] + "</td>"+
                "</tr>"+
                "<tr>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'][1] + "</td>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'][1] + "</td>"+
                "</tr>"+
                "<tr>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'][2] + "</td>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'][2] + "</td>"+
                "</tr>"+
                "<tr>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'][3] + "</td>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'][3] + "</td>"+
                "</tr>"+
                "<tr>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'][4] + "</td>"+
                "<td>" + classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'][4] + "</td>"+
                "</tr>"+
            "</table><br></div><br></div><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Metamagic</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['content'].join(" ")+"<br>";
            lvl3String+="<button class=\"collapsible\">Careful Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Careful Spell']+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Distant Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Distant Spell']['content'].join(" ")+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Empowered Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Empowered Spell']['content'].join(" ")+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Extended Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Extended Spell']+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Heightened Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Heightened Spell']+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Quickened Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Quickened Spell']+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Subtle Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Subtle Spell']+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Twinned Spell</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Sorcerer']['Class Features']['Metamagic']['Twinned Spell']['content'].join(" ")+"<br></div><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Sorcerer']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        /*all not noted levels are improvements or spells*/
        
        if(level>=6){
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">Draconic Bloodline</button><div class=\"content\">";
            lvl6String+="<br>"+"<button class=\"collapsible\">Elemental Affinity</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Elemental Affinity']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">Draconic Bloodline</button><div class=\"content\">";
            lvl14String+="<br>"+"<button class=\"collapsible\">Dragon Wings</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Wings']['content']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=18){
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Draconic Bloodline</button><div class=\"content\">";
            lvl18String+="<br>"+"<button class=\"collapsible\">Draconic Presence</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Presence']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            
            var lvl20String="<br>";
            lvl20String+="<br>"+"<button class=\"collapsible\">Sorcerous Restoration</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Sorcerer']['Class Features']['Sorcerous Restoration']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
        
        
        var sorcererCantrips = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['Cantrips (0 Level)'];
        var sorcererLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<sorcererCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+sorcererCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[sorcererCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<sorcererLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+sorcererLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[sorcererLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var sorcererLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<sorcererLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+sorcererLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[sorcererLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var sorcererLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<sorcererLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+sorcererLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[sorcererLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var sorcererLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<sorcererLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+sorcererLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[sorcererLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var sorcererLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<sorcererLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+sorcererLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[sorcererLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var spell6String="<br><br>";
            var sorcererLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['6th Level'];
            for(var i=0;i<sorcererLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+sorcererLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[sorcererLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var sorcererLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<sorcererLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+sorcererLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[sorcererLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var sorcererLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<sorcererLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+sorcererLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[sorcererLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var sorcererLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Sorcerer Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<sorcererLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+sorcererLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[sorcererLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
       
    }
    else if(charClass=="warlock"){
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Warlock']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Warlock']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Warlock']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Warlock']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Warlock']['Class Features']['Equipment']['content'][1][2]+"<br>";

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>Cantrips Known</th><th>Spells Known</th><th>Slot Level</th><th>Invocations Known</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Cantrips Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Spells Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Slot Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Warlock']['Class Features']['The Warlock']['table']['Invocations Known'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Pact Magic</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Pact Magic']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Pact Magic']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spell Slots</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Pact Magic']['Spell Slots']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spells Known of 1st Level and Higher</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Pact Magic']['Spells Known of 1st Level and Higher']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Focus']+"</div><br><br></div><br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Otherworldly Patron</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Class Features']['Otherworldly Patron']+"<br></div><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Otherworldly Patrons</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['content'].join(" ")+"<br><br>";
        lvl1String+="<button class=\"collapsible\">The Fiend</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Expanded Spell List</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['content']+"<br><br>";
        
        
        /*fiend spell list*/
        lvl1String+="<table>"+
        "<tr>"+
        "<th>Spell Level</th><th>Spells</th>"+    
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][0] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][0] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][1] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][1] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][2] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][2] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][3] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][3] +"</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'][4] +"</td>"+
        "<td>"+ classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'][4] +"</td>"+
        "</tr>"+
        "</table><br></div><br>";
        
        
        
        lvl1String+="<button class=\"collapsible\">Dark One's Blessing</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Blessing']+"<br></div><br></div><br></div><br>";
        
                
        
        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Eldritch Invocations</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Class Features']['Eldritch Invocations']['content'].join(" ")+"<br>";
            lvl2String+="<br><button class=\"collapsible\">Agonizing Blast</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Agonizing Blast']['content'].join("<br>")+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Armor of Shadows</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Armor of Shadows']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Beast Speech</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Beast Speech']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Beguiling Influence</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Beguiling Influence']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Book of Ancient Secrets</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Book of Ancient Secrets']['content'].join("<br>")+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Devil's Sight</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Devils Sight']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Eldritch Sight</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Eldritch Sight']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Eldritch Spear</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Eldritch Spear']['content'].join("<br>")+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Eyes of the Rune Keeper</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Eyes of the Rune Keeper']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Fiendish Vigor</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Fiendish Vigor']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Gaze of Two Minds</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Gaze of Two Minds']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Mask of Many Faces</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Mask of Many Faces']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Misty Visions</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Misty Visions']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Repelling Blast</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Repelling Blast']['content'].join("<br>")+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Thief of Five Fates</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Thief of Five Fates']+"<br></div><br>";
            lvl2String+="<button class=\"collapsible\">Voice of the Chain Master</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Voice of the Chain Master']['content'].join("<br>")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        if(level>=3){
            
            var lvl3String="<br>";
            lvl3String+="<button class=\"collapsible\">Pact Boon</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Warlock']['Class Features']['Pact Boon']['content']+"<br><br>";
            lvl3String+="<button class=\"collapsible\">Pact of the Chain</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Chain']['content'].join(" ")+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Pact of the Blade</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Blade']['content'].join(" ")+"<br></div><br>";
            lvl3String+="<button class=\"collapsible\">Pact of the Tome</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Tome']['content'].join(" ")+"<br></div><br>";
            
            lvl3String+="<button class=\"collapsible\">Your Pact Boon</button><div class=\"content\">";
            lvl3String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['Your Pact Boon']['content'].join("<br><br>")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[2].innerHTML=lvl3String;
        }
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Warlock']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=5){
            
            var lvl5String="<br>";
            lvl5String+="<button class=\"collapsible\">Eldritch Invocations</button><div class=\"content\">";
            lvl5String+="<br><button class=\"collapsible\">Mire the Mind</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Mire the Mind']['content'].join("<br>")+"<br></div><br>";
            lvl5String+="<button class=\"collapsible\">One with Shadows</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['One with Shadows']['content'].join("<br>")+"<br></div><br>";
            lvl5String+="<button class=\"collapsible\">Sign of Ill Omen</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Sign of Ill Omen']['content'].join("<br>")+"<br></div><br>";
            lvl5String+="<button class=\"collapsible\">Thirsting Blade</button><div class=\"content\">";
            lvl5String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Thirsting Blade']['content'].join("<br>")+"<br></div><br></div><br>";
            
            document.getElementsByClassName("lvlContent")[4].innerHTML=lvl5String;
        }
        
        
        /*all not listed levels are spells, ASI, or invocations*/
        if(level>=6){
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">The Fiend</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Dark One's Own Luck</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Own Luck']['content'].join(" ")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        if(level>=7){
            
            var lvl7String="<br>";
            lvl7String+="<button class=\"collapsible\">Eldritch Invocations</button><div class=\"content\">";
            lvl7String+="<br><button class=\"collapsible\">Bewitching Whispers</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Bewitching Whispers']['content'].join("<br>")+"<br></div><br>";
            lvl7String+="<button class=\"collapsible\">Dreadful Word</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Dreadful Word']['content'].join("<br>")+"<br></div><br>";
            lvl7String+="<button class=\"collapsible\">Sculptor of Flesh</button><div class=\"content\">";
            lvl7String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Sculptor of Flesh']['content'].join("<br>")+"<br></div><br></div><br>";
            
            
            document.getElementsByClassName("lvlContent")[6].innerHTML=lvl7String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        if(level>=9){
            var lvl9String="<br>";
            lvl9String+="<button class=\"collapsible\">Eldritch Invocations</button><div class=\"content\">";
            lvl9String+="<br><button class=\"collapsible\">Ascendant Step</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Ascendant Step']['content'].join("<br>")+"<br></div><br>";
            lvl9String+="<button class=\"collapsible\">Minions of Chaos</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Minions of Chaos']['content'].join("<br>")+"<br></div><br>";
            lvl9String+="<button class=\"collapsible\">Otherworldly Leap</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Otherworldly Leap']['content'].join("<br>")+"<br></div><br>";
            lvl9String+="<button class=\"collapsible\">Whispers of the Grave</button><div class=\"content\">";
            lvl9String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Whispers of the Grave']['content'].join("<br>")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[8].innerHTML=lvl9String;
        }
        
        if(level>=10){
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">The Fiend</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Fiendish Resilience</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Fiendish Resilience']+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        
        }
        
        if(level>=11){
            
            var lvl11String="<br>";
            lvl11String+="<br><button class=\"collapsible\">Mystic Arcanum</button><div class=\"content\">";
            lvl11String+="<br>"+classJSON['Warlock']['Class Features']['Mystic Arcanum']['content'].join(" ")+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[10].innerHTML=lvl11String;
        }
        
        if(level>=12){
                       
            var lvl12String="<br>";
            lvl12String+="<button class=\"collapsible\">Eldritch Invocations</button><div class=\"content\">";
            lvl12String+="<br><button class=\"collapsible\">Lifedrinker</button><div class=\"content\">";
            lvl12String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Lifedrinker']['content'].join("<br>")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString+lvl12String;
            
        }
        
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">The Fiend</button><div class=\"content\">";
            lvl14String+="<br><button class=\"collapsible\">Hurl Through Hell</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Hurl Through Hell']['content'].join(" ")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=15){
            
            
            var lvl15String="<br>";
            lvl15String+="<button class=\"collapsible\">Eldritch Invocations</button><div class=\"content\">";
            lvl15String+="<br><button class=\"collapsible\">Chains of Carceri</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Chains of Carceri']['content'].join("<br>")+"<br></div><br>";
            lvl15String+="<button class=\"collapsible\">Master of Myriad Forms</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Master of Myriad Forms']['content'].join("<br>")+"<br></div><br>";
            lvl15String+="<button class=\"collapsible\">Visions of Distant Realms</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Visions of Distant Realms']['content'].join("<br>")+"<br></div><br>";
            lvl15String+="<button class=\"collapsible\">Witch Sight</button><div class=\"content\">";
            lvl15String+="<br>"+classJSON['Warlock']['Eldritch Invocations']['Witch Sight']['content'].join("<br>")+"<br></div><br></div><br>";
            document.getElementsByClassName("lvlContent")[14].innerHTML=lvl15String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Eldritch Master</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Warlock']['Class Features']['Eldritch Master']+"<br></div><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }
        
        
        var warlockCantrips = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['Cantrips (0 Level)'];
        var warlockLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<warlockCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+warlockCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[warlockCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<warlockLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+warlockLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[warlockLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
        
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var warlockLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<warlockLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+warlockLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[warlockLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var warlockLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<warlockLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+warlockLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[warlockLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var warlockLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<warlockLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+warlockLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[warlockLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var warlockLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<warlockLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+warlockLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[warlockLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var warlockLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<warlockLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+warlockLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[warlockLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var warlockLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<warlockLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+warlockLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[warlockLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var warlockLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<warlockLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+warlockLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[warlockLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var warlockLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Warlock Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<warlockLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+warlockLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[warlockLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        

        //spellsElement.innerHTML=spellString;
        
        

        
    }
    
    
    /*wizard is only other class*/
    else{
        
        
        /*basic features for classes include hit points, proficiencies, and equipment*/
        basicFeaturesString+="<br><br>Hit Points: <br>" + classJSON['Wizard']['Class Features']['Hit Points']['content'][0] + "<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Hit Points']['content'][1] + "<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Hit Points']['content'][2] + "<br><br>";
        basicFeaturesString+="Proficiences:<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][0]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][1]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][2]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][3]+"<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Proficiencies']['content'][4]+"<br><br>";
        basicFeaturesString+="Equipment:<br>";
        basicFeaturesString+=classJSON['Wizard']['Class Features']['Equipment']['content'][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Wizard']['Class Features']['Equipment']['content'][1][0]+"<br>";
        basicFeaturesString+="- " + classJSON['Wizard']['Class Features']['Equipment']['content'][1][1]+"<br>";
        basicFeaturesString+="- " + classJSON['Wizard']['Class Features']['Equipment']['content'][1][2]+"<br>";

        
        basicFeatures.innerHTML=basicFeaturesString;
        
        
        
        var classTable = document.getElementById("classTable");
        var tableString="";
        tableString+="<tr><td colspan=4 id=\"spellSpace\"></td><th colspan=9>Spell Slots per Spell Level</th></tr>";
        tableString+="<tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th><th>Cantrips Known</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th><th>7th</th><th>8th</th><th>9th</th></tr>";
        for(var i=0;i<level;i++){
            tableString+="<tr>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['Level'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['Proficiency Bonus'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['Features'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['Cantrips Known'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['1st'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['2nd'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['3rd'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['4th'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['5th'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['6th'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['7th'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['8th'][i]+"</td>";
            tableString+="<td>"+classJSON['Wizard']['Class Features']['The Wizard']['table']['9th'][i]+"</td>";
            tableString+="</tr>";
        }
        classTable.innerHTML=tableString;
        
        var lvl1String="<br><br>";
        
        
        lvl1String+="<button class=\"collapsible\">Spellcasting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1String+="<button class=\"collapsible\">Cantrips</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Cantrips']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellbook</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Spellbook']['content']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Preparing and Casting Spells</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Ability</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Ritual Casting</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Ritual Casting']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Spellcasting Focus</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Focus']+"</div><br><br>";
        lvl1String+="<button class=\"collapsible\">Learning Spells of 1st Level and Higher</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Spellcasting']['Learning Spells of 1st Level and Higher']+"</div><br><br></div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Arcane Recovery</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Class Features']['Arcane Recovery']['content'].join(" ")+"</div><br><br>";
        
        lvl1String+="<button class=\"collapsible\">Your Spellbook</button><div class=\"content\">";
        lvl1String+="<br>"+classJSON['Wizard']['Arcane Traditions']['Your Spellbook']['content'].join(" ")+"</div><br><br>";
        

        document.getElementsByClassName("lvlContent")[0].innerHTML=lvl1String;
        
        if(level>=2){
            
            var lvl2String="<br>";
            lvl2String+="<button class=\"collapsible\">Arcane Tradition</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Wizard']['Class Features']['Arcane Tradition']['content'].join(" ")+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Arcane Traditions</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Wizard']['Arcane Traditions']['content'].join(" ")+"<br><br>";
            lvl2String+="<button class=\"collapsible\">School of Evocation</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Wizard']['Arcane Traditions']['School of Evocation']['content']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Evocation Savant</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Evocation Savant']+"</div><br><br>";
            lvl2String+="<button class=\"collapsible\">Sculpt Spells</button><div class=\"content\">";
            lvl2String+="<br>"+classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Sculpt Spells']+"</div><br></div><br></div><br>";

            document.getElementsByClassName("lvlContent")[1].innerHTML=lvl2String;
        }
        
        /*every not listed level is spells*/
        
        //use this string for levels 4, 8, 12, 16, and 19
        var asiString="<br><br>";
        asiString+="<button class=\"collapsible\">Ability Score Improvement:</button><div class=\"content\">";
        asiString+="<br>"+classJSON['Sorcerer']['Class Features']['Ability Score Improvement']+"</div><br><br>";
        
        if(level>=4){
            document.getElementsByClassName("lvlContent")[3].innerHTML=asiString;
        }
        
        if(level>=6){
            
            var lvl6String="<br>";
            lvl6String+="<button class=\"collapsible\">School of Evocation</button><div class=\"content\">";
            lvl6String+="<br><button class=\"collapsible\">Potent Cantrip</button><div class=\"content\">";
            lvl6String+="<br>"+classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Potent Cantrip']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[5].innerHTML=lvl6String;
        }
        
        if(level>=8){
            document.getElementsByClassName("lvlContent")[7].innerHTML=asiString;
        }
        
        
        if(level>=10){
            
            
            var lvl10String="<br>";
            lvl10String+="<button class=\"collapsible\">School of Evocation</button><div class=\"content\">";
            lvl10String+="<br><button class=\"collapsible\">Empowered Evocation</button><div class=\"content\">";
            lvl10String+="<br>"+classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Empowered Evocation']+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[9].innerHTML=lvl10String;
        }
        
        
        if(level>=12){
            document.getElementsByClassName("lvlContent")[11].innerHTML=asiString;
        }
        
        
        if(level>=14){
            
            var lvl14String="<br>";
            lvl14String+="<button class=\"collapsible\">School of Evocation</button><div class=\"content\">";
            lvl14String+="<br><button class=\"collapsible\">Overchannel</button><div class=\"content\">";
            lvl14String+="<br>"+classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Overchannel']['content'].join(" ")+"</div><br></div><br>";
            document.getElementsByClassName("lvlContent")[13].innerHTML=lvl14String;
        }
        
        if(level>=16){
            document.getElementsByClassName("lvlContent")[15].innerHTML=asiString;
        }
        
        if(level>=18){
            
            var lvl18String="<br>";
            lvl18String+="<button class=\"collapsible\">Spell Mastery</button><div class=\"content\">";
            lvl18String+="<br>"+classJSON['Wizard']['Class Features']['Spell Mastery']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[17].innerHTML=lvl18String;
        }
        
        if(level>=19){
            document.getElementsByClassName("lvlContent")[18].innerHTML=asiString;
        }
        
        if(level==20){
            
            var lvl20String="<br>";
            lvl20String+="<button class=\"collapsible\">Signature Spells</button><div class=\"content\">";
            lvl20String+="<br>"+classJSON['Wizard']['Class Features']['Signature Spells']['content'].join(" ")+"</div><br><br>";
            document.getElementsByClassName("lvlContent")[19].innerHTML=lvl20String;
        }

    
    
        classPara.innerHTML=classText;
    
    
    
        var wizardCantrips = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['Cantrips (0 Level)'];
        var wizardLvl1Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['1st Level'];
        var allSpells = spellJSON['Spellcasting']['Spell Descriptions'];
        
        
        //var spellsElement = document.getElementById("final spells");
        var spell1String="<br><br>";
        var cantripString="<br><br>";
        for(var i=0;i<wizardCantrips.length;i++){
            cantripString+="<button class=\"collapsible\">"+wizardCantrips[i]+"</button><div class=\"content\">";
            cantripString+=allSpells[wizardCantrips[i]]['content'].join("<br>")+"</div><br><br>";
        }
        for(var i=0;i<wizardLvl1Spells.length;i++){
            spell1String+="<button class=\"collapsible\">"+wizardLvl1Spells[i]+"</button><div class=\"content\">";
            spell1String+=allSpells[wizardLvl1Spells[i]]['content'].join("<br>")+"</div><br><br>";
        }
    
    
        document.getElementsByClassName("mainContent")[0].innerHTML=cantripString;
    
        document.getElementsByClassName("mainContent")[1].innerHTML=spell1String;
        
        if(level>=3){
            var wizardLvl2Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['2nd Level'];
            var spell2String="<br><br>";
            for(var i=0;i<wizardLvl2Spells.length;i++){
                spell2String+="<button class=\"collapsible\">"+wizardLvl2Spells[i]+"</button><div class=\"content\">";
                spell2String+=allSpells[wizardLvl2Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[2].innerHTML=spell2String;
        }
        
        if(level>=5){
            var wizardLvl3Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['3rd Level'];
            var spell3String="<br><br>";
            for(var i=0;i<wizardLvl3Spells.length;i++){
                spell3String+="<button class=\"collapsible\">"+wizardLvl3Spells[i]+"</button><div class=\"content\">";
                spell3String+=allSpells[wizardLvl3Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[3].innerHTML=spell3String;
        }
        
        if(level>=7){
            var wizardLvl4Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['4th Level'];
            var spell4String="<br><br>";
            for(var i=0;i<wizardLvl4Spells.length;i++){
                spell4String+="<button class=\"collapsible\">"+wizardLvl4Spells[i]+"</button><div class=\"content\">";
                spell4String+=allSpells[wizardLvl4Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[4].innerHTML=spell4String;
        }
        
        if(level>=9){
            var wizardLvl5Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['5th Level'];
            var spell5String="<br><br>";
            for(var i=0;i<wizardLvl5Spells.length;i++){
                spell5String+="<button class=\"collapsible\">"+wizardLvl5Spells[i]+"</button><div class=\"content\">";
                spell5String+=allSpells[wizardLvl5Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[5].innerHTML=spell5String;
        }
        
        if(level>=11){
            var wizardLvl6Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['6th Level'];
            var spell6String="<br><br>";
            for(var i=0;i<wizardLvl6Spells.length;i++){
                spell6String+="<button class=\"collapsible\">"+wizardLvl6Spells[i]+"</button><div class=\"content\">";
                spell6String+=allSpells[wizardLvl6Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[6].innerHTML=spell6String;
        }
        
        if(level>=13){
            var wizardLvl7Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['7th Level'];
            var spell7String="<br><br>";
            for(var i=0;i<wizardLvl7Spells.length;i++){
                spell7String+="<button class=\"collapsible\">"+wizardLvl7Spells[i]+"</button><div class=\"content\">";
                spell7String+=allSpells[wizardLvl7Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[7].innerHTML=spell7String;
        }
        
        if(level>=15){
            var wizardLvl8Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['8th Level'];
            var spell8String="<br><br>";
            for(var i=0;i<wizardLvl8Spells.length;i++){
                spell8String+="<button class=\"collapsible\">"+wizardLvl8Spells[i]+"</button><div class=\"content\">";
                spell8String+=allSpells[wizardLvl8Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[8].innerHTML=spell8String;
        }
        
        if(level>=17){
            var wizardLvl9Spells = spellJSON['Spellcasting']['Spell Lists']['Wizard Spells']['9th Level'];
            var spell9String="<br><br>";
            for(var i=0;i<wizardLvl9Spells.length;i++){
                spell9String+="<button class=\"collapsible\">"+wizardLvl9Spells[i]+"</button><div class=\"content\">";
                spell9String+=allSpells[wizardLvl9Spells[i]]['content'].join("<br>")+"</div><br><br>";
            }
            document.getElementsByClassName("mainContent")[9].innerHTML=spell9String;
        }
        
        
        
    }
        
}


/*hides or shows the proper collapsibles*/
function updateCollapsibles(baseClass, level){
    
    var coll = document.getElementsByClassName("mainCollapsible");
    
    
    //coll[0] is racial bonuses
    //coll[1]-[20] is level features
    //coll[21] is cantrips, and coll[22] onwards is spells levels 1-9
    
    //covers not-casters and casters with less than full progression
    for(var i=0;i<coll.length;i++){
        coll[i].style.display="none";
    }
    
    
    
        //fullcaster
        if(baseClass=="bard"||baseClass=="cleric"||baseClass=="druid"||baseClass=="sorcerer"||baseClass=="warlock"||baseClass=="wizard"){
            var maxSpellLevel = Math.ceil(level/2);
            
            //fix error when playing at level 19 or 20
            if(maxSpellLevel>9){
               maxSpellLevel=9;
            }
            
            //always show cantrips
            coll[21].style.display="inline";
            
            
            for(var i=1;i<=maxSpellLevel;i++){
                coll[21+i].style.display="inline";
            }
            
        }
        
        //half caster
        else if(baseClass=="paladin"||baseClass=="ranger"){
            var maxSpellLevel=0;
            if(level>=2){
               maxSpellLevel=1;
            }
            if(level>=5){
               maxSpellLevel=2;
            }
            if(level>=9){
                maxSpellLevel=3;
            }
            if(level>=13){
                maxSpellLevel=4;
            }
            if(level>=17){
                maxSpellLevel=5;
            }
            
            for(var i=1;i<=maxSpellLevel;i++){
                coll[21+i].style.display="inline";
            }
        }
    
    //handle class levels
    for(var i=0;i<level;i++){
        coll[i+1].style.display="inline";
    }
    
    //make racial bonuses button visible
    coll[0].style.display="inline";
        
    /*handles all of the buttons we added in js*/    
    
    var subColl = document.getElementsByClassName("collapsible");
    var j;

    for (j = 0; j < subColl.length; j++) {
        subColl[j].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } 
            else {
                content.style.display = "block";
            }
        });
         
    }
    
    
    
}
