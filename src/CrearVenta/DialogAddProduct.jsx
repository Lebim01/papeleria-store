import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Grid,
    InputAdornment,
    Button,
    DialogTitle,
    Typography
}
from '@material-ui/core'
import AsyncSelect from 'react-select/lib/Async';
import axios from 'axios'
import { SEARCH_PRODUCT, GET_PRODUCT_CODE, SUGGESTED_PRICES } from 'routing'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200
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
    chip: {
        margin: theme.spacing.unit / 2,
    },
});


class DialogAddProduct extends React.Component {
    state = {
        id_producto : 0,
        codigo : '',
        busqueda : '',
        errorCode : false
    }

    constructor(props){
        super(props)
        this.handleChangeSelect = this.handleChangeSelect.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.validCodeProduct = this.validCodeProduct.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.onEnter = this.onEnter.bind(this)
    }

    onEnter(){
        this.setState({
            codigo : '',
            busqueda : ''
        })
    }

    handleChangeSelect = ({ value, label }) => {
        this.setState({
            id_producto : value
        })
    }

    handleChangeInput = name => event => {
        this.setState({
            [name]: event.target.value
        });
    }

    loadOptions = async (inputValue, callback) => {
        let r = await axios.post(SEARCH_PRODUCT, { search : inputValue })
        callback(r.data.options)
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter'){ 
            event.preventDefault();
            this.validCodeProduct()
        }
    }

    validCodeProduct = async () => {
        try {
            let r = await axios.post(GET_PRODUCT_CODE, { code : this.state.codigo })
            if(r.data.id){
                this.setState({
                    errorCode : false,
                    id_producto : r.data.id
                })
                this.handleAdd()
            }else{
                throw 'Producto no conocido'
            }
        }catch(e){
            this.setState({
                errorCode : true,
                errorCodeMessage : e
            })
        }
    }

    handleAdd = async () => {
        if(this.state.id_producto){
            const { precio_compra, precio_venta } = await this.calcularPrecios()
            this.props.handleAdd({ precio_compra, precio_venta, ...this.state })
        }
    }

    async calcularPrecios(){
        const { id_producto, } = this.state
        const r = await axios.post(SUGGESTED_PRICES, { id_producto, cantidad : 0, precio_compra : null })
        return r.data || { precio_compra : '', precio_venta : '' }
    }

    render(){
        const { codigo, errorCode } = this.state
        return (
            <Dialog
                onClose={this.props.handleClose}
                aria-labelledby="customized-dialog-title"
                fullWidth={true}
                maxWidth={'md'}
                open={this.props.open}
                onEnter={this.onEnter}
                PaperProps={{
                    style: {
                        overflowY : 'visible'
                    },
                }}
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                    Buscar Producto
                </DialogTitle>
                <DialogContent style={{overflowY : 'unset'}}>
                    <Grid container spacing={24} className={styles.row}>
                        <Grid item xs={12} md={6} className={styles.paper}>
                            <TextField
                                label="Código"
                                className={styles.textField}
                                value={codigo}
                                onChange={this.handleChangeInput('codigo')}
                                onKeyPress={this.handleKeyPress}
                                error={errorCode}
                                helperText={errorCode ? 'Código no conocido' : ''}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment : 
                                        <InputAdornment position="start">
                                            {/* CODIGO DE BARRAS FONTAWESOME */}
                                            <i className="fa fa-barcode"></i>
                                        </InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} className={styles.paper}>
                            <Typography>Buscar por nombre, palabras clave, marca, linea</Typography>
                            <AsyncSelect
                                loadOptions={this.loadOptions}
                                defaultOptions
                                onChange={this.handleChangeSelect}
                                onInputChange={this.handleInputChange}
                                placeholder='Buscar...'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleAdd} color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default DialogAddProduct