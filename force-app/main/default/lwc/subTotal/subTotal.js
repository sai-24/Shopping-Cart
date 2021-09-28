import { LightningElement,wire,track} from 'lwc';
import GetCartCount from '@salesforce/apex/getCartProducts.GetCartCount';
import GetCartTotalAmount from '@salesforce/apex/getCartProducts.GetCartTotalAmount';
import GetRecentOrders from '@salesforce/apex/getCartProducts.GetRecentOrders';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import UpdateOrder from '@salesforce/apex/getCartProducts.UpdateOrder';
import { refreshApex } from '@salesforce/apex';
export default class SubTotal extends LightningElement {
    TotalCount;
    TotalAmount;
    error;
    @track wiredAmountList = [];
    @track wiredCountList=[];
     //Cart Count 
     @wire(GetCartCount) cartcountHandler(result) {
        this.wiredCountList = result;    
        if (result.data) {
          //console.log('Count--->'+ result.data);
          this.TotalCount = result.data;          
          this.error = undefined;
        } else if (result.error) {
          this.error = result.error;
          this.TotalCount = 0;
        }
        else{
            this.TotalCount = 0;
         
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
          else if(result.error){
              this.error = result.error
              console.error(result.error)
          }else{
              this.TotalAmount=0;
          }
      }
      //Recent Orders
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
    handleBuyClick(){
        UpdateOrder({
            CountProduct:this.TotalCount,
            GetAmount:this.TotalAmount
        }).then(result=>{
            console.log('Order Status--->'+result);
            if(result == 'Success'){
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Orderded Sucessfully',
                variant: 'success',
                mode: 'dismissable'
                });
                this.dispatchEvent(evt);
                refreshApex(this.wiredCountList);
                refreshApex(this.wiredAmountList);
                refreshApex(this.wiredRecentList);
            }
        });
       
        
    }
}