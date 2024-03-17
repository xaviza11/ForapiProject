const { model } = require('mongoose')
const { users, items, searches, tags, advertisements, posts, stores, countries, chats, likes, codes, renovationTokens, bans, blackList, userItems, basket} = require('./schemas')

const Items_Furniture = model('Items_Furniture', items)
const Items_Books = model('Items_Books', items)
const Items_TV = model('Items_TV', items)
const Items_Music = model('Items_Music', items)
const Items_Photography = model('Items_Photography', items)
const Items_Phones = model('Items_Phones', items)
const Items_Computers = model('Item_Computer', items)
const Items_Electronics = model('Items_Electronics', items)
const Items_Office = model('Items_Office', items)
const Items_Games = model('Items_Games', items)
const Items_Toys = model('Items_Toys', items)
const Items_Kids = model('Items_Kids', items)
const Items_Home = model('Items_Home', items)
const Items_Tools = model('Items_Tools', items)
const Items_BeautyAndHealth = model('Items_BeautyAndHealth', items)
const Items_Clothes = model('Items_Clothes', items)
const Items_Shoes = model('Items_Shoes', items)
const Items_Jewerly = model('Items_Jewerly', items)
const Items_Sports = model('Items_Sports', items)
const Items_Cars = model('Items_Cars', items)
const Items_MotorBike = model('Items_MotorBikes', items)

const Add_Furniture = model('Add_Furniture', advertisements)
const Add_Books = model('Add_Books', advertisements)
const Add_TV = model('Add_TV', advertisements)
const Add_Music = model('Add_Music', advertisements)
const Add_Photography = model('Add_Photography', advertisements)
const Add_Phones = model('Add_Phones', advertisements)
const Add_Computers = model('Add_Computer', advertisements)
const Add_Electronics = model('Add_Electronics', advertisements)
const Add_Office = model('Add_Office', advertisements)
const Add_Games = model('Add_Games', advertisements)
const Add_Toys = model('Add_Toys', advertisements)
const Add_Kids = model('Add_Kids', advertisements)
const Add_Home = model('Add_Home', advertisements)
const Add_Tools = model('Add_Tools', advertisements)
const Add_BeautyAndHealth = model('Add_BeautyAndHealth', advertisements)
const Add_Clothes = model('Add_Clothes', advertisements)
const Add_Shoes = model('Add_Shoes', advertisements)
const Add_Jewerly = model('Add_Jewerly', advertisements)
const Add_Sports = model('Add_Sports', advertisements)
const Add_Cars = model('Add_Cars', advertisements)
const Add_MotorBike = model('Add_MotorBikes', advertisements)

const Users = model('Users', users)
const Searches = model('Searches', searches) 
const Tags = model('Tags', tags)
const Posts = model('Posts', posts)
const Stores = model('Stores', stores )
const Countries = model('Countries', countries)
const Chats = model('chats', chats)
const Likes = model('furnitureLikes', likes)
const Codes = model('Codes', codes)
const RenovationTokens = model('RenovationTokens', renovationTokens)
const Bans = model('Bans', bans)
const BlackList = model('BlackList', blackList)
const UserItems = model('UserItems', userItems)
const Basket = model('Basket', basket)

module.exports = {
    Users,
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
    Items_Jewerly,
    Items_Sports,
    Items_Cars,
    Items_MotorBike,

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
    Add_Jewerly,
    Add_Sports,
    Add_Cars,
    Add_MotorBike,

    Searches,
    Tags,
    Posts,
    Stores,
    Countries,
    Chats,
    Likes,
    Codes, 
    RenovationTokens,
    Bans,
    BlackList,
    UserItems,
    Basket
}
