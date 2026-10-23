# Activar las salas online sin cambiar el enlace

El servidor está implementado y se puede probar localmente. No está desplegado en una cuenta de Cloudflare. Mientras `online-config.json` tenga una URL vacía, el juego muestra un aviso de activación pendiente. Los modos individual y local funcionan igualmente.

## 1. Cuenta gratuita
Crea tu cuenta en https://dash.cloudflare.com/sign-up y verifica tu correo. Utiliza Workers Free. No compres un dominio ni actives un plan de pago. Los Durable Objects con SQLite están disponibles en el plan gratuito, con cuotas: https://developers.cloudflare.com/durable-objects/platform/pricing/

## 2. Publicar el servidor
Descarga el repositorio desde GitHub (Code → Download ZIP) y descomprímelo. Para administrar el servidor instala Node.js LTS desde https://nodejs.org. Los jugadores no necesitan instalar nada.

Abre una terminal en la carpeta del proyecto:

```sh
npm ci
npx wrangler login
npx wrangler deploy
```

`login` abre el navegador para autorizar tu cuenta. No pegues contraseñas o tokens en archivos ni en el chat. `deploy` utiliza `wrangler.jsonc` para crear el Worker y sus dos clases de Durable Objects SQLite. No cambia GitHub Pages. Si Cloudflare solicita contratar un plan de pago, detente: esta implementación se ha preparado para Workers Free.

El enlace del Worker es solo el servidor: no mostrará la página del juego. Sigue jugando desde GitHub Pages.

Copia la dirección REAL que devuelve Wrangler, por ejemplo `https://la-sillita-salas.TU-SUBDOMINIO.workers.dev`.

## 3. Conectar la página
Edita `online-config.json`:

```json
{"serverUrl":"https://la-sillita-salas.TU-SUBDOMINIO.workers.dev"}
```

Esta URL es pública, no es una contraseña. No añadas `/rooms`, parámetros ni tokens.

Puedes facilitar a Codex esa URL pública para terminar la conexión. Si lo haces tú, con Python 3 instalado:

```sh
python3 scripts/build.py
```

En Windows puede ser `py scripts/build.py`. Después guarda los cambios en GitHub:

```sh
git add online-config.json La-Sillita.html La-Sillita.zip
git commit -m "Activar salas online"
git push origin HEAD:main
```

No hagas un push forzado. Integra primero los cambios remotos si los hay. GitHub Pages publicará automáticamente el mismo archivo y enlace:
https://martinaog888.github.io/digital-business-juego/La-Sillita.html

## 4. Probar con amigos
1. Abre el juego, selecciona Online e introduce nombre y animal.
2. Crea una sala y comparte el código o el enlace.
3. Otra persona entra desde otro dispositivo con un animal distinto.
4. Cada persona pulsa Activar sonido y prepararme.
5. El anfitrión comienza. Cada dispositivo controla exclusivamente su animal.
6. Quien pierde observa hasta la revancha.

Para probar en un ordenador usa perfiles de navegador o contextos privados independientes. Cada jugador necesita su propia sesión.

## Reglas de conexión y seguridad
El servidor decide las sillas por orden de llegada de mensajes válidos. Comprueba identidad, ronda, animales únicos y pulsaciones duplicadas o anticipadas. Ignora los tiempos y ganadores que intente declarar un cliente. Solo acepta pulsaciones con una señal aleatoria de la ronda, enviada por el servidor después de parar la música; no comunica por adelantado cuándo se detendrá. No puede garantizar la detección de todo automatismo de un navegador modificado; la latencia y el audio Bluetooth pueden influir.

Una desconexión de un jugador activo anula y pausa la ronda actual durante un máximo de 20 segundos, sin borrar puntos anteriores. Al reconectar hay que prepararse y repetir la misma ronda. Si no se recupera, se cancela la partida y se vuelve a la sala. El anfitrión se transfiere si sale. Las salas caducan tras 30 minutos sin actividad relevante. Son privadas por invitación: cualquiera con el código puede intentar entrar; no hay un listado público.

Las credenciales administrativas no están en el repositorio. Los tokens privados de los jugadores no van en invitaciones ni en instantáneas públicas. Los nombres se muestran como texto. Se permiten el origen de GitHub Pages y sesiones verificadas; conocer el origen no sustituye la autenticación. Límites del servidor: 4 jugadores, mensajes de 2 KB, 25 mensajes/segundo por conexión, 10 salas/hora y 40 conexiones/minuto por IP.

Para desactivar online, deja `serverUrl` vacío, vuelve a generar el HTML y desactiva el Worker. Individual y local seguirán funcionando.
