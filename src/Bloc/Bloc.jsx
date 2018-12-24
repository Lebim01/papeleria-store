import React from 'react'
import axios from 'axios'
import { UNEXPECTED } from './../dictionary'
import { withStyles } from 'material-ui/styles'

import toastr from 'toastr'
import TableUI from './../components/TableUI'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import { TableCell, TableRow } from 'material-ui/Table'
import { LIST_BLOC, DELETE_BLOC } from './../routing'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'

import TrashIcon from '@material-ui/icons/Delete'
import BuildIcon from '@material-ui/icons/Build'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    button: {
        margin: theme.spacing.unit,
    }
});

const goAdd = () => {
    window.location = '#/blog/create'
}

const columnData = [
    { id: 'titulo', numeric: false, label: 'Título', sortable : true, filterable : true },
    { id: 'fecha', numeric: false, label: 'Fecha', sortable : true, filterable : true },
    { id: 'vistas', numeric: false, label: 'Vistas', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false }
];

class CrearBloc extends React.Component {

    state = { data : [], loading : true }

    constructor(props){
        super(props)
        this.delete = this.delete.bind(this)
        this.goEdit = this.goEdit.bind(this)
    }

    componentDidMount(){
        axios.post(LIST_BLOC)
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

    delete = (event, item) => {
        event.preventDefault()
    
        if(window.confirm(`¿Estas seguró eliminar la publicacion "${item.titulo}"?`)){
            let params = {
                id_post : item.id
            }
            axios.post(DELETE_BLOC, params)
            .then((r) => {
                if(r.data.status === 200){
                    toastr.success(`Bloc Eliminado`)
                    let _data = this.state.data
                    _data = _data.filter((p) => p.id !== item.id)
                    this.setState({
                        data : _data
                    })
                }else{
                    toastr.error(UNEXPECTED)
                }
            })
        }
    }

    goEdit(event, item){
        event.preventDefault()
        this.props.history.push({
            pathname: '/blog/edit',
            state : {
                id : item.id
            }
        })
    }

    RowFormat = props => (
        <TableRow
            hover
            tabIndex={-1}
            key={props.id}
        >
            <TableCell>{props.titulo}</TableCell>
            <TableCell>{props.fecha}</TableCell>
            <TableCell>{props.vistas}</TableCell>
            <TableCell>
                <Tooltip title="Editar">
                    <Button variant="fab" color="primary" aria-label="Build" mini style={styles.button} onClick={(e) => this.goEdit(e, props)}>
                        <BuildIcon />
                    </Button>
                </Tooltip>
                {/*<Tooltip title="Borrar">
                    <Button variant="fab" color="secondary" aria-label="Trash" mini style={styles.button} onClick={(e) => this.delete(e, props)}>
                        <TrashIcon />
                    </Button>
                </Tooltip>*/}
            </TableCell>
        </TableRow>
    )

    render(){
        const { data, loading } = this.state

        return (
            <div>
                <Loader loaded={!loading} lines={13} length={20} width={10} radius={30}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />

                <RegularCard
                    cardTitle="Listado de Publicaciones"
                    headerColor='red'
                    content = {
                        <div>
                            <Tooltip title="Agregar">
                                <Button variant="fab" color="secondary" aria-label="Add" mini style={{float:'right'}} onClick={goAdd}>
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                            <TableUI 
                                RowFormat={this.RowFormat}
                                order={'asc'}
                                orderBy={'nombre'}
                                data={data}
                                columnData={columnData}
                                pagination={true}
                            />
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withStyles(styles)(CrearBloc);