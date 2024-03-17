const {UnexpectedError} = require('com/errors/index')

const {
    Add_Furniture,
    Add_Books,
    Add_TV,
    Add_Music,
    Add_Photography,
    Add_Phones,
    Add_Computers,
    Add_Electronics,
    Add_Office,
    Add_Games,
    Add_Toys,
    Add_Kids,
    Add_Home,
    Add_Tools,
    Add_BeautyAndHealth,
    Add_Clothes,
    Add_Shoes,
    Add_Jewelry,
    Add_Sports,
    Add_Cars,
    Add_MotorBikes,
    Items_Furniture,
    Items_Books,
    Items_TV,
    Items_Music,
    Items_Photography,
    Items_Phones,
    Items_Computers,
    Items_Electronics,
    Items_Office,
    Items_Games,
    Items_Toys,
    Items_Kids,
    Items_Home,
    Items_Tools,
    Items_BeautyAndHealth,
    Items_Clothes,
    Items_Shoes,
    Items_Jewelry,
    Items_Sports,
    Items_Cars,
    Items_MotorBikes
  } = require("../models");

function routerAdvertisments(kind) {
    let collection

    switch (kind) {
        case 'furniture':
            collection = Add_Furniture;
            break;
        case 'books':
            collection = Add_Books;
            break;
        case 'tv':
            collection = Add_TV;
            break;
        case 'music':
            collection = Add_Music;
            break;
        case 'photography':
            collection = Add_Photography
            break;
        case 'phones':
            collection = Add_Phones
            break
        case 'computers':
            collection = Add_Computers
            break;
        case 'electronics':
            collection = Add_Electronics
            break;
        case 'office':
            collection = Add_Office
            break;
        case 'games':
            collection = Add_Games
            break;
        case 'toys':
            collection = Add_Toys
            break;
        case 'kids':
            collection = Add_Kids
            break;
        case 'home':
            collection = Add_Home
            break
        case 'tools':
            collection = Add_Tools
            break;
        case 'beautyAndHealth':
            collection = Add_BeautyAndHealth
            break;
        case 'clothes':
            collection = Add_Clothes
            break;
        case 'shoes':
            collection = Add_Shoes
            break;
        case 'jewelry':
            collection = Add_Jewelry
            break;
        case 'sport':
            collection = Add_Sports
            break;
        case 'cars':
            collection = Add_Cars
            break;
        case 'motorBikes':
            collection = Add_MotorBikes
            break;   
        default:
            throw new UnexpectedError('Collection not exist');
    }

    return collection
}

function routerDatas(kind) {

    let collection

    switch (kind) {
        case 'furniture':
            collection = Items_Furniture;
            break;
        case 'books':
            collection = Items_Books;
            break;
        case 'tv':
            collection = Items_TV;
            break;
        case 'music':
            collection = Items_Music;
            break;
        case 'photography':
            collection = Items_Photography
            break;
        case 'phones':
            collection = Items_Phones
            break
        case 'computers':
            collection = Items_Computers
            break;
        case 'electronics':
            collection = Items_Electronics
            break;
        case 'office':
            collection = Items_Office
            break;
        case 'games':
            collection = Items_Games
            break;
        case 'toys':
            collection = Items_Toys
            break;
        case 'kids':
            collection = Items_Kids
            break;
        case 'home':
            collection = Items_Home
            break
        case 'tools':
            collection = Items_Tools
            break;
        case 'beautyAndHealth':
            collection = Items_BeautyAndHealth
            break;
        case 'clothes':
            collection = Items_Clothes
            break;
        case 'shoes':
            collection = Items_Shoes
            break;
        case 'jewelry':
            collection = Items_Jewelry
            break;
        case 'sport':
            collection = Items_Sports
            break;
        case 'cars':
            collection = Items_Cars
            break;
        case 'motorBikes':
            collection = Items_MotorBikes
            break;   
        default:
            throw new UnexpectedError('Collection not exist');
    }

    return collection
}

module.exports = {
    routerAdvertisments,
    routerDatas,
}