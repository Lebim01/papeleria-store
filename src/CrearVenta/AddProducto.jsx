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
import { LIST_PRICE_PRODUCT, SUGGESTED_PRICES } from './../routing'

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

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.historyPrice = this.historyPrice.bind(this)
    }

    handleChange = (name) => async (event) => {
        const { id_producto, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta, utilidad, inventario } = this.props
        let data = { id_producto, cantidad, precio_compra, precio_venta, placeholder_compra, placeholder_venta, utilidad, inventario }
        data[name] = event.target.value
        this.props.handleChange(data, this.props.index)
    }

    async historyPrice(){
        const { id_producto } = this.props
        let r = await axios.post(LIST_PRICE_PRODUCT, { id_producto })
        let data = r.data
        this.props.openModalHistoryPrice(data)
    }

    render(){
        const { id_producto, producto, cantidad, precio_venta, precio_compra, placeholder_compra, placeholder_venta, utilidad, inventario } = this.props

        return (
            <tr>
                <td padding={'dense'}>
                    <Tooltip title="Ver historial de precio de este producto">
                        <Fab style={{ height:20, width: 20, minHeight: 'unset' }} size="small" className="warning" onClick={this.historyPrice}>
                            <AttachMoney style={{height: 10}} />
                        </Fab>
                    </Tooltip>
                </td>
                <td padding={'dense'}>
                    <TextField
                        value={producto}
                        fullWidth={true}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </td>
                <td padding={'dense'}>
                    <TextField
                        value={cantidad}
                        fullWidth={true}
                        onChange={this.handleChange('cantidad')}
                        inputProps={{
                            type : 'number',
                            value : cantidad
                        }}
                        helperText={"Disponible " + inventario}
                    />
                </td>
                <td padding={'dense'}>
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
                </td>
                <td padding={'dense'} style={{width: 100, maxWidth: 100}}>
                    <Button style={{width:20, height:15, margin:0}} size="small" color="primary" variant="contained" className="danger" onClick={() => this.props.deleteProduct(id_producto)}>
                        <DeleteForever style={{height:15}} />
                    </Button>
                </td>
            </tr>
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

export default AddProducto