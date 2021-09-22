import { LightningElement,api } from 'lwc';
/*static resource*/
import PRODUCT_EMPTY_PLACEHOLDER from '@salesforce/resourceUrl/EmptyImage'

export default class Placeholder extends LightningElement {
    @api message;
    placeholderUrl=PRODUCT_EMPTY_PLACEHOLDER;
}