import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';

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
        const { classes, title, actions } = this.props;

        return (
            <Toolbar
                className={classNames(classes.root)}
            >
                <div className={classes.title}>
                    <Typography variant="title">{ title }</Typography>
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    { actions }
                </div>
            </Toolbar>
        )
    }
}

ToolbarUI.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(toolbarStyles)(ToolbarUI);