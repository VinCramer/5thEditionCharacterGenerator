

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
    
    
    var allStats = "";
    allStats+="Strength: " + charStats[0]+" ";
    allStats+="Dexterity: " + charStats[1]+" ";
    allStats+="Constitution: " + charStats[2]+" ";
    allStats+="Intelligence: " + charStats[3]+" ";
    allStats+="Wisdom: " + charStats[4]+" ";
    allStats+="Charisma: " + charStats[5]+" ";
    
    finalStatsPara.innerHTML=allStats;
    
    level = document.getElementById('level').value;
    proficiency = getProficiency(level);
    
    

    
    
    /*the base class the user wants to play as*/
    baseClass = document.getElementById('baseclass').value;
    
    /*String containing 'nomc' if they don't want to multiclass, and 'mc' if they do*/
    var mcOrNo = document.querySelector('input[name=mc]:checked').value;

    if(mcOrNo=="nomc"){
        if(baseClass=="rand"){
            
            baseClass = generateClass();
            finalClassPara.innerHTML=baseClass;
        }
        else{
            finalClassPara.innerHTML=baseClass;  
        }
    }
    else{
        /*TODO*/
        /*finalClassPara.innerHTML=generateClass(); */
    }
    
    /*need this after assigning the base class when the base class is random, otherwise proficiences don't work*/
    addStatsToTable(charStats, baseClass);
    
    var hiddenList = document.getElementsByClassName("hidden");
    for(let val of hiddenList){
        val.style="display:table";
    }
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

function showMinBox(){
    var hiddenList = document.getElementsByClassName("hidden_stats");
    for(let val of hiddenList){
        val.style="display:inline";
    }
}

function hideMinBox(){
    var hiddenList = document.getElementsByClassName("hidden_stats");
    for(let val of hiddenList){
        val.style="display:hidden";
    }
}

