Dupla: Manuela e Vinícius
Turma: 301 info


Para executar o frontend:
 -possua o node, com npm e nvm funcionando

 -entra no caminho: \Pokeagenda\frontend\pokeagenda>
 -execute: npm install
           npm run dev
 -ele deve abrir:
> pokeagenda@0.0.0 dev
> vite


  VITE v7.2.2  ready in 1524 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help



Para executar o backend:
 -entre no caminho \Pokeagenda\backend
 -execute python -m flask run --debug
 -ele deve abrir:
 * Debug mode: on
 WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 530-846-774




para importar o banco de dados você depende do aplicativo que estiver usando.
por exemplo o MySql Workbench:
 -Vá na aba server -> data import 
 -dai onde pede Import from Dump Project Folder, coloque o local do arquivo Dump20251205
 -depois disso pode clicar em Load Folder Contents e verifique se recebeu o banco de dados "pokeagenda"
 -após isso pode clicar em Start Import ou se der errado por ir copiando o código dos arquivos.

Caso use outro aplicativo, siga os passos recomendados de importação dele
se não funcionar tente abrir o arquivo Dump20251205 e copiar os comandos Sql descritos nele.