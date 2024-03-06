import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord } from 'lightning/uiRecordApi';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { getFieldValue } from 'lightning/uiRecordApi';

export default class RelatedRecordCard extends LightningElement {
    @api recordId; // Parent record Id
    @api fieldSet; // Field Set Name
    @api record; // Record data

    @wire(getObjectInfo, { objectApiName: '$childObjectName' })
    objectInfo;

    // Getter to determine if the component is in user mode
    get isUserMode() {
        return this.objectInfo && this.objectInfo.data && this.objectInfo.data.isCreateable;
    }

    // Getter to determine if the component is in admin mode
    get isAdminMode() {
        return this.objectInfo && this.objectInfo.data && this.objectInfo.data.isCustomizable;
    }
}
