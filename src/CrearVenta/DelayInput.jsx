import React, { Component } from 'react';

import {
    TextField,
    InputAdornment
} from '@material-ui/core'

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

const styles = {
    textField : {

    }
}

export default class DelayInput extends Component {
    constructor(props) {
        super();

        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.triggerChange = this.triggerChange.bind(this)

        this.state = {
            value: props.value,
            event : {
                target : {
                    value : props.value
                }
            }
        };
    }

    componentWillMount() {
        this.timer = null;
    }

    handleChange = (e) => {
        clearTimeout(this.timer);

        this.setState({ value : e.target.value, event : e });

        this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.props.handleKeyPress();
        }
    }

    triggerChange() {
        const { event } = this.state;

        this.props.handleChangeInput(event);
    }

    render() {
        const { codigo, errorCode } = this.props
        return (
            <TextField
                label="Código"
                className={styles.textField}
                value={codigo}
                fullWidth={this.props.fullWidth}
                InputProps={this.props.InputProps}
                placeholder={this.props.placeholder || ''}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyDown}
                onKeyDown={this.handleKeyDown}
                error={errorCode}
                helperText={errorCode ? 'Código no conocido' : ''}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment : 
                        <InputAdornment position="start">
                            <i className="fa fa-barcode"></i>
                        </InputAdornment>
                }}
            />
        );
    }
}