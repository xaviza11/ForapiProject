export const SET_LANGUAGE = 'SET_LANGUAGE'
export const SET_HOST = 'SET_HOST'
export const SET_COLORSCHEME = 'SET_COLORSCHEME'
export const SET_USER = 'SET_USER'
export const SET_LOCATION = 'SET_LOCATION'
export const SET_WINDOW_WIDTH = 'SET_WINDOW_WIDTH'
export const SET_WINDOW_HEIGHT = 'SET_WINDOW_HEIGHT'
export const CHANGE_USER_IMAGE = 'CHANGE_USER_IMAGE'
export const PUSH_CONTENT_LIST = 'PUSH_CONTENT_LIST'
export const TOGGLE_IS_RETRIEVE_LIKES = 'TOGGLE_IS_RETRIEVE_LIKES'
export const SELECT_ITEM = 'SELECT_ITEM'
export const TOGGLE_IS_ON_SEARCHER = 'TOGGLE_IS_ON_SEARCHER'
export const SET_BASKET_ITEMS = 'SET_BASKET_ITEMS'
export const SELECT_STORE = 'SELECT_STORE'
export const SELECT_PROPS = 'SELECT_PROPS'
export const RESET_CONTENT_LIST = 'RESET_CONTENT_LIST'
export const TOGGLE_ALERT = 'TOGGLE_ALERT'

export const setLanguage = (language: string) => ({
  type: SET_LANGUAGE,
  payload: language,
})

export const setHost = (host: string) => ({
  type: SET_HOST,
  payload: host,
})

export const setColorScheme = (colorScheme: string) => ({
  type: SET_COLORSCHEME,
  payload: colorScheme
})

export const setUser = (user: object) => ({
  type: SET_USER,
  payload: user
})

export const setWindowWidth = (width: number) => ({
  type: SET_WINDOW_WIDTH,
  payload: width
})

export const setWindowHeight = (height: number) => ({
  type: SET_WINDOW_HEIGHT,
  payload: height
})

export const changeUserImage = (url: string) => ({
  type: CHANGE_USER_IMAGE,
  payload: url
})

export const pushContentList = (contentList: any[]) => ({
  type: PUSH_CONTENT_LIST,
  payload: contentList
})

export const isRetrieveLikes = (isRetrieveLikes: boolean) => ({
  type: TOGGLE_IS_RETRIEVE_LIKES,
  payload: isRetrieveLikes
})

export const selectItem = (itemSelected: object) => ({
  type: SELECT_ITEM,
  payload: itemSelected
})

export const toggleSearcher = (isOnSearcher: boolean) => ({
  type: TOGGLE_IS_ON_SEARCHER,
  payload: isOnSearcher
})

export const setBasketItems = (basketItems: object) => ({
  type: SET_BASKET_ITEMS,
  payload: basketItems
})

export const selectStore = (storeSelected:  []) => ({
  type: SELECT_STORE,
  payload: storeSelected
}) 

export const selectProps = (props: object) => ({
  type: SELECT_PROPS,
  payload: props
})

export const resetContentList = () => ({
  type: RESET_CONTENT_LIST,
})

export const toggleAlert = (isAlertOpen: boolean) => ({
  type: TOGGLE_ALERT,
  payload: isAlertOpen 
})