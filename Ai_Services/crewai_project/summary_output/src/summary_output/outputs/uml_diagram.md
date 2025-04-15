# Uml Diagram.Md

```plantuml
@startuml
actor Customer
actor Admin
actor DeliveryPartner

Customer --> Browse Products
Customer --> Add to Cart
Customer --> Checkout
Customer --> Track Order
Customer --> View Order History
Customer --> Contact Support

Admin --> Manage Products
Admin --> View Orders
Admin --> Process Orders
Admin --> Manage Users
Admin --> Generate Reports
Admin --> Configure System Settings

DeliveryPartner --> Receive Order Assignments
DeliveryPartner --> Track Delivery Status
DeliveryPartner --> Update Delivery Status
DeliveryPartner --> Mark Delivery Complete

@enduml
```