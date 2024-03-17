function deleteStoreById(storeIdToDelete, storesArray) {

    const indexToDelete = storesArray.findIndex(store => store.storeId === storeIdToDelete);
  
    if (indexToDelete !== -1) {
      storesArray.splice(indexToDelete, 1);
    }
    return
  }

module.exports = deleteStoreById
  