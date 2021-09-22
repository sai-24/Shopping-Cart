public with sharing class getCartProducts {
    @AuraEnabled(cacheable=true)
    public static list<shop_product__c> getProducts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, product_name__c, price__c, brand__c, Description__c, Picture_URL__c
            FROM shop_product__c
            WHERE product_name__c LIKE :key 
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];

    }
}
