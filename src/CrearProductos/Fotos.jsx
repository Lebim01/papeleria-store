import React from 'react'
import PhotosViewer from './PhotosViewer'
import PhotosUploader from '../PhotosUploader'
import green from 'material-ui/colors/green';
import { DELETE_PHOTO_PRODUCT, FAVORITE_PHOTO_PRODUCT } from 'routing'
import { UNEXPECTED } from 'dictionary'
import axios from 'axios'
import toastr from 'toastr'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200
    },
    fab: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
    },
    row : {
        paddingTop : 10,
        paddingBottom : 10,
        marginTop : 5
    },
    textField: {
        width : '100%',
        textAlign : 'left'
    },
    formControl : {
        width : '100%'
    },
    paper: {
        padding: theme.spacing.unit
    },
    checkbox: {
        marginBottom: 16,
    },
    checkboxLabel : {
        color : theme.palette.accent.contrastText,
    },
    padding: {
        padding: `0 ${theme.spacing.unit * 2}px`,
    },
});

class Fotos extends React.Component{

    constructor(props){
        super(props)
        this.onRemove = this.onRemove.bind(this)
        this.onFavoriteChange = this.onFavoriteChange.bind(this)
        this.onChangePhotos = this.onChangePhotos.bind(this)
    }

    onChangePhotos(photos){
        if(this.props.onChangePhotos){
            this.props.onChangePhotos(photos)
        }
    }

    onRemove(photo){
        const { id_photo } = photo
        axios.post(DELETE_PHOTO_PRODUCT, photo)
        .then((r) => {
            if(r.data.status === 200){
                toastr.success('Eliminado correctamente')
                let photos_saved = this.props.photos_saved.filter((p) => p.id_photo !== id_photo)
                this.props.onChangePhotosSaved(photos_saved)
            }else if(r.data.status === 400){
                toastr.error(UNEXPECTED)
            }
        })
    }

    onFavoriteChange({ id_photo }){
        axios.post(FAVORITE_PHOTO_PRODUCT)
        .then((r) => {
            if(r.status === 200){
                toastr.success('Guardado correctamente')
            }else{
                toastr.error(UNEXPECTED)
            }
        })
    }

    render(){
        const { photos_saved, photos } = this.props
        return (
            <div className={styles.root}>
                <PhotosViewer 
                    photos={photos_saved} 
                    onRemove={this.onRemove} 
                    onFavoriteChange={this.onFavoriteChange} 
                />
                <br/>
                <PhotosUploader 
                    enabled={photos_saved.length+photos.length < 4} 
                    onChange={this.onChangePhotos}
                />
            </div>
        )
    }
}
Fotos.defaultProps = {
    photos_saved : []
}

export default Fotos