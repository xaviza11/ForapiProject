function updateStores(json, newObject) {
    const index = json.stores.findIndex(object => object.storeId === newObject.storeId);
    
    if (index !== -1) {
      json.stores[index] = newObject;
    } else {
      json.stores.push(newObject);
    }
  }

module.exports = updateStores