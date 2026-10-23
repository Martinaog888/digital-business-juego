from pathlib import Path
import json,zipfile
from urllib.parse import urlparse
root=Path(__file__).resolve().parents[1]
src=root/'src'
config=json.loads((root/'online-config.json').read_text())
server=config.get('serverUrl','').rstrip('/')
if server:
 u=urlparse(server)
 if u.scheme!='https' and not(u.scheme=='http' and u.hostname in ['localhost','127.0.0.1']):
  raise ValueError('El servidor debe usar HTTPS.')
 if u.username or u.password or u.query or u.fragment or u.path not in ['', '/']:
  raise ValueError('Usa solo el origen del servidor, sin credenciales ni rutas.')
game=(src/'game.js').read_text()
entries=json.loads((src/'modes-i18n.json').read_text())
addon='const modeTranslations = '+json.dumps(entries,ensure_ascii=False)+';\nfor(const [locale,entries] of Object.entries(modeTranslations))Object.assign(translations[locale],entries);'
game=game.replace('/*__MODE_TRANSLATIONS__*/',addon)
modes=(src/'modes.js').read_text().replace('const SERVER_URL = "";','const SERVER_URL = '+json.dumps(server)+';')
game=game.replace('/*__MODES__*/',modes)
html=(src/'index.template.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+(src/'styles.css').read_text()+'\n'+(src/'modes.css').read_text()+'\n</style>')
html=html.replace('<script src="rules.js"></script>','<script>\n'+(src/'rules.js').read_text()+'\n</script>')
html=html.replace('<script src="game.js"></script>','<script>\n'+game+'\n</script>')
(root/'La-Sillita.html').write_text(html)
out=root/'output';out.mkdir(exist_ok=True)
for name in ['La-Sillita.html','index.html']:(out/name).write_text(html)
(out/'game.js').write_text(game)
for name in ['styles.css','rules.js']:(out/name).write_text((src/name).read_text())
with zipfile.ZipFile(root/'La-Sillita.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in ['La-Sillita.html','online-config.json','ACTIVAR-ONLINE.md','README.md','package.json','package-lock.json','wrangler.jsonc']:
  path=root/name
  if path.exists():z.write(path,'La-Sillita/'+name)
 for folder in ['src','server','scripts','tests']:
  for path in (root/folder).rglob('*'):
   if path.is_file() and '__pycache__' not in str(path):z.write(path,'La-Sillita/'+str(path.relative_to(root)))
with zipfile.ZipFile(root/'La-Sillita.zip') as z:assert z.testzip() is None
print('HTML autónomo y ZIP generados. Servidor online: '+('configurado' if server else 'pendiente de activación'))
