public with sharing class AccountController {
    
    @AuraEnabled
    public static List<String> getRecordTypes(){
        List<String> recordTypeOptions = new List<String>();
        Map<Id, Schema.RecordTypeInfo> rtMap = Account.SObjectType.getDescribe().getRecordTypeInfosById();
        for(Id rtId : rtMap.keySet()){
            recordTypeOptions.add(rtMap.get(rtId).getName());
            System.debug('Record Types--->'+recordTypeOptions);
        }
        return recordTypeOptions;
    }
    
    @AuraEnabled
    public static List<String> getPicklistFields(){
        Map<String, Schema.SObjectField> fields = Schema.SObjectType.Account.fields.getMap();
        List<String> picklistFields = new List<String>();
        for(String fieldName : fields.keySet()){
            Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
            if(fieldResult.getType() == Schema.DisplayType.Picklist) {
                picklistFields.add(fieldResult.getName());
                System.debug('Picklist List Fields--->'+picklistFields);
            }
        }
        return picklistFields;
    }
    
    @AuraEnabled
    public static List<String> getPicklistValues(String recordTypeId, String fieldApiName){
        List<String> picklistValues = new List<String>();
        if(recordTypeId != null && fieldApiName != null){
            Schema.DescribeFieldResult fieldResult = Schema.SObjectType.Account.fields.getMap().get(fieldApiName).getDescribe();
            if(fieldResult.getType() == Schema.DisplayType.Picklist){
                List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
                for(Schema.PicklistEntry entry : picklistEntries){
                    picklistValues.add(entry.getValue());
                    System.debug('Picklist Values--->'+picklistValues);
                }
            }
        }
        return picklistValues;
    }
}
