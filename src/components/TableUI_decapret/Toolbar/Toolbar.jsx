import React from 'react'

import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { lighten } from 'material-ui/styles/colorManipulator';

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight: {
        color: theme.palette.accent.contrastText,
        backgroundColor: lighten(theme.palette.accent.light, 0.4),
    },
    spacer: {
        flex: '1 1 100%',
    },
    actionsPrimary : {
        color: theme.palette.accent.contrastText,
        backgroundColor : theme.palette.accent.main
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

class ToolbarUI extends React.Component {

    render(){
        const { numSelected, classes, goAdd, title } = this.props;

        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div className={classes.title}>
                    {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {numSelected} { numSelected > 1 ? 'seleccionados' : 'seleccionado' }
                    </Typography>
                    ) : (
                    <Typography variant="title">{ title }</Typography>
                    )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    { numSelected > 0 &&
                        <div>
                            <Tooltip title="Borrar">
                                <IconButton aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    }
                    { numSelected === 0 &&
                        <div>
                            <Tooltip title="Agregar">
                                <Button variant="fab" color="secondary" aria-label="Add" mini className={classes.actionsPrimary} onClick={goAdd}>
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    }
                </div>
            </Toolbar>
        )
    }
}

ToolbarUI.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

export default withStyles(toolbarStyles)(ToolbarUI);