import React from 'react'
import { withStyles } from "material-ui";
import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import {
    TextField,
    Grid,
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Tooltip
} from '@material-ui/core'
import './CrearVenta.css'
import axios from 'axios'
import toastr from 'toastr'
import { ADD_SALE, ONE_PRODUCTS, SUGGESTED_PRICES, GET_PRODUCT_CODE } from './../routing'
import { UNEXPECTED } from './../dictionary'
import DialogAddProduct from './DialogAddProduct';
import AddProducto from './AddProducto'
import DialogHistoryPrice from '../CrearInventarioEntrada/DialogHistoryPrice'
import InputCodigo from './InputCodigo'
import DelayInput from './DelayInput'

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

class Crear extends React.Component {
    state = { 
        list : [],
        factura : '', 
        cliente : 'CLIENTE DE MOSTRADOR', 
        producto : '',
        descuento : '',
        openAddProduct : false,
        historyPrices : [],
        validcode : false,
        titlecode : ''
    }

    constructor(props){
        super(props)

        this.add = this.add.bind(this)
        this.save = this.save.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleCloseAddProduct = this.handleCloseAddProduct.bind(this)
        this.openModalHistoryPrice = this.openModalHistoryPrice.bind(this)
        this.handleCloseHistoryPrice = this.handleCloseHistoryPrice.bind(this)
        this.getPreviewCode = this.getPreviewCode.bind(this)
    }

    calculateTotals(){
        const { list } = this.state
        const _subtotal = this.round(list.reduce((a, b) => a + (b.cantidad * (b.precio_venta || b.placeholder_venta)), 0) || 0)
        const _iva = this.round(_subtotal * 0.16)
        const _descuento = this.round((_subtotal + _iva) * (this.state.descuento / 100))
        const _total = this.round(_subtotal + _iva - _descuento)

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
        }, () => {
            this.calculateTotals()
            if(name === 'codigo'){
                this.getPreviewCode()
            }
        });
    }

    handleChange = (prod, index) => {
        let list = this.state.list
        list[index] = prod

        this.setState({
            list
        }, () => this.calculateTotals())
    }

    goList(){
        window.location = '#/ventas'
    }

    save(e){
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
                    this.goList()
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

    add(){
        /**/
        
        // OPEN MODAL
        this.setState({
            openAddProduct : true
        })
    }

    handleCloseAddProduct(){
        this.setState({
            openAddProduct : false
        })
    }

    async handleAddProduct({ id_producto, precio_compra, precio_venta }){
        let list = this.state.list
        let exists = this.state.list.filter((p) => p.id_producto == id_producto).length > 0
        if(!exists){
            let product = (await axios.post(ONE_PRODUCTS, { id: id_producto })).data
            list.push({ id_producto, producto : product.nombre, cantidad : 0, placeholder_compra : precio_compra, placeholder_venta : precio_venta, inventario : product.inventario })
            this.setState({
                list,
                validcode : false,
                titlecode : '',
                openAddProduct : false
            })
        }else{
            toastr.error('Este producto ya esta en la lista')
        }
    }

    deleteProduct(id_producto){
        let list = this.state.list
        list = list.filter((p) => p.id_producto != id_producto)
        this.setState({
            list
        })
    }

    round(value){
        return Math.round(value * 100) / 100
    }

    openModalHistoryPrice(data){
        this.setState({
            openHistoryPrice : true,
            historyPrices : data
        })
    }

    handleCloseHistoryPrice(){
        this.setState({
            openHistoryPrice : false
        })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter'){ 
            event.preventDefault();
            this.validCodeProduct()
        }
    }

    validCodeProduct = async () => {
        try {
            let { data } = await axios.post(GET_PRODUCT_CODE, { code : this.state.codigo })
            if(data.id){
                this.setState({
                    errorCode : false,
                    id_producto : data.id,
                    codigo : ''
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

    getPreviewCode = async () => {
        try {
            let { data } = await axios.post(GET_PRODUCT_CODE, { code : this.state.codigo })
            if(data.id){
                this.setState({
                    validcode : true,
                    titlecode : data.nombre
                })
            }else{
                throw 'Producto no conocido'
            }
        } catch(e) {
            this.setState({
                validcode : false,
                titlecode : ''
            })
        }
    }

    handleAdd = async () => {
        if(this.state.id_producto){
            const { precio_compra, precio_venta } = await this.calcularPrecios()
            this.handleAddProduct({ precio_compra, precio_venta, ...this.state })
        }
    }

    async calcularPrecios(){
        const { id_producto, } = this.state
        const r = await axios.post(SUGGESTED_PRICES, { id_producto, cantidad : 0, precio_compra : null })
        return r.data || { precio_compra : '', precio_venta : '' }
    }

    render(){
        const { list, factura, cliente, descuento, _subtotal, _iva, _total, _descuento } = this.state
        const { black } = this.props
        const validos = list.filter(product => 
            product.id_producto > 0 &&
            (product.cantidad > 0 || product.cantidad < 0) &&
            (product.precio_venta > 0 || product.placeholder_venta > 0)
        )
        const isValid = validos.length == list.length && list.length > 0

        return (
            <div className="create-line">

                <DialogAddProduct
                    open={this.state.openAddProduct}
                    handleClose={this.handleCloseAddProduct}
                    handleAdd={this.handleAddProduct}
                />

                <DialogHistoryPrice
                    open={this.state.openHistoryPrice}
                    handleClose={this.handleCloseHistoryPrice}
                    data={this.state.historyPrices}
                />

                <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            cardTitle="Crear Venta"
                            headerColor='red'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101',
                                card : 'Card-margin'
                            }}
                            content={
                                <div>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <TextField
                                                label="# Factura"
                                                className={styles.textField}
                                                value={factura}
                                                onChange={this.handleChangeInput('factura')}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4} className={styles.paper}>
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
                                        <Grid item xs={12} md={4} className={styles.paper}>
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
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <Tooltip open={this.state.validcode} title={this.state.titlecode}>
                                                <InputCodigo 
                                                    handleChangeInput={this.handleChangeInput}
                                                    handleKeyPress={this.handleKeyPress}
                                                    codigo={this.state.codigo}
                                                    errorCode={this.state.errorCode}
                                                />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} md={4} className={styles.paper}>
                                            <Button classes={{ button: 'text-body primary' }} onClick={this.add}>
                                                Agregar Producto &nbsp;&nbsp;<i className="fa fa-plus"></i>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                        />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            cardTitle="Productos"
                            headerColor='red'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{width : 100}}></TableCell>
                                                <TableCell padding={'dense'}>
                                                    Producto
                                                </TableCell>
                                                <TableCell padding={'dense'} style={{width : 200}}>
                                                    Cantidad
                                                </TableCell>
                                                <TableCell padding={'dense'} style={{width : 200}}>
                                                    $ Precio Venta
                                                </TableCell>
                                                <TableCell padding={'dense'} style={{width : 200}}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { list.map((prod, i) => 
                                                <AddProducto 
                                                    key={i}
                                                    {...prod} 
                                                    index={i}
                                                    black={black}
                                                    handleChange={this.handleChange}
                                                    deleteProduct={this.deleteProduct}
                                                    openModalHistoryPrice={this.openModalHistoryPrice}
                                                /> 
                                            ) }
                                        </TableBody>
                                    </Table>
                                    <Grid container spacing={24} className={styles.row}>
                                        <Grid item xs={12} md={6} style={{ ...styles.paper }}>
                                                
                                        </Grid>
                                        <Grid item xs={12} md={6} style={{ ...styles.paper }}>
                                            <br/>
                                            <br/>
                                            <br/>
                                            <Typography>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        Subtotal:
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_subtotal}
                                                    </Grid>
                                                </Grid>
                                                <hr/>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        <Tooltip title="Subtotal * (1.6 / 100)">
                                                            <span>Iva:</span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_iva}
                                                    </Grid>
                                                </Grid>
                                                <hr/>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        <Tooltip title="(Subtotal + Iva) * (% Descuento / 100)">
                                                            <span>Descuento:</span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_descuento}
                                                    </Grid>
                                                </Grid>
                                                <hr/>
                                                <Grid container xs={12} md={12}>
                                                    <Grid item xs={6} md={2} style={{ ...styles.paper }}>
                                                        <Tooltip title="Subtotal + Iva - Descuento">
                                                            <span>Total:</span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={6} md={10} style={{ ...styles.paper }}>
                                                        $ {_total}
                                                    </Grid>
                                                </Grid>
                                            </Typography>
                                        </Grid>
                                    </Grid>
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