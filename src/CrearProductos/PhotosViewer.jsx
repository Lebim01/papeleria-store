import React from 'react'
import './PhotosViewer.css'

class Photo extends React.Component {

    constructor(props){
        super(props)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleFavorite = this.handleFavorite.bind(this)
    }

    handleFavorite(){
        if(window.confirm('¿Estas seguro de hacer esta imagen principal?')){
            this.props.onFavoriteChange(this.props)
        }
    }

    handleRemove(){
        if(window.confirm('¿Estas seguro de eliminar esta imagen?')){
            this.props.onRemove(this.props)
        }
    }

    render(){
        let ext = this.props.filename.split('.')
        ext = ext[ext.length-1]
        let filename = this.props.filename.replace(ext, '')
        if(filename.length > 10){
            filename = filename.substring(0, 10) + '...'
        }

        return (
            <div className="photo-upload grid-item col-sm-3">
                <div className="grid-vertical">
                    <div className="card photo-image">
                        <img src={this.props.url} alt={this.props.alt}/>
                    </div>
                    <div className="mailbox-attachment-info photo-actions grid-item">
                        <a href={this.props.url} download className="mailbox-attachment-name">
                            <i className="fa fa-paperclip"></i> { filename }.{ ext }
                        </a>
                        <div className="photo-actions">
                            <a onClick={this.handleRemove} className="btn btn-default btn-xs">
                                <i className="fa fa-trash"></i>
                            </a>
                            { this.props.favorite 
                                ? <a onClick={this.handleFavorite} className="btn btn-default btn-xs" title="Desmarcar como imagen principal de este producto"><i className="fa fa-star text-yellow"></i></a> 
                                : <a onClick={this.handleFavorite} className="btn btn-default btn-xs" title="Marcar como imagen principal de este producto"><i className="fa fa-star"></i></a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class PhotosViewer extends React.Component {
    render(){
        const { photos, onRemove } = this.props
        return (
            <div className="col-sm-12">
                { photos.map((p, i) => <Photo key={i} {...p} onRemove={onRemove}/>)}
            </div>
        )
    }
}

PhotosViewer.defaultProps = {
    photos : [],
    onRemove : () => { }
}

export default PhotosViewer