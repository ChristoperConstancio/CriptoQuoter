const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda:''
}


const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptoMonedasSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);

})

function consultarCriptomonedas() {
    const url =  'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name}  =cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoMonedasSelect.appendChild(option)
    });
}

function leerValor(e) {
    // con el evento podemos saber el name del select
            //name == [moneda- criptomoneda]
    objBusqueda[e.target.name] = e.target.value;

}

function submitFormulario(e) {
    e.preventDefault();

    // validar
    const { moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Todos los campos son obligatorios');
    }

    // consultar api con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje) {
    const existeError = document.querySelector('error');
    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        // mensaje de error
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

}

function consultarAPI() {
    const { moneda, criptomoneda}  = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {
    const {PRICE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    limpiarHTML();
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
        Price: <span> ${PRICE} </span>
    `;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = ` <p> Highest price day: <span>${HIGHDAY}</span> `;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = ` <p> Lowest price day: <span>${LOWDAY}</span> `;

    const variacion = document.createElement('p');
    variacion.innerHTML = ` <p> Change price today: <span>${CHANGEPCT24HOUR}%</span> `;


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);




}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('sk-folding-cube');

    spinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        `;
    resultado.appendChild(spinner);
}