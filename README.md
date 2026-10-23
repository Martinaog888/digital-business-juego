# La Sillita Musical
Juego para Digital Business con panda, dragón, perro y conejo. Español de España, inglés británico, polaco y alemán estándar.

Jugar: https://martinaog888.github.io/digital-business-juego/La-Sillita.html

- **Individual:** nombre, animal y tres rivales automáticos. Dificultad fácil/media/difícil, sin servicios de IA ni pagos.
- **Local:** 2–4 personas con nombres y animales diferentes. Teclas A/F/J/L y controles táctiles multitáctiles.
- **Online:** salas para 2–4 dispositivos, servidor autoritativo, espectadores y revancha. Requiere desplegar el servidor gratuito: [ACTIVAR-ONLINE.md](ACTIVAR-ONLINE.md). La interfaz avisa si está pendiente.

El idioma se guarda localmente. El sonido se activa mediante un gesto de cada participante. Mantener una tecla o un dedo pulsados no da una silla.

## Estructura
- `La-Sillita.html`: HTML autónomo; individual y local funcionan sin servidor.
- `La-Sillita.zip`: proyecto completo.
- `src/`: diseño, reglas, música, controles, menú y traducciones.
- `server/`: Worker y lógica de salas; no se ejecuta en GitHub Pages.
- `online-config.json`: URL pública del servidor, sin credenciales.
- `scripts/build.py`: genera HTML y ZIP.
- `tests/`: pruebas de reglas y navegador.

## Desarrollo
Requiere Node.js y Python 3 únicamente para mantener el proyecto, nunca para jugar.

```sh
npm ci
npm run build
npm test
```

Servidor de pruebas sin publicar: `npm run server:dev`. Página local en otra terminal: `npm run dev`.

Las pruebas de navegador necesitan Chromium en el entorno de desarrollo: `npx playwright install chromium`. Si utilizas otro ejecutable, define `CHROMIUM_PATH`. Los jugadores no necesitan instalarlo.

La versión previa se conserva en `respaldo/antes-tres-modos-20261023`. Los cambios se preparan en `desarrollo/tres-modos`. GitHub Pages sigue publicando desde `main` y no cambia el enlace del juego.
