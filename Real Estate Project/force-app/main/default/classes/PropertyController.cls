public class PropertyController {
    
    @AuraEnabled(cacheable=true)
    public static List<Property__c> getPropertyList(){
        List<Property__c> propertyList = [Select Id,Property_Name__c,Property_Country__c,Property_City__c,Property_State__c,Status__c,Sale_Date__c,Sales_Office__r.Sales_office_Name__c,Listing_Price__c From Property__c Where Status__c = 'Open'];
        return propertyList;
    }
    
    @AuraEnabled
    public static String claimProperties(List<Id> lstpropertyIds) {
        try {
            List<Property__c> propertiesToUpdate = [SELECT Id, Status__c, Agent__c, Agent_Commission_Percentage__c FROM Property__c WHERE Id IN :lstpropertyIds];
            
            for (Property__c property : propertiesToUpdate) {
                property.Status__c = 'Working';
            }
            update propertiesToUpdate;
            return 'Properties claimed successfully';
        } catch (Exception e) {
            return 'An error occurred: ' + e.getMessage();
        }
    }
    
}