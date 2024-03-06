public with sharing class InvoiceController {
    
    @AuraEnabled(cacheable=true)
    public static InvoiceWrapper getInvoicesAndLineItems() {
        Map<Id, Invoice__c> invoiceMap = new Map<Id, Invoice__c>();
        Map<Id, List<Invoice_Line_Item__c>> lineItemMap = new Map<Id, List<Invoice_Line_Item__c>>();
        
        List<Invoice__c> invoices = [SELECT Id, Name, (SELECT Id, Name FROM Invoice_Line_Items__r ORDER BY Name ASC LIMIT 10) FROM Invoice__c];
        
        for(Invoice__c invoice : invoices) {
            invoiceMap.put(invoice.Id, invoice);
            lineItemMap.put(invoice.Id, invoice.Invoice_Line_Items__r);
        }
        return new InvoiceWrapper(invoiceMap, lineItemMap);
    }
    
    public class InvoiceWrapper {
        @AuraEnabled
        public Map<Id, Invoice__c> invoices;
        @AuraEnabled
        public Map<Id, List<Invoice_Line_Item__c>> invoiceLineItems;
        
        public InvoiceWrapper(Map<Id, Invoice__c> invoices, Map<Id, List<Invoice_Line_Item__c>> invoiceLineItems) {
            this.invoices = invoices;
            this.invoiceLineItems = invoiceLineItems;
        }
    }
}