import React from 'react'
import {
    List,
    Grid,
    Dialog,
    ListItem,
    DialogTitle,
    ListItemText,
    DialogContent,
}
from '@material-ui/core'
import moment from 'moment'
import 'moment/locale/es'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: 200
    },
    row : {
        paddingTop : 10,
        paddingBottom : 10,
        marginTop : 5
    },
    textField: {
        width : '100%',
        textAlign : 'left'
    },
    formControl : {
        width : '100%'
    },
    paper: {
        padding: theme.spacing.unit
    },
    checkbox: {
        marginBottom: 16,
    },
    checkboxLabel : {
        color : theme.palette.accent.contrastText,
    },
    padding: {
        padding: `0 ${theme.spacing.unit * 2}px`,
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
});


class DialogHistoryPrice extends React.Component {

    formatDate = (date) => {
        return moment(date).format('DD [de] MMMM YYYY')
    }

    render(){
        const { data } = this.props
        return (
            <Dialog
                onClose={this.props.handleClose}
                aria-labelledby="customized-dialog-title"
                fullWidth={true}
                maxWidth={'sm'}
                open={this.props.open}
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                    Historial de precio
                </DialogTitle>
                <DialogContent style={{overflowY : 'unset'}}>
                    <Grid container spacing={24} className={styles.row}>
                        <Grid item xs={12} md={12} className={styles.paper}>
                            <List dense={true}>
                                { data.map(r => 
                                    <ListItem>
                                        <ListItemText
                                            primary={`Compra $${r.precio_compra} - Venta $${r.precio_venta}`}
                                            secondary={`${r.proveedor} - ${this.formatDate(r.fecha)}`}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}

export default DialogHistoryPrice