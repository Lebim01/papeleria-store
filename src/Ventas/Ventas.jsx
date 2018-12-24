import React from 'react'
import axios from 'axios'
import TableUI from './../components/TableUI'
import { LIST_SELL } from './../routing'
import {
    RegularCard
} from './../components';
import Loader from 'react-loader'
// COMPONENTS
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import toastr from 'toastr'

const columnData = [
    { id: 'folio', label: 'Folio', sortable : true, filterable : true },
    { id: 'fecha', label: 'Fecha', sortable : true, filterable : true },
    { id: 'cliente', label: 'Cliente', sortable : true, filterable : true },
    { id: 'cliente_email', label: 'Email Cliente', sortable : true, filterable : true },
    { id: 'status_pago', label: 'Estatus', sortable : true, filterable : true },
    { id: 'actions', label : 'Acciones', sortable : false, style : { minWidth : 150 } }
];

class Ventas extends React.Component {
    state = {
        data : [],
        loading : true
    }

    constructor(props){
        super(props)
        this.go = this.go.bind(this)
    }

    go = (id) => {
        this.props.history.push({
            pathname: '/ventas/create',
            state : {
                id : id
            }
        })
    }

    RowFormat = props => {
        return (
            <TableRow
                hover
                tabIndex={-1}
                key={props.id}
            >
                <TableCell>{props.folio}</TableCell>
                <TableCell>{props.fecha}</TableCell>
                <TableCell>{props.cliente}</TableCell>
                <TableCell>{props.cliente_email}</TableCell>
                <TableCell>{props.status_pago}</TableCell>
                <TableCell>
                    <Button onClick={()=>this.go(props.id)}>
                        Ver
                    </Button>
                </TableCell>
            </TableRow>
        );
    }
    
    componentDidMount(){
        axios.post(LIST_SELL)
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
                    cardTitle="Listado de Ventas"
                    headerColor='red'
                    classes={{
                        cardHeader : 'RegularCard-cardTitle-101'
                    }}
                    content = {
                        <div>
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

export default Ventas