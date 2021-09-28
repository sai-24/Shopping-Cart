public with sharing class getCartProducts {
@AuraEnabled(cacheable=false)
public static list<shop_product__c> getProducts(String searchKey,Boolean cartvalue) {
    System.debug('Search--->'+searchKey);
    System.debug('Cart--->'+cartvalue);
    String key = '%' + searchKey + '%';
    return [
        SELECT Id, product_name__c, price__c, brand__c, Description__c, Picture_URL__c,Cart__c
        FROM shop_product__c
        WHERE product_name__c LIKE :key and Cart__c =: cartvalue
        WITH SECURITY_ENFORCED
        LIMIT 10
    ];

}
@AuraEnabled
public static string UpdateCartProduct(Id prodId){
    try {
        shop_product__c sp=[SELECT Id,product_name__c,price__c,Cart__c FROM shop_product__c WHERE Id=: prodId];
        sp.Cart__c=true;
        update sp;
        return 'Success';
    } catch (Exception e) {
        return(e.getMessage());
    }
}
@AuraEnabled
public static string UpdateRemoveCartProduct(Id prodId){
    try {
        shop_product__c sp=[SELECT Id,product_name__c,price__c,Cart__c FROM shop_product__c WHERE Id=: prodId];
        sp.Cart__c=false;
        update sp;
        return 'Success';
    } catch (Exception e) {
        return(e.getMessage());
    }
}
@AuraEnabled(cacheable=true)
public static Integer GetCartCount(){
    try {
        return [SELECT count() FROM shop_product__c where Cart__c =: true];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}

@AuraEnabled(cacheable=true)
public static Object GetCartTotalAmount(){
    try {
        AggregateResult[] groupedResults = [SELECT SUM(price__c)sumprice FROM shop_product__c where Cart__c =: true];
        Object cartamt = groupedResults[0].get('sumprice');
        system.debug('Amount-->'+cartamt);
        return cartamt;
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}

@AuraEnabled
public static string UpdateOrder(Integer CountProduct,Decimal GetAmount){
    try {
        List<Cart_Product_Item__c> OrderProductList=new List<Cart_Product_Item__c>();
        List<shop_product__c> CartProducts=[select Id,product_name__c FROM shop_product__c where Cart__c =: true ];
       
        if(CartProducts.size() != CountProduct){
            return 'Seems Error...,Please refresh.';
        }
        Cart_Order__c ord= new Cart_Order__c(            
            Account__c='0015g00000TCeSqAAL',
            Number_of_Products__c=CountProduct,
            price__c=GetAmount,
            Path__c='Activate'
        );
        insert ord;
        for(shop_product__c shop : CartProducts){
            Cart_Product_Item__c Productitems= new Cart_Product_Item__c(
                Cart_Order__c=ord.id,
                shopproduct__c=shop.Id,
                Status__c='Active'                
            );
            OrderProductList.add(Productitems);
            UpdateRemoveCartProduct(shop.Id);
        }
        insert OrderProductList;
       
        return 'Success';
    } catch (Exception e) {
        return(e.getMessage());
    }
}
@AuraEnabled(cacheable=true)
public static List<Cart_Order__c> GetRecentOrders(){
    try {
        return [select Id,Name from Cart_Order__c order by CreatedDate DESC LIMIT 10];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
}
