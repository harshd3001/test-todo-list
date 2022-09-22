{
    contextVar.jsonObj = [];
    if(contextVar.subAction === "approve") {
        contextVar.jsonObj = [
            {
              
              "workOrderTaskId": contextVar.workOrderTaskId,
              "reviewResult": contextVar.statusId,
             "reviewNotes": contextVar.taskReviewLogReviewNotes
            }
        ];
    } else if(contextVar.subAction === "reject") {
        contextVar.jsonObj = [
            {
               
                "workOrderTaskId": contextVar.workOrderTaskId,
                "listOptionAnswerId": contextVar.listOptionAnswerId,
                "reviewResult": contextVar.statusId,
                "reviewNotes": contextVar.taskReviewLogReviewNotes,
                "action": contextVar.taskReviewLogAction
            }
        ];
    }
}