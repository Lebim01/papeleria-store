import React from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import { SAVE_FAMOUS } from './../routing'
import toastr from 'toastr'
import { Grid } from "material-ui";
import {
    RegularCard,
    Button,
    ItemGrid
} from './../components';
import TextField from 'material-ui/TextField';
import { ONE_FAMOUS } from './../routing'
import $ from 'jquery'
import Loader from 'react-loader'
import PhotosUploader from './../PhotosUploader'

class CrearSalonFama extends React.Component {

    state = { pos_x : null, pos_y : null, loading : false, pos_x2 : 0, pos_y2 : 0 }

    constructor(props){
        super(props)
        this.point_it = this.point_it.bind(this)
        this.save = this.save.bind(this)
        this.onChange = this.onChange.bind(this)

        if(this.props.history.location.state){
            this.state.id = this.props.history.location.state.id
        }
    }

    componentDidMount(){
        if(this.state.id > 0){
            this.setState({
                loading : true
            })
            axios.post(ONE_FAMOUS, { id : this.state.id })
            .then((r) => {
                const { nombre, celular, lugar, youtube, pos_x, pos_y, pos_x2, pos_y2, logo, _logo } = r.data
                this.setState({
                    nombre, 
                    celular, 
                    lugar, 
                    youtube, 
                    pos_x, 
                    pos_y, 
                    pos_x2 : parseInt(pos_x2), 
                    pos_y2 : parseInt(pos_y2),
                    loading : false,
                    logo,
                    _logo
                })
            })
        }
    }

    onChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    goList(){
        window.location = '#/fama'
    }

    point_it(event){
        let pos_x2 = $(document.getElementById("mapa")).position().left - 10 + (event.offsetX?(event.offsetX):event.pageX-$(document.getElementById("mapa")).offset().left);
        let pos_y2 = $(document.getElementById("mapa")).position().top - 10 + (event.offsetY?(event.offsetY):event.pageY-$(document.getElementById("mapa")).offset().top);
        
        let pos_x = 
                -10 + event.offsetX
                    ? event.offsetX - $(document.getElementById("mapa")).offset().left
                    : event.pageX - $(document.getElementById("mapa")).offset().left;
        pos_x = (parseInt(pos_x))+125
        let pos_y = -10 + (event.offsetY?(event.offsetY):event.pageY-$(document.getElementById("mapa")).offset().top);
        pos_y = (parseInt(pos_y))
        
        this.setState({
            pos_x, pos_y, pos_x2, pos_y2
        })
    }

    save(){
        const { id, nombre, lugar, youtube, celular, pos_x, pos_y, pos_x2, pos_y2, logo } = this.state
        
        let exito = true
        if(!nombre){
            exito = false
        }
        if(!lugar){
            exito = false
        }
        if(!youtube){
            exito = false
        }
        if(!celular){
            exito = false
        }
        if(!logo){
            exito = false
        }
        if(pos_x === null || pos_y === null){
            exito = false
        }

        if(exito){
            let self = this
            swal({
                title: "Desea agregar aqui?",
                buttons: true
            })
            .then((r) => {
                if(r){
                    this.setState({
                        loading : true
                    })
                    axios.post(SAVE_FAMOUS, { id, nombre, lugar, youtube, celular, pos_x, pos_y, pos_x2, pos_y2, logo })
                    .then(function(r){
                        if(r.status === 200){
                            toastr.success('Guardado')
                            self.goList()
                        }else{
                            toastr.error('Error contacte a soporte')
                            this.setState({
                                loading : false
                            })
                        }
                    })
                }
            });
        }else{
            toastr.error('Favor llenar todos los campos')
        }
    }

    async changeImageSeccion(e){
        let logo = ''
        if(e && e[0]){
            logo = await this.getBase64(e[0])
        }
        this.setState({
            logo
        })
    }

    getBase64(file) {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result)
            };
            reader.onerror = function (error) {
                resolve()
            };
        })
     }

    render(){
        const { nombre, lugar, celular, youtube, pos_x, pos_y, pos_x2, pos_y2, loading, _logo } = this.state
        
        return (
            <RegularCard
                cardTitle="Crear Salon de la Fama"
                cardSubtitle="Completa la información"
                headerColor='red'
                classes={{
                    cardHeader : 'RegularCard-cardTitle-101'
                }}
                content={
                    <div>
                        <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                            corners={1} rotate={0} direction={1} color="#000" speed={1}
                            trail={60} shadow={false} hwaccel={false} className="spinner"
                            zIndex={2e9} top="50%" left="50%" scale={1.00}
                            loadedClassName="loadedContent" />

                        <Grid container>
                            <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                { _logo && 
                                    <div style={{display:'inline-flex'}}>
                                        <span style={{alignSelf:'center', marginRight : 10}}>Imagen Actual</span>
                                        <div 
                                            className="inline-block"
                                            style={{
                                                backgroundImage : `url(${_logo})`, 
                                                backgroundSize : 'contain',
                                                backgroundRepeat : 'no-repeat',
                                                height : 60, 
                                                width : 100
                                            }}>
                                        </div>
                                    </div>
                                }
                            </ItemGrid>
                            <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                <PhotosUploader 
                                    textDrop={'Logo'}
                                    showTitle={false} 
                                    limit={1} 
                                    replace={true}
                                    css={{ verticalAlign : 'bottom' }}
                                    onChange={(e) => this.changeImageSeccion(e)}
                                />
                            </ItemGrid>
                        </Grid>
                        <br/>
                        <br/>
                        <Grid container>
                            <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                <TextField
                                    name="nombre"
                                    label="Nombre"
                                    fullWidth
                                    value={nombre}
                                    onChange={(e) => this.onChange(e)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </ItemGrid>

                            <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                <TextField
                                    name="celular"
                                    label="Celular"
                                    fullWidth
                                    value={celular}
                                    onChange={(e) => this.onChange(e)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </ItemGrid>
                            
                            <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                <TextField
                                    name="lugar"
                                    label="Lugar"
                                    fullWidth
                                    value={lugar}
                                    onChange={(e) => this.onChange(e)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </ItemGrid>
                            <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                <TextField
                                    name="youtube"
                                    label="Youtube"
                                    fullWidth
                                    value={youtube}
                                    onChange={(e) => this.onChange(e)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </ItemGrid>
                        </Grid>
                        <br/>
                        <br/>
                        <Grid container>
                            <ItemGrid xs={12} sm={12} md={12}>
                                <img height="600" width="860" src="https://carmin.com.mx/assets/images/salonFama/mapa.jpg" id="mapa" onClick={this.point_it}></img>
                                
                                { (pos_x && pos_y) && 
                                    <img 
                                        src="https://carmin.com.mx/assets/images/salonFama/punto.png" 
                                        style={{ 
                                            top : pos_y2, 
                                            left : pos_x2,
                                            width : 20,
                                            position : 'absolute'
                                        }}
                                    />
                                }
                            </ItemGrid>
                        </Grid>
                    </div>
                }
                footer={
                    <div>
                        <Button color="simple" classes={{ button: 'text-body' }} onClick={this.goList}>
                            <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Regresar
                        </Button>
                        <Button color="success" onClick={this.save}>
                            { this.state.id !== null ? 'Guardar' : 'Crear' }
                        </Button>
                    </div>
                }
            />
        )
    }
}

export default CrearSalonFama