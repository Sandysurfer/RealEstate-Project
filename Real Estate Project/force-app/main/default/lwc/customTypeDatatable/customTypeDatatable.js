import { LightningElement, track } from 'lwc';
import getRecordTypes from '@salesforce/apex/AccountController.getRecordTypes';
import getPicklistFields from '@salesforce/apex/AccountController.getPicklistFields';
import getPicklistValues from '@salesforce/apex/AccountController.getPicklistValues';

export default class CustomTypeDatatable extends LightningElement {

    @track recordTypeOptions = [];
    @track picklistFieldOptions = [];
    @track picklistValueOptions = [];
    @track selectedRecordType;
    @track selectedPicklistField;
    @track selectedPicklistValue;



    connectedCallback() {
        this.fetchRecordTypes();
        this.fetchPicklistFields();
    }

    fetchRecordTypes() {
        getRecordTypes()
            .then(result => {
                this.recordTypeOptions = result;
                console.log('Record Type Options', JSON.stringify(this.recordTypeOptions));
            })
            .catch(error => {
                console.error('Error fetching record types', error);
            });
    }

    fetchPicklistFields() {
        getPicklistFields()
            .then(result => {
                this.picklistFieldOptions = result;
                console.log('PicklistFields', JSON.stringify(this.picklistFieldOptions));
            })
            .catch(error => {
                console.error('Error fetching picklist fields', error);
            });
    }

    handleRecordTypeChange(event) {
        this.selectedRecordType = event.detail.value;
        console.log('Selected Record Type', JSON.stringify(this.selectedRecordType));
        this.fetchPicklistValues();
    }

    handlePicklistFieldChange(event) {
        this.selectedPicklistField = event.detail.value;
        console.log('Selected Picklist Field', JSON.stringify(this.selectedPicklistField));
        this.fetchPicklistValues();
    }

    handlePicklistValueChange(event) {
        this.selectedPicklistValue = event.detail.value;
        console.log('Selected Picklist Value', JSON.stringify(this.selectedPicklistValue));

    }

    fetchPicklistValues() {
        if (this.selectedRecordType && this.selectedPicklistField) {
            getPicklistValues({ recordTypeId: this.selectedRecordType, fieldApiName: this.selectedPicklistField })
                .then(result => {
                    this.picklistValueOptions = result;
                    console.log('Picklist Values', JSON.stringify(this.picklistValueOptions));
                })
                .catch(error => {
                    console.error('Error fetching picklist values', error);
                });
        }
    }

}