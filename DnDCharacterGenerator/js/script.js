
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
    
    displayRace(race);
    displayClass(baseClass);
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
        raceText+=raceJSON['Races']['Dwarf']['Dwarf Traits']['content'].join("") + " ";   
        raceText+=raceJSON['Races']['Dwarf']['Dwarf Traits']['Hill Dwarf']['content'].join("");
        
    }
    else if(race=="highelf"){
        raceText=raceJSON['Races']['Elf']['Elf Traits']['content'].join("") + " ";
        raceText+=raceJSON['Races']['Elf']['Elf Traits']['High Elf']['content'].join("");
    }
    else if(race=="lightfoothalfling"){
        raceText=raceJSON['Races']['Halfling']['Halfling Traits']['content'].join("") + " ";
        raceText+=raceJSON['Races']['Halfling']['Halfling Traits']['Lightfoot']['content'].join("");   
    }
    else if(race=="human"){
        raceText=raceJSON['Races']['Human']['Human Traits']['content'].join("");    
    }
    else if(race=="dragonborn"){
        raceText=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'].join("");
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['**Dragon**'];
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['**Damage Type**'];
        raceText+=raceJSON['Races']['Dragonborn']['Dragonborn Traits']['content'][7]['table']['**Breath Weapon**'];
    }
    else if(race=="rockgnome"){
        raceText=raceJSON['Races']['Gnome']['Gnome Traits']['content'].join("") + " ";
        raceText+=raceJSON['Races']['Gnome']['Gnome Traits']['Rock Gnome']['content'].join("");
    }
    else if(race=="halfelf"){
        raceText=raceJSON['Races']['Half-Elf']['Half-Elf Traits']['content'].join("");    
    }
    else if(race=="halforc"){
        raceText=raceJSON['Races']['Half-Orc']['Half-Orc Traits']['content'].join("");    
    }
    else{
        raceText=raceJSON['Races']['Tiefling']['Tiefling Traits']['content'].join("");
    }
    racePara.innerHTML=raceText;
}


/*update an element of our HTML depending on what class the user selected*/
function displayClass(charClass){
    var classPara = document.getElementById("class features");
    var classText="";
    
    if(charClass=="barbarian"){
        
        /*base barb class features*/
        classText+=classJSON['Barbarian']['Class Features']['content'];   
        classText+=classJSON['Barbarian']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Barbarian']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Barbarian']['Class Features']['Equipment']['content'].join("");   
        classText+=classJSON['Barbarian']['Class Features']['Unarmored Defense'];
        classText+=classJSON['Barbarian']['Class Features']['Reckless Attack'];
        classText+=classJSON['Barbarian']['Class Features']['Danger Sense']['content'].join("");
        classText+=classJSON['Barbarian']['Class Features']['Primal Path'];
        classText+=classJSON['Barbarian']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Barbarian']['Class Features']['Extra Attack'];
        classText+=classJSON['Barbarian']['Class Features']['Fast Movement'];
        classText+=classJSON['Barbarian']['Class Features']['Feral Instinct']['content'].join(""); 
        classText+=classJSON['Barbarian']['Class Features']['Brutal Critical']['content'].join(""); 
        classText+=classJSON['Barbarian']['Class Features']['Relentless Rage']['content'].join(""); 
        classText+=classJSON['Barbarian']['Class Features']['Persistent Rage']; 
        classText+=classJSON['Barbarian']['Class Features']['Indomitable Might']; 
        classText+=classJSON['Barbarian']['Class Features']['Primal Champion']; 
        
        /*berserker subclass features*/
        classText+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['content'];
        classText+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Frenzy'];
        classText+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Mindless Rage'];
        classText+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Intimidating Presence']['content'].join("");
        classText+=classJSON['Barbarian']['Class Features']['Path of the Berserker']['Retaliation'];
    }
    else if(charClass=="bard"){
        /*core bard features*/
        classText+=classJSON['Bard']['Class Features']['content'];   
        classText+=classJSON['Bard']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Bard']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['Cantrips'];
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['Spell Slots']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['Ritual Casting'];
        classText+=classJSON['Bard']['Class Features']['Spellcasting']['Spellcasting Focus'];
        classText+=classJSON['Bard']['Class Features']['Bardic Inspiration']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Jack of All Trades'];
        classText+=classJSON['Bard']['Class Features']['Song of Rest']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Bard College']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Expertise']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Bard']['Class Features']['Font of Inspiration'];
        classText+=classJSON['Bard']['Class Features']['Countercharm'];
        classText+=classJSON['Bard']['Class Features']['Magical Secrets']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['Superior Inspiration'];
        
        /*Bard subclass*/
        classText+=classJSON['Bard']['Class Features']['College of Lore']['content'].join("");
        classText+=classJSON['Bard']['Class Features']['College of Lore']['Bonus Proficiencies'];
        classText+=classJSON['Bard']['Class Features']['College of Lore']['Cutting Words'];
        classText+=classJSON['Bard']['Class Features']['College of Lore']['Additional Magic Secrets'];
        classText+=classJSON['Bard']['Class Features']['College of Lore']['Peerless Skill'];
    }
    else if(charClass=="cleric"){
        
        /*cleric features*/
        classText+=classJSON['Cleric']['Class Features']['content'];   
        classText+=classJSON['Cleric']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Cleric']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Spellcasting']['content'];
        classText+=classJSON['Cleric']['Class Features']['Spellcasting']['Cantrips'];
        classText+=classJSON['Cleric']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Spellcasting']['Ritual Casting'];
        classText+=classJSON['Cleric']['Class Features']['Spellcasting']['Spellcasting Focus'];
        classText+=classJSON['Cleric']['Class Features']['Divine Domain']['content'];
        classText+=classJSON['Cleric']['Class Features']['Divine Domain']['Domain Spells']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Channel Divinity']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Channel Divinity']['Channel Divinity: Turn Undead']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Cleric']['Class Features']['Destroy Undead']['content'];
        classText+=classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Cleric Level'].join("");
        classText+=classJSON['Cleric']['Class Features']['Destroy Undead']['Destroy Undead']['table']['Destroys Undead of CR...'].join("");
        classText+=classJSON['Cleric']['Class Features']['Divine Intervention']['content'].join("");
        
        /*cleric subclass stuff*/
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['content'];
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Cleric Level'].join("");
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Life Domain Spells']['table']['Spells'].join("");
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Bonus Proficiency'];
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Disciple of Life'];
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Channel Divinity: Preserve Life']['content'].join("");
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Blessed Healer'];
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Divine Strike'];
        classText+=classJSON['Cleric']['Class Features']['Life Domain']['Supreme Healing'];
    }
    else if(charClass=="druid"){
        /*druid features*/
        classText+=classJSON['Druid']['Class Features']['content'];   
        classText+=classJSON['Druid']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Druid']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Spellcasting']['content'];
        classText+=classJSON['Druid']['Class Features']['Spellcasting']['Cantrips'];
        classText+=classJSON['Druid']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Spellcasting']['Ritual Casting'];
        classText+=classJSON['Druid']['Class Features']['Spellcasting']['Spellcasting Focus'];
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Max CR'].join("");
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Limitations'].join("");
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['table']['Example'].join("");
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Duration'];
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Rules'];
        classText+=classJSON['Druid']['Class Features']['Wild Shape']['Beast Shapes']['Rules']['content'];
        classText+=classJSON['Druid']['Class Features']['Druid Circle']['content'];
        classText+=classJSON['Druid']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Druid']['Class Features']['Timeless Body'];
        classText+=classJSON['Druid']['Class Features']['Beast Spells'];
        classText+=classJSON['Druid']['Class Features']['Archdruid']['content'].join("");
        
        
        /*druid subclass features*/
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['content'];
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Bonus Cantrip'];
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Natural Recovery']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['content'];
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Arctic']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Coast']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Desert']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Forest']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Grassland']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Mountain']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Druid Level'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Circle Spells']['Swamp']['table']['Circle Spells'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']["Lands Stride"]['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Natures Ward'];
        classText+=classJSON['Druid']['Class Features']['Circle of the Land']['Natures Sanctuary']['content'].join("");
        
        
        /*extra druid stuff*/
        classText+=classJSON['Druid']['Class Features']['Sacred Plants and Wood']['content'].join("");
        classText+=classJSON['Druid']['Class Features']['Druids and the Gods'];
        
    }
    else if(charClass=="fighter"){
        /*fighter stuff*/
        classText+=classJSON['Fighter']['Class Features']['content'];   
        classText+=classJSON['Fighter']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Fighter']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Fighter']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['content'];
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['Archery'];
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['Defense'];
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['Dueling'];
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['Great Weapon Fighting'];
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['Protection'];
        classText+=classJSON['Fighter']['Class Features']['Fighting Style']['Two-Weapon Fighting'];
        classText+=classJSON['Fighter']['Class Features']['Second Wind'];
        classText+=classJSON['Fighter']['Class Features']['Action Surge']['content'].join("");
        classText+=classJSON['Fighter']['Class Features']['Martial Archetype'];
        classText+=classJSON['Fighter']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Fighter']['Class Features']['Extra Attack']['content'].join("");
        classText+=classJSON['Fighter']['Class Features']['Indomitable']['content'].join("");
        
        /*champion subclass*/
        classText+=classJSON['Fighter']['Martial Archetypes']['content'];
        classText+=classJSON['Fighter']['Martial Archetypes']['Champion']['content'];
        classText+=classJSON['Fighter']['Martial Archetypes']['Champion']['Improve Critical'];
        classText+=classJSON['Fighter']['Martial Archetypes']['Champion']['Remarkable Athlete']['content'].join("");
        classText+=classJSON['Fighter']['Martial Archetypes']['Champion']['Additional Fighting Style'];
        classText+=classJSON['Fighter']['Martial Archetypes']['Champion']['Superior Critical'];
        classText+=classJSON['Fighter']['Martial Archetypes']['Champion']['Survivor'];
    }
    else if(charClass=="monk"){
        /*monk features*/
        classText+=classJSON['Monk']['Class Features']['content'];   
        classText+=classJSON['Monk']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Monk']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Monk']['Class Features']['Equipment']['content'].join(""); 
        classText+=classJSON['Monk']['Class Features']['Unarmored Defense'];
        classText+=classJSON['Monk']['Class Features']['Martial Arts']['content'].join("");
        classText+=classJSON['Monk']['Class Features']['Ki']['content'].join("");
        classText+=classJSON['Monk']['Class Features']['Ki']['Flurry of Blows'];
        classText+=classJSON['Monk']['Class Features']['Ki']['Patient Defense'];
        classText+=classJSON['Monk']['Class Features']['Ki']['Step of the Wind'];
        classText+=classJSON['Monk']['Class Features']['Unarmored Movement']['content'].join("");
        classText+=classJSON['Monk']['Class Features']['Monastic Tradition'];
        classText+=classJSON['Monk']['Class Features']['Deflect Missiles']['content'].join("");
        classText+=classJSON['Monk']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Monk']['Class Features']['Slow Fall'];
        classText+=classJSON['Monk']['Class Features']['Extra Attack'];
        classText+=classJSON['Monk']['Class Features']['Stunning Strike'];
        classText+=classJSON['Monk']['Class Features']['Ki-Empowered Strikes'];
        classText+=classJSON['Monk']['Class Features']['Evasion'];
        classText+=classJSON['Monk']['Class Features']['Stillness of Mind'];
        classText+=classJSON['Monk']['Class Features']['Purity of Body'];
        classText+=classJSON['Monk']['Class Features']['Tongue of the Sun and Moon'];
        classText+=classJSON['Monk']['Class Features']['Diamond Soul']['content'];
        classText+=classJSON['Monk']['Class Features']['Timeless Body'];
        classText+=classJSON['Monk']['Class Features']['Empty Body']['content'];
        classText+=classJSON['Monk']['Class Features']['Perfect Self'];
        
        
        /*open palm subclass*/
        classText+=classJSON['Monk']['Monastic Traditions']['content'];
        classText+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['content'];
        classText+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Open Hand Technique']['content'];
        classText+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Wholeness of Body'];
        classText+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Tranquility'];
        classText+=classJSON['Monk']['Monastic Traditions']['Way of the Open Hand']['Quivering Palm']['content'];
    }
    else if(charClass=="paladin"){
        /*core paladin class*/
        classText+=classJSON['Paladin']['Class Features']['content'];   
        classText+=classJSON['Paladin']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Paladin']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Paladin']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Paladin']['Class Features']['Divine Sense']['content'].join("");
        classText+=classJSON['Paladin']['Class Features']['Lay on Hands']['content'].join("");
        classText+=classJSON['Paladin']['Class Features']['Fighting Style']['content'];
        classText+=classJSON['Paladin']['Class Features']['Fighting Style']['Defense'];
        classText+=classJSON['Paladin']['Class Features']['Fighting Style']['Dueling'];
        classText+=classJSON['Paladin']['Class Features']['Fighting Style']['Great Weapon Fighting'];
        classText+=classJSON['Paladin']['Class Features']['Fighting Style']['Protection'];
        classText+=classJSON['Paladin']['Class Features']['Spellcasting']['content'];
        classText+=classJSON['Paladin']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join("");
        classText+=classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Paladin']['Class Features']['Spellcasting']['Spellcasting Focus'];
        classText+=classJSON['Paladin']['Class Features']['Divine Smite'];
        classText+=classJSON['Paladin']['Class Features']['Divine Health'];
        classText+=classJSON['Paladin']['Class Features']['Sacred Oath']['content'];
        classText+=classJSON['Paladin']['Class Features']['Sacred Oath']['Oath Spells']['content'];
        classText+=classJSON['Paladin']['Class Features']['Sacred Oath']['Channel Divinity']['content'];
        classText+=classJSON['Paladin']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Paladin']['Class Features']['Extra Attack'];
        classText+=classJSON['Paladin']['Class Features']['Aura of Protection']['content'];
        classText+=classJSON['Paladin']['Class Features']['Aura of Courage']['content'];
        classText+=classJSON['Paladin']['Class Features']['Improved Divine Smite'];
        classText+=classJSON['Paladin']['Class Features']['Cleansing Touch']['content'];
        
        /*Oath of devotion subclass*/
        classText+=classJSON['Paladin']['Sacred Oaths']['content'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['content'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Tenets of Devotion']['content'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['content'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Level'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Oath Spells']['Oath of Devotion Spells']['table']['Paladin Spells'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Channel Divinity']['content'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Aura of Devotion'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Purity of Spirit'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Oath of Devotion']['Holy Nimbus']['content'];
        classText+=classJSON['Paladin']['Sacred Oaths']['Breaking Your Oath']['content'];
    }
    else if(charClass=="ranger"){
        /*core ranger class - SRD, not the Revised Ranger UA*/
        classText+=classJSON['Ranger']['Class Features']['content'];   
        classText+=classJSON['Ranger']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Ranger']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Ranger']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Ranger']['Class Features']['Favored Enemy']['content'].join("");
        classText+=classJSON['Ranger']['Class Features']['Natural Explorer']['content'].join("");
        classText+=classJSON['Ranger']['Class Features']['Fighting Style']['content'];
        classText+=classJSON['Ranger']['Class Features']['Fighting Style']['Archery'];
        classText+=classJSON['Ranger']['Class Features']['Fighting Style']['Defense'];
        classText+=classJSON['Ranger']['Class Features']['Fighting Style']['Dueling'];
        classText+=classJSON['Ranger']['Class Features']['Fighting Style']['Two-Weapon Fighting'];
        classText+=classJSON['Ranger']['Class Features']['Spellcasting']['content'];
        classText+=classJSON['Ranger']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join("");
        classText+=classJSON['Ranger']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Ranger']['Class Features']['Ranger Archetype'];
        classText+=classJSON['Ranger']['Class Features']['Primeval Awareness'];
        classText+=classJSON['Ranger']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Ranger']['Class Features']['Extra Attack'];
        classText+=classJSON['Ranger']['Class Features']['Lands Stride']['content'];
        classText+=classJSON['Ranger']['Class Features']['Hide in Plain Sight']['content'];
        classText+=classJSON['Ranger']['Class Features']['Vanish'];
        classText+=classJSON['Ranger']['Class Features']['Feral Senses']['content'];
        classText+=classJSON['Ranger']['Class Features']['Foe Slayer'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['content'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['content'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Hunters Prey']['content'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Hunters Prey']['content'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Defensive Tactics']['content'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Multiattack']['content'];
        classText+=classJSON['Ranger']['Ranger Archetypes']['Hunter']['Superior Hunters Defense']['content'];
    }
    else if(charClass=="rogue"){
        /*rogue base class*/
        classText+=classJSON['Rogue']['Class Features']['content'];   
        classText+=classJSON['Rogue']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Rogue']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Rogue']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Rogue']['Class Features']['Expertise']['content'].join("");
        classText+=classJSON['Rogue']['Class Features']['Sneak Attack']['content'].join("");
        classText+=classJSON['Rogue']['Class Features']['Thieves Cant']['content'].join("");
        classText+=classJSON['Rogue']['Class Features']['Cunning Action'];
        classText+=classJSON['Rogue']['Class Features']['Rougish Archetype'];
        classText+=classJSON['Rogue']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Rogue']['Class Features']['Uncanny Dodge'];
        classText+=classJSON['Rogue']['Class Features']['Evasion'];
        classText+=classJSON['Rogue']['Class Features']['Reliable Talent'];
        classText+=classJSON['Rogue']['Class Features']['BLindsense'];
        classText+=classJSON['Rogue']['Class Features']['Slippery Mind'];
        classText+=classJSON['Rogue']['Class Features']['Elusive'];
        classText+=classJSON['Rogue']['Class Features']['Stroke of Luck']['content'].join("");
        
        /*thief subclass*/
        classText+=classJSON['Rogue']['Roguish Archetypes']['content'];
        classText+=classJSON['Rogue']['Roguish Archetypes']['Thief']['content'];
        classText+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Fast Hands'];
        classText+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Second-Story Work']['content'].join("");
        classText+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Supreme Sneak'];
        classText+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Use Magic Device'];
        classText+=classJSON['Rogue']['Roguish Archetypes']['Thief']['Thiefs Reflexes'];
    }
    else if(charClass=="sorcerer"){
        /*sorcerer base class*/
        classText+=classJSON['Sorcerer']['Class Features']['content'];   
        classText+=classJSON['Sorcerer']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Sorcerer']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Spellcasting']['content'];
        classText+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Cantrips'];
        classText+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spell Slots']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spells Known of 1st Level and Higher']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Spellcasting']['Spellcasting Focus'];
        classText+=classJSON['Sorcerer']['Class Features']['Sorcerous Origin']['content'];
        classText+=classJSON['Sorcerer']['Class Features']['Font of Magic']['content'];
        classText+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Sorcery Points'];
        classText+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['content'];
        classText+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']
        ['Spell Slot Level'];
        classText+=classJSON['Sorcerer']['Class Features']['Font of Magic']['Flexible Casting']['Creating Spell Slots']['content'][0]['table']['Sorcery Point Cost'];
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Careful Spell']
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Distant Spell']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Empowered Spell']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Extended Spell']
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Heightened Spell']
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Quickened Spell']
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Subtle Spell']
        classText+=classJSON['Sorcerer']['Class Features']['Metamagic']['Twinned Spell']['content'].join("");
        classText+=classJSON['Sorcerer']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Sorcerer']['Class Features']['Sorcererous Restoration'];
        
        /*sorcerer sub class*/
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['content'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['content'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['content'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Dragon'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'][0]['table']['Damage Type'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Ancestor']['Draconic Ancestry']['content'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Resilience']['content'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Elemental Affinity'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Dragon Wings']['content'];
        classText+=classJSON['Sorcerer']['Sorcerous Origins']['Draconic Bloodline']['Draconic Presence'];
    }
    else if(charClass=="warlock"){
        /*core warlock features*/
        classText+=classJSON['Warlock']['Class Features']['content'];   
        classText+=classJSON['Warlock']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Warlock']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Warlock']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Warlock']['Class Features']['Otherworldly Patrons'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['content'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['Cantrips'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['Cantrips'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['Spell Slots']['content'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['Spells Known of 1st Level and Higher']['content'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Ability']['content'];
        classText+=classJSON['Warlock']['Class Features']['Pact Magic']['Spellcasting Focus'];
        classText+=classJSON['Warlock']['Class Features']['Eldritch Invocations']['content'];
        classText+=classJSON['Warlock']['Class Features']['Pact Boon']['content'];
        classText+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Chain']['content'].join("");
        classText+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Blade']['content'].join("");
        classText+=classJSON['Warlock']['Class Features']['Pact Boon']['Pact of the Tome']['content'].join("");
        classText+=classJSON['Warlock']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Warlock']['Class Features']['Mystic Arcanum']['content'].join("");
        classText+=classJSON['Warlock']['Class Features']['Eldritch Master'];
        
        /*invocations*/
        classText+=classJSON['Warlock']['Eldritch Invocations']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Agonizing Blast']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Armor of Shadows'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Ascendant Step']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Beast Speech'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Beguiling Influence'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Bewitching Whispers']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Book of Ancient Secrets']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Chains of Carceri']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Devils Sight'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Dreadful Word']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Eldritch Sight'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Eldritch Spear']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Eyes of the Rune Keeper'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Fiendish Vigor'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Gaze of Two Minds'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Lifedrinker']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Mask of Many Faces'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Master of Myriad Forms']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Minions of Chaos']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Mire the Mind']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Misty Visions'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['One with Shadows']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Otherworldly Leap']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Repelling Blast']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Sculptor of Flesh']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Sign of Ill Omen']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Thief of Five Fates'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Thirsting Blade']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Visions of Distant Realms']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Voice of the Chain Master']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Whispers of the Grave']['content'];
        classText+=classJSON['Warlock']['Eldritch Invocations']['Witch Sight']['content'];
        
        /*patron*/
        classText+=classJSON['Warlock']['Otherworldly Patrons']['content'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['content'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['content'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spell Level'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Expanded Spell List']['Fiend Expanded Spells']['table']['Spells'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Blessing'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Dark Ones Own Luck']['content'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Fiendish Resilience'];
        classText+=classJSON['Warlock']['Otherworldly Patrons']['The Fiend']['Hurl Through Hell']['content'];
        
        /*extra stuff on pacts*/
        classText+=classJSON['Warlock']['Otherworldly Patrons']['Your Pact Boon']['content'].join("");
    }
    else{
        /*core wizard features*/
        classText+=classJSON['Wizard']['Class Features']['content'];   
        classText+=classJSON['Wizard']['Class Features']['Hit Points']['content'].join("");
        classText+=classJSON['Wizard']['Class Features']['Proficiencies']['content'].join("");   
        classText+=classJSON['Wizard']['Class Features']['Equipment']['content'].join("");
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['content'];
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Cantrips'];
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellbook']['content'];
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Preparing and Casting Spells']['content'].join("");
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Ability']['content'].join("");
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Ritual Casting'];
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Spellcasting Focus'];
        classText+=classJSON['Wizard']['Class Features']['Spellcasting']['Learning Spells of 1st Level or Higher'];
        classText+=classJSON['Wizard']['Class Features']['Arcane Recovery']['content'].join("");
        classText+=classJSON['Wizard']['Class Features']['Arcane Tradition']['content'].join("");
        classText+=classJSON['Wizard']['Class Features']['Ability Score Improvement'];
        classText+=classJSON['Wizard']['Class Features']['Spell Mastery']['content'];
        classText+=classJSON['Wizard']['Class Features']['Signature Spells']['content'];
        
        /*wizard subclass*/
        classText+=classJSON['Wizard']['Arcane Traditions']['content'];
        classText+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['content'];
        classText+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Evocation Savant'];
        classText+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Scult Spells'];
        classText+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Potent Cantrip'];
        classText+=classJSON['Wizard']['Arcane Traditions']['School of Evocation']['Overchannel']['content'].join("");
        classText+=classJSON['Wizard']['Arcane Traditions']['Your Spellbook']['content'].join("");
    }
    
    classPara.innerHTML=classText;
}


