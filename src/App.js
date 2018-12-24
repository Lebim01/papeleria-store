import React, { Component } from 'react';
import './App.css';

// Admin
import { Admin, Resource } from 'react-admin';
// AUTH PROVIDER
import authProvider from './authProvider'

// Material-UI components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import { Responsive } from 'react-admin';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

// -- MODULOS
import LoginPage from './Login'
// Inicio
import Inicio from './Inicio'
import InicioIcon from '@material-ui/icons/Home';
// Productos
import Productos from './Productos'
import CrearProductos from './CrearProductos'
import ProductosIcon from '@material-ui/icons/LocalGroceryStore';
// Lineas productos
import LineasProductos from './LineasProductos'
import LineasIcon from '@material-ui/icons/List';
import CrearLineas from './CrearLineaProducto'
// Clientes
import Clientes from './Clientes'
import PersonIcon from '@material-ui/icons/Person';
import CrearClientes from './CrearClientes'
// Marcas
import Marcas from './Marcas'
import MarcasIcon from '@material-ui/icons/Copyright';
import CrearMarcas from './CrearMarcas'
// Inventario
import InventarioIcon from '@material-ui/icons/Store';
import Inventario from './Inventario'
import CrearInventarioEntrada from './CrearInventarioEntrada'
// Ventas
import VentasIcon from '@material-ui/icons/CreditCard'
import Ventas from './Ventas'
import VerVenta from './VerVenta'
// Bloc
import BlocIcon from '@material-ui/icons/FormatQuote'
import Bloc from './Bloc'
import CrearBloc from './CrearBloc'
// Salon de la fama
import FamaIcon from '@material-ui/icons/Place'
import CrearSalonFama from './CrearSalonFama'
import SalonFama from './SalonFama'
// Master Class
import MasterClass from './MasterClass'
import MasterIcon from '@material-ui/icons/Grade'

const theme = createMuiTheme(require('./theme'));

const LogoutButton = ({ userLogout, ...rest }) => (
    <Responsive
        xsmall={
            <MenuItem
                onClick={()=> {
                    localStorage.removeItem('token')
                    window.location.href = '#/login'
                }}
                style={{color : theme.palette.primary.contrastText }}
            >
                <ExitIcon /> Salir
            </MenuItem>
        }
        medium={
            <Button
                onClick={()=> {
                    localStorage.removeItem('token')
                    window.location.href = '#/login'
                }}
                style={{color : theme.palette.primary.contrastText }}
                size="small"
            >
                <ExitIcon /> Salir
            </Button>
        }
    />
);

class App extends Component {

    render() {
        return (
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <Admin loginPage={LoginPage} theme={theme} title={"Carmin"} authProvider={authProvider} logoutButton={LogoutButton}>
                        <Resource 
                            name="inicio" 
                            list={Inicio}
                            icon={InicioIcon}
                            options={{ label: 'Inicio' }}/>
                        <Resource 
                            name="productos" 
                            list={Productos}
                            create={CrearProductos}
                            edit={CrearProductos}
                            icon={ProductosIcon}/>
                        <Resource 
                            name="lineasproductos" 
                            list={LineasProductos} 
                            create={CrearLineas}
                            edit={CrearLineas}
                            icon={LineasIcon}
                            options={{ label: 'Lineas de Productos' }}/>
                        <Resource 
                            name="marcas" 
                            list={Marcas} 
                            create={CrearMarcas}
                            edit={CrearMarcas}
                            icon={MarcasIcon}
                            options={{ label: 'Marcas' }}/>
                        <Resource 
                            name="clientes" 
                            list={Clientes} 
                            create={CrearClientes}
                            edit={CrearClientes}
                            icon={PersonIcon}
                            options={{ label: 'Clientes' }}/>

                        <Resource 
                            name="inventario" 
                            list={Inventario} 
                            create={CrearInventarioEntrada}
                            icon={InventarioIcon}
                            options={{ label: 'Inventario' }}/>

                        <Resource 
                            name="ventas" 
                            list={Ventas}
                            create={VerVenta}
                            icon={VentasIcon}
                            options={{ label: 'Ventas' }}/>

                        <Resource 
                            name="blog" 
                            list={Bloc}
                            edit={CrearBloc}
                            create={CrearBloc}
                            icon={BlocIcon}
                            options={{ label: 'Blog' }}/>

                        <Resource 
                            name="fama" 
                            list={SalonFama}
                            edit={CrearSalonFama}
                            create={CrearSalonFama}
                            icon={FamaIcon}
                            options={{ label: 'Salon de la Fama' }}/>

                        <Resource 
                            name="master" 
                            list={MasterClass}
                            icon={MasterIcon}
                            options={{ label: 'Master Class' }}/>
                    </Admin>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;