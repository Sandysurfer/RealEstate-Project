import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord } from 'lightning/uiRecordApi';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class RelatedRecordList extends LightningElement {
    @api recordId; // Parent record Id
    @api childObjectName; // Child object API name
    @api relationshipFieldName; // Relationship field name
    @api fieldSetName; // Field Set Name

    relatedRecords;
    error;
    isLoading = true;

    @wire(getObjectInfo, { objectApiName: '$childObjectName' })
    objectInfo;

    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListApiName: '$relationshipFieldName' })
    wiredRelatedRecords({ error, data }) {
        if (data) {
            this.relatedRecords = data.records;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.relatedRecords = undefined;
        }
        this.isLoading = false;
    }

    // Getter to determine if the component is in user mode
    get isUserMode() {
        return this.objectInfo && this.objectInfo.data && this.objectInfo.data.isCreateable;
    }

    // Getter to determine if the component is in admin mode
    get isAdminMode() {
        return this.objectInfo && this.objectInfo.data && this.objectInfo.data.isCustomizable;
    }
}
