import React from 'react'
import PropTypes from 'prop-types'

class PhotoPreview extends React.Component {

    render(){
        const style = {
            width : '100%',
            height : '100%'
        }
        return (
            <div className="photo-preview grid-item">
                <a className="button button-circle remove-preview"
                    style={{cursor:'pointer'}} 
                    onClick={() => this.props.handleRemove(this.props)}><i className="fa fa-times"></i></a>
                <img src={this.props.preview} style={style} alt=""/>
            </div>
        );
    }
}

PhotoPreview.propsTypes = {
    preview : PropTypes.string,
    size : PropTypes.number,
    type : PropTypes.string,
    name : PropTypes.string,
    handleRemove : PropTypes.func
}

export default PhotoPreview