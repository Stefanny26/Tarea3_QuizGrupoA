// Inicialización del socket
const socket = io();

// Variables globales
let nombreUsuario = '';
let codigoSala = '';
let esDocente = false;
let rondaActiva = false;

// Referencias a elementos del DOM
const panelIdentificacion = document.getElementById('panel-identificacion');
const panelSalaInfo = document.getElementById('panel-sala-info');
const panelDocente = document.getElementById('panel-docente');
const panelJuego = document.getElementById('panel-juego');

// Elementos del selector de rol
const btnRolDocente = document.getElementById('btn-rol-docente');
const btnRolEstudiante = document.getElementById('btn-rol-estudiante');
const formDocente = document.getElementById('form-docente');
const formEstudiante = document.getElementById('form-estudiante');

// Elementos para docente
const inputNombreDocente = document.getElementById('input-nombre-docente');
const btnCrearSala = document.getElementById('btn-crear-sala');

// Elementos para estudiante
const inputNombreEstudiante = document.getElementById('input-nombre-estudiante');
const inputCodigoSala = document.getElementById('input-codigo-sala');
const btnUnirseSala = document.getElementById('btn-unirse-sala');

// Elementos de información de sala
const codigoSalaDisplay = document.getElementById('codigo-sala-display');
const btnCopiarCodigo = document.getElementById('btn-copiar-codigo');
const participantesCount = document.getElementById('participantes-count');
const salaActual = document.getElementById('sala-actual');

// Elementos del status
const statusConexion = document.getElementById('status-conexion');
const nombreUsuarioSpan = document.getElementById('nombre-usuario');

// Elementos del juego
const formPregunta = document.getElementById('form-pregunta');
const inputPregunta = document.getElementById('input-pregunta');
const inputRespuesta = document.getElementById('input-respuesta');
const btnReiniciar = document.getElementById('btn-reiniciar');
const areaPregunta = document.getElementById('area-pregunta');
const sinPregunta = document.getElementById('sin-pregunta');
const conPregunta = document.getElementById('con-pregunta');
const textoPregunta = document.getElementById('texto-pregunta');
const formRespuesta = document.getElementById('form-respuesta');
const inputRespuestaEstudiante = document.getElementById('input-respuesta-estudiante');
const btnEnviarRespuesta = document.getElementById('btn-enviar-respuesta');
const areaResultados = document.getElementById('area-resultados');
const nombreGanador = document.getElementById('nombre-ganador');
const respuestaCorrectaMostrar = document.getElementById('respuesta-correcta');
const mensajes = document.getElementById('mensajes');

// Funciones de utilidad
function mostrarMensaje(texto, tipo = 'info') {
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje ${tipo}`;
    mensaje.textContent = texto;
    mensajes.appendChild(mensaje);
    mensajes.scrollTop = mensajes.scrollHeight;
    
    // Auto-eliminar mensajes después de 5 segundos
    setTimeout(() => {
        if (mensaje.parentNode) {
            mensaje.remove();
        }
    }, 5000);
}

function actualizarStatusConexion(estado, texto) {
    statusConexion.className = `status-item ${estado}`;
    statusConexion.textContent = texto;
}

function mostrarPanel(panel) {
    // Ocultar todos los paneles principales
    panelIdentificacion.classList.add('hidden');
    panelSalaInfo.classList.add('hidden');
    panelDocente.classList.add('hidden');
    panelJuego.classList.add('hidden');
    
    // Mostrar el panel solicitado
    panel.classList.remove('hidden');
}

function actualizarInfoSala(codigo, participantes = 0) {
    codigoSala = codigo;
    codigoSalaDisplay.textContent = codigo;
    participantesCount.textContent = `👥 ${participantes} estudiantes conectados`;
    salaActual.textContent = `🏠 Sala: ${codigo}`;
    salaActual.classList.remove('hidden');
}

function copiarCodigoAlPortapapeles() {
    navigator.clipboard.writeText(codigoSala).then(() => {
        codigoSalaDisplay.classList.add('codigo-copiado');
        mostrarMensaje('📋 ¡Código copiado al portapapeles!', 'success');
        
        setTimeout(() => {
            codigoSalaDisplay.classList.remove('codigo-copiado');
        }, 1000);
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = codigoSala;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        mostrarMensaje('📋 Código copiado', 'success');
    });
}

function limpiarFormulario(form) {
    form.reset();
}

function habilitarCampoRespuesta() {
    inputRespuestaEstudiante.disabled = false;
    btnEnviarRespuesta.disabled = false;
    inputRespuestaEstudiante.focus();
}

function deshabilitarCampoRespuesta() {
    inputRespuestaEstudiante.disabled = true;
    btnEnviarRespuesta.disabled = true;
}

function mostrarPregunta(pregunta) {
    textoPregunta.textContent = pregunta;
    sinPregunta.classList.add('hidden');
    conPregunta.classList.remove('hidden');
    
    if (!esDocente) {
        habilitarCampoRespuesta();
        rondaActiva = true;
        mostrarMensaje('📢 Nueva pregunta publicada. ¡Responde rápido!', 'info');
    }
}

function ocultarPregunta() {
    sinPregunta.classList.remove('hidden');
    conPregunta.classList.add('hidden');
    deshabilitarCampoRespuesta();
    rondaActiva = false;
}

function mostrarResultado(ganador, respuestaCorrecta, pregunta) {
    nombreGanador.textContent = `🏆 ${ganador}`;
    respuestaCorrectaMostrar.textContent = `La respuesta correcta era: "${respuestaCorrecta}"`;
    areaResultados.classList.remove('hidden');
    
    deshabilitarCampoRespuesta();
    rondaActiva = false;
    
    // Mensaje personalizado según si es el ganador o no
    if (ganador === nombreUsuario) {
        mostrarMensaje('🎉 ¡Felicidades! ¡Has ganado esta ronda!', 'success');
    } else {
        mostrarMensaje(`🏆 ${ganador} ha ganado esta ronda`, 'info');
    }
}

function ocultarResultado() {
    areaResultados.classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Foco inicial
    inputNombreDocente.focus();
});

// Selección de rol
btnRolDocente.addEventListener('click', () => {
    btnRolDocente.classList.add('active');
    btnRolEstudiante.classList.remove('active');
    formDocente.classList.remove('hidden');
    formEstudiante.classList.add('hidden');
    inputNombreDocente.focus();
});

btnRolEstudiante.addEventListener('click', () => {
    btnRolEstudiante.classList.add('active');
    btnRolDocente.classList.remove('active');
    formEstudiante.classList.remove('hidden');
    formDocente.classList.add('hidden');
    inputNombreEstudiante.focus();
});

// Crear sala (docente)
btnCrearSala.addEventListener('click', () => {
    const nombre = inputNombreDocente.value.trim();
    if (!nombre) {
        mostrarMensaje('❌ Por favor ingresa tu nombre', 'error');
        inputNombreDocente.focus();
        return;
    }
    
    nombreUsuario = nombre;
    esDocente = true;
    
    socket.emit('sala:crear', nombreUsuario);
    mostrarMensaje('🏠 Creando sala...', 'info');
});

// Unirse a sala (estudiante)
btnUnirseSala.addEventListener('click', () => {
    const nombre = inputNombreEstudiante.value.trim();
    const codigo = inputCodigoSala.value.trim().toUpperCase();
    
    if (!nombre) {
        mostrarMensaje('❌ Por favor ingresa tu nombre', 'error');
        inputNombreEstudiante.focus();
        return;
    }
    
    if (!codigo || codigo.length !== 6) {
        mostrarMensaje('❌ Ingresa un código de sala válido (6 caracteres)', 'error');
        inputCodigoSala.focus();
        return;
    }
    
    nombreUsuario = nombre;
    esDocente = false;
    
    socket.emit('sala:unirse', { nombre: nombreUsuario, codigo: codigo });
    mostrarMensaje(`🚪 Uniéndose a la sala ${codigo}...`, 'info');
});

// Copiar código de sala
btnCopiarCodigo.addEventListener('click', copiarCodigoAlPortapapeles);

// Permitir Enter en los campos de entrada
inputNombreDocente.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnCrearSala.click();
    }
});

inputNombreEstudiante.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        inputCodigoSala.focus();
    }
});

inputCodigoSala.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnUnirseSala.click();
    }
});

// Auto-uppercase para código de sala
inputCodigoSala.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Publicar pregunta (solo docente)
formPregunta.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pregunta = inputPregunta.value.trim();
    const respuesta = inputRespuesta.value.trim();
    
    if (!pregunta || !respuesta) {
        mostrarMensaje('❌ Completa todos los campos', 'error');
        return;
    }
    
    // Emitir nueva pregunta
    socket.emit('pregunta:nueva', { pregunta, respuesta });
    
    limpiarFormulario(formPregunta);
    mostrarMensaje('📢 Pregunta publicada a todos los estudiantes', 'success');
});

// Reiniciar juego (solo docente)
btnReiniciar.addEventListener('click', () => {
    socket.emit('juego:reiniciar');
    limpiarFormulario(formPregunta);
    mostrarMensaje('🔄 Juego reiniciado', 'warning');
});

// Enviar respuesta (solo estudiantes)
formRespuesta.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!rondaActiva) {
        mostrarMensaje('⏰ La ronda ya ha terminado', 'warning');
        return;
    }
    
    const respuesta = inputRespuestaEstudiante.value.trim();
    if (!respuesta) {
        mostrarMensaje('❌ Escribe una respuesta', 'error');
        return;
    }
    
    // Emitir respuesta
    socket.emit('respuesta:enviada', respuesta);
    
    // Deshabilitar temporalmente el campo
    deshabilitarCampoRespuesta();
    mostrarMensaje(`📤 Respuesta enviada: "${respuesta}"`, 'info');
    
    limpiarFormulario(formRespuesta);
});

// Permitir Enter en el campo de respuesta
inputRespuestaEstudiante.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        formRespuesta.dispatchEvent(new Event('submit'));
    }
});

// ===== EVENTOS DE SOCKET.IO =====

// Conexión establecida
socket.on('connect', () => {
    console.log('Conectado al servidor');
    actualizarStatusConexion('conectado', '🟢 Conectado');
});

// Sala creada exitosamente (docente)
socket.on('sala:creada', (datos) => {
    console.log('Sala creada:', datos);
    codigoSala = datos.codigo;
    
    // Actualizar UI
    mostrarPanel(panelSalaInfo);
    actualizarInfoSala(datos.codigo, 0);
    panelDocente.classList.remove('hidden');
    panelJuego.classList.remove('hidden');
    
    nombreUsuarioSpan.textContent = `�‍🏫 ${nombreUsuario} (Docente)`;
    
    mostrarMensaje(`🎉 ${datos.mensaje}`, 'success');
    mostrarMensaje('💡 Comparte el código con tus estudiantes', 'info');
});

// Unido a sala exitosamente (estudiante)
socket.on('sala:unido', (datos) => {
    console.log('Unido a sala:', datos);
    codigoSala = datos.codigo;
    
    // Actualizar UI
    mostrarPanel(panelJuego);
    nombreUsuarioSpan.textContent = `�‍🎓 ${nombreUsuario}`;
    salaActual.textContent = `🏠 Sala: ${datos.codigo}`;
    salaActual.classList.remove('hidden');
    
    mostrarMensaje(`✅ ${datos.mensaje}`, 'success');
    mostrarMensaje('⏳ Esperando preguntas del docente...', 'info');
    
    // Solicitar información actualizada de la sala
    socket.emit('sala:info');
});

// Nuevo participante se unió
socket.on('participante:nuevo', (datos) => {
    if (esDocente) {
        actualizarInfoSala(codigoSala, datos.totalEstudiantes);
    }
    
    if (datos.nombre !== nombreUsuario) {
        mostrarMensaje(`👋 ${datos.nombre} se unió a la sala`, 'info');
    }
});

// Participante se desconectó
socket.on('participante:desconectado', (datos) => {
    if (esDocente) {
        actualizarInfoSala(codigoSala, datos.totalEstudiantes);
    }
    
    mostrarMensaje(`👋 ${datos.nombre} abandonó la sala`, 'info');
});

// Información de sala actualizada
socket.on('sala:info-actualizada', (datos) => {
    if (esDocente) {
        actualizarInfoSala(datos.codigo, datos.totalEstudiantes);
    }
});

// Nueva pregunta publicada
socket.on('pregunta:publicada', (pregunta) => {
    console.log('Nueva pregunta recibida:', pregunta);
    ocultarResultado();
    mostrarPregunta(pregunta);
});

// Ronda iniciada
socket.on('ronda:iniciada', () => {
    console.log('Ronda iniciada');
    rondaActiva = true;
});

// Respuesta incorrecta
socket.on('respuesta:incorrecta', (mensaje) => {
    mostrarMensaje(`❌ ${mensaje}`, 'error');
    // Rehabilitar el campo para que pueda seguir intentando
    if (rondaActiva && !esDocente) {
        habilitarCampoRespuesta();
    }
});

// Ronda terminada (hay un ganador)
socket.on('ronda:terminada', (datos) => {
    console.log('Ronda terminada:', datos);
    mostrarResultado(datos.ganador, datos.respuestaCorrecta, datos.pregunta);
});

// Juego reiniciado
socket.on('juego:reiniciado', () => {
    console.log('Juego reiniciado');
    ocultarResultado();
    ocultarPregunta();
    mostrarMensaje('🔄 El juego ha sido reiniciado por el docente', 'warning');
});

// Sala cerrada
socket.on('sala:cerrada', (mensaje) => {
    mostrarMensaje(`🚪 ${mensaje}`, 'warning');
    // Redirigir a la pantalla inicial
    setTimeout(() => {
        location.reload();
    }, 3000);
});

// Errores
socket.on('error:sala-no-existe', (mensaje) => {
    mostrarMensaje(`❌ ${mensaje}`, 'error');
});

socket.on('error:sin-permisos', (mensaje) => {
    mostrarMensaje(`⚠️ ${mensaje}`, 'warning');
});

socket.on('error:docente-no-puede-responder', (mensaje) => {
    mostrarMensaje(`⚠️ ${mensaje}`, 'warning');
});

socket.on('error:ronda-terminada', (mensaje) => {
    mostrarMensaje(`⚠️ ${mensaje}`, 'warning');
});

socket.on('error:usuario-no-identificado', (mensaje) => {
    mostrarMensaje(`❌ ${mensaje}`, 'error');
});

// Desconexión
socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    actualizarStatusConexion('desconectado', '🔴 Desconectado');
    mostrarMensaje('❌ Conexión perdida. Reintentando...', 'error');
});

// Reconexión
socket.on('reconnect', () => {
    console.log('Reconectado al servidor');
    actualizarStatusConexion('conectado', '🟢 Reconectado');
    mostrarMensaje('✅ Conexión restablecida', 'success');
});

// Error de conexión
socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error);
    actualizarStatusConexion('desconectado', '🔴 Error de conexión');
    mostrarMensaje('❌ No se pudo conectar al servidor', 'error');
});

// ===== FUNCIONES ADICIONALES =====

// Prevenir recarga accidental de la página
window.addEventListener('beforeunload', (e) => {
    if (nombreUsuario) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir del quiz?';
        return e.returnValue;
    }
});

// Manejo de visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Página oculta');
    } else {
        console.log('Página visible');
        // Verificar conexión cuando la página vuelve a ser visible
        if (!socket.connected) {
            socket.connect();
        }
    }
});

// Log inicial
console.log('🎮 Quiz Rápido: El Duelo de Conocimiento - Cliente inicializado');
console.log('🏠 Sistema de salas implementado - Los docentes crean salas, los estudiantes se unen con códigos');
