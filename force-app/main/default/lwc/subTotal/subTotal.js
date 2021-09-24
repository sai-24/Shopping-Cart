import { LightningElement,wire,track} from 'lwc';
import GetCartCount from '@salesforce/apex/getCartProducts.GetCartCount';
import GetCartTotalAmount from '@salesforce/apex/getCartProducts.GetCartTotalAmount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SubTotal extends LightningElement {
    TotalCount;
    TotalAmount;
    @track wiredAmountList = [];
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
    cartAmountHandler(result){
        if(result.data){
            this.wiredAmountList=result;
            //console.log(result.data)
            this.TotalAmount = result.data;            
        }
        if(result.error){
            this.error = result.error
            console.error(result.error)
        }
    }
    handleBuyClick(){
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Orderded Sucessfully',
            variant: 'success',
            mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        
    }
}