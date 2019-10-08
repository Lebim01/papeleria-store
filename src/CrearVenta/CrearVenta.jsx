import React from 'react'
import { withStyles } from "material-ui";
import classnames from 'classnames'
import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import {
    TextField,
    Grid,
    Typography,
    Checkbox
} from '@material-ui/core'
import './CrearVenta.css'
import axios from 'axios'
import toastr from 'toastr'
import { ADD_SALE, ONE_PRODUCTS, SUGGESTED_PRICES, GET_PRODUCT_CODE, SEARCH_PRODUCT } from './../routing'
import { UNEXPECTED } from './../dictionary'
import InputCantidad from './InputCantidad'
import ListadoProductos from './ListadoProductos'
import Totales from './Totales'
import AsyncSelect from 'react-select/lib/Async';

const styles = {
    underline : {
        backgroundColor : '#000'
    },
    paper : {
        display : 'inline-block'
    },
    backgroundColor : {
        backgroundColor : 'red'
    },
    fixwidth : {
        width : '30vh'
    }
}

const defaultState = {
    list : [],
    factura : '', 
    cliente : 'CLIENTE DE MOSTRADOR', 
    producto : '',
    descuento : '',
    openAddProduct : false,
    historyPrices : [],
    validcode : false,
    titlecode : '',
    cantidad : 1,
    id_producto : 0,
    isBox: false,
    searchValue : ''
}
const round = (value) => Math.round(value * 100) / 100

class Crear extends React.Component {
    state = { 
        ...defaultState
    }

    resetView = () => {
        this.setState(defaultState)
    }

    calculateTotals = () => {
        const { list } = this.state
        const _subtotal = round(list.reduce((a, b) => a + (b.cantidad * (b.precio_venta || b.placeholder_venta)), 0) || 0)
        const _iva = round(_subtotal * 0.16)
        const _descuento = round((_subtotal + _iva) * (this.state.descuento / 100))
        const _total = round(_subtotal + _iva - _descuento)

        this.setState({
            list,
            _subtotal,
            _iva,
            _descuento,
            _total
        })
    }

    handleChangeInput = name => event => {
        this.setState({
            [name]: event.target.value
        }, this.calculateTotals);
    }

    handleChange = (prod, index) => {
        let list = this.state.list
        list[index] = prod

        this.setState({
            list
        }, () => this.calculateTotals())
    }

    save = (e) => {
        e.preventDefault()
        const _products = this.state.list
        const { factura, cliente, descuento, _descuento, _subtotal, _iva, _total } = this.state

        if(_products.length > 0){
            const params = {
                productos: _products, 
                token : localStorage.getItem('token'),
                factura,
                cliente,
                descuento_porcentaje : descuento,

                descuento : _descuento,
                subtotal : _subtotal,
                iva : _iva,
                total:  _total
            }
            axios.post(ADD_SALE, params)
            .then(({data}) => {
                if(data.status === 200){
                    toastr.success(`Se guardo con éxito`)
                    this.resetView()
                }
                else if(data.message){
                    toastr.error(data.message)
                }
                else {
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    handleAddProduct = async ({ id_producto, precio_compra, precio_venta }) => {
        let list = this.state.list
        let exists = this.state.list.filter((p) => p.id_producto == id_producto).length > 0
        if(!exists){
            let product = (await axios.post(ONE_PRODUCTS, { id: id_producto })).data
            list.push({ id_producto, producto : product.nombre, cantidad : this.state.cantidad, placeholder_compra : precio_compra, placeholder_venta : precio_venta, inventario : product.inventario })
            this.setState({
                list,
                validcode : false,
                titlecode : '',
                openAddProduct : false,
                id_producto : 0,
                cantidad : 1,
                searchValue : ''
            }, this.calculateTotals)
        }else{
            toastr.error('Este producto ya esta en la lista')
        }
    }

    deleteProduct = (id_producto) => {
        let list = this.state.list
        list = list.filter((p) => p.id_producto != id_producto)
        this.setState({
            list
        })
    }

    enterToAddProducto = (event) => {
        if (event.key === 'Enter'){
            this.validCodeProduct()
        }
    }

    validCodeProduct = async () => {
        try {
            const { id_producto, cantidad } = this.state
            if(id_producto && cantidad){
                this.handleAdd()
            }else{
                throw 'Seleccione un producto y coloque una cantidad'
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
            this.handleAddProduct({ precio_compra, precio_venta, ...this.state })
        }
    }

    calcularPrecios = async () => {
        const { id_producto, } = this.state
        const r = await axios.post(SUGGESTED_PRICES, { id_producto, cantidad : this.state.cantidad, precio_compra : null })
        return r.data || { precio_compra : '', precio_venta : '' }
    }

    handleChangeSelect = ({ value, label }, { ...action }) => {
        console.log(this.selectProducts)
        this.setState({
            id_producto : value,
            searchValue : label
        })
    }

    handleChangeSelect2 = (e) => {
        const { id_producto } = this.state
        if(!(id_producto && !e)){
            this.setState({
                searchValue: e
            })
        }
    }

    loadOptions = async (inputValue, callback) => {
        this.setState({
            searchValue: inputValue
        })
        let r = await axios.post(SEARCH_PRODUCT, { search : inputValue, isBox: this.state.isBox })
        callback(r.data.options)
    }

    handleChangeCheckbox = (name) => (e) => {
        this.setState({
            [name]: e.target.checked
        })
    }

    render(){
        const { list, cliente, descuento, errorCodeMessage } = this.state
        const validos = list.filter(product => 
            product.id_producto > 0 &&
            (product.cantidad > 0 || product.cantidad < 0) &&
            (product.precio_venta > 0 || product.placeholder_venta > 0)
        )
        const isValid = validos.length == list.length && list.length > 0
        return (
            <div className="create-line">
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            style={{padding:0}}
                            cardTitle="Crear Venta"
                            headerColor='red'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101',
                                card : 'Card-margin',
                            }}
                            content={
                                <div>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={12} md={4} className={classnames(styles.paper)}>
                                            <TextField
                                                label="Cliente"
                                                className={styles.textField}
                                                value={cliente}
                                                onChange={this.handleChangeInput('cliente')}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4} className={classnames(styles.paper)}>
                                            <TextField
                                                label="% Descuento"
                                                className={styles.textField}
                                                value={descuento}
                                                placeholder="0-100 %"
                                                onChange={this.handleChangeInput('descuento')}
                                                fullWidth
                                                InputProps={{
                                                    type :"number"
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <hr/>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={2} md={1} className={classnames(styles.paper)} style={{textAlign:'right'}}>
                                            <span>¿Es paquete?</span>
                                            <Checkbox style={{padding:0}} value="1" checked={this.state.isBox} onChange={this.handleChangeCheckbox('isBox')} />
                                        </Grid>
                                        <Grid item xs={12} md={4} className={classnames(styles.paper)}>
                                            <Typography>Buscar por nombre, palabras clave, marca, linea</Typography>
                                            <AsyncSelect
                                                ref={this.selectProducts}
                                                value={this.state.id_producto}
                                                inputValue={this.state.searchValue}
                                                onInputChange={this.handleChangeSelect2}

                                                onKeyDown={this.enterToAddProducto}

                                                loadOptions={this.loadOptions}
                                                defaultOptions
                                                onChange={this.handleChangeSelect}
                                                placeholder='Buscar...'
                                            />
                                            {errorCodeMessage && <span className="text-danger">{errorCodeMessage}</span>}
                                        </Grid>
                                        <Grid item xs={12} md={2} className={classnames(styles.paper)}>
                                            <InputCantidad 
                                                handleChangeInput={this.handleChangeInput}
                                                handleKeyPress={this.enterToAddProducto}
                                                cantidad={this.state.cantidad}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            style={{padding:0}}
                            cardTitle="Productos"
                            headerColor='red'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <ListadoProductos list={list} handleChange={this.handleChange} deleteProduct={this.deleteProduct} black={this.props.black} />
                                    <br/>
                                    <br/>
                                    <Totales _subtotal={this.state._subtotal} _iva={this.state._iva} _total={this.state._total} _descuento={this.state._descuento} />
                                </div>
                            }
                            footer={
                                <div>
                                    <Button color="simple" classes={{ button: 'text-body' }} onClick={this.goList}>
                                        <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Regresar
                                    </Button>
                                    <Button color="success" onClick={this.save} disabled={!isValid}>
                                        { this.state.id !== null ? 'Guardar' : 'Crear' }
                                    </Button>
                                </div>
                            }
                        />
                    </ItemGrid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Crear)