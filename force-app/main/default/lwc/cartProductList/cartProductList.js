import { LightningElement,wire } from 'lwc';
//Apex class
import getProducts from '@salesforce/apex/getCartProducts.getProducts'
//LMS
import {publish, MessageContext} from 'lightning/messageService'
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c'


/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;
export default class CartProductList extends LightningElement {
    searchKey = '';
    products=[];
    error;
     /**Load context for LMS */
     @wire(MessageContext)
     messageContext

    @wire(getProducts, { searchKey: '$searchKey' })
    productsHandler({data, error}){
        if(data){
            console.log(data)
            this.products = data
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }
    
    handleKeyChange(event) {        
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;       
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
    //publishing Record Id
    handleProductSelected(event){
        console.log("selected Product Id", event.detail)
        publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
            ProductId:event.detail
        })
    }
}