import React from 'react'
import { 
    TextField,
} from '@material-ui/core'
class InputCantidad extends React.Component {

    render(){
        const { cantidad, handleChangeInput, handleKeyPress } = this.props
        return (
            <TextField
                label="Cantidad"
                value={cantidad}
                onChange={handleChangeInput('cantidad')}
                onKeyPress={handleKeyPress}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    type : 'number',
                    value : cantidad
                }}
            />
        ) 
    }
}

export default InputCantidad