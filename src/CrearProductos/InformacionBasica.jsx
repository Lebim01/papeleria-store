import React from 'react'
import axios from 'axios'
import {LIST_LINEAS, LIST_MARCAS} from 'routing'
import green from 'material-ui/colors/green';
import {
    FormControlLabel,
    Checkbox,
    Select,
    Grid,
    FormControl,
    TextField,
    InputLabel
} from 'material-ui'
import moment from 'moment'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200
    },
    fab: {
        position: 'absolute',
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
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
});

class InformacionBasica extends React.Component {
    state = {
        linea : '',
        marca : '',
        nombre : '',
        descripcion : '',
        lineas : [],
        marcas : [],
        isNuevo : false,
        nuevo_desde : '',
        nuevo_hasta : '',
        isPromocion : false,
        promocion_desde : '',
        promocion_hasta : '',
        promocion_limite : 0,
        promocion_tipo_descuento : 'Porcentaje',
        promocion_descuento : 0
    }

    componentDidMount(){
        axios.post(LIST_LINEAS)
        .then((r_lineas) => {
            axios.post(LIST_MARCAS)
            .then((r_marcas) => {
                this.setState({
                    marcas : r_marcas.data,
                    lineas : r_lineas.data
                })
            })
        })
    }

    componentWillReceiveProps(props){
        this.setState({
            linea : props.linea,
            marca : props.marca,
            nombre : props.nombre,
            descripcion : props.descripcion,
            isNuevo : props.isNuevo,
            isPromocion : props.isPromocion,
            nuevo_desde : props.nuevo_desde,
            nuevo_hasta : props.nuevo_hasta,
            promocion_desde : props.promocion_desde,
            promocion_hasta : props.promocion_hasta,
            promocion_descuento : props.promocion_descuento,
            promocion_limite : props.promocion_limite,
            promocion_tipo_descuento : props.promocion_tipo_descuento,
            errorMessage : props.errorMessage
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: name === 'isNuevo' || name === 'isPromocion'
                ? !this.state[name] 
                : event.target.value
        }, () => {
            if(this.props.onChange){
                let estado = { 
                    nombre : this.state.nombre,
                    descripcion : this.state.descripcion,
                    linea : this.state.linea,
                    marca : this.state.marca,
                    isNuevo : this.state.isNuevo,
                    isPromocion : this.state.isPromocion,
                    nuevo_desde : this.state.nuevo_desde,
                    nuevo_hasta : this.state.nuevo_hasta,
                    promocion_descuento : this.state.promocion_descuento,
                    promocion_desde : this.state.promocion_desde,
                    promocion_hasta : this.state.promocion_hasta,
                    promocion_limite : this.state.promocion_limite,
                    promocion_tipo_descuento : this.state.promocion_tipo_descuento,
                }
                this.props.onChange(estado)
            }
        });
    }

    render(){
        const { errorMessage, isNuevo, nuevo_desde, nuevo_hasta, promocion_tipo_descuento, nombre, descripcion, linea, marca, isPromocion, promocion_desde, promocion_hasta, promocion_limite, promocion_descuento } = this.state
        return (
            <div className={styles.root}>
                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField
                            label="Nombre"
                            className={styles.textField}
                            value={nombre}
                            onChange={this.handleChange('nombre')}
                            fullWidth
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <TextField
                            label="Descripción"
                            className={styles.textField}
                            value={descripcion}
                            onChange={this.handleChange('descripcion')}
                            fullWidth
                            error={errorMessage !== ''}
                            helperText={errorMessage}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={24} className={styles.row}>
                    <Grid item xs={12} md={4} className={styles.paper}>
                        <FormControl className={styles.formControl} fullWidth>
                            <InputLabel htmlFor="linea">Linea de Producto</InputLabel>
                            <Select
                                value={linea}
                                native={true}
                                onChange={this.handleChange('linea')}
                                style={{textAlign : 'left'}}
                                inputProps={{
                                    name: 'linea',
                                    id: 'linea'
                                }}
                            >
                                <option value="">Seleccione</option>
                                {this.state.lineas.map((b, i) => <option key={i} value={b.id}>{b.nombre}</option> )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4} className={styles.paper}>
                        <FormControl className={styles.formControl} fullWidth>
                            <InputLabel htmlFor="marca">Marca</InputLabel>
                            <Select
                                value={marca}
                                native={true}
                                onChange={this.handleChange('marca')}
                                style={{textAlign : 'left'}}
                                inputProps={{
                                    name: 'marca',
                                    id: 'marca'
                                }}
                            >
                                <option value="">Seleccione</option>
                                {this.state.marcas.map((b, i) => <option key={i} value={b.id}>{b.nombre}</option> )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <div className="col-md-6">
                        <div>
                            <div className="col-md-6 inline-block">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isNuevo}
                                            onChange={this.handleChange('isNuevo')}
                                            value="true"
                                        />
                                    }
                                    label="Nuevo"
                                />
                            </div>
                            <div className="col-md-6 inline-block"></div>
                        </div>
                        <div>
                            <div className="col-md-6 inline-block">
                                { isNuevo &&
                                    <TextField
                                        label="Desde"
                                        type="date"
                                        onChange={this.handleChange('nuevo_desde')}
                                        value={nuevo_desde}
                                        error={nuevo_desde && nuevo_hasta ? moment(nuevo_desde).isAfter(nuevo_hasta) : false}
                                        helperText={nuevo_desde && nuevo_hasta ? moment(nuevo_desde).isAfter(nuevo_hasta) ? 'Fecha incorrecta' : '' : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                }
                            </div>
                            <div className="col-md-6 inline-block">
                                { isNuevo &&
                                    <TextField
                                        label="Hasta"
                                        type="date"
                                        onChange={this.handleChange('nuevo_hasta')}
                                        value={nuevo_hasta}
                                        error={nuevo_desde && nuevo_hasta ? moment(nuevo_hasta).isBefore(nuevo_desde) : false}
                                        helperText={nuevo_desde && nuevo_hasta ? moment(nuevo_hasta).isBefore(nuevo_desde) ? 'Fecha incorrecta' : '' : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div>
                            <div className="col-md-6 inline-block">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isPromocion"
                                            checked={isPromocion}
                                            onChange={this.handleChange('isPromocion')}
                                            value="isPromocion"
                                        />
                                    }
                                    label="Promoción"
                                />
                            </div>
                            <div className="col-md-6 inline-block"></div>
                        </div>
                        
                        <div>
                            <div className="col-md-6 inline-block">
                                { isPromocion &&
                                    <TextField
                                        label="Desde"
                                        type="date"
                                        onChange={this.handleChange('promocion_desde')}
                                        fullWidth
                                        value={promocion_desde}
                                        error={promocion_desde && promocion_hasta ? moment(promocion_desde).isAfter(promocion_hasta) : false}
                                        helperText={promocion_desde && promocion_hasta ? moment(promocion_desde).isAfter(promocion_hasta) ? 'Fecha incorrecta' : '' : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                }
                            </div>
                            <div className="col-md-6 inline-block">
                                { isPromocion &&
                                    <TextField
                                        label="Hasta"
                                        type="date"
                                        onChange={this.handleChange('promocion_hasta')}
                                        fullWidth
                                        value={promocion_hasta}
                                        error={promocion_desde && promocion_hasta ? moment(promocion_hasta).isBefore(promocion_desde) : false}
                                        helperText={promocion_desde && promocion_hasta ? moment(promocion_hasta).isBefore(promocion_desde) ? 'Fecha incorrecta' : '' : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                }
                            </div>
                        </div>
                        
                        <div style={{ marginTop : 10 }}>
                            <div className="col-md-6 inline-block">
                                { isPromocion &&
                                    <TextField 
                                        label="Descuento"
                                        fullWidth 
                                        value={promocion_descuento}
                                        onChange={this.handleChange('promocion_descuento')}
                                    />
                                }
                            </div>
                            <div className="col-md-6 inline-block">
                                { isPromocion &&
                                    <FormControl className={styles.formControl} fullWidth>
                                        <InputLabel htmlFor="tipo_descuento">Tipo Descuento</InputLabel>
                                        <Select
                                            value={promocion_tipo_descuento}
                                            native={true}
                                            onChange={this.handleChange('promocion_tipo_descuento')}
                                            style={{textAlign : 'left'}}
                                            inputProps={{
                                                name: 'tipo_descuento',
                                                id: 'tipo_descuento'
                                            }}
                                        >
                                            <option value="Porcentaje">Porcentaje</option>
                                            <option value="Cantidad">Cantidad</option>
                                        </Select>
                                    </FormControl>
                                }
                            </div>
                        </div>

                        <div style={{ marginTop : 10 }}>
                            <div className="col-md-6 inline-block">
                                { isPromocion &&
                                    <TextField 
                                        fullWidth 
                                        label={"Limite de productos"} 
                                        value={promocion_limite}
                                        onChange={this.handleChange('promocion_limite')}
                                    />
                                }
                            </div>
                            <div className="col-md-6 inline-block"></div>
                        </div>
                    </div>
                </Grid>
            </div>
        )
    }
}

export default InformacionBasica