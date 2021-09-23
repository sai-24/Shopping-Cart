import { LightningElement,wire,track } from 'lwc';
//Apex class
import getProducts from '@salesforce/apex/getCartProducts.getProducts';
import GetCartCount from '@salesforce/apex/getCartProducts.GetCartCount';
//LMS
import {publish, MessageContext} from 'lightning/messageService';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';
//For removing From Cart
import UpdateRemoveCartProduct from '@salesforce/apex/getCartProducts.UpdateRemoveCartProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;
export default class CartProductList extends LightningElement {
    searchKey = '';
    products=[];
    error;
    cartCount;
    producttitle;
     /**Load context for LMS */
     @wire(MessageContext)
     messageContext
     @track wiredCountList = [];

     @wire(GetCartCount) cartcountHandler(result) {
        this.wiredCountList = result;    
        if (result.data) {
          console.log('Count--->'+ result.data);
          this.cartCount = 'Cart('+result.data+')';
          this.error = undefined;
        } else if (result.error) {
          this.error = result.error;
          this.cartCount = 'Cart(0)';
        }
        else{
            this.cartCount = 'Cart(0)';
           //console.log('Cart(0)');
        }
      }

    // @wire(GetCartCount)
    // cartcountHandler({data, error}){
    //     if(data){
    //         console.log(data)
    //         this.cartCount = 'Cart('+data+')';
    //         //console.log(this.cartCount)
    //     }
    //     if(error){
    //         this.error = error
    //         console.error(error)
    //     }
    // }
    
    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }
    //publishing Record Id
    handleProductSelected(event){
        console.log("selected Product Id", event.detail)
        publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
            ProductId:event.detail
        })
    }
    //on Clicking of Cart
    handleCartClick(event){ 
        this.producttitle='Cart Products';      
        this.productslist(true);
    }       
    productslist(cartchk){
        console.log('Start'+cartchk);
        getProducts({        
            searchKey:this.searchKey,
            cartvalue:cartchk
            }).then(result=>{
                
                this.products=result;
            console.log(result);
            }
            
            );
    }
    handleSearch(){
        this.producttitle='Avaliable Products';
        this.productslist(false);

    }
    //Removing From Cart
    handleProductRemoved(event){
        UpdateRemoveCartProduct({
            prodId:event.detail
        }).then(result=>{
            if(result=='Success'){                  
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Removed From Cart Sucessful',
                    variant: 'success',
                    mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);
                    this.productslist(true);
                    refreshApex(this.wiredCountList);
                }                                
        })
        
    }

}