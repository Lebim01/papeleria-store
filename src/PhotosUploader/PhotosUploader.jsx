import React from 'react'
import Dropzone from 'react-dropzone'
import PhotoPreview from './PhotoPrewiew.jsx'
import "./PhotosUploader.css"

class PhotosUploader extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            files : []
        }
        this.handleRemoveFile = this.handleRemoveFile.bind(this)
    }

    cleanImages(){
        this.setState({
            files : []
        })
    }

    getImages(){
        return this.state.files
    }

    onDrop(files) {
        const { limit, replace } = this.props
        
        let _newFiles = replace 
                            ? files
                            : this.state.files.concat(files)
        this.setState({
            files : limit !== null ? _newFiles.slice(0, limit) : _newFiles
        });

        if(this.props.onChange){
            this.props.onChange(_newFiles)
        }
    }

    handleRemoveFile(file){
        let _newFiles = this.state.files
        _newFiles = _newFiles.filter((f) => f.preview !== file.preview)
        this.setState({
            files : _newFiles
        })

        if(this.props.onChange){
            this.props.onChange(_newFiles)
        }
    }

    render(){
        const { enabled, showTitle, css, textDrop } = this.props
        return (
            <div className="photos-uploader">
                <div className="photos-uploader-actions">

                </div>
                <div className="photos-uploader-viewport">
                    { enabled &&
                        <div className="col-md-3 col-sm-12" style={{display:'inline-block'}}>
                            <Dropzone 
                                accept="image/jpeg, image/png"
                                onDrop={this.onDrop.bind(this)}>
                                { textDrop === null && <p>Arrastra los archivos aqui, o da click para seleccionar.</p> }
                                { textDrop !== null && <p>{ textDrop }</p> }
                            </Dropzone>
                        </div>
                    }
                    <div className="col-md-8 col-sm-12" style={{display:'inline-block', ... css}}>
                        { showTitle && <h2>Subir imagenes</h2> }
                        <div className="photos-uplader-images">
                            {
                                this.state.files.map((f, i) => 
                                    <PhotoPreview 
                                        handleRemove={this.handleRemoveFile} 
                                        key={i} 
                                        name={f.name} 
                                        size={f.size} 
                                        preview={f.preview} 
                                        type={f.type} 
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PhotosUploader.defaultProps = {
    showTitle : true,
    half : false,
    enabled : true,
    limit : null,
    replace : false,
    loadPreview : null,
    textDrop : null
}

export default PhotosUploader