import React from 'react'
import axios from 'axios'
import { UNEXPECTED } from './../dictionary'
import toastr from 'toastr'
import { withStyles } from 'material-ui/styles'
import { Grid } from "material-ui";
import TextField from 'material-ui/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import {
    RegularCard,
    ItemGrid
} from './../components';
import Tooltip from '@material-ui/core/Tooltip';
import PhotosUploader from './../PhotosUploader'
import { ONE_BLOC, SAVE_BLOC } from './../routing'
import Loader from 'react-loader'
import PlusIcon from '@material-ui/icons/PlusOne'
import swal from 'sweetalert'
import green from '@material-ui/core/colors/green';

const styles = theme => ({
    green: {
        color: 'white',
        backgroundColor: green[500],
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    button: {
        margin: theme.spacing.unit,
    }
});

class CrearBloc extends React.Component {

    state = { data : [], loading : false, id : null }

    constructor(props){
        super(props)

        this.onChange = this.onChange.bind(this)
        this.save = this.save.bind(this)
        this.addSeccion = this.addSeccion.bind(this)
        this.deleteSeccion = this.deleteSeccion.bind(this)

        if(this.props.history.location.state){
            this.state.id = this.props.history.location.state.id
        }
    }

    save(){
        const { id } = this.state
        const { facebook, twitter, instagram, snapchat, youtube, titulo, secciones } = this.state.data

        let exito = true
        if(!titulo) exito = false
        if(!secciones) exito = false
        for(let i in secciones){
            let seccion = secciones[i]
            if(!seccion.descripcion) exito = false
            if(!seccion.url_media){
                if(!seccion._url_media) exito = false
            }
        }

        if(exito){
            this.setState({
                loading : true
            })
            let headers = { headers: {'Content-Type': 'application/json;charset=UTF-8'} }
            axios.post(SAVE_BLOC, { id, facebook, twitter, instagram, snapchat, youtube, titulo, secciones }, headers)
            .then(r => {
                if(r.status === 200){
                    toastr.success('Guardado')
                    this.goList()
                }else{
                    toastr.error('Contacte a soporte')
                }
                this.setState({
                    loading : false
                })
            })
        }else{
            toastr.error('Favor de llenar todos los campos')
        }
    }

    goList(){
        window.location = '#/blog'
    }

    onChange(e, name){
        const { data } = this.state
        data[name] = e.target.value

        this.setState({
            data,
        })
    }

    componentDidMount(){
        if(this.state.id > 0){
            this.setState({
                loading : true
            })
            axios.post(ONE_BLOC, { id : this.state.id })
            .then((r) => {
                this.setState({
                    data : r.data,
                    loading : false
                })
            })
        }
    }

    changeSeccion(campo, index, e){
        const { data } = this.state
        let _data = data
        _data.secciones[index][campo] = e.target.value
        
        this.setState({
            data : _data
        })
    }

    handleChangeType(section, index, e){
        const { data } = this.state

        let _data = data
        section.type = e.target.value
        section.url_media = ''
        _data.secciones[index] = section

        this.setState({
            data : _data
        })
    }

    async changeImageSeccion(section, index, e){
        const { data } = this.state

        let _data = data
        if(e){
            section.url_media = await this.getBase64(e[0])
        }else{
            section.url_media = ''
        }
        _data.secciones[index] = section

        this.setState({
            data : _data
        })
    }

    addSeccion(){
        const { data } = this.state

        let _data = data
        if(!Array.isArray(_data.secciones)){
            _data.secciones = []
        }
        if(_data.secciones.length >= 3){
            return;
        }
        _data.secciones.push({ type : "1" })

        this.setState({
            data : _data
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

    async deleteSeccion(index){
        const { data } = this.state
        
        let r = await swal({
            title: "Desea eliminar la sección?",
            buttons: {
                cancel : {
                    text : 'No',
                    visible : true
                },
                confirm : {
                    text : 'Si',
                    className : 'btn-danger'
                }
            }
        })
        if(r){
            data.secciones.splice(index, 1)
            this.setState({
                data
            })
        }
    }

    render(){
        const { classes } = this.props
        const { data, loading } = this.state

        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle="Blog"
                    headerColor='red'
                    content = {
                        <div>
                            <Grid container>
                                <ItemGrid xs={12} sm={12} md={6}>
                                    <TextField
                                        id="titulo"
                                        label="Título"
                                        fullWidth
                                        value={data.titulo}
                                        onChange={(e) => this.onChange(e, 'titulo')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </ItemGrid>
                            </Grid>
                            <Grid container>
                                <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                    <TextField
                                        id="instagram"
                                        label="Instagram"
                                        fullWidth
                                        value={data.instagram}
                                        onChange={(e) => this.onChange(e, 'instagram')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </ItemGrid>
                                <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                    <TextField
                                        id="facebook"
                                        label="Facebook"
                                        fullWidth
                                        value={data.facebook}
                                        onChange={(e) => this.onChange(e, 'facebook')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </ItemGrid>
                                <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                    <TextField
                                        id="twitter"
                                        label="Twitter"
                                        fullWidth
                                        value={data.twitter}
                                        onChange={(e) => this.onChange(e, 'twitter')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </ItemGrid>
                                {/*<ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                    <TextField
                                        id="snapchat"
                                        label="Snapchat"
                                        fullWidth
                                        value={data.snapchat}
                                        onChange={(e) => this.onChange(e, 'snapchat')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </ItemGrid>*/}
                                <ItemGrid xs={12} sm={12} md={6} className="inline-block">
                                    <TextField
                                        id="youtube"
                                        label="Youtube"
                                        fullWidth
                                        value={data.youtube}
                                        onChange={(e) => this.onChange(e, 'youtube')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </ItemGrid>
                            </Grid>
                            <br/>
                            <br/>
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>
                                        Secciones
                                        { (data.secciones || []).length < 3 &&
                                            <Tooltip title="Agregar Sección">
                                                <Button style={{marginLeft : 10}} 
                                                    variant="fab" 
                                                    color="secondary" 
                                                    aria-label="PlusOne" 
                                                    mini
                                                    onClick={this.addSeccion}>
                                                    <PlusIcon />
                                                </Button>
                                            </Tooltip>
                                        }
                                    </h4>
                                </div>
                                { (data.secciones || []).map((sec, index) =>
                                    <div className="col-md-12" style={{marginTop : 10, marginBottom : 10}}>
                                        <hr/>
                                        <div className="inline-block col-md-6">
                                            <TextField
                                                label="Título"
                                                className={styles.textField}
                                                value={sec.titulo}
                                                onChange={(e) => this.changeSeccion('titulo', index, e)}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField
                                                label="Descripción"
                                                className={styles.textField}
                                                value={sec.descripcion}
                                                onChange={(e) => this.changeSeccion('descripcion', index, e)}
                                                fullWidth
                                                multiline
                                                rows={10}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                        <div className="inline-block col-md-6">
                                            { sec._url_media &&
                                                <div className="inline-block">
                                                    { sec._type == 1 &&
                                                        <div style={{display:'inline-flex'}}>
                                                            <span style={{alignSelf:'center', marginRight : 10}}>Imagen Actual</span>
                                                            <div 
                                                                className="inline-block"
                                                                style={{
                                                                    backgroundImage : `url(${sec._url_media})`, 
                                                                    backgroundSize : 'contain',
                                                                    backgroundRepeat : 'no-repeat',
                                                                    height : 60, 
                                                                    width : 100
                                                                }}>
                                                            </div>
                                                        </div>
                                                    }

                                                    { sec._type == 2 &&
                                                        <div style={{display:'inline-flex'}}>
                                                            <span style={{alignSelf:'center', marginRight : 10}}>
                                                                Url Actual
                                                            </span>
                                                            <a target="_blank" href={sec.url_media}>{ sec.url_media }</a>
                                                        </div>
                                                    }
                                                </div>

                                            }
                                            <RadioGroup
                                                aria-label="Tipo de Multimedia"
                                                name="type"
                                                value={sec.type}
                                                style={{flexDirection : 'row'}}
                                                onChange={(e) => this.handleChangeType(sec, index, e)}
                                            >
                                                <FormControlLabel
                                                    value="1"
                                                    control={<Radio color="primary" />}
                                                    label="Imagen"
                                                    className="inline-block"
                                                />
                                                <FormControlLabel
                                                    value="2"
                                                    control={<Radio color="primary" />}
                                                    label="Url"
                                                    className="inline-block"
                                                />
                                            </RadioGroup>
                                            
                                            { sec.type == 1
                                                ? <PhotosUploader 
                                                        showTitle={false} 
                                                        limit={1} 
                                                        replace={true}
                                                        css={{ verticalAlign : 'bottom' }}
                                                        onChange={(e) => this.changeImageSeccion(sec, index, e)}
                                                    />
                                                : <TextField
                                                        label="Link"
                                                        className={styles.textField}
                                                        value={sec.url_media}
                                                        onChange={(e) => this.changeSeccion('url_media', index, e)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                            }
                                        </div>
                                        <div className="col-md-12">
                                            <Button color="secondary" classes={{ button: 'text-body' }} onClick={(e) => this.deleteSeccion(index)}>
                                                <span style={{ color : 'red !important' }}> <i className="fa fa-trash"></i>&nbsp;&nbsp;Borrar Sección</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                    footer={
                        <div>
                            <Button color="simple" classes={{ button: 'text-body' }} onClick={this.goList}>
                                <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Regresar
                            </Button>
                            <Button color="success" onClick={this.save} className={classes.green}>
                                { this.state.id !== null ? 'Guardar' : 'Crear' }
                            </Button>
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(CrearBloc);