import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import axios from 'axios'
import promise from 'redux-promise-middleware'
import trunk from 'redux-thunk'

const initialState = { 
    photos : [],
    error : null
}

const removeImage = (action) => {
    axios.post('phrapi/products/removeImage', action)
    .then((r) => {
        if(r.data.status === 200){
            store.dispatch({ type: 'REMOVE_IMAGE_SUCCESS', id_photo : action.id_photo })
        }else{
            store.dispatch({ type: 'REMOVE_IMAGE_FAILED' })
        }
    })
    .catch((err) => store.dispatch({ type: 'REMOVE_IMAGE_FAILED', error : err }))
}

const toggleFavorite = (action) => {
    axios.post('phrapi/products/favoriteImage', action)
    .then((r) => {
        if(r.data.status === 200){
            store.dispatch({ type: 'TOGGLE_FAVORITE_SUCCESS', id_photo : action.id_photo, favorite : r.data.favorite })
        }else{
            store.dispatch({ type: 'TOGGLE_FAVORITE_FAILED' })
        }
    })
    .catch((err) => store.dispatch({ type: 'TOGGLE_FAVORITE_FAILED', error : err }))
}

const changePositionImage = (action) => {
    axios.post('phrapi/products/positionImage', { newPosition : action.newPosition, oldPosition : action.oldPosition, id : action.id_product })
    .then((r) => {
        if(r.data.status === 200){
            store.dispatch({ type: 'CHANGE_POSITION_SUCCESS', id_photo : action.id_product, oldPosition : action.oldPosition, newPosition : action.newPosition, images : r.data.photos })
        }else{
            store.dispatch({ type: 'CHANGE_POSITION_FAILED' })
        }
    })
    .catch((err) => store.dispatch({ type: 'CHANGE_POSITION_FAILED', error : err }))
}

const saveTitle = (action) => {
    axios.post('phrapi/productsGallery/saveTitle', { id_photo : action.id_photo, title : action.title })
    .then((r) => {
        if(r.data.status === 200){
            store.dispatch({ type: 'SAVE_TITLE_SUCCESS', id_photo : action.id_product, title : action.title })
        }else{
            store.dispatch({ type: 'SAVE_TITLE_FAILED' })
        }
    })
    .catch((err) => store.dispatch({ type: 'SAVE_TITLE_FAILED', error : err }))
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PHOTOS' : {
            return Object.assign({}, state, {
                lastAction :  action.type,
                photos : action.photos
            })
        }
        case 'POSITION_CHANGE' : {
            changePositionImage(action)
            break;
        }
        case 'REMOVE': {
            removeImage(action)
            break;
        }
        case 'REMOVE_IMAGE_SUCCESS': {
            state.photos.map((i) => {
                if(i.id_photo != action.id_photo){
                    return i
                }
            })
            return Object.assign({}, state, {
                lastAction : action.type,
                photos : state.photos.filter((i) => i.id_photo != action.id_photo)
            })
        }
        case 'TOGGLE_FAVORITE': {
            toggleFavorite(action)
            break;
        }
        case 'TOGGLE_FAVORITE_SUCCESS': {
            return Object.assign({}, state, {
                lastAction : action.type,
                photos : state.photos.map((i) => {
                    if(i.id_photo == action.id_photo){
                        i.favorite = action.favorite
                    }
                    return i
                })
            })
        }
        case 'TOGGLE_EDIT': {
            return Object.assign({}, state, {
                lastAction : action.type,
                id_photo : action.id_photo,
                editing : true,
                photos : state.photos.map((i) => {
                    if(i.id_photo == action.id_photo){
                        i.editing = !i.editing
                    }
                    return i
                })
            })
        }
        case 'SAVE_TITLE': {
            saveTitle(action)
            break;
        }
        case 'SAVE_TITLE_SUCCESS' : {
            return Object.assign({}, state, {
                lastAction : action.type,
                title : action.title,
                editing : false
            })
        }
        case 'SAVE_IMAGE_FAILED' : {
            return Object.assign({}, state, { error : action.error, editing : false })
        }
        default : {
            break;
        }
    }
    return Object.assign({}, state, { error : null, lastAction : action.type })
}

const 
    middleware = applyMiddleware(createLogger(), trunk, promise()),
    store = createStore(reducer, middleware),
    ACTIONS_TO_REFRESH = ['REMOVE_IMAGE_SUCCESS', 'TOGGLE_FAVORITE_SUCCESS', 'TOGGLE_EDIT', 'SAVE_TITLE', 'SET_PHOTOS', 'REMOVE_IMAGE_SUCCESS']

export {
    ACTIONS_TO_REFRESH
}
export default store