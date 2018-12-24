import React from 'react'
import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel
} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip'


class Header extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy, columnData } = this.props;

        return (
            <TableHead>
                <TableRow>
                    { columnData.map(column => {
                        return (
                        <TableCell
                            key={column.id}
                            numeric={column.numeric}
                            padding={column.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === column.id ? order : false}
                            style={column.style || {}}
                        >
                        { column.sortable 
                            ?   <Tooltip
                                    title="Ordenar"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.createSortHandler(column.id)}
                                    >
                                        { column.label }
                                    </TableSortLabel>
                                </Tooltip>
                            : column.label
                        }
                        </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default Header;