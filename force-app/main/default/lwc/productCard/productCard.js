import { LightningElement,wire,track } from 'lwc';
//Navigation
import {NavigationMixin} from 'lightning/navigation'
//shop_product__c Schema
import PRODUCT_OBJECT from '@salesforce/schema/shop_product__c'
import NAME_FIELD from '@salesforce/schema/shop_product__c.product_name__c'
import PICTURE_URL_FIELD from '@salesforce/schema/shop_product__c.Picture_URL__c'
import BATTERY_FIELD from '@salesforce/schema/shop_product__c.Battery__c'
import BRAND_FIELD from '@salesforce/schema/shop_product__c.brand__c'
import COLOUR_FIELD from '@salesforce/schema/shop_product__c.colour__c'
import DESCRIPTION_FIELD from '@salesforce/schema/shop_product__c.Description__c'
import EMI_FIELD from '@salesforce/schema/shop_product__c.no_cost_EMI__c'
import PRICE_FIELD from '@salesforce/schema/shop_product__c.price__c'
import STORAGE_FIELD from '@salesforce/schema/shop_product__c.storage__c'
import CART__FIELD from '@salesforce/schema/shop_product__c.Cart__c'
// getFieldValue function is used to extract field values
import {getFieldValue} from 'lightning/uiRecordApi'

//lightning message service
import {subscribe, MessageContext, unsubscribe} from 'lightning/messageService'
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c'

//Apex class to update Cart
import UpdateCartProduct from '@salesforce/apex/getCartProducts.UpdateCartProduct'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProductCard extends NavigationMixin(LightningElement) {
    // load content for LMS
    @wire(MessageContext)
    messageContext
    @track showCart=false;
    //exposing fields to make them available in the template
    batteryField = BATTERY_FIELD
    brandField = BRAND_FIELD 
    colourField = COLOUR_FIELD
    descriptionField = DESCRIPTION_FIELD
    emiField = EMI_FIELD
    priceField = PRICE_FIELD
    storageField = STORAGE_FIELD

    //Id of shop_product__c to display data
    recordId;

    // product fields displayed with specific format
    productName;
    productPictureUrl;
    cartStatus;
    //subscription reference for productSelected
    productSelectionSubscription;

    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.productName = getFieldValue(recordData, NAME_FIELD)
        this.productPictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)
        this.cartStatus = getFieldValue(recordData, CART__FIELD)
        console.log('Cart Status in Product Card'+this.cartStatus);
    }

    connectedCallback(){
        this.showCart=false;  
        this.subscribeHandler();
    }

    subscribeHandler(){
        this.productSelectionSubscription = subscribe(this.messageContext, PRODUCT_SELECTED_MESSAGE, (message)=>this.handleProductSelected(message))
    }
    handleProductSelected(message){
        this.recordId = message.ProductId;
    }
    disconnectedCallback(){
        unsubscribe(this.productSelectionSubscription)
        this.productSelectionSubscription = null
    }

     /**navigate to record page */
     handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:PRODUCT_OBJECT.objectApiName,
                actionName:'view'
            }
        })
    }
//Add to cart 
handleAddCartClick(){
   
    UpdateCartProduct({
        prodId:this.recordId
    }).then(result=>{
        console.log(result);
        if(result=='Success'){
            this.showCart=true;       
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Added to Cart Sucessful',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
      
    })
}


}