import React from 'react'
import {
    RegularCard
} from './../components';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles'
import Button from '@material-ui/core/Button';
import Loader from 'react-loader'
import { ONE_INICIO, UP_IMAGE_INICIO, DELETE_IMAGE_INICIO } from './../routing'
import toastr from 'toastr'
import axios from 'axios'
import PhotosUploader from './../PhotosUploader'
import './Inicio.css'
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

class Inicio extends React.Component {
    state = { loading : true, imagenes : [] }

    componentDidMount(){
        this.getData = this.getData.bind(this)
        this.getData()
    }

    async getData(){
        let r = await axios.post(ONE_INICIO)
        this.setState({
            imagenes : r.data.images,
            loading : false
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
        let r = await axios.post(UP_IMAGE_INICIO, { data })
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
            await axios.post(DELETE_IMAGE_INICIO, { id })
            this.setState({
                loading : false
            })

            window.location.reload()
        }
    }

    render(){
        const { classes } = this.props
        const { loading, imagenes } = this.state
        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle="Inicio"
                    headerColor='red'
                    content = {
                        <div>
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

export default withStyles(styles)(Inicio);