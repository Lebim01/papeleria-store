import React from 'react'
import {
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core'

class RowGeneric extends React.Component {
    render(){
        const { columnData } = this.props
        return (
            <TableRow>
                { columnData.map((cell) => 
                    <TableCell 
                        key={cell.id}
                        padding={cell.padding ? cell.padding : cell.disablePadding ? 'none' : 'dense'}
                        numeric={cell.numeric}
                        classes={{root:cell.className}}>
                        { this.props[cell.id] }
                    </TableCell>
                )}
            </TableRow>
        )
    }
}

class Body extends React.Component{

    render(){
        const { id, data, rowsPerPage, page, RowFormat, columnData, pagination } = this.props;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        
        let dataRedered = data
        if(pagination){
            dataRedered = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        }
        return (
            <TableBody>
                {dataRedered.map((n, i) => {
                    return (
                        RowFormat !== undefined
                            ? <RowFormat key={i} id_table={id} {...n} />
                            : <RowGeneric key={i} id_table={id} {...n} columnData={columnData} />
                    );
                })}
                {(emptyRows > 0 && pagination) && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={columnData.length+1} />
                    </TableRow>
                )}
            </TableBody>
        )
    }
}

export default Body