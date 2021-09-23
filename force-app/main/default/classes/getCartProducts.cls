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
}
