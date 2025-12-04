Projeto PokeAgenda — instruções rápidas

Backend (Flask):
- entre na pasta `backend` e crie um ambiente Python, instale dependências e rode o servidor:

```powershell
cd c:\Users\manu\Desktop\Pokeagenda\backend
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

O backend por padrão escuta em `http://0.0.0.0:5000`.

Frontend (React + Vite):
- entre na pasta do frontend e rode o servidor de desenvolvimento:

```powershell
cd c:\Users\manu\Desktop\Pokeagenda\frontend\pokeagenda
npm install
npm run dev
```

Observações:
- O backend já tem CORS habilitado (via `flask_cors`) para aceitar requisições do frontend. Os componentes do frontend utilizam `http://localhost:5000` nas chamadas à API.
- Se for necessário ajustar a URL do backend, edite os `fetch` nos componentes em `src/components`.
