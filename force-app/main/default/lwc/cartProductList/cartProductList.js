import { LightningElement,wire,track } from 'lwc';
//Apex class
import getProducts from '@salesforce/apex/getCartProducts.getProducts';
import GetCartCount from '@salesforce/apex/getCartProducts.GetCartCount';
import GetCartTotalAmount from '@salesforce/apex/getCartProducts.GetCartTotalAmount';
import UpdateRemoveCartProduct from '@salesforce/apex/getCartProducts.UpdateRemoveCartProduct';
//LMS
import {publish, MessageContext} from 'lightning/messageService';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';
//Toast message
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


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
     @track wiredAmountList = [];

     issearchLoaded = false
     iscartLoaded = false
    // renderedCallback(){
    //     if(this.isLoaded) return
    //     const style = document.createElement('style')
    //     style.innerText = `c-cart-product-list .setcolour{
    //         background: blue;
    //         color: white;
    //     } `
    //     this.template.querySelector('lightning-button').appendChild(style)
    //     this.isLoaded = true
    // }

     //Cart Count 
     @wire(GetCartCount) cartcountHandler(result) {
        this.wiredCountList = result;    
        if (result.data) {
          //console.log('Count--->'+ result.data);
          this.cartCount = 'Cart('+result.data+')';          
          this.error = undefined;
        } else if (result.error) {
          this.error = result.error;
          this.cartCount = 'Cart(0)';
        }
        else{
            this.cartCount = 'Cart(0)';
         
        }
      }
      //Cart Amount
      @wire(GetCartTotalAmount)
      cartAmountHandler(result){
          if(result.data){
              this.wiredAmountList = result;
              //console.log(result.data)
              this.TotalAmount = result.data;            
          }
          if(result.error){
              this.error = result.error
              console.error(result.error)
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
        // if(this.iscartLoaded) return
        // const style = document.createElement('style')
        // style.innerText = `c-cart-product-list .setcolour{
        //     background: red;
        //     color: white;
        // } `
        // this.template.querySelector('lightning-button').appendChild(style)
        // this.iscartLoaded = true
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
                    refreshApex(this.wiredAmountList);
                }                                
        })
        
    }
  
}