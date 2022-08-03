//DEFINIMOS LA CLASE QUE TRABAJA CADA ELEMENTO
class Elemento {
    constructor(nombre,cantidad,precio) {
        this.nombre=nombre.toUpperCase();
        this.cantidad=cantidad;
        this.precio=precio;

        this.PrecioTotal();
        this.IvaElemento();
        this.TotalNeto();
    }

    PrecioTotal() {
        this.total = this.precio * this.cantidad;
    }

    IvaElemento() {
        this.iva = this.total * 0.22;
    }

    TotalNeto() {
        this.totalneto = (this.total + this.iva).toFixed(2);
    }
       
}

// Funcion guarda informacion local
const GuardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };

// Funcion obtener valor local
function ObtenerValorLocal(clave) {
    return localStorage.getItem(clave);
}

// Funcion mensajes de respueta
function SweetAlert(tipo,msj='') {

    let tipos={'error':'error','ok':'success'};

    Swal.fire({
        text:msj,
        icon: tipos[tipo],
        confirmButtonText:'Aceptar'

    })
    
}

//Funcion que llena datos de consumo final con ajax
async function ConsumoFinal() {
    const respuesta = await fetch('data/data.json');
    const data = await respuesta.json();

    cliente.val(data.nombre);
    telefono.val(data.telefono);
    direccion.val(data.direccion);
    documento.val(data.documento);
}

//Funcion que inicia el proceso de facturacion
function Iniciar() {
    if (documento.val() == '' || cliente.val() == '' || telefono.val() == '' || direccion.val() == '') {
        SweetAlert('error','Debe completar todos los datos del cliente');
        return 'error';
    } else {
        SweetAlert('ok','Cliente añadido correctamente');
        sec_datos.hide()
        tb_arts.show();
        sec_c_ing.show();
        i_documento.html(`<strong>${documento.val()}</strong>`);
        i_cliente.html(`<strong>${cliente.val()}</strong>`);
        i_telefono.html(`<strong>${telefono.val()}</strong>`);
        i_direccion.html(`<strong>${direccion.val()}</strong>`);

        let d_cliente={'nombre':cliente.val(),'documento':documento.val(),'telefono':telefono.val(),'direccion':direccion.val()};
        GuardarLocal('dato_cliente', JSON.stringify(d_cliente));
    }   
}

//Funcion que crea pdf
function PDF() {
    //Variables
    let ivatotal=0;
    let totalgeneral=0;
    let redondeo = 0;

    //variables para la tabla
    let columnas = ['ARTÍCULO','CANTIDAD','PRECIO UNI','TOTAL','IVA','TOTAL NETO'];
    let datos_tabla = [];

    //Obtenemos la fecha actual
    let hoy=new Date();

    //añadimos titulo con fecha
    let titulo= 'FACTURA EMITIDA EL: '+ hoy.toLocaleDateString();

    //Datos del cliente
    let cliente=JSON.parse(ObtenerValorLocal('dato_cliente'));
    console.log(cliente);

    //añadimos los elementos procesados
    elementos.forEach( (ele) => {
        const {nombre, cantidad, precio, total, iva, totalneto:totalnetoele} = ele;
        let dato=[nombre, cantidad, '$'+precio, '$'+total, '$'+iva, '$'+totalnetoele];

        datos_tabla.push(dato);
        
        ivatotal = ivatotal + iva;
        totalgeneral = totalgeneral + total;
            
    })

    let totalneto=totalgeneral+ivatotal;

    //aplicamos funciones matematicas para calcular el redondeo
    redondeo = Math.ceil(totalneto) - totalneto;
    totalneto = Math.ceil(totalneto);

    datos_tabla.push(["","","","","",""])
    datos_tabla.push(["","","","","TOTAL:",'$ '+totalgeneral])
    datos_tabla.push(["","","","","IVA:",'$ '+ivatotal])
    datos_tabla.push(["","","","","REDONDEO:",`(${redondeo.toFixed(2)})`])
    datos_tabla.push(["","","","","TOTAL NETO:",'$ '+totalneto])

    
    //Iniciamos creacion de pdf
    let pdf = new jsPDF();
    pdf.setFontSize(10);
    pdf.text(135,20,titulo);
    pdf.text(15,30,'DOCUMENTO: '+cliente.documento);
    pdf.text(100,30,'TELEFONO: '+cliente.telefono);
    pdf.text(15,40,'CLIENTE: '+cliente.nombre);
    pdf.text(15,50,'DIRECIÓN: '+cliente.direccion);

    pdf.autoTable(columnas, datos_tabla, { margin:{ top: 55 }});

    // Save the PDF
    pdf.save('factura.pdf');
    
}

//FUNCION QUE MANEJA LOS ELEMENTOS
function AgregaElemento() {

    //creamos variables relevantes para operativa del script
    let nombre = nombre_p.val();
    let cantidad = cantidad_p.val();
    let precio = precio_p.val();
    let ivatotal = 0;
    let totalgeneral = 0;
    let redondeo = 0;
    let result=''; 
    
    //Evaluamos datos
    if (nombre == '' || cantidad == 0 || precio == 0) {
        SweetAlert('error','Debe completar todos los campos correctamente');
        return 'error';
    }

    nombre = nombre.trim();

    //añadimos elementos   
    elementos.push(new Elemento (nombre,cantidad,precio));

    let tabla =''
    //añadimos los elementos procesados
    elementos.forEach( (ele) => {

        const {nombre, cantidad, precio, total, iva, totalneto:totalnetoele} = ele;

        tabla=tabla+`<tr><td>${nombre}</td><td>${cantidad}</td><td>$${precio}</td><td>$${total}</td><td>$${iva}</td><td>$${totalnetoele}</td>`;
        
        ivatotal = ivatotal + iva;
        totalgeneral = totalgeneral + total;
        
    });

    let totalneto = totalgeneral+ivatotal;

    //limpiamos formulario
    nombre_p.val('');
    cantidad_p.val('');
    precio_p.val('');

    //cerramos modal
    modal.modal('toggle');

    //aplicamos funciones matematicas para calcular el redondeo
    redondeo = Math.ceil(totalneto) - totalneto;
    totalneto = Math.ceil(totalneto);

    //creamos arreglo con resultados finales
    let d=[`<strong>Total:</strong> $${totalgeneral}`,`<strong>IVA:</strong> $${ivatotal}`,`<strong>Redondeo:</strong> (${redondeo.toFixed(2)})`,`<strong>Neto:</strong> $${totalneto}`];

    //iteramos soble el arreglo de resultados para preparar html a imprimir
    d.forEach((r) => {
        result=result+`<p>${r}</p>`;
    });

    dato_tabla.html(tabla);

    //imprimimos los resultados
    dato_resultado.html(result);
    
    //imprimimos resultado
    SweetAlert('ok','Articulo añadido correctamente');
    
    //activamos boton imprimir
    btn_pdf.show()

}

//funcion que reinicia sistema facturacion
function Reinicia() {
    localStorage.clear();
    location.reload();
}