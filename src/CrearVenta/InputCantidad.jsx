import React from 'react'
import { 
    TextField,
    InputAdornment,
} from '@material-ui/core'

const styles = {
    textField : {

    }
}

class InputCantidad extends React.Component {

    render(){
        const { cantidad, handleChangeInput, handleKeyPress } = this.props
        return (
            <TextField
                label="Cantidad"
                className={styles.textField}
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