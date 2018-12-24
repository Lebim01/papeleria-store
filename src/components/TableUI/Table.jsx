import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PaginationActions from './PaginationActions'
import Body from './Body'
import Header from './Header'
import { Button } from "@material-ui/core";
import { GetApp as DownloadIcon } from '@material-ui/icons'

import {
    Table,
    TableRow,
    TableFooter,
    TablePagination,
    Grid
} from '@material-ui/core';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
        fontSize : '13px !important'
    },
    pagination : {
        fontSize : 13
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
            data: props.data,
            page: props.page,
            rowsPerPage: props.rowsPerPage,
            initial : true,
            filters : {}
        };
        this.onChangeFilters = this.onChangeFilters.bind(this)
    }

    componentWillReceiveProps(props){
        const { data, defaultFilters } = props
        if(defaultFilters){
            this.setState({
                filters : defaultFilters
            })
        }
        
        this.setState({
            data,
            real_data : data
        })
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

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    onChangeFilters(e){
        let filters = this.state.filters
        if(e.target.value !== '' && e.target.value !== undefined){
            filters[e.target.name] = e.target.value
        }
        else if(filters[e.target.name]){
            delete filters[e.target.name]
        }

        if(this.props.onChangeFilters){
            this.props.onChangeFilters(filters)
        }

        this.setState({
            filters
        })
    }

    filterFunction(data, filters){
        return data.filter((row) => {
            let keys = Object.keys(filters)
            return keys.filter((key) => {
                return (row[key] || "").trim().toUpperCase().includes(filters[key].trim().toUpperCase())
            }).length === keys.length
        })
    }

    exportExcel(id_table, title){
        var tableToExcel = (function() {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
                , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
            return function(table, name) {
                if (!table.nodeType) table = document.getElementById(table)
                var contentTable = table.innerHTML
                var ctx = {worksheet: name || 'Worksheet', table: contentTable}
                window.location.href = uri + base64(format(template, ctx))
            }
        })()
        tableToExcel(id_table, title)
    }
    
    render(){
        const { columnData, classes, RowFormat, pagination, FooterFormat, id, excel, SubHeader, className} = this.props
        const { data, order, orderBy, rowsPerPage, page, filters } = this.state;
        let colspan_center = Math.floor(columnData.length/2)+1
        let dataRedered = 
            Object.keys(filters).length > 0
                ? this.filterFunction(data, filters)
                : data

        return (
            <Grid container>
                <Grid item xs={12}>
                    <div className={classes.tableWrapper}>
                        {
                            (id !== '' && excel) &&
                            <div>
                                <Button
                                    onClick={() => {this.exportExcel(id)}}>
                                    <DownloadIcon />
                                    &nbsp;&nbsp;&nbsp; DESCARGAR EXCEL
                                </Button>
                            </div>
                        }
                        <Table id={id} className={className} responsive>
                            <Header 
                                SubHeader={SubHeader}
                                columnData={columnData}
                                onRequestSort={this.handleRequestSort}
                                onSelectAllClick={this.handleSelectAllClick}
                                order={order}
                                orderBy={orderBy}
                                rowCount={data.length}
                                filters={filters}
                                onChangeFilters={this.onChangeFilters}
                            />
                            <Body 
                                id={id}
                                columnData={columnData}
                                data={dataRedered}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                RowFormat={RowFormat}
                                pagination={pagination}
                                filters={filters}
                            />
                            <TableFooter>
                                { (FooterFormat && !Array.isArray(FooterFormat)) &&
                                    <FooterFormat data={dataRedered} columnData={columnData} />
                                }
                                { (FooterFormat && Array.isArray(FooterFormat)) &&
                                    FooterFormat.map((Format, i) => <Format key={i} data={dataRedered} columnData={columnData} /> )
                                }
                                { pagination &&
                                    <TableRow>
                                        <TablePagination
                                            colSpan={colspan_center}
                                            count={dataRedered.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onChangePage={this.handleChangePage}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            ActionsComponent={PaginationActions}
                                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                            labelRowsPerPage={`Registros por página`}
                                            classes={{caption: classes.pagination}}
                                        />
                                    </TableRow>
                                }
                            </TableFooter>
                        </Table>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

TableUI.propTypes = {
    classes: PropTypes.object.isRequired
};

TableUI.defaultProps = {
    rowsPerPage : 5,
    page : 0,
    data : [],
    order : 'asc',
    orderBy : 'id',
    selected : [],
    title : '',
    selectable : false,
    pagination : false,
    excel : false,
    className: ''
}

export default withStyles(styles)(TableUI);