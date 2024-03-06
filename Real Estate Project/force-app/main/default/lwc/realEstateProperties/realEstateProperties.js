import { LightningElement, wire } from 'lwc';
import getPropertyList from '@salesforce/apex/PropertyController.getPropertyList';
import claimProperties from '@salesforce/apex/PropertyController.claimProperties';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from 'lightning/navigation';


const columns = [
    { label: 'Property', fieldName: 'Property_Name__c', type: 'text' },
    { label: 'Property Country', fieldName: 'Property_Country__c', type: 'text' },
    { label: 'Property City', fieldName: 'Property_City__c', type: 'text' },
    { label: 'Property State', fieldName: 'Property_State__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'picklist' },
    { label: 'Sales Office', fieldName: 'Sales_Office__r.Sales_office_Name__c', type: 'text' },
    { label: 'Listing Price', fieldName: 'Listing_Price__c', type: 'currency' },
    { label: 'Date Added', fieldName: 'Sale_Date__c', type: 'date' },

];
export default class RealEstateProperties extends NavigationMixin(LightningElement) {

    page = 1; //initialize 1st page
    items = []; //contains all the records.
    data = []; //data  displayed in the table
    columns; //holds column info.
    startingRecord = 1; //start record position per page
    endingRecord = 0; //end record position per page
    pageSize = 5; //default value we are assigning
    totalRecountCount = 0; //total record count received from all retrieved records
    totalPage = 0; //total number of page is needed to display all records
    selectedProperties = [];  //stores the selected property
    claimedPropertiesCount = 0;


    @wire(getPropertyList)
    wiredData({ error, data }) {
        if (data) {
            this.items = data;
            this.totalRecountCount = data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            //slice the data according to page size
            this.data = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.columns = columns;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
            this.showToast(this.error, 'Error', 'Error'); //show toast for error
        }
    }

    // previous button method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
    }

    // next button  method will be called
    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);
        }
    }

    // method displays records page by page
    displayRecordPerPage(page) {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord;

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 5 to 10 of 15 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
    }


    // Method to update the claimed properties count
    updateClaimedPropertiesCount() {
        this.claimedPropertiesCount = this.selectedProperties.length;
    }

    handleSelectedRow(event) {
        const allselectedRows = event.detail.selectedRows; //property for selected rows
        this.selectedProperties = allselectedRows;
        console.log('Selected Properties', JSON.stringify(this.selectedProperties));

    }

    handleClaimProperties() {
        // Navigate back to the Sales Office
        this.navigateToSalesOffice();
    }


    handleClaimContinueProperties() {
        const totalClaimedProperties = this.claimedPropertiesCount + this.selectedProperties.length;

        if (this.selectedProperties.length === 0) {
            this.showToast('Please select at least one row of property', 'error', 'Error');
        }
        // Check if the total number of claimed properties is greater than 5
        // else if (totalClaimedProperties >= 5) {
        //     this.showToast('Total claimed properties cannot exceed 5', 'error', 'Error');
        // }
        else {
            // If the condition is met, proceed to claim properties
            this.updateClaimedPropertiesCount();
            this.showToast('Properties Claimed Successfully', 'success', 'Success');
        }
    }

    handleCancelProperties() {
        // Navigate back to the Sales Office
        this.navigateToSalesOffice();
    }


    claimContinuePropertiesMethod() {
        const propertyIds = this.selectedProperties.map(property => property.Id);

        claimProperties({ lstpropertyIds: propertyIds })
            .then(result => {
                if (result.includes('error')) {
                    // Handle error scenario
                } else {
                    // Success scenario - properties status updated successfully.
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Show an error message to the user or take appropriate action.
            });
    }


    //Reusable toast Message.
    showToast(message, variant, title) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    //Navigate To Page reference type to navigate to the Sales Office.
    navigateToSalesOffice() {
        const pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Sales_Office__c',
                actionName: 'home',
            },
        };
        this[NavigationMixin.Navigate](pageReference);
    }
}