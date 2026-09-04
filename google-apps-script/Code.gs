/**
 * ==============================================================================
 * 🐍 PYTHON DESDE CERO - GOOGLE APPS SCRIPT WEB APP ENDPOINT
 * ==============================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN PASO A PASO:
 * 
 * 1. Crea una nueva hoja de cálculo en Google Sheets (ej: "Python Desde Cero - Resultados Desafíos").
 * 2. En la primera fila (encabezados), coloca las siguientes 10 columnas:
 *    Columna A: Fecha
 *    Columna B: Nombre
 *    Columna C: Apellido
 *    Columna D: Colegio
 *    Columna E: Curso
 *    Columna F: Desafío
 *    Columna G: Puntaje
 *    Columna H: Nota
 *    Columna I: Porcentaje
 *    Columna J: Tiempo
 * 
 * 3. En el menú superior de Google Sheets, ve a:
 *    Extensiones ➔ Apps Script
 * 
 * 4. Borra cualquier código existente en el editor de Apps Script y pega TODO este archivo.
 * 5. Cambia el valor de TEACHER_EMAIL por tu dirección de correo electrónico donde deseas recibir avisos.
 * 
 * 6. Haz clic en "Implementar" (Deploy) ➔ "Nueva implementación" (New deployment):
 *    - Tipo: Aplicación web (Web app)
 *    - Descripción: Versión 1.0 Desafíos Python
 *    - Ejecutar como: Yo (tu cuenta de Google)
 *    - Quién tiene acceso: Cualquier usuario (Anyone) [IMPORTANTE para que el frontend pueda enviar POST]
 * 
 * 7. Haz clic en "Implementar", autoriza los permisos y COPIA la URL de la aplicación web que termina en /exec.
 * 8. En el proyecto frontend, crea o edita el archivo `.env` y pega esa URL:
 *    VITE_RESULTS_ENDPOINT=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
 *    VITE_TEACHER_EMAIL=tu_correo@gmail.com
 * ==============================================================================
 */

// CONFIGURACIÓN DEL DOCENTE (Modifica con tu email de preferencia)
var TEACHER_EMAIL = "docente@colegio.edu.ar";

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 1. Insertar fila en Google Sheets
    sheet.appendRow([
      data.fecha || new Date().toLocaleString(),
      data.studentName || "Sin nombre",
      data.studentLastName || "Sin apellido",
      data.school || "Sin colegio",
      data.course || "Sin curso",
      data.challengeTitle || data.challengeId || "Desafío",
      data.score || 0,
      data.grade || 0,
      (data.percentage || 0) + "%",
      data.duration || "N/A"
    ]);

    // 2. Enviar notificación por email al docente
    if (TEACHER_EMAIL && TEACHER_EMAIL !== "docente@colegio.edu.ar") {
      try {
        var subject = "🚀 Nuevo desafío completado: " + (data.studentName || "") + " " + (data.studentLastName || "");
        var htmlBody = 
          "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;'>" +
            "<h2 style='color: #0284c7; margin-top: 0;'>🚀 Nuevo desafío de Python completado</h2>" +
            "<p>Se ha registrado una nueva entrega en la plataforma <strong>Python desde Cero</strong>:</p>" +
            "<table style='width: 100%; border-collapse: collapse; margin: 15px 0;'>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Alumno:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9;'>" + data.studentName + " " + data.studentLastName + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Colegio:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9;'>" + data.school + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Curso:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9;'>" + data.course + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Desafío:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9;'>" + data.challengeTitle + "</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Nota final:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; color: #16a34a; font-weight: bold; font-size: 16px;'>" + data.grade + " / 10</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Puntaje:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9;'>" + data.score + " / 100 pts (" + data.percentage + "%)</td></tr>" +
              "<tr><td style='padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;'>Tiempo utilizado:</td><td style='padding: 8px; border-bottom: 1px solid #f1f5f9;'>" + data.duration + "</td></tr>" +
            "</table>" +
            "<p style='font-size: 12px; color: #64748b; margin-top: 20px;'>Python desde Cero — Notificación automática de evaluación.</p>" +
          "</div>";

        MailApp.sendEmail({
          to: TEACHER_EMAIL,
          subject: subject,
          htmlBody: htmlBody
        });
      } catch (mailError) {
        Logger.log("Error al enviar email: " + mailError.toString());
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
