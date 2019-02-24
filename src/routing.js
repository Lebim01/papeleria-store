let HOST = `http://api-papeleria.teknovatemzt.com:8080/index.php`

module.exports = {
    LOGIN : `${HOST}/admin/login`,
    AUTH : `${HOST}/admin/auth`,

    INVENTORY : `${HOST}/inventario`,
    ADD_INVENTORY : `${HOST}/inventario/save`,
    SUGGESTED_PRICES : `${HOST}/inventario/suggestedPrices`,

    SALES : `${HOST}/ventas`,
    ADD_SALE : `${HOST}/ventas/save`,

    LIST_LINEAS : `${HOST}/lineas/list`,
    ONE_LINEAS : `${HOST}/lineas/one`,
    SAVE_LINEAS : `${HOST}/lineas/save`,
    DELETE_LINEAS : `${HOST}/lineas/delete`,

    LIST_PRODUCTS : `${HOST}/productos/list`,
    CHANGE_STATUS_PRODUCTS : `${HOST}/productos/status`,
    SAVE_PRODUCTS : `${HOST}/productos/save`,
    DELETE_PRODUCTS : `${HOST}/productos/delete`,
    ONE_PRODUCTS : `${HOST}/productos/one`,
    GET_PRODUCT_CODE : `${HOST}/productos/oneCode`,
    UP_PHOTOS_PRODUCTS : `${HOST}/productos/upPhoto`,
    DELETE_PHOTO_PRODUCT : `${HOST}/productos/deletePhoto`,
    FAVORITE_PHOTO_PRODUCT : `${HOST}/productos/favoritePhoto`,
    CHANGE_PRICE_PRODUCTS : `${HOST}/productos/changePrice`,
    SEARCH_PRODUCT : `${HOST}/productos/search`,
    GET_PRODUCT : `${HOST}/productos/get`,
    LIST_PRICE_PRODUCT : `${HOST}/productos/historyPrice`,

    LIST_CLIENTS : `${HOST}/clientes/list`,
    ONE_CLIENTS : `${HOST}/clientes/one`,
    SAVE_CLIENTS : `${HOST}/clientes/save`,
    DELETE_CLIENTS : `${HOST}/clientes/delete`,
    LIST_MARCAS : `${HOST}/marcas/list`,
    ONE_MARCAS : `${HOST}/marcas/one`,
    SAVE_MARCAS : `${HOST}/marcas/save`,
    DELETE_MARCAS : `${HOST}/marcas/delete`,

    LIST_SELL : `${HOST}/ventas/list`,
    SELL_ONE : `${HOST}/ventas/one`,
    SAVE_SELL : `${HOST}/ventas/save`,

    LIST_BLOC : `${HOST}/bloc/list`,
    ONE_BLOC : `${HOST}/bloc/one`,
    SAVE_BLOC : `${HOST}/bloc/save`,
    DELETE_BLOC : `${HOST}/bloc/delete`,

    LIST_FAMOUS : `${HOST}/famous/list`,
    ONE_FAMOUS : `${HOST}/famous/one`,
    DELETE_FAMOUS : `${HOST}/famous/delete`,
    SAVE_FAMOUS : `${HOST}/famous/save`,

    ONE_MASTER : `${HOST}/master/one`,
    SAVE_MASTER : `${HOST}/master/save`,
    UP_IMAGE_MASTER : `${HOST}/master/upImage`,
    DELETE_IMAGE_MASTER : `${HOST}/master/deleteImage`,

    ONE_INICIO : `${HOST}/inicio/one`,
    UP_IMAGE_INICIO : `${HOST}/inicio/upImage`,
    DELETE_IMAGE_INICIO : `${HOST}/inicio/deleteImage`,

    
}