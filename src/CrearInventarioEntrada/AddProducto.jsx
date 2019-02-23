import React from 'react'
import NumberFormat from 'react-number-format';
import {
    DeleteForever,
    AttachMoney
} from '@material-ui/icons'
import axios from 'axios'
import {
    CustomInput,
    Button
} from './../components';
import {
    TextField,
    TableCell, 
    TableRow, 
    Tooltip,
    Fab
} from '@material-ui/core'
import { SUGGESTED_PRICE, LIST_PRICE_PRODUCT } from './../routing'

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

class AddProducto extends React.Component {
    state = {
        productos : []
    }

    constructor(props){
        super(props)
        this.historyPrice = this.historyPrice.bind(this)
    }

    suggestedPrice = async (...params) => {
        let { data } = await axios.post(SUGGESTED_PRICE, params)
        return data
    }

    handleChange = name => async (e) => {
        const { id_marca, id_producto, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta, utilidad } = this.props
        let data = { id_marca, id_producto, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta, utilidad }
        data[name] = e.target.value
        
        if(['cantidad', 'precio_compra', 'utilidad'].indexOf(name) !== -1){
            let sugerido = await this.suggestedPrice(cantidad, precio_compra, placeholder_compra, utilidad)
            data.placeholder_compra = sugerido.precio_compra
            data.placeholder_venta = sugerido.precio_venta
        }
        this.props.handleChange(data, this.props.index)
    }

    async historyPrice(){
        const { id_producto } = this.props
        let r = await axios.post(LIST_PRICE_PRODUCT, { id_producto })
        let data = r.data
        this.props.openModalHistoryPrice(data)
    }

    render(){
        const { id_producto, producto, cantidad, precio_venta, precio_compra, placeholder_compra, placeholder_venta, utilidad } = this.props
        return (
            <TableRow>
                <TableCell padding={'dense'}>
                    <Tooltip title="Ver historial de precio de este producto">
                        <Fab size="small" className="warning" onClick={this.historyPrice}>
                            <AttachMoney />
                        </Fab>
                    </Tooltip>
                </TableCell>
                <TableCell padding={'dense'}>
                    <TextField
                        value={producto}
                        fullWidth={true}
                        InputProps={{
                            readOnly: true
                        }}
                    />
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
                        fullWidth={true}
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
                        value={utilidad}
                        fullWidth={true}
                        onChange={this.handleChange('utilidad')}
                        id="utilidad"
                        InputProps={{
                            type : 'number'
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'}>
                    <TextField
                        value={precio_venta}
                        fullWidth={true}
                        onChange={this.handleChange('precio_venta')}
                        id="precio_venta"
                        placeholder={placeholder_venta}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </TableCell>
                <TableCell padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <Button size="small" color="primary" variant="contained" className="danger" onClick={() => this.props.deleteProduct(id_producto)}>
                        <DeleteForever />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
}

AddProducto.defaultProps = {
    id_producto : '',
    id_marca : '',
    cantidad : 0,
    utilidad : 0,
    index : -1,
    marcas : [],
    placeholder_compra : '',
    placeholder_venta : '',
    handleChange : () => {}
}

export default AddProducto