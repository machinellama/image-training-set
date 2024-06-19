# image-training-set

[![ja](https://img.shields.io/badge/lang-Japanese-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.ja.md)
[![es](https://img.shields.io/badge/lang-Spanish-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.es.md)
[![ko](https://img.shields.io/badge/lang-Korean-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.ko.md)
[![zh-CN](https://img.shields.io/badge/lang-Simplified--Chinese-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.zh-CN.md)

Hice este repositorio para etiquetar y organizar imágenes fácilmente para entrenar modelos de imágenes. Soporta la carga de imágenes (PNG/JPG) o videos (MP4) para generar imágenes automáticamente a intervalos de 1 segundo. Puedes agregar subtítulos a cada imagen y descargar un archivo ZIP con todas las imágenes y los subtítulos asociados en archivos txt.

Lo uso específicamente para entrenar modelos de Stable Diffusion y crear un conjunto de entrenamiento en el formato utilizado por kohya_ss. Nota: este repositorio NO está asociado de ninguna manera con Stable Diffusion ni kohya_ss.

# Tabla de contenidos
- [Privacidad](#Privacidad)
- [Configuración](#Configuración)
- [Pasos](#Pasos)
- [Capturas de pantalla](#Capturas%20de%20pantalla)
- [Licencia](#Licencia)
- [Problemas y Contribuciones](#Problemas%20y%20Contribuciones)

## Privacidad
La privacidad es un aspecto fundamental de este repositorio. Tus datos nunca se enviarán fuera de tu computadora. Tampoco se guardarán datos en tu navegador; si actualizas o cierras una pestaña, cualquier dato en proceso se perderá.

## Configuración

- Prerrequisito: `NodeJS` (yo uso v20.11.1, pero otras versiones probablemente también funcionen)
- `npm install`
- `npm run dev` para ejecutar en el puerto 3000

## Pasos

- Sube una o varias imágenes (PNG/JPG) y agrega un subtítulo para cada una
  - Cuanto más detallados sean los subtítulos, mejor será el conjunto de entrenamiento
- Sube un archivo de video MP4
  - Establece una hora de inicio y de finalización para capturar imágenes del video
  - Se generarán imágenes a intervalos de 1 segundo
  - Agrega una descripción que se aplique a cada imagen generada
- Descarga un archivo ZIP con todas las imágenes y los subtítulos asociados en archivos txt
- Si descargas múltiples archivos ZIP, extrae todos los archivos en una sola carpeta para el entrenamiento
- Una vez que tengas todos tus datos de entrenamiento (imágenes y archivos txt) en una sola carpeta, dirígete a [kohya_ss](https://github.com/bmaltais/kohya_ss) para entrenar o ajustar tu modelo de Stable Diffusion

## Capturas de pantalla

Subiendo una imagen:

<img src="../images/its1.png" alt="image-training-set" width="650"/>

Subiendo un video:

<img src="../images/its2.png" alt="image-training-set" width="650"/>

Descargando un archivo ZIP:

<img src="../images/its3.png" alt="image-training-set" width="650"/>

## Licencia
Licencia MIT

## Problemas y Contribuciones
Si tienes alguna pregunta o encuentras algún problema, por favor crea un `Issue` con información detallada.
  - Ten en cuenta que esto solo se ha probado en una computadora con Windows usando Firefox. Tu experiencia puede variar en otros sistemas operativos y navegadores.

¡Cualquiera puede agregar nuevo código o características! Por favor, crea un `Issue` primero, comenta que estás trabajando en ello (para que varias personas no trabajen en lo mismo) y menciona el número del `Issue` en tu Pull Request.
