# app.py
# Rotas Flask corrigidas para trabalhar com as classes do arquivo classes.py
# Use: python app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymysql.err import MySQLError

# Importa as classes (certifique-se de que classes.py esteja no mesmo diretório)
from classes import Treinador, Tipo, Pokemon, TreinadorPokemon

app = Flask(__name__)
CORS(app)  # Permite requisições de qualquer origem (CORS liberado)


# =====================================================
# Rota inicial (teste)
# =====================================================
@app.route('/')
def home():
    return jsonify({"message": "Bem-vindo à PokeAgenda API!"})


# =====================================================
# ROTAS DE TREINADOR
# =====================================================

# Criar treinador
# exemplo curl:
# curl -X POST http://127.0.0.1:5000/criar_treinador -H "Content-Type: application/json" -d '{"nome":"Ash","email":"ash@kanto","cpf":"12345678900","foto":"ash.jpg","cidade":"Pallet"}'
@app.route('/criar_treinador', methods=['POST'])
def criar_treinador():
    dados = request.json or {}
    resultado = Treinador.criar_treinador(
        nome=dados.get("nome"),
        email=dados.get("email"),
        cpf=dados.get("cpf"),
        foto=dados.get("foto"),
        cidade=dados.get("cidade")
    )
    return jsonify({"message": resultado})


# Editar/atualizar treinador
# curl -X PUT http://127.0.0.1:5000/editar_treinador/1 -H "Content-Type: application/json" -d '{"nome":"Ash Updated","cidade":"Viridian"}'
@app.route('/editar_treinador/<int:id>', methods=['PUT'])
def editar_treinador(id):
    dados = request.json or {}

    try:
        resultado = Treinador.atualizar_treinador(
            id=id,
            nome=dados.get("nome"),
            email=dados.get("email"),
            cpf=dados.get("cpf"),
            foto=dados.get("foto"),
            cidade=dados.get("cidade")
        )

        if resultado != "Treinador atualizado com sucesso":
            return jsonify({"erro": resultado}), 400

        return jsonify({"message": resultado}), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# Deletar treinador
@app.route('/deletar_treinador/<int:id>', methods=['DELETE'])
def deletar_treinador(id):
    resultado = Treinador.deletar_treinador(id)
    return jsonify({"message": resultado})

# Adicione logo abaixo da rota listar_treinadores

# Listar treinador MAIN (retorna apenas o primeiro treinador, para compatibilidade com o frontend atual)
@app.route('/listar_treinador', methods=['GET'])
def listar_treinador():
    treinadores = Treinador.listar_treinadores()
    if treinadores:
        return jsonify(treinadores[0])  # retorna só o primeiro como objeto para o frontend
    else:
        return jsonify({})  # Objeto vazio se nenhum encontrado

# Listar treinadores
@app.route('/listar_treinadores', methods=['GET'])
def listar_treinadores():
    treinadores = Treinador.listar_treinadores()
    return jsonify(treinadores)


# Obter treinador por id (útil)
@app.route('/treinador/<int:id>', methods=['GET'])
def obter_treinador(id):
    treinador = Treinador.obter_por_id(id)
    if treinador:
        return jsonify(treinador)
    else:
        return jsonify({"message": "Treinador não encontrado."}), 404


# =====================================================
# ROTAS DE TIPO
# =====================================================

# Criar tipo
@app.route('/criar_tipo', methods=['POST'])
def criar_tipo():
    dados = request.json or {}
    resultado = Tipo.criar_tipo(dados.get("nome"))
    return jsonify({"message": resultado})


# Editar tipo
@app.route('/editar_tipo/<int:id>', methods=['PUT'])
def editar_tipo(id):
    dados = request.json or {}
    resultado = Tipo.atualizar_tipo(id, dados.get("nome"))
    return jsonify({"message": resultado})


# Deletar tipo
@app.route('/deletar_tipo/<int:id>', methods=['DELETE'])
def deletar_tipo(id):
    resultado = Tipo.deletar_tipo(id)
    return jsonify({"message": resultado})


# Listar tipos
@app.route('/listar_tipos', methods=['GET'])
def listar_tipos():
    tipos = Tipo.listar_tipos()
    return jsonify(tipos)


# =====================================================
# ROTAS DE POKEMON
# =====================================================

# Criar pokemon
# Observação: a função interna espera (shiny, apelido, numero_pokedex, sombroso, id_treinador, loca, habilidade)
@app.route('/criar_pokemon', methods=['POST'])
def criar_pokemon():
    dados = request.json or {}
    # Pegamos os campos que a classe espera.
    resultado = Pokemon.criar_pokemon(
        shiny=dados.get("shiny", False),
        apelido=dados.get("apelido"),
        numero_pokedex=dados.get("numero_pokedex"),
        sombroso=dados.get("sombroso", False),
        id_treinador=dados.get("id_treinador"),
        loca=dados.get("loca"),  # 'time' ou 'box' — valide no front se quiser
        habilidade=dados.get("habilidade")
    )
    return jsonify({"message": resultado})


# Editar/atualizar pokemon
@app.route('/editar_pokemon/<int:id>', methods=['PUT'])
def editar_pokemon(id):
    dados = request.json or {}
    resultado = Pokemon.atualizar_pokemon(
        id=id,
        shiny=dados.get("shiny"),
        apelido=dados.get("apelido"),
        numero_pokedex=dados.get("numero_pokedex"),
        sombroso=dados.get("sombroso"),
        id_treinador=dados.get("id_treinador"),
        loca=dados.get("loca"),
        habilidade=dados.get("habilidade")
    )
    return jsonify({"message": resultado})

@app.route('/trocar_loca/<int:id>', methods=['PUT'])
def trocar_loca(id):
    resultado = Pokemon.trocar_loca(
        id=id,
    )
    return jsonify({"message": resultado})

# Deletar pokemon
@app.route('/deletar_pokemon/<int:id>', methods=['DELETE'])
def deletar_pokemon(id):
    resultado = Pokemon.deletar_pokemon(id)
    return jsonify({"message": resultado})


# Listar pokemons (todos)
@app.route('/listar_pokemons', methods=['GET'])
def listar_pokemons():
    pokemons = Pokemon.listar_pokemons()
    return jsonify(pokemons)


# Listar pokemons por treinador
@app.route('/listar_pokemons_por_treinador/<int:treinador_id>', methods=['GET'])
def listar_pokemons_por_treinador(treinador_id):
    pokemons = Pokemon.listar_pokemons_por_treinador(treinador_id)
    return jsonify(pokemons)


# Obter pokemon por id
@app.route('/pokemon/<int:id>', methods=['GET'])
def obter_pokemon(id):
    pokemon = Pokemon.obter_por_id(id)
    if pokemon:
        return jsonify(pokemon)
    else:
        return jsonify({"message": "Pokemon não encontrado."}), 404


# =====================================================
# ROTAS DE TREINADOR_POKEMON (ASSOCIAÇÃO)
# =====================================================

# Criar associação (atribuir um pokemon a um treinador/com localização 'time' ou 'box')
@app.route('/criar_treinador_pokemon', methods=['POST'])
def criar_treinador_pokemon():
    dados = request.json or {}
    resultado = TreinadorPokemon.criar_treinador_pokemon(
        treinador_id=dados.get("treinador_id"),
        pokemon_id=dados.get("pokemon_id"),
        loca=dados.get("loca")
    )
    return jsonify({"message": resultado})


# Remover associação — rota com dois parâmetros na URL
# curl -X DELETE http://127.0.0.1:5000/remover_treinador_pokemon/1/2
@app.route('/remover_treinador_pokemon/<int:treinador_id>/<int:pokemon_id>', methods=['DELETE'])
def remover_treinador_pokemon(treinador_id, pokemon_id):
    resultado = TreinadorPokemon.deletar_treinador_pokemon(treinador_id, pokemon_id)
    return jsonify({"message": resultado})


# Listar todas as associações
@app.route('/listar_treinador_pokemon', methods=['GET'])
def listar_treinador_pokemon():
    associacoes = TreinadorPokemon.listar_treinador_pokemon()
    return jsonify(associacoes)


# Listar pokemons do treinador (usando a tabela de associação)
@app.route('/listar_pokemons_do_treinador/<int:treinador_id>', methods=['GET'])
def listar_pokemons_do_treinador(treinador_id):
    pokemons = TreinadorPokemon.listar_pokemons_do_treinador(treinador_id)
    return jsonify(pokemons)


# =====================================================
# EXECUÇÃO DO APP
# =====================================================
if __name__ == "__main__":
    # host 0.0.0.0 para acessar pela rede local, porta 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
