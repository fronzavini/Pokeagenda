# app.py
from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS
from pymysql.err import MySQLError

# Importa as classes com funções de banco de dados
from classes import Treinador, Tipo, Pokemon, TreinadorPokemon


app = Flask(__name__)
CORS(app)  # Permite requisições de qualquer origem (CORS liberado)


# =====================================================
# Função de conexão com o banco de dados
# =====================================================
def conectar_banco():
    """Cria uma conexão com o banco POKEAGENDA"""
    try:
        conexao = pymysql.connect(
            host="localhost",
            user="root",
            password="root",
            database="POKEAGENDA"
        )
        print("✅ Conexão com o banco funcionando")
        return conexao
    except MySQLError as erro:
        print(f"❌ Erro ao conectar ao banco: {erro}")
        return None


# =====================================================
# Rota inicial (teste)
# =====================================================
@app.route('/')
def home():
    return jsonify({"message": "Bem-vindo à PokeAgenda API!"})


# =====================================================
# ROTAS DE TREINADOR
# =====================================================

# Exemplo:
# curl -X POST http://127.0.0.1:5000/criar_treinador -H "Content-Type: application/json" -d "{\"nome\":\"Ash Ketchum\",\"email\":\"ash@kanto.com\",\"cpf\":\"12345678900\",\"foto\":\"ash.jpg\",\"cidade\":\"Pallet Town\"}"
@app.route('/criar_treinador', methods=['POST'])
def criar_treinador():
    dados = request.json
    resultado = Treinador.criar_treinador(
        nome=dados.get("nome"),
        email=dados.get("email"),
        cpf=dados.get("cpf"),
        foto=dados.get("foto"),
        cidade=dados.get("cidade")
    )
    return jsonify({"message": resultado})


# curl -X PUT http://127.0.0.1:5000/editar_treinador/1 -H "Content-Type: application/json" -d "{\"nome\":\"Ash Updated\",\"email\":\"ash@pallet.com\",\"foto\":\"nova.jpg\",\"cidade\":\"Viridian\"}"
@app.route('/editar_treinador/<int:id>', methods=['PUT'])
def editar_treinador(id):
    dados = request.json
    resultado = Treinador.editar_treinador(
        id=id,
        nome=dados.get("nome"),
        email=dados.get("email"),
        cpf=dados.get("cpf"),
        foto=dados.get("foto"),
        cidade=dados.get("cidade")
    )
    return jsonify({"message": resultado})


# curl -X DELETE http://127.0.0.1:5000/deletar_treinador/1
@app.route('/deletar_treinador/<int:id>', methods=['DELETE'])
def deletar_treinador(id):
    resultado = Treinador.deletar_treinador(id)
    return jsonify({"message": resultado})


# curl -X GET http://127.0.0.1:5000/listar_treinadores
@app.route('/listar_treinadores', methods=['GET'])
def listar_treinadores():
    treinadores = Treinador.listar_treinadores()
    return jsonify(treinadores)


# =====================================================
# ROTAS DE TIPO
# =====================================================

# curl -X POST http://127.0.0.1:5000/criar_tipo -H "Content-Type: application/json" -d "{\"nome\":\"Fogo\"}"
@app.route('/criar_tipo', methods=['POST'])
def criar_tipo():
    dados = request.json
    resultado = Tipo.criar_tipo(dados.get("nome"))
    return jsonify({"message": resultado})


# curl -X PUT http://127.0.0.1:5000/editar_tipo/1 -H "Content-Type: application/json" -d "{\"nome\":\"Água\"}"
@app.route('/editar_tipo/<int:id>', methods=['PUT'])
def editar_tipo(id):
    dados = request.json
    resultado = Tipo.editar_tipo(id, dados.get("nome"))
    return jsonify({"message": resultado})


# curl -X DELETE http://127.0.0.1:5000/deletar_tipo/1
@app.route('/deletar_tipo/<int:id>', methods=['DELETE'])
def deletar_tipo(id):
    resultado = Tipo.deletar_tipo(id)
    return jsonify({"message": resultado})


# curl -X GET http://127.0.0.1:5000/listar_tipos
@app.route('/listar_tipos', methods=['GET'])
def listar_tipos():
    tipos = Tipo.listar_tipos()
    return jsonify(tipos)


# =====================================================
# ROTAS DE POKEMON
# =====================================================

# curl -X POST http://127.0.0.1:5000/criar_pokemon -H "Content-Type: application/json" -d "{\"nome\":\"Charmander\",\"shiny\":false,\"apelido\":\"Chary\",\"numero_pokedex\":4,\"tipo\":1,\"imagem_url\":\"charmander.png\",\"altura\":0.6,\"peso\":8.5,\"habilidade\":\"Blaze\"}"
@app.route('/criar_pokemon', methods=['POST'])
def criar_pokemon():
    dados = request.json
    resultado = Pokemon.criar_pokemon(
        nome=dados.get("nome"),
        shiny=dados.get("shiny"),
        apelido=dados.get("apelido"),
        numero_pokedex=dados.get("numero_pokedex"),
        tipo=dados.get("tipo"),
        imagem_url=dados.get("imagem_url"),
        altura=dados.get("altura"),
        peso=dados.get("peso"),
        habilidade=dados.get("habilidade")
    )
    return jsonify({"message": resultado})


# curl -X PUT http://127.0.0.1:5000/editar_pokemon/1 -H "Content-Type: application/json" -d "{\"apelido\":\"Mega Char\",\"altura\":1.2}"
@app.route('/editar_pokemon/<int:id>', methods=['PUT'])
def editar_pokemon(id):
    dados = request.json
    resultado = Pokemon.editar_pokemon(
        id=id,
        nome=dados.get("nome"),
        shiny=dados.get("shiny"),
        apelido=dados.get("apelido"),
        numero_pokedex=dados.get("numero_pokedex"),
        tipo=dados.get("tipo"),
        imagem_url=dados.get("imagem_url"),
        altura=dados.get("altura"),
        peso=dados.get("peso"),
        habilidade=dados.get("habilidade")
    )
    return jsonify({"message": resultado})


# curl -X DELETE http://127.0.0.1:5000/deletar_pokemon/1
@app.route('/deletar_pokemon/<int:id>', methods=['DELETE'])
def deletar_pokemon(id):
    resultado = Pokemon.deletar_pokemon(id)
    return jsonify({"message": resultado})


# curl -X GET http://127.0.0.1:5000/listar_pokemons
@app.route('/listar_pokemons', methods=['GET'])
def listar_pokemons():
    pokemons = Pokemon.listar_pokemons()
    return jsonify(pokemons)


# =====================================================
# ROTAS DE TREINADOR_POKEMON
# =====================================================

# curl -X POST http://127.0.0.1:5000/associar_treinador_pokemon -H "Content-Type: application/json" -d "{\"treinador_id\":1,\"pokemon_id\":1,\"loca\":\"time\"}"
@app.route('/criar_treinador_pokemon', methods=['POST'])
def criar_treinador_pokemon():
    dados = request.json
    resultado = TreinadorPokemon.criar_treinador_pokemon(
        treinador_id=dados.get("treinador_id"),
        pokemon_id=dados.get("pokemon_id"),
        loca=dados.get("loca")
    )
    return jsonify({"message": resultado})


# curl -X DELETE http://127.0.0.1:5000/remover_treinador_pokemon/1
@app.route('/deletar_treinador_pokemon/<int:id>', methods=['DELETE'])
def deletar_treinador_pokemon(treinador_id, pokemon_id):
    resultado = TreinadorPokemon.deletar_treinador_pokemon(treinador_id, pokemon_id)
    return jsonify({"message": resultado})


# curl -X GET http://127.0.0.1:5000/listar_treinador_pokemon
@app.route('/listar_treinador_pokemon', methods=['GET'])
def listar_treinador_pokemon():
    associacoes = TreinadorPokemon.listar_treinador_pokemon()
    return jsonify(associacoes)


@app.route('/listar_pokemons_do_treinador/<int:treinador_id>', methods=['GET'])
def listar_pokemons_do_treinador(treinador_id):
    pokemons = TreinadorPokemon.listar_pokemons_do_treinador(treinador_id)
    return jsonify(pokemons)
# =====================================================
# EXECUÇÃO DO APP
# =====================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
