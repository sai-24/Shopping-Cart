import { LightningElement,wire } from 'lwc';
//Apex class
import getProducts from '@salesforce/apex/getCartProducts.getProducts'
import GetCartCount from '@salesforce/apex/getCartProducts.GetCartCount'
//LMS
import {publish, MessageContext} from 'lightning/messageService'
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c'


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

    @wire(GetCartCount)
    cartcountHandler({data, error}){
        if(data){
            console.log(data)
            this.cartCount = 'Cart('+data+')';
            //console.log(this.cartCount)
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }
    
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

}