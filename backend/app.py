# app.py
# Rotas Flask corrigidas para trabalhar com as classes do arquivo classes.py
# Use: python app.py

# Importa Flask (framework), jsonify (para retornar JSON), e request (para ler dados que chegam por POST e PUT)
from flask import Flask, jsonify, request

# Libera a API para ser acessada de outros domínios (como o React)
from flask_cors import CORS

# Tratamento de erros relacionados ao MySQL
from pymysql.err import MySQLError

# Importa as classes do backend que fazem todas as operações de banco
from classes import Treinador, Tipo, Pokemon, TreinadorPokemon

# Cria a aplicação Flask
app = Flask(__name__)

# Ativa CORS (Cross-Origin Resource Sharing) para permitir requisições externas
CORS(app)


# =====================================================
# Rota inicial (teste)
# =====================================================
@app.route('/')
def home():
    # Retorna uma mensagem simples para testar se o servidor está rodando
    return jsonify({"message": "Bem-vindo à PokeAgenda API!"})


# =====================================================
# ROTAS DE TREINADOR
# =====================================================

# Criar treinador
# Recebe JSON com nome, email, cpf, foto e cidade
@app.route('/criar_treinador', methods=['POST'])
def criar_treinador():
    dados = request.json or {}   # Lê o JSON enviado pelo frontend

    # Chama o método da classe Treinador que insere no banco
    resultado = Treinador.criar_treinador(
        nome=dados.get("nome"),
        email=dados.get("email"),
        cpf=dados.get("cpf"),
        foto=dados.get("foto"),
        cidade=dados.get("cidade")
    )
    return jsonify({"message": resultado})


# Edita um treinador existente pelo ID
@app.route('/editar_treinador/<int:id>', methods=['PUT'])
def editar_treinador(id):
    dados = request.json or {}

    try:
        # Chama a função da classe que atualiza no banco
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


# Deletar treinador por ID
@app.route('/deletar_treinador/<int:id>', methods=['DELETE'])
def deletar_treinador(id):
    resultado = Treinador.deletar_treinador(id)
    return jsonify({"message": resultado})


# Retorna APENAS 1 treinador (compatibilidade com o frontend atual)
@app.route('/listar_treinador', methods=['GET'])
def listar_treinador():
    treinadores = Treinador.listar_treinadores()
    if treinadores:
        return jsonify(treinadores[0])   # Retorna só o primeiro
    else:
        return jsonify({})


# Lista todos os treinadores cadastrados no banco
@app.route('/listar_treinadores', methods=['GET'])
def listar_treinadores():
    treinadores = Treinador.listar_treinadores()
    return jsonify(treinadores)


# Busca um treinador específico pelo ID
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

# Cria novo tipo (ex: Fogo, Água, Planta)
@app.route('/criar_tipo', methods=['POST'])
def criar_tipo():
    dados = request.json or {}
    resultado = Tipo.criar_tipo(dados.get("nome"))
    return jsonify({"message": resultado})


# Edita um tipo existente
@app.route('/editar_tipo/<int:id>', methods=['PUT'])
def editar_tipo(id):
    dados = request.json or {}
    resultado = Tipo.atualizar_tipo(id, dados.get("nome"))
    return jsonify({"message": resultado})


# Deleta tipo
@app.route('/deletar_tipo/<int:id>', methods=['DELETE'])
def deletar_tipo(id):
    resultado = Tipo.deletar_tipo(id)
    return jsonify({"message": resultado})


# Lista todos os tipos cadastrados
@app.route('/listar_tipos', methods=['GET'])
def listar_tipos():
    tipos = Tipo.listar_tipos()
    return jsonify(tipos)


# =====================================================
# ROTAS DE POKEMON
# =====================================================

# Cria um novo Pokémon
@app.route('/criar_pokemon', methods=['POST'])
def criar_pokemon():
    dados = request.json or {}

    # Chama a função da classe para criar no banco
    resultado = Pokemon.criar_pokemon(
        shiny=dados.get("shiny", False),
        apelido=dados.get("apelido"),
        numero_pokedex=dados.get("numero_pokedex"),
        sombroso=dados.get("sombroso", False),
        id_treinador=dados.get("id_treinador"),
        loca=dados.get("loca"),
        habilidade=dados.get("habilidade")
    )
    return jsonify({"message": resultado})


# Atualiza pokemon existente
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


# Troca localização (time ⇄ box)
@app.route('/trocar_loca/<int:id>', methods=['PUT'])
def trocar_loca(id):
    resultado = Pokemon.trocar_loca(id)
    return jsonify({"message": resultado})


# Deleta pokemon
@app.route('/deletar_pokemon/<int:id>', methods=['DELETE'])
def deletar_pokemon(id):
    resultado = Pokemon.deletar_pokemon(id)
    return jsonify({"message": resultado})


# Lista todos os pokemons do banco
@app.route('/listar_pokemons', methods=['GET'])
def listar_pokemons():
    pokemons = Pokemon.listar_pokemons()
    return jsonify(pokemons)


# Lista pokemons de um treinador específico
@app.route('/listar_pokemons_por_treinador/<int:treinador_id>', methods=['GET'])
def listar_pokemons_por_treinador(treinador_id):
    pokemons = Pokemon.listar_pokemons_por_treinador(treinador_id)
    return jsonify(pokemons)


# Busca pokemon por ID
@app.route('/pokemon/<int:id>', methods=['GET'])
def obter_pokemon(id):
    pokemon = Pokemon.obter_por_id(id)
    if pokemon:
        return jsonify(pokemon)
    else:
        return jsonify({"message": "Pokemon não encontrado."}), 404


# =====================================================
# ROTAS DE TREINADOR_POKEMON
# =====================================================

# Cria associação Treinador ↔ Pokémon (com time/box)
@app.route('/criar_treinador_pokemon', methods=['POST'])
def criar_treinador_pokemon():
    dados = request.json or {}
    resultado = TreinadorPokemon.criar_treinador_pokemon(
        treinador_id=dados.get("treinador_id"),
        pokemon_id=dados.get("pokemon_id"),
        loca=dados.get("loca")
    )
    return jsonify({"message": resultado})


# Remove associação
@app.route('/remover_treinador_pokemon/<int:treinador_id>/<int:pokemon_id>', methods=['DELETE'])
def remover_treinador_pokemon(treinador_id, pokemon_id):
    resultado = TreinadorPokemon.deletar_treinador_pokemon(treinador_id, pokemon_id)
    return jsonify({"message": resultado})


# Lista todas as associações da tabela treinadores ↔ pokemons
@app.route('/listar_treinador_pokemon', methods=['GET'])
def listar_treinador_pokemon():
    associacoes = TreinadorPokemon.listar_treinador_pokemon()
    return jsonify(associacoes)


# Lista apenas os pokemons de um treinador, usando a tabela de vínculos
@app.route('/listar_pokemons_do_treinador/<int:treinador_id>', methods=['GET'])
def listar_pokemons_do_treinador(treinador_id):
    pokemons = TreinadorPokemon.listar_pokemons_do_treinador(treinador_id)
    return jsonify(pokemons)


# =====================================================
# EXECUÇÃO DO APP
# =====================================================
if __name__ == "__main__":
    # Host 0.0.0.0 = permite acesso pela rede local
    # Porta 5000 = padrão para APIs Flask
    # debug=True = reinicia automaticamente ao salvar
    app.run(host="0.0.0.0", port=5000, debug=True)
