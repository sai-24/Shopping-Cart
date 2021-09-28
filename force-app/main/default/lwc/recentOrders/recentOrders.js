import { LightningElement,track,wire } from 'lwc';
import GetRecentOrders from '@salesforce/apex/getCartProducts.GetRecentOrders';
import {NavigationMixin} from 'lightning/navigation';
import CART_OBJECT from '@salesforce/schema/Cart_Order__c'

export default class RecentOrders extends NavigationMixin(LightningElement) {
    url;
    @track wiredRecentList=[];
    error;
    getrecentorders;
 //@wire(GetRecentOrders)getrecentorders;
 @wire(GetRecentOrders) RecentcountHandler(result) {
    this.wiredRecentList = result;    
    if (result.data) {
      //console.log('Count--->'+ result.data);
      this.getrecentorders = result.data;          
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;     
    }
    else{
        this.getrecentorders = [];     
    }
  }
 
      /**navigate to record page */
      handleNavigateToRecord(event){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:event.target.dataset.id,
                objectApiName:CART_OBJECT.objectApiName,
                actionName:'view'
            }
        })
    }
}