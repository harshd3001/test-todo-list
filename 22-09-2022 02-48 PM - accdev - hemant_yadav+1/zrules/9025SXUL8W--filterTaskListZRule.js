function checkIfArray(a) {
    return (typeof a !== 'undefined' && Array.isArray(a));
}

function checkForData(a) {
    return (typeof a !== 'undefined' && a !== '' && a !== null);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function validateDate(currentDate) {
    let dateValid = false;
    let cDate = new Date(currentDate).getTime();
    let sDate = new Date(contextVar.startDate).getTime();
    let eDate = new Date(contextVar.endDate).getTime();
    if (cDate >= sDate && cDate <= eDate) {
        dateValid = true;
    }
    return dateValid;
}

function findMultipleBreakdownIndex(ar, taskId, breakdownId) {
    let retVal = -1;
    if (checkIfArray(ar)) {
        ar.some((o, ind) => {
            if ((o.id === taskId) && (o.taskBreakdownId !== breakdownId)) {
                retVal = ind;
                return true;
            }
        });
    }
    return retVal;
}

{
    //For applying filters for open tasks list
    if (typeof contextVar.openTasksFilterFlag !== 'undefined' && contextVar.openTasksFilterFlag === true) {

        let openTaskData, tempTaskList = [], tempOpenTaskIdList = [];
        if (checkForData(contextVar.schedulingAndDispatchData)) {
            openTaskData = contextVar.schedulingAndDispatchData;
        }
        let currentDate = new Date(),
            startingDate = new Date();
        startingDate.setDate(currentDate.getDate() - contextVar.daysFromCurrent);


        if (checkIfArray(openTaskData)) {
            openTaskData.forEach((obj) => {
                let createdDateTime = new Date(obj.createdDate).getTime();
                let startingDateTime = startingDate.getTime();

                if ((createdDateTime >= startingDateTime) && !obj.taskTypeCrewTask) {
                    tempOpenTaskIdList.push(obj.workOrderTaskId);
                    tempTaskList.push(obj);
                }
            });
        }
        contextVar.schedulingAndDispatchData = tempTaskList;
        contextVar.openTaskIdList = tempOpenTaskIdList;
    }

    //For applying filters for calendar tasks grid
    if (typeof contextVar.calendarTasksFilterFlag !== 'undefined' && contextVar.calendarTasksFilterFlag === true) {

        if (checkForData(contextVar.techAndTaskData) && checkForData(contextVar.techAndTaskData.taskData)) {
            let tempTaskdata = [],
                tempTaskIdList = [], breakdownTaskIdList = [];
            if (checkIfArray(contextVar.techAndTaskData.taskData)) {
                contextVar.techAndTaskData.taskData.forEach(taskObj => {
                    if (validateDate(taskObj.scheduledStartTime) === true) {
                        /* Comparing the tasks, and checking for mulitple breakdown ids present for the given taskId, in the taskData and modifying it with the multiBreakdownTask flag. */
                        if (findMultipleBreakdownIndex(contextVar.techAndTaskData.taskData, taskObj.id, taskObj.taskBreakdownId) !== -1) {
                            console.log('Multiple breakdown task --> ' + taskObj.id);
                            contextVar.techAndTaskData.taskData.filter(function (ele) {
                                breakdownTaskIdList.push(taskObj.id);
                                if (ele.id === taskObj.id) {
                                    taskObj = {
                                        ...taskObj,
                                        'multiBreakdownTask': true
                                    };
                                }
                            });

                        }
                        else {
                            taskObj = {
                                ...taskObj,
                                'multiBreakdownTask': false
                            };
                        }

                        tempTaskdata.push(taskObj);
                        tempTaskIdList.push(taskObj.id);
                    }
                });
            }

            tempTaskIdList = tempTaskIdList.filter(onlyUnique);
            contextVar.taskIdList = tempTaskIdList;
            contextVar.techAndTaskData.taskData = tempTaskdata;
        }
    }

}