import React from 'react'
import {
    RegularCard
} from './../components';
import axios from 'axios'
import Loader from 'react-loader'
import { withStyles } from 'material-ui/styles';
import { SELL_ONE, SAVE_SELL } from './../routing'
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import {
    Button,
} from 'material-ui'
import green from 'material-ui/colors/green';
import classNames from 'classnames';
import AddIcon from '@material-ui/icons/Save';
import { UNEXPECTED } from './../dictionary'
import toastr from 'toastr'

const styles = theme => ({
    fab: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
    },
});

class VerVenta extends React.Component {

    state = {
        loading : false,
        folio : '',
        id : null,
        validSave : false,
        data : {
            productos : [],
            comprobantes : [],
            status_pago : ''
        }
    }

    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this)
        if(props.history.location.state){
            this.state.id = props.history.location.state.id
        }
    }

    componentDidMount(){
        if(this.state.id > 0){
            axios.post(SELL_ONE, {id: this.state.id})
            .then((r) => {
                this.setState({
                    data : r.data,
                    loading : false
                })
            })
            .catch(() => {
                this.setState({
                    loading : false
                })
            })   
        }
    }

    handleChange = (name) => e => {
        let data = this.state.data
        data[name] = e.target.value
        this.setState({
            data,
            validSave : true
        })
    }

    save = () => {
        this.setState({
            loading: true
        })

        axios.post(SAVE_SELL, { status : this.state.data.status_pago, id : this.state.id })
        .then((r) => {
            this.setState({
                loading : false,
                validSave : false
            })

            toastr.success('Guardado con éxito')
        })
        .catch(e => {
            toastr.error(UNEXPECTED)
        })
    }

    render(){
        const { loading, data, validSave, id } = this.state
        const { classes } = this.props
        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle={"Venta #"+data.folio}
                    headerColor='red'
                    classes={{
                        cardHeader : 'RegularCard-cardTitle-101'
                    }}
                    content = {
                        <div>
                            { (id && validSave) && 
                                <Button 
                                    variant="fab" 
                                    className={classNames(classes.fab, classes.fabGreen)} 
                                    color={'inherit'}
                                    onClick={this.save.bind(this)}>
                                    <AddIcon />
                                </Button>
                            }
                            <div className="row">
                                <div className="col-md-6">
                                    <fieldset>
                                        <legend>Información de la venta</legend>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Folio
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.folio }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Fecha del Pedido
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.fecha }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Dirección
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.direccion }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Costo Envío
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.envio }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Costo Productos
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.total_prod }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Total Costo de Venta
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                $ { data.total }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Estatus
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                <Select
                                                    value={data.status_pago}
                                                    onChange={this.handleChange('status_pago')}
                                                    style={{textAlign : 'left'}}
                                                    inputProps={{
                                                        name: 'status',
                                                        id: 'status'
                                                    }}
                                                >
                                                    <MenuItem value={'Pendiente de pago'}>Pendiente de pago</MenuItem>
                                                    <MenuItem value={'Pagada'}>Pagada</MenuItem>
                                                    <MenuItem value={'Cancelada'}>Cancelada</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="col-md-6">
                                    <fieldset>
                                        <legend>Información del cliente</legend>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Nombre
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.cliente }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4 inline-block">
                                                <label htmlFor="" className="label-control">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="col-md-8 inline-block text-left">
                                                { data.cliente_email }
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <h4>Comprobantes</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Fecha de subida</th>
                                        <th>Archivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { data.comprobantes.map((c, i) => 
                                        <tr>
                                            <td>{c.fecha}</td>
                                            <td>
                                                <a href={'/'+c.pathfile} download>Descargar</a>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <br/>
                            <br/>
                            <h4>Detalle de Productos</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { data.productos.map((p, i) => 
                                        <tr key={i}>
                                            <td>
                                                <div style={{
                                                    display : 'inline-block',
                                                    width : 200,
                                                    height : 150,
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat : 'no-repeat',
                                                    backgroundImage : `url(${p.image})`
                                                 }}>
                                                </div>
                                            </td>
                                            <td>{p.nombre}</td>
                                            <td>{p.cantidad}</td>
                                            <td>${p.precio}</td>
                                            <td>${p.cantidad*p.precio}</td>
                                        </tr>
                                    ) }
                                </tbody>
                            </table>
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(VerVenta);