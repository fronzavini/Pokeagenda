import pymysql

def conectar():
    """
    Cria e retorna uma conexão com o banco de dados MySQL.
    Ajuste host, user e password conforme sua configuração local.
    """
    return pymysql.connect(
        host="localhost",           # endereço do servidor MySQL
        user="root",                # usuário do banco
        password="root",            # senha do banco
        database="POKEAGENDA",      # nome do banco de dados
        #cursorclass=pymysql.cursors.DictCursor  # retorna resultados como dicionários
    )

from db_config import conectar


# =====================================================
# CLASSE TREINADOR
# =====================================================
class Treinador:
    """
    Representa um treinador Pokémon com seus dados pessoais.
    """
    def __init__(self, id=None, nome=None, email=None, cpf=None, foto=None, cidade=None):
        self.id = id
        self.nome = nome
        self.email = email
        self.cpf = cpf
        self.foto = foto
        self.cidade = cidade


    # ---------- CREATE ----------
    def criar_treinador(nome, email, cpf, foto, cidade):
        """Insere um novo treinador no banco de dados."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """INSERT INTO Treinador (nome, email, cpf, foto, cidade)
                        VALUES (%s, %s, %s, %s, %s)"""
                cursor.execute(sql, (nome, email, cpf, foto, cidade))  # executa o comando SQL
            conexao.commit()  # confirma a transação no banco


    # ---------- READ ----------
    def listar_treinador():
        """Retorna todos os treinadores cadastrados."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("SELECT * FROM Treinador")
                return cursor.fetchall()  # retorna uma lista de dicionários


    # ---------- UPDATE ----------
    def atualizar_treinador(id, nome, email, cpf, foto, cidade):
        """Atualiza os dados de um treinador existente."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """UPDATE Treinador
                        SET nome=%s, email=%s, cpf=%s, foto=%s, cidade=%s
                        WHERE id=%s"""
                cursor.execute(sql, (nome, email, cpf, foto, cidade, id))
            conexao.commit()


    # ---------- DELETE ----------
    def deletar_treinador(id):
        """Remove um treinador pelo ID."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("DELETE FROM Treinador WHERE id=%s", (id,))
            conexao.commit()


# =====================================================
# CLASSE TIPO
# =====================================================
class Tipo:
    """
    Representa um tipo de Pokémon (ex: Fogo, Água, Planta...).
    """
    def __init__(self, id=None, nome=None):
        self.id = id
        self.nome = nome


    def criar_tipo(nome):
        """Cadastra um novo tipo de Pokémon."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("INSERT INTO Tipo (nome) VALUES (%s)", (nome,))
            conexao.commit()


    def listar_tipo():
        """Lista todos os tipos cadastrados."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("SELECT * FROM Tipo")
                return cursor.fetchall()


    def atualizar_tipo(id, nome):
        """Atualiza o nome de um tipo existente."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("UPDATE Tipo SET nome=%s WHERE id=%s", (nome, id))
            conexao.commit()


    def deletar_tipo(id):
        """Exclui um tipo pelo ID."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("DELETE FROM Tipo WHERE id=%s", (id,))
            conexao.commit()


# =====================================================
# CLASSE POKEMON
# =====================================================
class Pokemon:
    """
    Representa um Pokémon, com todas as informações da tabela correspondente.
    """
    def __init__(self, id=None, nome=None, shiny=None, apelido=None,
                 numero_pokedex=None, tipo=None, imagem_url=None,
                 altura=None, peso=None, habilidade=None):
        self.id = id
        self.nome = nome
        self.shiny = shiny
        self.apelido = apelido
        self.numero_pokedex = numero_pokedex
        self.tipo = tipo  # chave estrangeira para Tipo
        self.imagem_url = imagem_url
        self.altura = altura
        self.peso = peso
        self.habilidade = habilidade


    def criar_pokemon(nome, shiny, apelido, numero_pokedex, tipo, imagem_url, altura, peso, habilidade):
        """Insere um novo Pokémon no banco."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """INSERT INTO Pokemon (nome, shiny, apelido, numero_pokedex, tipo,
                                            imagem_url, altura, peso, habilidade)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
                cursor.execute(sql, (nome, shiny, apelido, numero_pokedex, tipo,
                                    imagem_url, altura, peso, habilidade))
            conexao.commit()


    def listar_pokemon():
        """Lista todos os Pokémon com o nome do tipo."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """SELECT p.*, t.nome AS tipo_nome
                        FROM Pokemon p
                        JOIN Tipo t ON p.tipo = t.id"""
                cursor.execute(sql)
                return cursor.fetchall()


    def atualizar_pokemon(id, nome, shiny, apelido, numero_pokedex, tipo, imagem_url, altura, peso, habilidade):
        """Atualiza os dados de um Pokémon existente."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """UPDATE Pokemon
                        SET nome=%s, shiny=%s, apelido=%s, numero_pokedex=%s, tipo=%s,
                            imagem_url=%s, altura=%s, peso=%s, habilidade=%s
                        WHERE id=%s"""
                cursor.execute(sql, (nome, shiny, apelido, numero_pokedex, tipo,
                                    imagem_url, altura, peso, habilidade, id))
            conexao.commit()


    def deletar_pokemon(id):
        """Remove um Pokémon pelo ID."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("DELETE FROM Pokemon WHERE id=%s", (id,))
            conexao.commit()


# =====================================================
# CLASSE TREINADOR_POKEMON
# =====================================================
class TreinadorPokemon:
    """
    Relaciona um Treinador com um Pokémon.
    A coluna 'loca' indica se o Pokémon está no 'time' ou na 'box'.
    """
    def __init__(self, id=None, treinador_id=None, pokemon_id=None, loca=None):
        self.id = id
        self.treinador_id = treinador_id
        self.pokemon_id = pokemon_id
        self.loca = loca


    def criar_treinador_pokemon(treinador_id, pokemon_id, loca):
        """Cria o vínculo entre um treinador e um Pokémon."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """INSERT INTO Treinador_Pokemon (treinador_id, pokemon_id, loca)
                        VALUES (%s, %s, %s)"""
                cursor.execute(sql, (treinador_id, pokemon_id, loca))
            conexao.commit()


    def listar_treinador_pokemon():
        """Lista todos os vínculos entre treinadores e Pokémon, mostrando nomes."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """SELECT tp.*, tr.nome AS treinador_nome, p.nome AS pokemon_nome, tp.loca
                        FROM Treinador_Pokemon tp
                        JOIN Treinador tr ON tp.treinador_id = tr.id
                        JOIN Pokemon p ON tp.pokemon_id = p.id"""
                cursor.execute(sql)
                return cursor.fetchall()


    def listar_treinador_pokemon_por_treinador(treinador_id):
        """Lista apenas os Pokémon de um treinador específico."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """SELECT tp.*, p.nome AS pokemon_nome, p.apelido, p.shiny, tp.loca
                        FROM Treinador_Pokemon tp
                        JOIN Pokemon p ON tp.pokemon_id = p.id
                        WHERE tp.treinador_id = %s"""
                cursor.execute(sql, (treinador_id,))
                return cursor.fetchall()


    def atualizar_treinador_pokemon(id, treinador_id, pokemon_id, loca):
        """Atualiza a relação entre um treinador e um Pokémon."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                sql = """UPDATE Treinador_Pokemon
                        SET treinador_id=%s, pokemon_id=%s, loca=%s
                        WHERE id=%s"""
                cursor.execute(sql, (treinador_id, pokemon_id, loca, id))
            conexao.commit()


    def deletar_treinador_pokemon(treinador_id, pokemon_id):
        """Exclui o vínculo entre treinador e Pokémon."""
        conexao = conectar()
        with conexao:
            with conexao.cursor() as cursor:
                cursor.execute("DELETE FROM Treinador_Pokemon WHERE treinador_id=%s and pokemon_id", (treinador_id,pokemon_id,))
            conexao.commit()
