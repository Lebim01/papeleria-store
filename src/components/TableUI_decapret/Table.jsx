import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import PaginationActions from './PaginationActions'
import Body from './Body'
import Header from './Header'
import Toolbar from './Toolbar'

import 
    Table,
    {
        TableRow,
        TableFooter,
        TablePagination
    } 
from 'material-ui/Table';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class TableUI extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            order: props.order,
            orderBy: props.orderBy,
            selected: props.selected,
            data: props.data,
            page: props.page,
            rowsPerPage: props.rowsPerPage
        };
    }

    componentWillReceiveProps(props){
        const { data } = props
        if(data){
            this.setState({
                data
            }, () => {
                this.handleRequestSort(null, this.state.orderBy)
            })
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        const data = order === 'desc'
            ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
            : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

        this.setState({ data, order, orderBy });
    }

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.state.data.map(n => n.id) });
            return;
        }
        this.setState({ selected: [] });
    }

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        this.setState({ selected: newSelected });
    }

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    render(){
        const { columnData, goAdd, classes, RowFormat, title, goEdit, selectable } = this.props
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;

        return (
            <div>
                <Toolbar 
                    numSelected={selected.length}
                    goAdd={goAdd}
                    title={title}
                />
                <div className={classes.tableWrapper}>
                    <Table>
                        <Header 
                            columnData={columnData}
                            onRequestSort={this.handleRequestSort}
                            onSelectAllClick={this.handleSelectAllClick}
                            order={order}
                            orderBy={orderBy}
                            numSelected={selected.length}
                            rowCount={data.length}
                            selectable={selectable}
                        />
                        <Body 
                            columnData={columnData}
                            data={data}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            RowFormat={RowFormat}
                            selected={selected}
                            handleClick={this.handleClick}
                            goEdit={goEdit}
                        />
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    colSpan={columnData.length+1}
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={PaginationActions}
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                    labelRowsPerPage={`Registros por página`}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        )
    }
}

TableUI.propTypes = {
    classes: PropTypes.object.isRequired,
    selectable : PropTypes.bool
};

TableUI.defaultProps = {
    rowsPerPage : 5,
    page : 0,
    data : [],
    order : 'asc',
    orderBy : 'nombre',
    selected : [],
    title : 'Listado',
    goEdit : () => {},
    selectable : true
}

export default withStyles(styles)(TableUI);