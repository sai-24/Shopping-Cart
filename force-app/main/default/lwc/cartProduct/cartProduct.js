import { LightningElement,api } from 'lwc';
import UpdateRemoveCartProduct from '@salesforce/apex/getCartProducts.UpdateRemoveCartProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CartProduct extends LightningElement {
    @api product={};
    handleClick(){
        this.dispatchEvent(new CustomEvent('selected', {
            detail:this.product.Id
        }))
    }
    handleRemoveCartClick(){
        UpdateRemoveCartProduct({
            prodId:this.product.Id
        }).then(result=>{
            console.log(result);
            if(result=='Success'){
                this.showCart=true;       
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Removed From Cart Sucessful',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            }
        })

    }
}