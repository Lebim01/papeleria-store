import React from 'react'
import { Grid, Tooltip } from '@material-ui/core'

function Totales(props){
    const { _subtotal, _descuento, _total, _iva } = props
    return (
        <Grid>
            <Tooltip title="">
                <span>
                    <span style={{ fontSize: "16px", borderBottom : "solid", borderColor : "#c2cad8", borderWidth : "1px"}}>
                        SUBTOTAL : $ <b> {_subtotal} </b>
                    </span>
                    &nbsp;&nbsp;
                </span> 
            </Tooltip>
            <Tooltip title="Subtotal * (1.6 / 100)">
                <span>
                    <span style={{ borderBottom : "solid", borderColor : "#c2cad8", borderWidth : "1px"}}>
                        IVA : $ <b> {_iva} </b>
                    </span>
                    &nbsp;&nbsp;
                </span> 
            </Tooltip>
            <Tooltip title="(Subtotal + Iva) * (% Descuento / 100)">
                <span>
                    <span style={{ borderBottom : "solid", borderColor : "#c2cad8", borderWidth : "1px"}}>
                        DESCUENTO : $  <b> {_descuento} </b> 
                    </span>
                    &nbsp;&nbsp;
                </span> 
            </Tooltip>
            <Tooltip title="Subtotal + Iva - Descuento">
                <span>
                    <span style={{ borderBottom : "solid", borderColor : "#c2cad8", borderWidth : "1px"}}>
                        TOTAL : $  <b> {_total} </b>
                    </span>
                    &nbsp;&nbsp;
                </span> 
            </Tooltip>
        </Grid>
    )
}

export default Totales