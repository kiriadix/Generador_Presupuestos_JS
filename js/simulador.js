//VARIABLES MANIPULADORAS DE ELEMENTOS DEL DOM

//variables datos clientes
let sec_datos = $('#datos_cliente');
let cliente = $('#nombre');
let documento = $('#documento');
let telefono = $('#telefono');
let direccion = $('#direccion');
let btn_cliente = $('#btnprocesos');
let btn_cf = $('#btncf');

//variables factura
let sec_c_ing = $('#cliente_ingresado');
let tb_arts = $('#tabla_art');
let i_cliente = $('#i_cliente');
let i_documento = $('#i_documento');
let i_telefono = $('#i_telefono');
let i_direccion = $('#i_direccion');
let dato_resultado = $('#dato_resultado');
let dato_tabla = $('#dato_tabla');

//variables del articulo
let nombre_p = $('#nombre_p');
let cantidad_p = $('#cantidad_p');
let precio_p = $('#precio_p');
let modal = $('#datos_articulos');


//botones finales
let btn_pdf = $('#btnpdf');
let btn_reiniciar = $('#btnreiniciar');
let btn_agregar = $('#btn_agregar');


//AREGLO QUE GUARDA ELEMENTOS
const elementos=[];

// FUNCION QUE SE EJECUTA CUANDO CARGA LA PAGINA
$(document).ready(function() {
    btn_cf.click(ConsumoFinal);
    btn_cliente.click(Iniciar);
    btn_agregar.click(AgregaElemento);
    btn_pdf.click(PDF);
    btn_reiniciar.click(Reinicia);
    tb_arts.hide();
    sec_c_ing.hide();
    btn_pdf.hide();
});
