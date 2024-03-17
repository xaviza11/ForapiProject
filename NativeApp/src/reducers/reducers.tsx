import { SET_HOST, SET_LANGUAGE, SET_COLORSCHEME, SET_USER, SET_WINDOW_WIDTH, SET_WINDOW_HEIGHT, CHANGE_USER_IMAGE, PUSH_CONTENT_LIST, TOGGLE_IS_RETRIEVE_LIKES, SELECT_ITEM, TOGGLE_IS_ON_SEARCHER, SET_BASKET_ITEMS, SELECT_STORE, SELECT_PROPS, RESET_CONTENT_LIST, TOGGLE_ALERT } from '../actions/actions';
import { es, it, cat, ger, ru, fr, en, eu, pt, gl, } from '../languages';

const initialState = {
    language: es,
    host: 'https://apidataforapi-production.up.railway.app/',
    colorScheme: 'light',
    user: {},
    location: {lat: 40.63134149519965, lon: 0.29216278402216744, acc: 0 },
    item: {},
    props: {},
    searchId: '',
    windowWidth: 0,
    windowHeight: 0,
    contentList: [],
    isRetrieveLikes: false,
    itemSelected: {},
    isOnSearcher: false,
    basketItems: [],
    storeSelected: [],
    isAlertOpen: false,
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_LANGUAGE:
            if (action.payload === 'es') return { ...state, language: es }
            else if (action.payload === 'cat') return { ...state, language: cat }
            else if (action.payload === 'en') return { ...state, language: en }
            else if (action.payload === 'fr') return { ...state, language: fr }
            else if (action.payload === 'ru') return { ...state, language: ru }
            else if (action.payload === 'ger') return { ...state, language: ger }
            else if (action.payload === 'it') return { ...state, language: it }
            else if (action.payload === 'pt') return { ...state, language: pt }
            else if (action.payload === 'gl') return { ...state, language: gl }
            else if (action.payload === 'eu') return { ...state, language: eu }
            else return { ...state, language: es }
        case SET_HOST:
            return { ...state, host: action.payload };
        case SET_COLORSCHEME:
            return { ...state, colorScheme: action.payload}
        case SET_USER:
            return {...state, user: action.payload}
        case CHANGE_USER_IMAGE:
            return {
                ...state, user: {
                    ...state.user,
                    image: action.payload
                }
            }
        case SET_WINDOW_WIDTH:
            return { ...state, windowWidth: action.payload }
        case SET_WINDOW_HEIGHT:
            return { ...state, windowHeight: action.payload }
        case PUSH_CONTENT_LIST:
            return { ...state, contentList: [...state.contentList, action.payload] };
        case RESET_CONTENT_LIST:
            return { ...state, contentList: [] }
        case TOGGLE_IS_RETRIEVE_LIKES:
            return { ...state, isRetrieveLikes: action.payload }
        case SELECT_ITEM:
            return { ...state, itemSelected: action.payload }
        case TOGGLE_IS_ON_SEARCHER:
            return { ...state, isOnSearcher: action.payload }
        case SET_BASKET_ITEMS:
            return { ...state, basketItems: action.payload }
        case SELECT_STORE:
            return { ...state, storeSelected: action.payload }
        case SELECT_PROPS:
            return { ...state, props: action.payload }
        case TOGGLE_ALERT:
            return { ...state, isAlertOpen: action.payload }
        default:
            return state;
    }
};

export default reducer;