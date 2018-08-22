
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








/*below are all fields that are empty when first loading the page, but will be filled with relevant info once the user has generated a character*/
var finalStatsPara = document.getElementById("final stats");

var finalClassPara = document.getElementById("final class");

var finalEquipmentPara = document.getElementById("final equipment");

var finalMagicItemsPara = document.getElementById("final magic items");

var finalSpellsPara = document.getElementById("final spells");

var proficiences = [];

var proficiency;

var level;



function generateChar(){
    
    var isMinStats = document.querySelector('input[name=stats]:checked').value;
    
    var charStats = generateStats(isMinStats);
    
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
    
    finalStatsPara.innerHTML=allStats;
    
    level = document.getElementById('level').value;
    if(level=="rand"){
        level=roll1d20();   
    }
    proficiency = getProficiency(level);
    
    

    
    
    /*the base class the user wants to play as*/
    baseClass = document.getElementById('baseclass').value;
    
    
    if(baseClass=="rand"){
        baseClass = generateClass();
    }
    
    finalClassPara.innerHTML=baseClass;  
    
    /*need this after assigning the base class when the base class is random, otherwise proficiences don't work*/
    addStatsToTable(charStats, baseClass);
    
    var hiddenList = document.getElementsByClassName("hidden");
    for(let val of hiddenList){
        val.style="display:inline";
    }
    
    
    document.getElementById("ac").innerHTML=findAC(baseClass, race, charStats[0], findScoreBonus(charStats[1]), findScoreBonus(charStats[2]), findScoreBonus(charStats[4]));
    
    document.getElementById("initiative").innerHTML=findInitiative(findScoreBonus(charStats[1]), baseClass, level, proficiency);
    document.getElementById("speed").innerHTML=findSpeed(race, baseClass, level);
    
    var health = findCharHealth(race, baseClass, level, findScoreBonus(charStats[2]));
    
    document.getElementById("health").innerHTML= health;
    document.getElementById("proficiency").innerHTML=proficiency;
    document.getElementById("passive perception").innerHTML=findPassivePerception(charStats[4]);
    
    document.getElementById("final race").innerHTML=race;
    document.getElementById("final level").innerHTML=level;
    
    var levelFeatures = [];
    levelFeatures.push(document.getElementById("lvl1"));
    levelFeatures.push(document.getElementById("lvl2"));
    levelFeatures.push(document.getElementById("lvl3"));
    levelFeatures.push(document.getElementById("lvl4"));
    levelFeatures.push(document.getElementById("lvl5"));
    levelFeatures.push(document.getElementById("lvl6"));
    levelFeatures.push(document.getElementById("lvl7"));
    levelFeatures.push(document.getElementById("lvl8"));
    levelFeatures.push(document.getElementById("lvl9"));
    levelFeatures.push(document.getElementById("lvl10"));
    levelFeatures.push(document.getElementById("lvl11"));
    levelFeatures.push(document.getElementById("lvl12"));
    levelFeatures.push(document.getElementById("lvl13"));
    levelFeatures.push(document.getElementById("lvl14"));
    levelFeatures.push(document.getElementById("lvl15"));
    levelFeatures.push(document.getElementById("lvl16"));
    levelFeatures.push(document.getElementById("lvl17"));
    levelFeatures.push(document.getElementById("lvl18"));
    levelFeatures.push(document.getElementById("lvl19"));
    levelFeatures.push(document.getElementById("lvl20"));
    
    resetLevelFeatures(levelFeatures);
    
    
    displayRace(race);
    displayClass(baseClass, level, levelFeatures);
}

function getProficiency(level){
    if(level=="rand"){
        level = roll1d20();   
    }
    
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
function addStatsToTable(arr, baseClass){
    addStrStats(arr, baseClass);
    addDexStats(arr, baseClass);
    addConStats(arr, baseClass);
    addIntStats(arr, baseClass);
    addWisStats(arr, baseClass);
    addChaStats(arr, baseClass);
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

function addStrStats(arr, baseClass){
    
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
    
    addSkillStyling(tableAthletics,bonus);
}

function addDexStats(arr, baseClass){
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
    
    addSkillStyling(tableAcrobatics,bonus);
    addSkillStyling(tableStealth,bonus);
    addSkillStyling(tableSleightOfHand,bonus);
}


function addConStats(arr, baseClass){
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


function addIntStats(arr, baseClass){
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
    
    addSkillStyling(tableArcana,bonus);
    addSkillStyling(tableNature,bonus);
    addSkillStyling(tableHistory,bonus);
    addSkillStyling(tableInvestigation,bonus);
    addSkillStyling(tableReligion,bonus);
}

function addWisStats(arr, baseClass){
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
    
    addSkillStyling(tableAnimalHandling,bonus);
    addSkillStyling(tableInsight,bonus);
    addSkillStyling(tableMedicine,bonus);
    addSkillStyling(tablePerception,bonus);
    addSkillStyling(tableSurvival,bonus);
}

function addChaStats(arr, baseClass){
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
    
    addSkillStyling(tablePerformance,bonus);
    addSkillStyling(tablePersuasion,bonus);
    addSkillStyling(tableIntimidation,bonus);
    addSkillStyling(tableDeception,bonus);
}

function generateStats(isMinStats){
    /*the way the user wants to roll for stats*/
    var statMethod = document.getElementById('stats').value;

    
    
    if(statMethod=='4'){
       return stats4d6(isMinStats);
        
    }
    else if(statMethod=='3'){
        return stats3d6(isMinStats);
    }
    else{
        return stats1d20(isMinStats);
    }
}

/*roll 4d6, and take away the lowest value. This function will be called 6 times if that's what the user chose*/
function roll4d6(){
    var a = roll1d6();
    var b = roll1d6();
    var c = roll1d6();
    var d = roll1d6();
    
    return a+b+c+d-Math.min(a,b,c,d);
}

/*roll 3d6*/
function roll3d6(){
    
    var a = roll1d6();
    var b = roll1d6();
    var c = roll1d6();
    return a+b+c;
}

/*generate a number 1-6*/
function roll1d6(){
    return Math.floor(Math.random()*6+1);
}

/*generate a number 1-20*/
function roll1d20(){
    return Math.floor(Math.random()*20+1);
}

/*calls 4d6 minus lowest for all 6 stats*/
function stats4d6(isMinStats){
    while(true){
        var myStats=[];

        for(var i=0;i<6;i++){
            myStats.push(roll4d6());   
        }

        /*if the user put a minimum in place, we want to respect that. Just like in real life, we completely re-roll our results. This still works even if the user does not enter a value for the lowest possible stat total*/
        if(isMinStats=="minimum"){
            var min = document.getElementById("min val").value;
            var total=0;
            for(var i=0;i<myStats.length;i++){
                total+=myStats[i];
            }
            if(total>=min){
               return myStats;
               }
        }

        else{
            return myStats;
        }
    }
}

/*calls 3d6 for all 6 stats*/
function stats3d6(isMinStats){
    while(true){
        var myStats=[];

        for(var i=0;i<6;i++){
            myStats.push(roll3d6());
        }

        if(isMinStats=="minimum"){
                var min = document.getElementById("min val").value;
                var total=0;
                for(var i=0;i<myStats.length;i++){
                    total+=myStats[i];
                }
                if(total>=min){
                   return myStats;
                   }
            }

        else{
            return myStats;
        }
        
    }
    
}

/*calls 1d20 for all 6 stats*/
function stats1d20(isMinStats){
    while(true){
        var myStats=[];
    
        for(var i=0;i<6;i++){
            myStats.push(roll1d20());
        }
        if(isMinStats=="minimum"){
            var min = document.getElementById("min val").value;
            var total=0;
            for(var i=0;i<myStats.length;i++){
                total+=myStats[i];
            }
            if(total>=min){
               return myStats;
               }
        }

        else{
            return myStats;
        }
    }
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

/*shows the input for the minimum stat total*/
function showMinBox(){
    var hiddenList = document.getElementsByClassName("hidden_stats");
    for(let val of hiddenList){
        val.style="display:inline";
    }
}

/*hides the input for the minimum stat total*/
function hideMinBox(){
    var hiddenList = document.getElementsByClassName("hidden_stats");
    for(let val of hiddenList){
        val.style="display:hidden";
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

/*calculates passive perception of the character, which is equal to 10 + its perception bonus*/
function findPassivePerception(wisdom){
    var bonus = findScoreBonus(wisdom);
    /*TODO - deal with proficiency, jack of all trades, and expertise!*/
    return 10 + bonus;
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
        return (13+dexMod)+" draconic resilience";   
    }
    
    /*must not wear armor to gain most class features*/
    if(charClass=="monk"){
       return (10+dexMod+wisMod) + " unarmored defense";
    }
    
    /*no armor prof*/
    if(charClass=="wizard"){
       return (10+dexMod) + " none";
    }
    
    /*light armor only*/
    if(charClass=="bard" || charClass=="warlock" || charClass=="rogue"){
       return (12+dexMod) + " studded leather";
    }
    
    /*medium and light proficiency*/
    if(charClass=="ranger" || charClass=="druid"){
        
        /*at max dex, they're the same, so we'll go with the light armor to avoid the stealth disadvantage*/
        if(dexMod==5){
            return 17 + " studded leather";
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
            return ac + " half plate";
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
           return unarmored+" unarmored defense";
        }
        
        /*we'll then prioritize light over medium to avoid the stealth disadvantage*/
        else if(light>=med){
           return light + " studded leather";
        }
        
        else{
            return med + " half plate";
        }
    }
    
    /*all other classes that can wear platemail*/
    else{
        
        /*we go through all 4 types of heavy armor to see if they're better/same as other armor types.*/
        if(str>=15 || race=="hilldwarf"){
            return 18 + " plate";
        }
        
        if((str>=17 || race=="hilldwarf") && dexMod<2){
            return 17 + " splint";   
        }
        
        if((str>=17 || race=="hilldwarf") && dexMod<1){
           return 16 + " chain mail";
        }
        
        
        if((str>=17 || race=="hilldwarf") && dexMod<0){
           return 16 + " ring mail";
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
           return light + " studded leather";
        }
        else{
            return med + " half plate";
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
        /*TODO - fix choosing any 2 other stats for +1*/
        
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
    
    /*Here we correct if any bonuses made a stat too high. For example, if the user chose to roll 1d20 for stats and rolled a 19 for Strength, then added the Dragonborn's strength bonus, rather than breaking the game by having a Strength of 21, the stat is lowered to 20.*/
    for(var i=0;i<charStats.length;i++){
        if(charStats[i]>20){
           charStats[i]=20;
        }
    }
    
    return charStats;
}

/*update an element of our HTLM depending on what race the user selected*/
function displayRace(race){
    var racePara = document.getElementById("racial bonuses");
    var raceText="";

    if(race=="hilldwarf"){
        raceText+=raceJSON['Races']['Dwarf']['Dwarf Traits']['content'].join("<br>")+"<br><br>";   
        raceText+=raceJSON['Races']['Dwarf']['Dwarf Traits']['Hill Dwarf']['content'].join("<br>");
        
    }
    else if(race=="highelf"){
        raceText=raceJSON['Races']['Elf']['Elf Traits']['content'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'].join("<br>");
    }
    else if(race=="lightfoothalfling"){
        raceText=raceJSON['Races']['Halfling']['Halfling Traits']['content'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'].join("<br>");   
    }
    else if(race=="human"){
        raceText=raceJSON['Races']['Human']['Human Traits']['content'].join("<br>");    
    }
    else if(race=="dragonborn"){
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][0]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][1]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][2]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][3]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][4]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][5]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][6]+"<br>";
        /*TODO fix table*/
        raceText+="<b>Dragon:</b><br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['<b>Dragon</b>'].join("<br>")+"<br>";
        raceText+="<b>Damage Type:</b><br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['<b>Damage Type</b>'].join("<br>")+"<br>";
        raceText+="<b>Breath Weapon:</b><br>"+raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['<b>Breath Weapon</b>'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][8]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][9]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][10]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][11]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][12]+"<br>";
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][13]+"<br>";
    }
    else if(race=="rockgnome"){
        raceText=raceJSON['Races']['Gnome']['Gnome Traits']['content'].join("<br>")+"<br><br>";
        raceText+=raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'].join("<br>");
    }
    else if(race=="halfelf"){
        raceText=raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'].join("<br>");    
    }
    else if(race=="halforc"){
        raceText=raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'].join("<br>");    
    }
    else{
        raceText=raceJSON['Races']['Tiefling']['Tiefling Traits']['content'].join("<br>");
    }
    racePara.innerHTML=raceText;
}


/*update an element of our HTML depending on what class the user selected, as well as level.*/
function displayClass(charClass, level, levelFeatures){
    var classPara = document.getElementById("class features");
    var classText="";
    
    /*fill in boilerplate with the class name*/
    var classSpan = document.getElementById("charClass");
    classSpan.innerHTML=charClass;
    
    var basicFeatures = document.getElementById("basic features");
    var basicFeaturesString = "";
    
    var lvl1Features = "<b>Level 1 features:</b><br><br>";
    var lvl1Element=levelFeatures[0];
    
    var lvl2Features= "<b>Level 2 features:</b><br><br>";
    var lvl2Element=levelFeatures[1];
    
    var lvl3Features= "<b>Level 3 features:</b><br><br>";
    var lvl3Element=levelFeatures[2];
    
    var lvl4Features= "<b>Level 4 features:</b><br><br>";
    var lvl4Element=levelFeatures[3];
    
    var lvl5Features= "<b>Level 5 features:</b><br><br>";
    var lvl5Element=levelFeatures[4];
    
    var lvl6Features= "<b>Level 6 features:</b><br><br>";
    var lvl6Element=levelFeatures[5];
    
    var lvl7Features= "<b>Level 7 features:</b><br><br>";
    var lvl7Element=levelFeatures[6];
    
    var lvl8Features= "<b>Level 8 features:</b><br><br>";
    var lvl8Element=levelFeatures[7];
    
    var lvl9Features= "<b>Level 9 features:</b><br><br>";
    var lvl9Element=levelFeatures[8];
    
    var lvl10Features= "<b>Level 10 features:</b><br><br>";
    var lvl10Element=levelFeatures[9];
    
    var lvl11Features = "<b>Level 11 features:</b><br><br>";
    var lvl11Element=levelFeatures[10];
    
    var lvl12Features= "<b>Level 12 features:</b><br><br>";
    var lvl12Element=levelFeatures[11];
    
    var lvl13Features= "<b>Level 13 features:</b><br><br>";
    var lvl13Element=levelFeatures[12];
    
    var lvl14Features= "<b>Level 14 features:</b><br><br>";
    var lvl14Element=levelFeatures[13];
    
    var lvl15Features= "<b>Level 15 features:</b><br><br>";
    var lvl15Element=levelFeatures[14];
    
    var lvl16Features= "<b>Level 16 features:</b><br><br>";
    var lvl16Element=levelFeatures[15];
    
    var lvl17Features= "<b>Level 17 features:</b><br><br>";
    var lvl17Element=levelFeatures[16];
    
    var lvl18Features= "<b>Level 18 features:</b><br><br>";
    var lvl18Element=levelFeatures[17];
    
    var lvl19Features= "<b>Level 19 features:</b><br><br>";
    var lvl19Element=levelFeatures[18];
    
    var lvl20Features= "<b>Level 20 features:</b><br><br>";
    var lvl20Element=levelFeatures[19];
    
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
        
        lvl1Features+="<b>Rage:</b><br>";
        lvl1Features+=classJSON['Barbarian']['Class Features']['Rage']['content'][0]+ "<br>";
        lvl1Features+=classJSON['Barbarian']['Class Features']['Rage']['content'][1]+ "<br>";  
        lvl1Features+=classJSON['Barbarian']['Class Features']['Rage']['content'][2].join(" ")+ "<br>";    
        lvl1Features+=classJSON['Barbarian']['Class Features']['Rage']['content'][3]+ "<br>";
        lvl1Features+=classJSON['Barbarian']['Class Features']['Rage']['content'][4]+ "<br>";
        lvl1Features+="<br><b>Unarmored Defense:</b><br>";
        lvl1Features+=classJSON['Barbarian']['Class Features']['Unarmored Defense'];
        
        lvl1Element.innerHTML=lvl1Features;
        
        
        if(level>=2){
            lvl2Features+="<b>Reckless Attack:</b><br>";
            lvl2Features+=classJSON['Barbarian']['Class Features']['Reckless Attack']+"<br><br>";
            
            lvl2Features+="<b>Danger Sense:</b><br>";
            lvl2Features+=classJSON['Barbarian']['Class Features']['Danger Sense']['content'].join("");
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Primal Path:</b><br>";
            lvl3Features+=classJSON['Barbarian']['Class Features']['Primal Path']+"<br><br>";
            
            lvl3Features+="<b>Path of the Berserker:</b><br>";
            lvl3Features+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['content']+"<br><br>";
            lvl3Features+="<b>Frenzy:</b><br>";
            lvl3Features+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Frenzy']+"<br>";
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        /*Since this is just an ASI, this covers levels 4, 8, 12, 16, and 19 for us.*/
        if(level>=4){
            lvl4Features+=classJSON['Barbarian']['Class Features']['Ability Score Improvement'];  
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Barbarian']['Class Features']['Extra Attack']+"<br><br>";
            lvl5Features+="<b>Fast Movement:</b><br>";
            lvl5Features+=classJSON['Barbarian']['Class Features']['Fast Movement'];
           
            lvl5Element.innerHTML=lvl5Features;
        }
        
        if(level>=6){
            lvl6Features+="<b>Mindless Rage:</b><br>";
            lvl6Features+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Mindless Rage'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=7){
            lvl7Features+="<b>Feral Instinct:</b><br>";
            lvl7Features+=classJSON['Barbarian']['Class Features']['Feral Instinct']['content'].join(" ");  
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*level 8 is an ASI, which we already covered*/
        
        /*Since barbarians have this same feature at level 13 and 17, it saves us from filling in those elements*/
        if(level>=9){
            lvl9Features+="<b>Brutal Critical:</b><br>";
            lvl9Features+=classJSON['Barbarian']['Class Features']['Brutal Critical']['content'].join(" ");
            
            lvl9Element.innerHTML=lvl9Features;
        }
        
        
        if(level>=10){
            lvl10Features+="<b>Intimidating Prescence:</b><br>";
            lvl10Features+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Intimidating Presence']['content'].join(" ");
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Relentless Rage:</b><br>";
            lvl11Features+=classText+=classJSON['Barbarian']['Class Features']['Relentless Rage']['content'].join(" "); ;
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*level 12 is an ASI, and level 13 is brutal critical again*/
        if(level>=14){
            lvl14Features+="<b>Retaliation:</b><br>";
            lvl14Features+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Retaliation'];
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Persistent Rage:</b><br>";
            lvl15Features+=classJSON['Barbarian']['Class Features']['Persistent Rage'];
            lvl15Element.innerHTML=lvl15Features;
        }
        
        /*17 is brutal crit again*/
        
        if(level>=18){
            lvl18Features+="<b>Indomitable Might:</b><br>";
            lvl18Features+=classJSON['Barbarian']['Class Features']['Indomitable Might']; 
            lvl18Element.innerHTML=lvl18Features;
        }
        
        /*19 is ASI*/
        
        if(level==20){
            lvl20Features+="<b>Primal Champion:</b><br>";
            lvl20Features+=classJSON['Barbarian']['Class Features']['Primal Champion']; 
            lvl20Element.innerHTML=lvl20Features;
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

        
        lvl1Features+="<b>Spellcasting:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['Cantrips'] + "<br><br>";
        lvl1Features+="<b>Spell Slots:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['Spell Slots']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"<br><br>";
        lvl1Features+="<b>Ritual Casting:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['Ritual Casting']+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Focus'];
        
        /*Bardic Inspiration covers parts of some levels, but completely covers level 15 for us.*/
        lvl1Features+=classJSON['Bard']['Class Features']['Bardic Inspiration']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Jack of All Trades:</b><br>";
            lvl2Features+=classJSON['Bard']['Class Features']['Jack of All Trades']+"<br><br>";
            lvl2Features+="<b>Song of Rest:</b><br>";
            lvl2Features+=classJSON['Bard']['Class Features']['Song of Rest']['content'].join(" ")+"<br>";
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Bard College:</b><br>";
            lvl3Features+=classJSON['Bard']['Class Features']['Bard College']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Expertise:</b><br>";
            lvl3Features+=classJSON['Bard']['Class Features']['Expertise']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>College of Lore:</b><br>";
            lvl3Features+=classJSON['Bard']['Class Features']['College of Lore']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Bonus Proficiences:</b><br>";
            lvl3Features+=classJSON['Bard']['Class Features']['College of Lore']['Bonus Proficiencies']+"<br><br>";
            lvl3Features+="<b>Cutting Words:</b><br>";
            lvl3Features+=classJSON['Bard']['Class Features']['College of Lore']['Cutting Words']+"<br><br>";
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        /*covers levels 4, 8, 12, 16, and 19*/
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Bard']['Class Features']['Ability Score Improvement'] + "<br>";
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Font of Inspiration:</b><br>";
            lvl5Features+=classJSON['Bard']['Class Features']['Font of Inspiration'] + "<br>";
            
            lvl5Element.innerHTML=lvl5Features;
            
        }
        
        if(level>=6){
            lvl6Features+="<b>Countercharm:</b><br>";
            lvl6Features+=classJSON['Bard']['Class Features']['Countercharm']+"<br><br>";
            lvl6Features+="<b>Additional Magical Secrets:</b><br>";
            lvl6Features+=classJSON['Bard']['Class Features']['College of Lore']['Additional Magical Secrets']+"<br>";
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        /*levels 7-9 are all previously defined feature improvements or just more spells*/
        if(level>=10){
            lvl10Features+="<b>Magical Secrets:</b><br>";
            lvl10Features+=classJSON['Bard']['Class Features']['Magical Secrets']['content'].join(" ")+"<br>";
            lvl10Element.innerHTML=lvl10Features;
        }
        
        /*levels 11-13 have no new features*/
        if(level>=14){
            lvl14Features+="<b>Peerless Skill:</b><br>";
            lvl14Features+=classJSON['Bard']['Class Features']['College of Lore']['Peerless Skill']+"<br>";
            
            lvl14.innerHTML=lvl14Features;
        }
        
        /*levels 13-19 hve no new features*/
        if(level==20){
            lvl20Features+=classJSON['Bard']['Class Features']['Superior Inspiration']+"<br>";
            
            lvl20Element.innerHTML=lvl20Features;
        }
        
        
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
        
        
        lvl1Features+="<b>Spellcasting:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Spellcasting']['Cantrips'] + "<br><br>";
        lvl1Features+="<b>Preparing and Casting Spells:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ");
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br><br>")+"<br><br>";
        lvl1Features+="<b>Ritual Casting:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Spellcasting']['Ritual Casting']+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Divine Domain:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Divine Domain']['content']+"<br><br>";
        lvl1Features+="<b>Domain Spells:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Divine Domain']['Domain Spells']['content'].join(" ")+"<br><br>";
        
        lvl1Features+="<b>Life Domain:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Life Domain']['content']+"<br><br>";
        
        /*TODO - fix spell tables*/
        lvl1Features+="<b>Cleric Level:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'].join(" ")+"<br>";
        lvl1Features+="<b>Spells:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'].join(" ")+"<br><br>";
        
        
        lvl1Features+="<b>Bonus Proficiency:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Life Domain']['Bonus Proficiency']+"<br><br>";
        lvl1Features+="<b>Disciple of Life:</b><br>";
        lvl1Features+=classJSON['Cleric']['Class Features']['Life Domain']['Disciple of Life'];
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Channel Divinity:</b><br>";
            lvl2Features+=classJSON['Cleric']['Class Features']['Channel Divinity']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Channel Divinity - Turn Undead:</b><br>";
            lvl2Features+=classJSON['Cleric']['Class Features']['Channel Divinity']['Channel Divinity: Turn Undead']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Channel Divinity - Preserve Life:</b><br>";
            lvl2Features+=classJSON['Cleric']['Class Features']['Life Domain']['Channel Divinity: Preserve Life']['content'].join(" ")+"<br><br>";
            lvl2Element.innerHTML=lvl2Features;
        }
        
        /*spells at 3*/
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Cleric']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Destroy Undead:</b><br>";
            lvl5Features+=classJSON['Cleric']['Class Features']['Destroy Undead']['content']+"<br><br>";
            
            /*TODO fix table*/
            lvl5Features+="<b>Destroy Undead Table:</b><br>";
            lvl5Features+=classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'].join(" "); 
            lvl5Features+=classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'].join("");
            lvl5Element.innerHTML=lvl5Features;
        }
        
        /*cleric features*/
        
        if(level>=6){
            lvl6Features+="<b>Blessed Healer:</b><br>";
            lvl6Features+=classJSON['Cleric']['Class Features']['Life Domain']['Blessed Healer'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        /*lvl 7 is spells*/
        if(level>=8){
            lvl8Features+="<b>Divine Strike:</b><br>";
            lvl8Features+=classJSON['Cleric']['Class Features']['Life Domain']['Divine Strike'];
            
            lvl8Element.innerHTML=lvl8Features;
        }
        
        if(level>=10){
            lvl10Features+="<b>Divine Intervention:</b><br>";
            lvl10Features+=classJSON['Cleric']['Class Features']['Divine Intervention']['content'].join(" ");
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        /*all other levels aside from 17 are already defined or more spells*/
        if(level>=17){
            lvl17Features+="<b>Supreme Healing:</b><br>";
            lvl17Features+=classJSON['Cleric']['Class Features']['Life Domain']['Supreme Healing'];
            
            lvl17Element.innerHTML=lvl17Features;
        }
        
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
        
        lvl1Features+="<b>Spellcasating:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Spellcasting']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Preparing and Casting Spells:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Ritual Casting:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Spellcasting']['Ritual Casting']+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Druidic</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Druidic']+"<br><br>";
        
        /*extra druid stuff*/
        lvl1Features+="<b>Sacred Plants and Wood:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Sacred Plants and Wood']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Druids and the Gods:</b><br>";
        lvl1Features+=classJSON['Druid']['Class Features']['Druids and the Gods'];
        
        
        lvl1Element.innerHTML=lvl1Features;
        
        
        if(level>=2){
            lvl2Features+="<b>Wild Shape:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Level:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'].join(" ")+"<br>";
            lvl2Features+="<b>Max CR:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'].join(" ")+"<br>";
            lvl2Features+="<b>Limitations:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'].join(" ")+"<br>";
            lvl2Features+="<b>Example:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'].join(" ")+"<br><br>";
            lvl2Features+="<b>Duration:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Duration']+"<br><br>";
            lvl2Features+="<b>Rules:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Rules']+"<br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['content']+"<br><br>";
            
            lvl2Features+="<b>Druid Circle:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Druid Circle']+"<br><br>";
            lvl2Features+="<b>Circle of the Land:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['content']+"<br><br>";
            lvl2Features+="<b>Bonus Cantrip:</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Bonus Cantrip']+"<br><br>";
            lvl2Features+="<b>Natural Recovery</b><br>";
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Natural Recovery']['content'].join(" ");
            
            /*TODO - table formatting*/
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['content'];
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'].join(" ");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'].join("");
            lvl2Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'].join(" ");
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        /*3rd level is spells*/
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Druid']['Class Features']['Ability Score Improvement'];  
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        /*level 5 is spells*/
        if(level>=6){
            lvl6Features+="<b>Land's Stride:</b><br>";
            lvl6Features+=classJSON['Druid']['Class Features']['Circle of the Land']["Lands Stride"]['content'].join(" ");
            lvl6Element.innerHTML=lvl6Features;
        }
        
        /*nothing new until level 10*/
        if(level>=10){
            lvl10Features+="<b>Nature's Ward:</b><br>";
            lvl10Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Natures Ward'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        /*nothing until level 14*/
        if(level>=14){
            lvl14Features+="<b>Nature's Sanctuary:</b><br>";
            lvl14Features+=classJSON['Druid']['Class Features']['Circle of the Land']['Natures Sanctuary']['content'].join(" ");
            lvl14Element.innerHTML=lvl14Features;
            
        }
        
        /*nothing until level 18*/
        if(level>=18){
            lvl18Features+="<b>Timeless Body:</b><br>";
            lvl18Features+=classJSON['Druid']['Class Features']['Timeless Body'] + "<br><br>";
            lvl18Features+="<b>Beast Spells:</b><br>";
            lvl18Features+=classJSON['Druid']['Class Features']['Beast Spells'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        
        /*nothing at 19*/
        
        if(level==20){
            lvl20Features+="<b>Archdruid:</b><br>";
            lvl20Features+=classJSON['Druid']['Class Features']['Archdruid']['content'].join(" ");
            
            lvl20Element.innerHTML=lvl20Features;
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
        
        lvl1Features+="<b>Fighting Style:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['content']+"<br><br>";
        lvl1Features+="<b>Archery:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['Archery']+"<br>";
        lvl1Features+="<b>Defense:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['Defense']+"<br>";
        lvl1Features+="<b>Dueling:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['Dueling']+"<br>";
        lvl1Features+="<b>Great Weapon Fighting:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['Great Weapon Fighting']+"<br>";
        lvl1Features+="<b>Protection:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['Protection']+"<br>";
        lvl1Features+="<b>Two-Weapon Fighting:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Fighting Style']['Two-Weapon Fighting']+"<br><br>";
        lvl1Features+="<b>Second Wind:</b><br>";
        lvl1Features+=classJSON['Fighter']['Class Features']['Second Wind']+"<br>";
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Action Surge:</b><br>";
            lvl2Features+=classJSON['Fighter']['Class Features']['Action Surge']['content'].join(" ");    
        }
        
        if(level>=3){
            lvl3Features+="<b>Martial Archetype:</b><br>";
            lvl3Features+=classJSON['Fighter']['Class Features']['Martial Archetype']+"<br><br>";
            lvl3Features+="<b>Martial Archetypes:</b><br>";
            lvl3Features+=classJSON['Fighter']['Martial Archetypes']['content']+"<br><br>";
            lvl3Features+="<b>Champion::</b><br>";
            lvl3Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['content']="<br><br>";
            lvl3Features+="<b>Improved Critical:</b><br>";
            lvl3Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Improved Critical'];
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Fighter']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Fighter']['Class Features']['Extra Attack']['content'].join("");
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        /*level 6 is ASI*/
        if(level>=7){
            lvl7Features+="<b>Remarkable Athlete:</b><br>";
            lvl7Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Remarkable Athlete']['content'].join(" ");
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        if(level>=9){
            lvl9Features+="<b>Indomitable:</b><br>";
            lvl9Features+=classJSON['Fighter']['Class Features']['Indomitable']['content'].join("");
            
            lvl9Element.innerHTML=lvl9Features;
        }
        
        if(level>=10){
            lvl10Features+="<b>Additional Fighting Style:</b><br>";
            lvl10Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Additional Fighting Style']; 
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Superior Critical:</b><br>";
            lvl15Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Superior Critical'];
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Survivor:</b><br>";
            lvl18Features+=classJSON['Fighter']['Martial Archetypes']['Champion']['Survivor'];
            
            lvl18Element.innerHTML=lvl18Features;
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
        
        
        lvl1Features+="<b>Unarmored Defense:</b><br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Unarmored Defense']+"<br><br>";
        lvl1Features+="<b>Martial Arts:</b><br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][0]+"<br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][1]+"<br>";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][2].join(" ")+" ";
        lvl1Features+=classJSON['Monk']['Class Features']['Martial Arts']['content'][3];
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Ki:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['content'].join(" ")+"<br>";
            lvl2Features+="<b>Flurry of Blows:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['Flurry of Blows']+"<br>";
            lvl2Features+="<b>Patient Defense:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['Patient Defense']+"<br>";
            lvl2Features+="<b>Step of the Wind:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Ki']['Step of the Wind']+"<br><br>";
            lvl2Features+="<b>Unarmored Movement:</b><br>";
            lvl2Features+=classJSON['Monk']['Class Features']['Unarmored Movement']['content'].join(" ");
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Deflect Missiles:</b><br>";
            lvl3Features+=classJSON['Monk']['Class Features']['Deflect Missiles']['content'].join(" ")+"<br><br>";
            
            lvl3Features+="<b>Monastic Tradition:</b><br>";
            lvl3Features+=classJSON['Monk']['Class Features']['Monastic Tradition']+"<br><br>";
            lvl3Features+="<b>Monastic Traditions:</b><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['content']+"<br><br>";
            lvl3Features+="<b>Way of the Open Hand:</b><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['content']+"<br><br>";
            lvl3Features+="<b>Open Hand Technique:</b><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'][0]+"<br><br>";
            lvl3Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'][1].join("<br>");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Monk']['Class Features']['Ability Score Improvement']+"<br><br>"; 
            lvl4Features+="<b>Slow Fall:</b><br>";
            lvl4Features+=classJSON['Monk']['Class Features']['Slow Fall'];
            lvl4Element.innerHTML=lvl4Features;
        }
        
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Monk']['Class Features']['Extra Attack']+"<br><br>";
            lvl5Features+="<b>Stunning Strike:</b><br>";
            lvl5Features+=classJSON['Monk']['Class Features']['Stunning Strike'];
            
            lvl5Element.innerHTML=lvl5Features;
            
        }
        
        if(level>=6){
            lvl6Features+="<b>Ki-Empowered Strikes:</b><br>";
            lvl6Features+=classJSON['Monk']['Class Features']['Ki-Empowered Strikes']+"<br><br>";
            lvl6Features+="<b>Wholeness of Body:</b><br>";
            lvl6Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Wholeness of Body'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=7){
            lvl7Features+="<b>Evasion:</b><br>";
            lvl7Features+=classJSON['Monk']['Class Features']['Evasion']+"<br><br>";
            lvl7Features+="<b>Stillness of Mind:</b><br>";
            lvl7Features+=classJSON['Monk']['Class Features']['Stillness of Mind'];
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*8 is ASI, 9 is improved unarmored movement*/
        if(level>=10){
            lvl10Features+="<b>Purity of Body:</b><br>";
            lvl10Features+=classJSON['Monk']['Class Features']['Purity of Body'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Tranquility:</b><br>";
            lvl11Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Tranquility'];
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI*/
        if(level>=13){
            lvl13Features+="<b>Tongue of the Sun and Moon:</b><br>";
            lvl13Features+=classJSON['Monk']['Class Features']['Tongue of the Sun and Moon'];
            
            lvl13Element.innerHTML=lvl13Features;
            
        }
        
        
        if(level>=14){
            lvl14Features+="<b>Diamond Soul:</b><br>";
            lvl14Features+=classJSON['Monk']['Class Features']['Diamond Soul']['content'].join(" ");
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Timeless Body:</b><br>";
            lvl15Features+=classJSON['Monk']['Class Features']['Timeless Body'];
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        /*16 is ASI*/
        if(level>=17){
            lvl17Features+="<b>Quivering Palm:</b><br>";
            lvl17Features+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Quivering Palm']['content'].join(" "); 
            
            lvl17Element.innerHTML=lvl17Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Empty Body:</b><br>";
            lvl18Features+=classJSON['Monk']['Class Features']['Empty Body']['content'].join(" ");
            
            lvl18Element.innerHTML=lvl18Features;
            
        }
        
        /*19 is ASI*/
        
        if(level>=20){
            lvl20Features+="<b>Perfect Self:</b><br>";
            lvl20Features+=classJSON['Monk']['Class Features']['Perfect Self'];
            
            lvl20Element.innerHTML=lvl20Features;
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
        
        basicFeatures+=classJSON['Paladin']['Sacred Oaths']['Breaking Your Oath']['content'];

        basicFeatures.innerHTML=basicFeaturesString;
        
        
        lvl1Features+="<b>Divine Sense:</b><br>";
        lvl1Features+=classJSON['Paladin']['Class Features']['Divine Sense']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Lay on Hands:</b><br>";
        lvl1Features+=classJSON['Paladin']['Class Features']['Lay on Hands']['content'].join(" ");
        
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Fighting Style:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['content']+"<br>";
            lvl2Features+="<b>Defense:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Defense']+"<br>";
            lvl2Features+="<b>Dueling:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Dueling']+"<br>";
            lvl2Features+="<b>Great Weapon Fighting:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Great Weapon Fighting']+"<br>";
            lvl2Features+="<b>Protection:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Fighting Style']['Protection']+"<br><br>";
            lvl2Features+="<b>Spellcasting:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['content']+"<br><br>";
            lvl2Features+="<b>Preparing and Casting Spells:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Spellcasting Ability:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Spellcasting Focus:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
            lvl2Features+="<b>Divine Smite:</b><br>";
            lvl2Features+=classJSON['Paladin']['Class Features']['Divine Smite'];
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        
        if(level>=3){
            lvl3Features+="<b>Divine Health:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Divine Health']+"<br><br>";
            lvl3Features+="<b>Sacred Oath:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Sacred Oath']['content']+"<br><br>";
            lvl3Features+="<b>Oath Spells:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Sacred Oath']['Oath Spells']['content']+"<br><br>";
            lvl3Features+="<b>Channel Divinity:</b><br>";
            lvl3Features+=classJSON['Paladin']['Class Features']['Sacred Oath']['Channel Divinity']['content']+"<br><br>";
            lvl3Features+="<b>Sacred Oaths:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['content']+"<br><br>";
            lvl3Features+="<b>Oath of Devotion:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['content']+"<br><br>";
            lvl3Features+="<b>Tenets of Devotion:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Tenets of Devotion']['content'].join("<br>")+"<br><br>";
            lvl3Features+="<b>Oath Spells:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['content']+"<br><br>";
            lvl3Features+="<b>Level:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level']+"<br>";
            lvl3Features+="<b>Paladin Spells:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells']+"<br><br>";
            lvl3Features+="<b>Channel Divinity:</b><br>";
            lvl3Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Channel Divinity']['content'].join("<br>");  
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Abililty Score Improvement:</b><br>";
            lvl4Features+=classJSON['Paladin']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Paladin']['Class Features']['Extra Attack'];
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        if(level>=6){
            lvl6Features+="<b>Aura of Protection:</b><br>";
            lvl6Features+=classJSON['Paladin']['Class Features']['Aura of Protection']['content'].join(" ");
            
            lvl6Element.innerHTML=lvl6Features;
            
        }
        
        if(level>=7){
            lvl7Features+="<b>Aura of Devotion:</b><br>";
            lvl7Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Aura of Devotion']['content'].join(" ");
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*8 is ASI, 9 is spells*/
        
        if(level>=10){
            lvl10Features+="<b>Aura of Courage:</b><br>";
            lvl10Features+=classJSON['Paladin']['Class Features']['Aura of Courage']['content'].join(" ");
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Improved Divine Smite:</b><br>";
            lvl11Features+=classJSON['Paladin']['Class Features']['Improved Divine Smite'];
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI, 13 is spells*/
        
        if(level>=14){
            lvl14Features+="<b>Cleansing Touch:</b><br>";
            lvl14Features+=classJSON['Paladin']['Class Features']['Cleansing Touch']['content'].join(" ");    
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Purity of Spirit:</b><br>";
            lvl15Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Purity of Spirit'];
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Holy Nimbus:</b><br>";
            lvl20Features+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Holy Nimbus']['content'].join(" ");
            
            lvl20Element.innerHTML=lvl20Features;
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
        
        lvl1Features+="<b>Favored Enemy:</b><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Favored Enemy']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Natural Explorer:</b><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][0]+" ";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][1]+"<br><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][2].join("<br>")+"<br><br>";
        lvl1Features+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'][3];
        
        lvl1Element.innerHTML=lvl1Features;
        
        /*core ranger class - SRD, not the Revised Ranger UA*/
        
        if(level>=2){
            lvl2Features+="<b>Fighting Style:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['content']+"<br>";
            lvl2Features+="<b>Archery:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Archery']+"<br>";
            lvl2Features+="<b>Defense:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Defense']+"<br>";
            lvl2Features+="<b>Dueling:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Dueling']+"<br>";
            lvl2Features+="<b>Two-Weapon Fighting:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Fighting Style']['Two-Weapon Fighting']+"<br><br>";
            lvl2Features+="<b>Spellcasting:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Spellcasting']['content']+"<br><br>";
            lvl2Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ");
            lvl2Features+="<b>Spellcasting Ability:</b><br>";
            lvl2Features+=classJSON['Ranger']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>");

            lvl2Element.innerHTML=lvl2Features;
            
        }
        
        if(level>=3){
            lvl3Features+="<b>Ranger Archetype:</b><br>";
            lvl3Features+=classJSON['Ranger']['Class Features']['Ranger Archetype']+"<br><br>";
            lvl3Features+="<b>Primeval Awareness:</b><br>";
            lvl3Features+=classJSON['Ranger']['Class Features']['Primeval Awareness']+"<br><br>";
            lvl3Features+="<b>Ranger Archetypes:</b><br>";
            lvl3Features+=classJSON['Ranger']['Ranger Archetypes']['content']+"<br><br>";
            lvl3Features+="<b>Hunter:</b><br>";
            lvl3Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['content']+"<br><br>";
            lvl3Features+="<b>Hunter's Prey:</b><br>";
            lvl3Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Hunters Prey']['content'].join("<br>");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>"
            lvl4Features+=classJSON['Ranger']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Extra Attack:</b><br>";
            lvl5Features+=classJSON['Ranger']['Class Features']['Extra Attack'];
            
            lvl5Element.innerHTML=lvl5Features;
            
        }
        
        /*level 6 is improvements on previously defined features.*/
        if(level>=7){
            lvl7Features+="<b>Defensive Tactics:</b><br>";
            lvl7Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Defensive Tactics']['content'].join("<br>");
            lvl7Element.innerHTML=lvl7Features;
        }
        
        if(level>=8){
            lvl8Features+="<b>Land's Stride:</b><br>";
            lvl8Features+=classJSON['Ranger']['Class Features']['Lands Stride']['content'].join(" ");
            
            lvl8Element.innerHTML=lvl8Features;
        }
        
        /*9 is spells*/
        
        if(level>=10){
            lvl10Features+="<b></b><br>";
            lvl10Features+=classJSON['Ranger']['Class Features']['Hide in Plain Sight']['content'].join(" ");
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b></b><br>";
            lvl11Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Multiattack']['content'].join("<br>");
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI, 13 is spells*/
        if(level>=14){
            lvl14Features+="<b>Vanish:</b><br>";
            lvl14Features+=classJSON['Ranger']['Class Features']['Vanish'];
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Superior Hunter's Defense:</b><br>";
            lvl15Features+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Superior Hunters Defense']['content'];
        }
        
        /*16 is ASI, 17 is spells*/
        
        if(level>=18){
            lvl18Features+="<b>Feral Senses:</b><br>";
            lvl18Features+=classJSON['Ranger']['Class Features']['Feral Senses']['content'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        /*19 is ASI*/
        
        if(level==20){
            lvl20Features+="<b>Foe Slayer:</b><br>";
            lvl20Features+=classJSON['Ranger']['Class Features']['Foe Slayer'];
            
            lvl20Element.innerHTML=lvl20Features;
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
        
        
        lvl1Features+="<b>Expertise:</b><br>";
        lvl1Features+=classJSON['Rogue']['Class Features']['Expertise']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Sneak Attack:</b><br>";
        lvl1Features+=classJSON['Rogue']['Class Features']['Sneak Attack']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Thieves' Cant:</b><br>";
        lvl1Features+=classJSON['Rogue']['Class Features']['Thieves Cant']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Cunning Action:</b><br>";
            lvl2Features+=classJSON['Rogue']['Class Features']['Cunning Action'];
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Roguish Archetype:</b><br>";
            lvl3Features+=classJSON['Rogue']['Class Features']['Roguish Archetype']+"<br><br>";
            lvl3Features+="<b>Roguish Archetypes:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['content']+"<br><br>";
            lvl3Features+="<b>Thief:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['content']+"<br><br>";
            lvl3Features+="<b>Fast Hands:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Fast Hands']+"<br><br>";
            lvl3Features+="<b>Second-Story Work:</b><br>";
            lvl3Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Second-Story Work']['content'].join(" ");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Rogue']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Uncanny Dodge:</b><br>"
            lvl5Features+=classJSON['Rogue']['Class Features']['Uncanny Dodge'];
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        /*6 is more expertise*/
        
        if(level>=7){
            lvl7Features+="<b>Evasion:</b><br>";
            lvl7Features+=classJSON['Rogue']['Class Features']['Evasion'];
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        /*8 is ASI*/

        if(level>=9){
            lvl9Features+="<b>Supreme Sneak:</b><br>";
            lvl9Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Supreme Sneak'];
            
            lvl9Element.innerHTML=lvl9Features;
        }
        
        /*10 is another ASI*/
        
        if(level>=11){
            lvl11Features+="<b>Reliable Talent:</b><br>";
            lvl11Features+=classJSON['Rogue']['Class Features']['Reliable Talent'];
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        /*12 is ASI*/
        
        if(level>=13){
            lvl13Features+="<b>Use Magic Device:</b><br>";
            lvl13Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Use Magic Device'];
            
            lvl13Element.innerHTML=lvl13Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Blindsense:</b><br>";
            lvl14Features+=classJSON['Rogue']['Class Features']['Blindsense'];
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Slippery Mind:</b><br>";
            lvl15Features+=classJSON['Rogue']['Class Features']['Slippery Mind']+"<br><br>";
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        /*16 is ASI*/
        
        if(level>=17){
            lvl17Features+="<b>Thief's Reflexes:</b><br>";
            lvl17Features+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Thiefs Reflexes']+"<br><br>";
            
            lvl17Element.innerHTML=lvl17Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Elusive:</b><br>";
            lvl18Features+=classJSON['Rogue']['Class Features']['Elusive'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        /*19 is ASI*/
        
        if(level==20){
            lvl20Features+="<b>Stroke of Luck:</b><br>";
            lvl20Features+=classJSON['Rogue']['Class Features']['Stroke of Luck']['content'].join(" ");
            
            lvl20Element.innerHTML=lvl20Features;
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
        
        lvl1Features+="<b>Spellcasting:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Spell Slots:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spell Slots']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Sorcerous Origin:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Class Features']['Sorcerous Origin']['content']+"<br><br>";
        
        /*sorcerer sub class*/
        lvl1Features+="<b>Sorcererous Origins:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['content']+"<br><br>";
        lvl1Features+="<b>Draconic Bloodline:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['content']+"<br><br>";
        lvl1Features+="<b>Dragon Ancestor:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['content']+"<br><br>";
        lvl1Features+="<b>Dragon:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'].join(" ")+"<br>";
        lvl1Features+="<b>Damage Type:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'].join(" ")+"<br><br>";
        lvl1Features+="<b>Draconic Ancestry:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][1]+"<br><br>";
        lvl1Features+="<b>Draconic Resilience:</b><br>";
        lvl1Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Resilience']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        
        
        if(level>=2){
            lvl2Features+="<b>Font of Magic:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['content']+"<br><br>";
            lvl2Features+="<b>Sorcery Points:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Sorcery Points']+"<br><br>";
            lvl2Features+="<b>Flexible Casting:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Spell Slot Level:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Spell Slot Level'].join(" ")+"<br>";
            lvl2Features+="<b>Sorcery Point Cost:</b><br>";
            lvl2Features+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'].join(" ");
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Metamagic:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Careful Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Careful Spell']+"<br>";
            lvl3Features+="<b>Distant Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Distant Spell']['content'].join(" ")+"<br>";
            lvl3Features+="<b>Empowered Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Empowered Spell']['content'].join(" ")+"<br>";
            lvl3Features+="<b>Extended Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Extended Spell']+"<br>";
            lvl3Features+="<b>Heightened Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Heightened Spell']+"<br>";
            lvl3Features+="<b>Quickened Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Quickened Spell']+"<br>";
            lvl3Features+="<b>Subtle Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Subtle Spell']+"<br>";
            lvl3Features+="<b>Twinned Spell:</b><br>";
            lvl3Features+=classJSON['Sorcerer']['Class Features']['Metamagic']['Twinned Spell']['content'].join(" ");

            lvl3Element.innerHTML=lvl3Features;
            
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Sorcerer']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        /*all not noted levels are improvements, spells, or ASIs*/
        
        if(level>=6){
            lvl6Features+="<b>Elemental Affinity:</b><br>";
            lvl6Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Elemental Affinity'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Dragon Wings:</b><br>";
            lvl14Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Wings']['content']; 
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Dracoinc Presence:</b><br>";
            lvl18Features+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Presence'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Sorcerous Restoration:</b><br>";
            lvl20Features+=classJSON['Sorcerer']['Class Features']['Sorcerous Restoration'];
            
            lvl20Element.innerHTML=lvl20Features;
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
        
        
        lvl1Features+="<b>Pact Magic:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Spell Slots:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spell Slots']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spells Known of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spells Known of 1st Level and Higher']['content']+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Otherworldly Patron:</b><br>";
        lvl1Features+=classJSON['Warlock']['Class Features']['Otherworldly Patron']+"<br><br>";
        
        /*patron*/
        lvl1Features+="<b>Otherworldly Patrons:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['content']+"<br><br>";
        lvl1Features+="<b>The Fiend:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['content']+"<br><br>";
        lvl1Features+="<b>Expanded Spell List:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['content']+"<br><br>";
        lvl1Features+="<b>Spell Level:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level']+"<br><br>";
        lvl1Features+="<b>Spells:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'].join(" ")+"<br><br>";
        lvl1Features+="<b>Dark One's Blessing:</b><br>";
        lvl1Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Blessing'];
        
        
        
        lvl1Element.innerHTML=lvl1Features;
        
        
        if(level>=2){
            lvl2Features+="<b>Eldritch Invocations:</b><br>";
            lvl2Features+=classJSON['Warlock']['Class Features']['Eldritch Invocations']['content'].join(" ")+"<br><br>";
            
            
            lvl2Features+="<b>Agonizing Blast:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Agonizing Blast']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Armor of Shadows:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Armor of Shadows']+"<br><br>";
            lvl2Features+="<b>Beast Speech:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Beast Speech']+"<br><br>";
            lvl2Features+="<b>Beguiling Influence:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Beguiling Influence']+"<br><br>";
            lvl2Features+="<b>Book of Ancient Secrets:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Book of Ancient Secrets']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Devil's Sight:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Devils Sight']+"<br><br>";
            lvl2Features+="<b>Eldritch Sight:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Eldritch Sight']+"<br><br>";
            lvl2Features+="<b>Eldritch Spear:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Eldritch Spear']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Eyes of the Rune Keeper:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Eyes of the Rune Keeper']+"<br><br>";
            lvl2Features+="<b>Fiendish Vigor:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Fiendish Vigor']+"<br><br>";
            lvl2Features+="<b>Gaze of Two Minds:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Gaze of Two Minds']+"<br><br>";
            lvl2Features+="<b>Mask of Many Faces:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Mask of Many Faces']+"<br><br>";
            lvl2Features+="<b>Misty Visions:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Misty Visions']+"<br><br>";
            lvl2Features+="<b>Repelling Blast:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Repelling Blast']['content'].join("<br>")+"<br><br>";
            lvl2Features+="<b>Thief of Five Fates:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Thief of Five Fates']+"<br><br>";
            lvl2Features+="<b>Voice of the Chain Master:</b><br>";
            lvl2Features+=classJSON['Warlock']['Eldritch Invocations']['Voice of the Chain Master']['content']+"<br><br>";
            
            

            
            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        if(level>=3){
            lvl3Features+="<b>Pact Boon:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['content']+"<br><br>";
            lvl3Features+="<b>Pact of the Chain:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Chain']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Pact of the Blade:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Blade']['content'].join(" ")+"<br><br>";
            lvl3Features+="<b>Pact of the Tome:</b><br>";
            lvl3Features+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Tome']['content'].join(" ")+"<br><br>";
            
            /*extra stuff on pacts*/
            lvl3Features+="<b>Your Pact Boon:</b><br>";
            lvl3Features+=classJSON['Warlock']['Otherworldly Patrons']['Your Pact Boon']['content'].join("<br><br>");
            
            lvl3Element.innerHTML=lvl3Features;
        }
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Warlock']['Class Features']['Ability Score Improvement'];
        
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=5){
            lvl5Features+="<b>Invocations:</b><br><br>";
            lvl5Features+="<b>Mire the Mind:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['Mire the Mind']['content'].join("<br>")+"<br><br>";
            lvl5Features+="<b>One With Shadows:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['One with Shadows']['content'].join("<br>")+"<br><br>";
            lvl5Features+="<b>Sign of Ill Omen:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['Sign of Ill Omen']['content'].join("<br>")+"<br><br>";
            lvl5Features+="<b>Thirsting Blade:</b><br>";
            lvl5Features+=classJSON['Warlock']['Eldritch Invocations']['Thirsting Blade']['content'].join("<br>");
            
            lvl5Element.innerHTML=lvl5Features;
        }
        
        
        /*all not listed levels are spells, ASI, or invocations*/
        if(level>=6){
            lvl6Features+="<b>Dark One's Own Luck:</b><br>";
            lvl6Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Own Luck']['content'].join(" ");
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=7){
            lvl7Features+="<b>Invocations:</b><br><br>";
            lvl7Features+="<b>Bewitching Whispers:</b><br>";
            lvl7Features+=classJSON['Warlock']['Eldritch Invocations']['Bewitching Whispers']['content'].join("<br>")+"<br><br>";
            lvl7Features+="<b>Dreadful Word:</b><br>";
            lvl7Features+=classJSON['Warlock']['Eldritch Invocations']['Dreadful Word']['content'].join("<br>")+"<br><br>";
            lvl7Features+="<b>Sculptor of Flesh:</b><br>";
            lvl7Features+=classJSON['Warlock']['Eldritch Invocations']['Sculptor of Flesh']['content'].join("<br>")+"<br><br>";
            
            lvl7Element.innerHTML=lvl7Features;
        }
        
        if(level>=9){
            lvl9Features+="<b>Invocations:</b><br><br>";
            lvl9Features+="<b>Ascendant Step:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Ascendant Step']['content'].join("<br>")+"<br><br>";
            lvl9Features+="<b>Minions of Chaos:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Minions of Chaos']['content'].join("<br>")+"<br><br>";
            lvl9Features+="<b>Otherworldly Leap:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Otherworldly Leap']['content'].join("<br>")+"<br><br>";
            lvl9Features+="<b>Whispers of the Grave:</b><br>";
            lvl9Features+=classJSON['Warlock']['Eldritch Invocations']['Whispers of the Grave']['content'].join("<br>")+"<br><br>";
            
            lvl9Element.innerHTML=lvl9Features;
        }
        
        if(level>=10){
            lvl10Features+="<b>Fiendish Resilience:</b><br>";
            lvl10Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Fiendish Resilience'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=11){
            lvl11Features+="<b>Mystic Arcanum:</b><br>";
            lvl11Features+=classJSON['Warlock']['Class Features']['Mystic Arcanum']['content'].join(" ");
            
            lvl11Element.innerHTML=lvl11Features;
        }
        
        if(level>=12){
            lvl12Features+="<b>Invocations:</b><br><br>";
            lvl12Features+="<b>Lifedrinker:</b><br>";
            lvl12Features+=classJSON['Warlock']['Eldritch Invocations']['Lifedrinker']['content'].join("<br>");
            
            lvl12Element.innerHTML=lvl12Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Hurl Through Hell:</b><br>";
            lvl14Features+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Hurl Through Hell']['content'].join(" ");
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=15){
            lvl15Features+="<b>Invocations:</b><br><br>";
            lvl15Features+="<b>Chains of Carceri:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Chains of Carceri']['content'].join("<br>")+"<br><br>";
            lvl15Features+="<b>Master of Myriad Form:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Master of Myriad Forms']['content'].join("<br>")+"<br><br>";
            lvl15Features+="<b>Visions of Distant Realms:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Visions of Distant Realms']['content'].join("<br>")+"<br><br>";
            lvl15Features+="<b>Witch Sight:</b><br>";
            lvl15Features+=classJSON['Warlock']['Eldritch Invocations']['Witch Sight']['content'].join("<br>");
            
            lvl15Element.innerHTML=lvl15Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Eldritch Master:</b><br>";
            lvl20Features+=classJSON['Warlock']['Class Features']['Eldritch Master'];
            
            lvl20Element.innerHTML=lvl20Features;
        }
        

        
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
        
        
        lvl1Features+="<b>Spellcasting:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['content']+"<br><br>";
        lvl1Features+="<b>Cantrips:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Cantrips']+"<br><br>";
        lvl1Features+="<b>Spellbook:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellbook']+"<br><br>";
        lvl1Features+="<b>Preparing and Casting Spells:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join(" ")+"<br><br>";
        lvl1Features+="<b>Spellcasting Ability:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("<br>")+"<br><br>";
        lvl1Features+="<b>Ritual Casting:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Ritual Casting']+"<br><br>";
        lvl1Features+="<b>Spellcasting Focus:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Focus']+"<br><br>";
        lvl1Features+="<b>Learning Spells of 1st Level and Higher:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Spellcasting']['Learning Spells of 1st Level and Higher']+"<br><br>";
        lvl1Features+="<b>Arcane Recovery:</b><br>";
        lvl1Features+=classJSON['Wizard']['Class Features']['Arcane Recovery']['content'].join(" ")+"<br><br>";
        
        /*extra wizard fluff*/
        lvl1Features+=classJSON['Wizard']['Arcane Traditions']['Your Spellbook']['content'].join(" ");
        
        lvl1Element.innerHTML=lvl1Features;
        
        if(level>=2){
            lvl2Features+="<b>Arcane Tradition:</b><br>";
            lvl2Features+=classJSON['Wizard']['Class Features']['Arcane Tradition']['content'].join(" ")+"<br><br>";
            lvl2Features+="<b>Arcane Traditions:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['content']+"<br><br>";
            lvl2Features+="<b>School of Evocation:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['content']+"<br><br>";
            lvl2Features+="<b>Evocation Savant:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Evocation Savant']+"<br><br>";
            lvl2Features+="<b>Sculpt Spells:</b><br>";
            lvl2Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Sculpt Spells']+"<br><br>";

            
            lvl2Element.innerHTML=lvl2Features;
        }
        
        /*every not listed level is spells or ASIs*/
        
        if(level>=4){
            lvl4Features+="<b>Ability Score Improvement:</b><br>";
            lvl4Features+=classJSON['Wizard']['Class Features']['Ability Score Improvement'];
            
            lvl4Element.innerHTML=lvl4Features;
        }
        
        if(level>=6){
            lvl6Features+="<b>Potent Cantrip:</b><br>";
            lvl6Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Potent Cantrip'];
            
            lvl6Element.innerHTML=lvl6Features;
        }
        
        if(level>=10){
            lvl10Features+="<b>Empowred Evocation:</b><br>";
            lvl10Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Empowered Evocation'];
            
            lvl10Element.innerHTML=lvl10Features;
        }
        
        if(level>=14){
            lvl14Features+="<b>Overchannel:</b><br>";
            lvl14Features+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Overchannel']['content'].join(" ");
            
            lvl14Element.innerHTML=lvl14Features;
        }
        
        if(level>=18){
            lvl18Features+="<b>Spell Mastery:</b><br>";
            lvl18Features+=classJSON['Wizard']['Class Features']['Spell Mastery']['content'];
            
            lvl18Element.innerHTML=lvl18Features;
        }
        
        if(level==20){
            lvl20Features+="<b>Signature Spells:</b><br>";
            lvl20Features+=classJSON['Wizard']['Class Features']['Signature Spells']['content'];
            
            lvl20Element.innerHTML=lvl20Features;
        }

    }
    
    classPara.innerHTML=classText;
}


function resetLevelFeatures(arr){
    for(var i=0;i<arr.length;i++){
        arr[i].innerHTML="";
    }
}