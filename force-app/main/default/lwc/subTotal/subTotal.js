import { LightningElement,wire} from 'lwc';
import GetCartCount from '@salesforce/apex/getCartProducts.GetCartCount';
import GetCartTotalAmount from '@salesforce/apex/getCartProducts.GetCartTotalAmount';

export default class SubTotal extends LightningElement {
    TotalCount;
    TotalAmount;
    @wire(GetCartCount)
    cartcountHandler({data, error}){
        if(data){
            console.log(data)
            this.TotalCount = data;            
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }
    @wire(GetCartTotalAmount)
    cartAmountHandler({data, error}){
        if(data){
            console.log(data)
            this.TotalAmount = data;            
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }
    handleBuyClick(){
        
    }
}