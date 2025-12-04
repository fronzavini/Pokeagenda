# classes.py
# Contém a camada de acesso ao banco (classes Treinador, Tipo, Pokemon, TreinadorPokemon)
# Importante: ajuste as credenciais em conectar() conforme sua máquina.

import pymysql
from pymysql.cursors import DictCursor
from pymysql.err import MySQLError

def conectar():
    """
    Cria e retorna uma conexão com o banco de dados MySQL.
    Ajuste host, user e password conforme sua configuração local.
    """
    return pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="POKEAGENDA",
        cursorclass=DictCursor  # retornar resultados como dicionários facilita jsonify
    )


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

    @staticmethod
    def criar_treinador(nome, email, cpf, foto, cidade):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """INSERT INTO Treinador (nome, email, cpf, foto, cidade)
                             VALUES (%s, %s, %s, %s, %s)"""
                    cursor.execute(sql, (nome, email, cpf, foto, cidade))
                conexao.commit()
            return "Treinador criado com sucesso."
        except MySQLError as e:
            return f"Erro ao criar treinador: {e}"

    @staticmethod
    def listar_treinadores():
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Treinador")
                    return cursor.fetchall()
        except MySQLError as e:
            # retornar lista vazia em caso de erro para não quebrar o endpoint
            return []

    @staticmethod
    def atualizar_treinador(id, nome=None, email=None, cpf=None, foto=None, cidade=None):
        try:
            # Atualização dinâmica: só atualiza campos que não sejam None
            campos = []
            valores = []
            if nome is not None:
                campos.append("nome=%s"); valores.append(nome)
            if email is not None:
                campos.append("email=%s"); valores.append(email)
            if cpf is not None:
                campos.append("cpf=%s"); valores.append(cpf)
            if foto is not None:
                campos.append("foto=%s"); valores.append(foto)
            if cidade is not None:
                campos.append("cidade=%s"); valores.append(cidade)

            if not campos:
                return "Nenhum campo para atualizar."

            sql = "UPDATE Treinador SET " + ", ".join(campos) + " WHERE id=%s"
            valores.append(id)

            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute(sql, tuple(valores))
                conexao.commit()
            return "Treinador atualizado com sucesso."
        except MySQLError as e:
            return f"Erro ao atualizar treinador: {e}"

    @staticmethod
    def deletar_treinador(id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("DELETE FROM Treinador WHERE id=%s", (id,))
                conexao.commit()
            return "Treinador deletado com sucesso."
        except MySQLError as e:
            return f"Erro ao deletar treinador: {e}"

    @staticmethod
    def obter_por_id(id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Treinador WHERE id=%s", (id,))
                    return cursor.fetchone()
        except MySQLError:
            return None


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

    @staticmethod
    def criar_tipo(nome):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("INSERT INTO Tipo (nome) VALUES (%s)", (nome,))
                conexao.commit()
            return "Tipo criado com sucesso."
        except MySQLError as e:
            return f"Erro ao criar tipo: {e}"

    @staticmethod
    def listar_tipos():
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Tipo")
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def atualizar_tipo(id, nome):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("UPDATE Tipo SET nome=%s WHERE id=%s", (nome, id))
                conexao.commit()
            return "Tipo atualizado com sucesso."
        except MySQLError as e:
            return f"Erro ao atualizar tipo: {e}"

    @staticmethod
    def deletar_tipo(id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("DELETE FROM Tipo WHERE id=%s", (id,))
                conexao.commit()
            return "Tipo deletado com sucesso."
        except MySQLError as e:
            return f"Erro ao deletar tipo: {e}"


# =====================================================
# CLASSE POKEMON
# =====================================================
class Pokemon:
    """
    Representa um Pokémon, com todas as informações da tabela correspondente.
    NOTE: a tabela Pokemon definida no seu SQL atual possui apenas alguns campos.
    Ajuste conforme sua modelagem (aqui consideramos os campos usados no seu código).
    """
    def __init__(self, id=None, shiny=None, apelido=None, numero_pokedex=None,
                 sombroso=None, id_treinador=None, loca=None, habilidade=None):
        self.id = id
        self.shiny = shiny
        self.apelido = apelido
        self.numero_pokedex = numero_pokedex
        self.sombroso = sombroso
        self.id_treinador = id_treinador
        self.loca = loca
        self.habilidade = habilidade

    @staticmethod
    def criar_pokemon(shiny, apelido, numero_pokedex, sombroso, id_treinador, loca, habilidade):
        """
        Cria um pokemon na tabela com os campos disponíveis.
        OBS: convertemos booleanos para int (0/1) ao inserir.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """INSERT INTO Pokemon (shiny, apelido, numero_pokedex, sombroso, id_treinador, loca, habilidade)
                             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
                    cursor.execute(
                        sql,
                        (
                            int(bool(shiny)),
                            apelido,
                            numero_pokedex,
                            int(bool(sombroso)),
                            id_treinador,
                            loca,
                            habilidade
                        )
                    )
                conexao.commit()
            return "Pokemon criado com sucesso."
        except MySQLError as e:
            return f"Erro ao criar pokemon: {e}"

    @staticmethod
    def listar_pokemons():
        """
        Lista pokemons juntando o nome do treinador (se existir).
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """SELECT p.* , tr.nome AS treinador_nome
                             FROM Pokemon p
                             LEFT JOIN Treinador tr ON p.id_treinador = tr.id"""
                    cursor.execute(sql)
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def listar_pokemons_por_treinador(treinador_id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """SELECT * FROM Pokemon WHERE id_treinador = %s"""
                    cursor.execute(sql, (treinador_id,))
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def atualizar_pokemon(id, shiny=None, apelido=None, numero_pokedex=None, sombroso=None, id_treinador=None, loca=None, habilidade=None):
        try:
            campos = []
            valores = []
            if shiny is not None:
                campos.append("shiny=%s"); valores.append(int(bool(shiny)))
            if apelido is not None:
                campos.append("apelido=%s"); valores.append(apelido)
            if numero_pokedex is not None:
                campos.append("numero_pokedex=%s"); valores.append(numero_pokedex)
            if sombroso is not None:
                campos.append("sombroso=%s"); valores.append(int(bool(sombroso)))
            if id_treinador is not None:
                campos.append("id_treinador=%s"); valores.append(id_treinador)
            if loca is not None:
                campos.append("loca=%s"); valores.append(loca)
            if habilidade is not None:
                campos.append("habilidade=%s"); valores.append(habilidade)

            if not campos:
                return "Nenhum campo para atualizar."

            sql = "UPDATE Pokemon SET " + ", ".join(campos) + " WHERE id=%s"
            valores.append(id)

            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute(sql, tuple(valores))
                conexao.commit()
            return "Pokemon atualizado com sucesso."
        except MySQLError as e:
            return f"Erro ao atualizar pokemon: {e}"

    @staticmethod
    def deletar_pokemon(id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("DELETE FROM Pokemon WHERE id=%s", (id,))
                conexao.commit()
            return "Pokemon deletado com sucesso."
        except MySQLError as e:
            return f"Erro ao deletar pokemon: {e}"

    @staticmethod
    def obter_por_id(id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Pokemon WHERE id=%s", (id,))
                    return cursor.fetchone()
        except MySQLError:
            return None


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

    @staticmethod
    def criar_treinador_pokemon(treinador_id, pokemon_id, loca):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """INSERT INTO Treinador_Pokemon (treinador_id, pokemon_id, loca)
                             VALUES (%s, %s, %s)"""
                    cursor.execute(sql, (treinador_id, pokemon_id, loca))
                conexao.commit()
            return "Associação criada!"
        except MySQLError as e:
            return f"Erro ao criar associação: {e}"

    @staticmethod
    def listar_treinador_pokemon():
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """SELECT tp.*, t.nome AS treinador, p.numero_pokedex 
                             FROM Treinador_Pokemon tp
                             JOIN Treinador t ON tp.treinador_id = t.id
                             JOIN Pokemon p ON tp.pokemon_id = p.id"""
                    cursor.execute(sql)
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def listar_pokemons_do_treinador(treinador_id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """SELECT tp.*, p.* 
                             FROM Treinador_Pokemon tp
                             JOIN Pokemon p ON tp.pokemon_id = p.id
                             WHERE tp.treinador_id=%s"""
                    cursor.execute(sql, (treinador_id,))
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def deletar_treinador_pokemon(treinador_id, pokemon_id):
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute(
                        "DELETE FROM Treinador_Pokemon WHERE treinador_id=%s AND pokemon_id=%s",
                        (treinador_id, pokemon_id)
                    )
                conexao.commit()
            return "Associação removida!"
        except MySQLError as e:
            return f"Erro ao remover associação: {e}"
