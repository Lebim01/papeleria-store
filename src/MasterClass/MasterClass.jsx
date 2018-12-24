import React from 'react'
import {
    RegularCard
} from './../components';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles'
import Button from '@material-ui/core/Button';
import Loader from 'react-loader'
import { ONE_MASTER, SAVE_MASTER, UP_IMAGE_MASTER, DELETE_IMAGE_MASTER } from './../routing'
import toastr from 'toastr'
import axios from 'axios'
import PhotosUploader from './../PhotosUploader'
import './MasterClass.css'
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import swal from 'sweetalert'

const styles = theme => ({
    delete : {
        float : 'right',
        color : 'red'
    },
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

class MasterClass extends React.Component {
    state = { loading : true, imagenes : [] }

    componentDidMount(){
        this.save = this.save.bind(this)
        this.getData = this.getData.bind(this)
        this.getData()
    }

    async save(){
        const { titulo, descripcion } = this.state
        let r = await axios.post(SAVE_MASTER, { titulo, descripcion })
        if(r.status === 200){
            toastr.success('Guardado')
        }else{
            toastr.error('Error contacte a soporte')
        }
    }

    async getData(){
        let r = await axios.post(ONE_MASTER)
        this.setState({
            titulo : r.data.titulo,
            descripcion : r.data.descripcion,
            imagenes : r.data.images,
            loading : false
        })
    }

    onChange(name, e){
        this.setState({
            [name] : e.target.value
        })
    }

    async changeImageSeccion(e){
        if(e){
            let data = await this.getBase64(e[0])
            let r = await this.updateImage(data)
            if(r.status === 200){
                toastr.success('Imagen guardada')
                setTimeout(function(){
                    window.location.reload()
                }, 500)
            }
        }
    }

    async updateImage(data){
        this.setState({
            loading : true
        })
        let r = await axios.post(UP_IMAGE_MASTER, { data })
        this.setState({
            loading : false
        })
        return r
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

    async deleteImage(id){
        let r = await swal({
            title: "Desea eliminar la imagen?",
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
            this.setState({
                loading : true
            })
            await axios.post(DELETE_IMAGE_MASTER, { id })
            this.setState({
                loading : false
            })

            window.location.reload()
        }
    }

    render(){
        const { classes } = this.props
        const { loading, titulo, descripcion, imagenes } = this.state
        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle="Master Class"
                    headerColor='red'
                    content = {
                        <div>
                            <div className="row">
                                <div className="col-md-12">
                                    <TextField
                                        label="Título"
                                        className={styles.textField}
                                        value={titulo}
                                        onChange={(e) => this.onChange('titulo', e)}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-md-12">
                                    <TextField
                                        label="Descripción"
                                        className={styles.textField}
                                        value={descripcion}
                                        onChange={(e) => this.onChange('descripcion', e)}
                                        fullWidth
                                        multiline
                                        rows={10}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <span style={{ color : 'red' }}>Nota : Las imagenes se guardarán en automático, los textos no.</span>
                            <br/>
                            <br/>
                            <div className="row">
                                { imagenes.map((img) =>
                                    <div className="col-md-4" style={{marginTop : 20}}>
                                        <IconButton aria-label="Delete" className={classes.delete} onClick={()=> this.deleteImage(img.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <div className="imagen" style={{ backgroundImage : `url(${img.url_media})` }}></div>
                                    </div>
                                )}
                                <div className="col-md-4" style={{marginTop : 20}}>
                                    <PhotosUploader 
                                        showTitle={false} 
                                        limit={1} 
                                        replace={true}
                                        css={{ verticalAlign : 'bottom' }}
                                        onChange={(e) => this.changeImageSeccion(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    footer={
                        <div>
                            <Button color="success" onClick={this.save} className={classes.green}>
                                Guardar
                            </Button>
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(MasterClass);