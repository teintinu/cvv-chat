
var settings = {
  publish_key: 'pub-5ad63a7a-0c72-4b86-978d-960dcdb971e1'
  , subscribe_key: 'sub-459a5e4a-9de6-11e0-982f-efe715a9b6b8'
  , secret_key: 'sec-fa847381-dcdb-4bcf-a8aa-7b812c390441'
  , cipher_key: 'ODgwNDsmIzczMDustKOiJiM4NzM0O7aqSDNh2mig'
  , ssl: true
};

declare var PUBNUB: any;

var db = PUBNUB.sync('db-admin', settings);

// View All Items in DB
db.all(function (item: any) {       /* -- render all items  -- */ });

// Register All Callback Events
db.on.create(function (item:any) { /* -- new item          -- */ });
db.on.update(function (item:any) { /* -- updated item      -- */ });
db.on.delete(function (item:any) { /* -- removed item      -- */ });

// // Create Item
// var item = db.create({ headline: "Hello!" });

// // Update Item
// item.update({ headline: "Hello Update!" });

// // Delete Item
// item.delete();