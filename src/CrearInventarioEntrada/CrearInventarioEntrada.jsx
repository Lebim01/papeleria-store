import React from 'react'
import { Grid, withStyles } from "material-ui";

import {
    RegularCard,
    CustomInput,
    Button,
    ItemGrid
} from './../components';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { FormControl } from 'material-ui/Form';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

import './CrearInventarioEntrada.css'
import axios from 'axios'
import toastr from 'toastr'
import { LIST_PRODUCTS, LIST_MARCAS, ADD_INVENTORY } from './../routing'
import { UNEXPECTED } from './../dictionary'

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

const styles = {
    underline : {
        backgroundColor : '#000'
    }
}

class AddProducto extends React.Component {
    state = {
        productos : []
    }

    handleChange = (name) => e => {
        const { id_marca, id_producto, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta } = this.props
        let data = { id_marca, id_producto, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta }
        data[name] = e.target.value

        if(name === 'id_producto'){
            let p = this.state.productos.filter((p) => p.id === data[name])[0]
            data.placeholder_compra = p.precio_compra
            data.placeholder_venta = p.precio_venta
        }
        this.props.handleChange(data, this.props.index)
    }

    componentWillReceiveProps(props){
        if(this.props.id_marca !== props.id_marca){
            this.handleChangeMarca(props.id_marca)
        }
    }

    handleChangeMarca(id_marca){
        axios.post(LIST_PRODUCTS, { id_marca })
        .then((r) => {
            this.setState({
                productos : r.data || []
            })
        })
    }

    render(){
        const { productos } = this.state
        const { id_marca, id_producto, cantidad, precio_venta, precio_compra, placeholder_compra, placeholder_venta, marcas } = this.props
        return (
            <TableRow>
                <TableCell padding={'dense'}>
                    <FormControl fullWidth>
                        <Select
                            value={id_marca}
                            onChange={this.handleChange('id_marca')}
                            style={{textAlign : 'left'}}
                            inputProps={{
                                name: 'id_marca',
                                id: 'id_marca'
                            }}
                        >
                            <MenuItem value={0}>Seleccione</MenuItem>
                            {marcas.map((b, i) => <MenuItem key={i} value={b.id}>{b.nombre}</MenuItem> )}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell padding={'dense'}>
                    <FormControl fullWidth>
                        <Select
                            value={id_producto}
                            onChange={this.handleChange('id_producto')}
                            style={{textAlign : 'left'}}
                            inputProps={{
                                name: 'id_producto',
                                id: 'id_producto'
                            }}
                        >
                            <MenuItem value={0}>Seleccione</MenuItem>
                            {productos.map((b, i) => <MenuItem key={i} value={b.id}>{b.nombre}</MenuItem> )}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <CustomInput
                        id="cantidad"
                        formControlProps={{
                            style : {
                                margin: 0
                            },
                            fullWidth : true
                        }}
                        classes={{
                            underline : '#000'
                        }}
                        inputProps={{
                            onChange: this.handleChange('cantidad'),
                            value : cantidad,
                            type : 'number',
                            min : 1
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <TextField
                        value={precio_compra}
                        onChange={this.handleChange('precio_compra')}
                        id="precio_compra"
                        placeholder={placeholder_compra}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <TextField
                        value={precio_venta}
                        onChange={this.handleChange('precio_venta')}
                        id="precio_venta"
                        placeholder={placeholder_venta}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}></TableCell>
            </TableRow>
        )
    }
}
AddProducto.defaultProps = {
    id_producto : '',
    id_marca : '',
    cantidad : 0,
    index : -1,
    marcas : [],
    placeholder_compra : '',
    placeholder_venta : '',
    handleChange : () => {}
}

class Crear extends React.Component {
    state = { list : [] }

    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this)
        this.add = this.add.bind(this)
    }

    componentDidMount(){
        axios.post(LIST_MARCAS)
        .then((r) => {
            this.setState({
                marcas : r.data || []
            })
        })
    }

    handleChange = (prod, index) => {
        let list = this.state.list
        list[index] = prod
        this.setState({
            list
        })
    }

    goList(){
        window.location = '#/inventario'
    }

    save(e){
        e.preventDefault()
        let _products = this.state.list
        if(_products.length > 0){
            axios.post(ADD_INVENTORY, { productos: _products, token : localStorage.getItem('token') })
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
        let list = this.state.list
        list.push({ id_producto : 0, cantidad : 0, precio : 0, id_marca : 0 })
        this.setState({
            list
        })
    }

    render(){
        const { list, marcas } = this.state
        const { black } = this.props
        const validos = list.filter(product => 
            product.id_marca > 0 &&
            product.id_producto > 0 &&
            (product.cantidad > 0 || product.cantidad < 0) &&
            (product.precio_compra > 0 || product.placeholder_compra > 0) &&
            (product.precio_venta > 0 || product.placeholder_venta > 0)
        )
        const isValid = validos.length == list.length && list.length > 0
        return (
            <div className="create-line">
                <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <RegularCard
                            cardTitle="Crear Entrada de Inventario"
                            cardSubtitle="Completa la información"
                            headerColor='red'
                            classes={{
                                cardHeader : 'RegularCard-cardTitle-101'
                            }}
                            content={
                                <div>
                                    <Button classes={{ button: 'text-body primary float-right' }} onClick={this.add}>
                                        Agregar&nbsp;&nbsp;<i className="fa fa-plus"></i>
                                    </Button>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding={'dense'}>Marca</TableCell>
                                                <TableCell padding={'dense'}>
                                                    Producto&nbsp;&nbsp;
                                                    <Tooltip title="Elija una marca primero para cargar los productos">
                                                        <span className="badge badge-warning text-light">
                                                            <i className="fa fa-info"></i> 
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding={'dense'}>Cantidad</TableCell>
                                                <TableCell padding={'dense'}>
                                                    $ Precio Compra&nbsp;&nbsp;
                                                    <Tooltip title="Al quedar vació tomara como valor el ultimo precio registrado">
                                                        <span className="badge badge-warning text-light">
                                                            <i className="fa fa-info"></i> 
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding={'dense'}>
                                                    $ Precio Venta&nbsp;&nbsp;
                                                    <Tooltip title="Al quedar vació tomara como valor el ultimo precio registrado">
                                                        <span className="badge badge-warning text-light">
                                                            <i className="fa fa-info"></i> 
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell padding={'dense'}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { list.map((prod, i) => 
                                                <AddProducto 
                                                    key={i} 
                                                    marcas={marcas}
                                                    {...prod} 
                                                    index={i}
                                                    black={black}
                                                    handleChange={this.handleChange}
                                                /> 
                                            ) }
                                        </TableBody>
                                    </Table>
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