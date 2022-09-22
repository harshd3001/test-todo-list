function toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}
		return arr2;
	} else {
		return Array.from(arr);
	}
}

function toDefineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	} else {
		obj[key] = value;
	}
	return obj;
}

function getCycle(graph) {
	/* Copy the graph, converting all node references to String graph = Object.assign.apply(Object, toConsumableArray(Object.keys(graph).map(function (node) { return toDefineProperty({}, node, graph[node].map(String)); }))); */
	var queue = Object.keys(graph).map(function (node) {
		return [node];
	});
	while (queue.length) {
		var batch = [];
		for (var path = 0; path < queue.length; path++) {
			var parents = graph[queue[path][0]] || [];
			for (var node = 0; node < parents.length; node++) {
				if (parents[node] === queue[path][queue[path].length - 1])
					return ([parents[node]].concat(queue[path]));
				batch.push([parents[node]].concat(queue[path]));
			}
		}
		queue = batch;
	}
}
contextVar.message = 'noError';
var precendentFlag;
var dependentFlag;
var operation = 'add';
if (typeof contextVar.taskDependencyData !== 'undefined' && contextVar.taskDependencyData !== '' && contextVar.taskDependencyData.length > 0) {
	for (var element = 0; element < contextVar.taskDependencyData.length; element++) {
		precendentFlag = false;
		dependentFlag = false;
		if (contextVar.taskDependencyData[element].id !== 'undefined' && contextVar.jsonObj[0].id !== 'undefined' && contextVar.taskDependencyData[element].id === contextVar.jsonObj[0].id) {
			continue;
		}
		contextVar.taskDependencyData[element].precedentTask.forEach(function (val) {
			if (precendentFlag) return;
			if (contextVar.jsonObj[0].precedentTask.indexOf(val) !== -1) {
				precendentFlag = true;
			}
		});
		contextVar.taskDependencyData[element].dependentTask.forEach(function (val) {
			if (dependentFlag) return;
			if (contextVar.jsonObj[0].dependentTask.indexOf(val) !== -1) {
				dependentFlag = true;
			}
		});
		if (precendentFlag && dependentFlag) break;
	}
	if (precendentFlag && dependentFlag) {
		contextVar.message = 'duplicate';
	}
	if (!(precendentFlag && dependentFlag)) {
		var graph = {};
		if (contextVar.jsonObj[0].id !== 'undefined' && contextVar.jsonObj[0].id !== '') {
			contextVar.taskDependencyData.forEach(function (element) {
				if (element.id === contextVar.jsonObj[0].id) {
					element.precedentTask = contextVar.jsonObj[0].precedentTask;
					element.dependentTask = contextVar.jsonObj[0].dependentTask;
					operation = 'edit';
				}
			});
		}
		if (operation !== 'edit') {
			contextVar.taskDependencyData = contextVar.taskDependencyData.concat(contextVar.jsonObj);
		}
		contextVar.taskDependencyData.forEach(function (graphNode) {
			graphNode.precedentTask.forEach(function (val) {
				if (typeof graph[val] === 'undefined') {
					graph[val] = graphNode.dependentTask;
				} else {
					graph[val] = graph[val].concat(graphNode.dependentTask);
				}
			});
		});
		var result = getCycle(graph);
		if (typeof result !== 'undefined') {
			contextVar.message = 'cyclic';
		}
	}
}