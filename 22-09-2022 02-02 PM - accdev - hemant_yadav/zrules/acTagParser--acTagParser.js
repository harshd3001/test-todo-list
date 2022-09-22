var appraiserType = contextVar.appraiserDetails.appraiserType;
var supportedTags = [
  "Traineesolo#",
  "%complexA",
  "%complexB",
  "%complexC",
  "%rural",
  "%historical",
  "-3000sf",
  "3000-4000sf",
  "4000-5000sf",
  "5000-6000sf",
  "6000+",
  "%misc",
  "%ext"
  ];

var currentTags = [];
var woType = "";
var taskTypes = {"appraiser": "", "analyst": ""};
var assignmentType = contextVar.customerAssignmentType;

function evaluateLenderThresholds(exceptions,contractValue){}

if (assignmentType=="NTS") {
  evaluateLenderThresholds(contextVar.tsExceptions, contextVar.recData.contractValue);
}

function parseTags(tags) {
  var wo = "";
  var task = {"appraiser": "", "analyst": ""};
  var gla = "-";
  var complexity = "-";
  var rural = "-";
  var historical = "-";
  var tagGlaToSkillMapper = {
    "-3000sf":"GLA1",
    "3000-4000sf":"GLA2",
    "4000-5000sf":"GLA3",
    "5000-6000sf":"GLA4",
    "6000+":"GLA5"
  };
  var tagComplexToSkillMapper = {
    "%complexA":"Complex A",
    "%complexB":"Complex B",
    "%complexC":"Complex C"
  };

  var tsIndex = tags.indexOf("Traineesolo#");
  if (tsIndex!= -1) {
    assignmentType = "TS";
    tags.splice(tsIndex,1);
  }

  for (var i=0;i<tags.length;i++) {
    if(wo==""){
      switch(tags[i]){
        case "%complexA":
        case "-3000sf":
          wo = "Appraisal G1";
          task.appraiser = "Appraiser Appraisal G1";
          task.analyst = "Analyst Appraisal G1";
          break;
        case "%complexB":
        case "3000-4000sf":
          wo = "Appraisal G2";
          task.appraiser = "Appraiser Appraisal G2";
          task.analyst = "Analyst Appraisal G2";
          break;
        case "%complexC":
        case "4000-5000sf":
          wo = "Appraisal G3";
          task.appraiser = "Appraiser Appraisal G3";
          task.analyst = "Analyst Appraisal G3";
          break;
        case "5000-6000sf":
          wo = "Appraisal G4";
          task.appraiser = "Appraiser Appraisal G4";
          task.analyst = "Analyst Appraisal G4";
          break;
        case "6000+":
          wo = "Appraisal G5";
          task.appraiser = "Appraiser Appraisal G5";
          task.analyst = "Analyst Appraisal G5";
          break;
        case "%misc":
        case "UnkGLA":
          wo = "Appraisal Misc";
          task.appraiser = "Appraiser Appraisal Misc";
          task.analyst = "Analyst Appraisal Misc";
          break;
        case "%ext":
          wo = "Exterior Inspections";
          task.appraiser = "Appraiser Appraisal Ext";
          task.analyst = "Analyst Appraisal Ext";
          break;
      }
    }
    if ((["FHA","USDA","VA"].indexOf(contextVar.recData.loantype)!=-1)||(contextVar.appraiserDetails.appraiserType=="API Appraiser")) {
      assignmentType = "NTS";
    }
    if (["-3000sf","3000-4000sf","4000-5000sf","5000-6000sf","6000+"].indexOf(tags[i])>=0) {
      gla = tagGlaToSkillMapper[tags[i]];
    }
    if (tags[i].search("%complex")>=0) {
      complexity = tagComplexToSkillMapper[tags[i]];
    }
    if (tags[i].search("%rural")>=0) {
      rural = 'Rural';
    }
    if (tags[i].search("%historical")>=0) {
      historical = 'Historical';
    }
  }
  if (wo=="") {
    wo = "Appraisal Misc";
    task.appraiser = "Appraiser Appraisal Misc";
    task.analyst = "Analyst Appraisal Misc";
    if (assignmentType ==""||typeof assignmentType =="undefined") {
      assignmentType = "NTS";
    }
  }

  return {
    "wo":wo,
    "task":task,
    "assignmentType":assignmentType,
    "tagGlaValue":gla,
    "tagComplexityValue":complexity,
    "tagRuralValue":rural,
    "tagHistoricalValue":historical
  };
}

if (contextVar.recData.tags == "" || typeof contextVar.recData.tags == "undefined") {
  contextVar.woTypeToBeCreated = "Exterior Inspections";
  contextVar.taskTypesToBeCreated = {"appraiser": "Appraiser Appraisal Ext","analyst": "Analyst Appraisal Ext"};
  contextVar.assignmentTypeToBeHandled = "NTS";
  contextVar.tagGlaValue = "-";
  contextVar.tagComplexityValue = "-";
  contextVar.tagRuralValue = "-";
  contextVar.tagHistoricalValue = "-";
} else {
  currentTags = contextVar.recData.tags.split(",");
  result = parseTags(currentTags);

  contextVar.woTypeToBeCreated = result.wo;
  contextVar.taskTypesToBeCreated = result.task;
  contextVar.assignmentTypeToBeHandled = result.assignmentType;
  contextVar.tagGlaValue = result.tagGlaValue;
  contextVar.tagComplexityValue = result.tagComplexityValue;
  contextVar.tagRuralValue = result.tagRuralValue;
  contextVar.tagHistoricalValue = result.tagHistoricalValue;
}