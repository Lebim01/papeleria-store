import React from 'react'
import {
    TableBody,
    TableRow,
    TableCell
} from 'material-ui/Table';

class Body extends React.Component{

    isSelected = id => this.props.selected.indexOf(id) !== -1;

    render(){
        const { handleClick, data, rowsPerPage, page, RowFormat, goEdit, columnData } = this.props;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
                    const isSelected = this.isSelected(n.id);
                    return (
                        <RowFormat key={i} {...n} goEdit={goEdit} isSelected={isSelected} handleClick={handleClick} />
                    );
                })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={columnData.length+1} />
                    </TableRow>
                )}
            </TableBody>
        )
    }
}

export default Body