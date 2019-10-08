import React from 'react'
import AddProducto from './AddProducto'

function ListadoProductos(props){
    const { list, black } = props
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <td padding={'dense'}>
                            Producto
                        </td>
                        <td>
                            Cantidad
                        </td>
                        <td>
                            $ Precio Venta
                        </td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    { list.map((prod, i) => 
                        <AddProducto 
                            key={i}
                            {...prod} 
                            index={i}
                            black={black}
                            handleChange={props.handleChange}
                            deleteProduct={props.deleteProduct}
                        /> 
                    ) }
                </tbody>
            </table>
        </div>
    )
}

export default ListadoProductos