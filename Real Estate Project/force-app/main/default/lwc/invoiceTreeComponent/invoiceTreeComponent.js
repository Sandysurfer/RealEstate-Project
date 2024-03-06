import { LightningElement, wire } from 'lwc';
import getInvoicesAndLineItems from '@salesforce/apex/InvoiceController.getInvoicesAndLineItems';

export default class InvoiceTreeComponent extends LightningElement {
    invoices;
    lineItems = {};
    expandedInvoiceId;

    @wire(getInvoicesAndLineItems)
    wiredInvoices({ error, data }) {
        if (data) {
            this.invoices = data.invoices;
            this.lineItems = data.invoiceLineItems;
        } else if (error) {
            console.error('Error fetching invoices:', error);
        }
    }

    handleInvoiceClick(event) {
        const invoiceId = event.target.dataset.id;
        this.expandedInvoiceId = this.expandedInvoiceId === invoiceId ? null : invoiceId;
    }

    loadMoreLineItems(event) {
        const invoiceId = event.target.dataset.id;
    }
}