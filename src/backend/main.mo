import AccessControl "authorization/access-control";
import AuthMixin "authorization/MixinAuthorization";
import BlobMixin "blob-storage/Mixin";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor {
  // --- Authorization state ---
  let _accessControlState = AccessControl.initState();
  include AuthMixin(_accessControlState);
  include BlobMixin();

  // --- Types ---
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    imageId : Text;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
  };

  public type Order = {
    id : Text;
    customerName : Text;
    customerEmail : Text;
    items : [OrderItem];
    fulfilled : Bool;
    createdAt : Int;
  };

  // --- State ---
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  var nextProductId : Nat = 0;
  var nextOrderId : Nat = 0;

  // --- Product functions ---
  public query func listProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, stock : Nat, imageId : Text) : async Product {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let id = nextProductId.toText();
    nextProductId += 1;
    let product : Product = { id; name; description; price; stock; imageId };
    products.add(id, product);
    product;
  };

  public shared ({ caller }) func updateProduct(id : Text, name : Text, description : Text, price : Nat, stock : Nat, imageId : Text) : async ?Product {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (products.get(id)) {
      case (null) { null };
      case (?_) {
        let updated : Product = { id; name; description; price; stock; imageId };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async Bool {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let exists = products.get(id);
    switch (exists) {
      case (null) { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  // --- Order functions ---
  public shared func placeOrder(customerName : Text, customerEmail : Text, items : [OrderItem]) : async Order {
    let id = nextOrderId.toText();
    nextOrderId += 1;
    let order : Order = {
      id;
      customerName;
      customerEmail;
      items;
      fulfilled = false;
      createdAt = Time.now();
    };
    orders.add(id, order);
    order;
  };

  public shared ({ caller }) func listOrders() : async [Order] {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func fulfillOrder(id : Text) : async ?Order {
    if (not AccessControl.isAdmin(_accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (orders.get(id)) {
      case (null) { null };
      case (?order) {
        let updated : Order = {
          id = order.id;
          customerName = order.customerName;
          customerEmail = order.customerEmail;
          items = order.items;
          fulfilled = true;
          createdAt = order.createdAt;
        };
        orders.add(id, updated);
        ?updated;
      };
    };
  };
};
