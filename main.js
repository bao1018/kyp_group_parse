var groups = [];
var subGroups = [];
var members = [];
var strGroupJSON = '';
var strSubGroupJSON = '';
var strMemberJSON = '';
var LINE_BREAK = '\r\n'
var groupCol = ['groupId', 'name', 'repId', 'groupType', 'groupTypeDesc', 'SIC', 'SICDesc', 'financialCategory', 'employeeCount', 'employeeCountDate', 'fcstType', 'fcstTypeDesc', 'changeDate', 'effectiveDate'];

var subGroupCol = ['subgroupId', 'SIC', 'SICDesc', 'effectiveDate', 'fcstType', 'fcstTypeDesc', 'groupType', 'groupTypeDesc', 'repId', 'subgroupName', 'contract_contractId', 'contract_carrierId', , 'contract_effectiveDate', 'contract_baseBenefitId', 'contract_baseBenefitDesc', 'contract_rateType', 'contract_serviceArea', 'contract_eligibility', 'contract_renewalFlag', 'benefit_CHIR', 'benefit_CMPL', 'benefit_EPOT', 'benefit_OPT'];

var memberCol = ['COBRA', 'addReason', 'birthDate', 'changeDate', 'displayName', 'duplicateHRN', 'effectiveDate', 'familyHireDate', 'familyPremium', 'familySubscriberId', 'firstName', 'healthRecordNumber', 'individualHealthRecordNumber', 'lastName', 'maritalStatus', 'medicare', 'relationshipDesc', 'relationshipDesc2', 'sex', 'status', 'subgroupId', 'zipcode'];

var exposeHashToCSVRow = function(cols, obj) {
	var strRow = '';
	cols.forEach(function(col) {
		var addedValue;
		if(col.indexOf('benefit_') > -1){
            var benefitList = obj['contract']['benefits'];
            var targetCol = col.replace('benefit_', '');
            benefitList.forEach(function(ben){
            	if(ben.benefit.trim() == targetCol){
            		addedValue = ben.choice;
            	}
            })
		}
		else if(col.indexOf('_') > -1) {
			var fields = col.split('_');
			addedValue = obj[fields[0]][fields[1]];
		} else {
			addedValue = obj[col];
		}
		console.log(addedValue);
		if(typeof(addedValue) =='string' && addedValue.indexOf(',') > -1)
			addedValue = '\"' + addedValue + '\"';
		strRow = strRow == '' ? addedValue : strRow + ',' + addedValue;
	});
	return strRow;
};

var processMember = function(member) {
	var newRow = exposeHashToCSVRow(memberCol, member);
	if (strMemberJSON != '')
		strMemberJSON = strMemberJSON + LINE_BREAK;
	strMemberJSON = strMemberJSON + newRow;

};

var processSubGroup = function(subGroup) {
	var newRow = exposeHashToCSVRow(subGroupCol, subGroup);
	newRow = mainGroupId + ',' + newRow;
	if (strSubGroupJSON != '')
		strSubGroupJSON = strSubGroupJSON + LINE_BREAK;
	strSubGroupJSON = strSubGroupJSON + newRow;
};

var processGroup = function(group) {
	var newRow = exposeHashToCSVRow(groupCol, group);
	if (strGroupJSON != '')
		strGroupJSON = strGroupJSON + LINE_BREAK;
	strGroupJSON = strGroupJSON + newRow;
	mainGroupId = group.groupId;
	group.subgroups.forEach(processSubGroup);
	// group.members.forEach(processMember);
};


var convert = function() {
	groups.length = 0;
	subGroups.length = 0;
	members.length = 0;
	strGroupJSON = '';
	strSubGroupJSON = '';
	strMemberJSON = '';
	var data = JSON.parse(document.getElementById('source').value);
	data.groups.forEach(processGroup);
	document.getElementById('groupData').value = strGroupJSON;
	document.getElementById('subGroupData').value = strSubGroupJSON;
	// document.getElementById('memberData').value = strMemberJSON;
}