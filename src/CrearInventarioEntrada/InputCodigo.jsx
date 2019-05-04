import React from 'react'
import { 
    TextField,
    InputAdornment,
} from '@material-ui/core'

const styles = {
    textField : {

    }
}

class InputCodigo extends React.Component {
    render(){
        const { codigo, errorCode, handleChangeInput, handleKeyPress } = this.props
        return (
            <TextField
                label="Código"
                className={styles.textField}
                value={codigo}
                onChange={handleChangeInput('codigo')}
                onKeyPress={handleKeyPress}
                error={errorCode}
                helperText={errorCode ? 'Código no conocido' : ''}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment : 
                        <InputAdornment position="start">
                            <i className="fa fa-barcode"></i>
                        </InputAdornment>
                }}
            />
        )
    }
}

export default InputCodigo