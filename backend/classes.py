# classes.py
# -----------------------------------------------------------
# Este arquivo contém todas as classes responsáveis pelo
# acesso ao banco de dados MySQL da aplicação Pokeagenda.
#
# As classes representam tabelas (Treinador, Tipo, Pokemon)
# e a tabela relacional Treinador_Pokemon.
#
# Cada classe implementa métodos CRUD completos.
# -----------------------------------------------------------

import pymysql
from pymysql.cursors import DictCursor
from pymysql.err import MySQLError


# -----------------------------------------------------------
# Função de conexão com o banco
# -----------------------------------------------------------
def conectar():
    """
    Cria e retorna uma conexão com o banco de dados MySQL.
    Ajuste host, user e password conforme sua configuração local.
    O uso do DictCursor faz com que os resultados venham como
    dicionários em vez de tuplas.
    """
    return pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="POKEAGENDA",
        cursorclass=DictCursor
    )


# ===========================================================
# CLASSE TREINADOR
# ===========================================================
class Treinador:
    """
    Representa um treinador Pokémon, conforme tabela Treinador
    no banco de dados.
    """
    def __init__(self, id=None, nome=None, email=None, cpf=None, foto=None, cidade=None):
        # Dados do treinador
        self.id = id
        self.nome = nome
        self.email = email
        self.cpf = cpf
        self.foto = foto
        self.cidade = cidade

    @staticmethod
    def criar_treinador(nome, email, cpf, foto, cidade):
        """
        Insere um novo treinador no banco de dados.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """
                    INSERT INTO Treinador (nome, email, cpf, foto, cidade)
                    VALUES (%s, %s, %s, %s, %s)
                    """
                    cursor.execute(sql, (nome, email, cpf, foto, cidade))
                conexao.commit()
            return "Treinador criado com sucesso."
        except MySQLError as e:
            return f"Erro ao criar treinador: {e}"

    @staticmethod
    def listar_treinadores():
        """
        Retorna todos os treinadores cadastrados.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Treinador")
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def atualizar_treinador(id, nome=None, email=None, cpf=None, foto=None, cidade=None):
        """
        Atualiza apenas os campos fornecidos (dinâmico).
        """
        try:
            campos = []
            valores = []

            # Só adiciona o campo se foi enviado no request
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
        """
        Deleta um treinador com base no ID.
        """
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
        """
        Obtém um treinador específico.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Treinador WHERE id=%s", (id,))
                    return cursor.fetchone()
        except MySQLError:
            return None


# ===========================================================
# CLASSE TIPO
# ===========================================================
class Tipo:
    """
    Representa um tipo de Pokémon (ex: Fogo, Água, Planta...)
    """
    def __init__(self, id=None, nome=None):
        self.id = id
        self.nome = nome

    @staticmethod
    def criar_tipo(nome):
        """
        Cria um novo tipo.
        """
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
        """
        Lista todos os tipos cadastrados.
        """
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
        """
        Atualiza o nome de um tipo.
        """
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
        """
        Deleta um tipo.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("DELETE FROM Tipo WHERE id=%s", (id,))
                conexao.commit()
            return "Tipo deletado com sucesso."
        except MySQLError as e:
            return f"Erro ao deletar tipo: {e}"


# ===========================================================
# CLASSE POKEMON
# ===========================================================
class Pokemon:
    """
    Representa um Pokémon na tabela adequada.
    Os campos seguem a estrutura enviada por você.
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
        Insere um novo Pokémon.
        Booleanos shiny e sombroso são convertidos para 0/1.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """
                    INSERT INTO Pokemon (shiny, apelido, numero_pokedex, sombroso, id_treinador, loca, habilidade)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(sql, (
                        int(bool(shiny)),
                        apelido,
                        numero_pokedex,
                        int(bool(sombroso)),
                        id_treinador,
                        loca,
                        habilidade
                    ))
                conexao.commit()
            return "Pokemon criado com sucesso."
        except MySQLError as e:
            return f"Erro ao criar pokemon: {e}"

    @staticmethod
    def listar_pokemons():
        """
        Lista pokemons mostrando o nome do treinador.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """
                    SELECT p.*, tr.nome AS treinador_nome
                    FROM Pokemon p
                    LEFT JOIN Treinador tr ON p.id_treinador = tr.id
                    """
                    cursor.execute(sql)
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def listar_pokemons_por_treinador(treinador_id):
        """
        Lista pokemons pertencentes a um treinador específico.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute(
                        "SELECT * FROM Pokemon WHERE id_treinador=%s",
                        (treinador_id,)
                    )
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def atualizar_pokemon(id, shiny=None, apelido=None, numero_pokedex=None,
                          sombroso=None, id_treinador=None, loca=None, habilidade=None):
        """
        Atualização dinâmica de Pokémon.
        Apenas campos enviados são alterados.
        """
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

    def trocar_loca(id):
        """
        Alterna entre 'box' e 'time'.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:

                    cursor.execute("SELECT loca FROM Pokemon WHERE id=%s", (id,))
                    resultado = cursor.fetchone()
                    if not resultado:
                        return "Pokemon não encontrado."

                    loca_atual = resultado["loca"]

                    # Alternância automática
                    nova_loca = "box" if loca_atual == "time" else "time"

                    cursor.execute(
                        "UPDATE Pokemon SET loca=%s WHERE id=%s",
                        (nova_loca, id)
                    )

                conexao.commit()
            return f"Loca do Pokemon trocada para {nova_loca}."
        except MySQLError as e:
            return f"Erro ao trocar loca do pokemon: {e}"

    @staticmethod
    def deletar_pokemon(id):
        """
        Remove um Pokémon do banco.
        """
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
        """
        Obtém um Pokémon específico.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    cursor.execute("SELECT * FROM Pokemon WHERE id=%s", (id,))
                    return cursor.fetchone()
        except MySQLError:
            return None


# ===========================================================
# CLASSE TREINADOR_POKEMON
# ===========================================================
class TreinadorPokemon:
    """
    Representa relação entre treinador e Pokémon.
    A coluna 'loca' indica se está no time ou na box.
    """
    def __init__(self, id=None, treinador_id=None, pokemon_id=None, loca=None):
        self.id = id
        self.treinador_id = treinador_id
        self.pokemon_id = pokemon_id
        self.loca = loca

    @staticmethod
    def criar_treinador_pokemon(treinador_id, pokemon_id, loca):
        """
        Associa um Pokémon a um treinador.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """
                    INSERT INTO Treinador_Pokemon (treinador_id, pokemon_id, loca)
                    VALUES (%s, %s, %s)
                    """
                    cursor.execute(sql, (treinador_id, pokemon_id, loca))
                conexao.commit()
            return "Associação criada!"
        except MySQLError as e:
            return f"Erro ao criar associação: {e}"

    @staticmethod
    def listar_treinador_pokemon():
        """
        Lista todas as associações com nome do treinador e numero pokedex.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """
                    SELECT tp.*, t.nome AS treinador, p.numero_pokedex
                    FROM Treinador_Pokemon tp
                    JOIN Treinador t ON tp.treinador_id = t.id
                    JOIN Pokemon p ON tp.pokemon_id = p.id
                    """
                    cursor.execute(sql)
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def listar_pokemons_do_treinador(treinador_id):
        """
        Lista Pokémons associados a um treinador específico.
        """
        try:
            conexao = conectar()
            with conexao:
                with conexao.cursor() as cursor:
                    sql = """
                    SELECT tp.*, p.*
                    FROM Treinador_Pokemon tp
                    JOIN Pokemon p ON tp.pokemon_id = p.id
                    WHERE tp.treinador_id=%s
                    """
                    cursor.execute(sql, (treinador_id,))
                    return cursor.fetchall()
        except MySQLError:
            return []

    @staticmethod
    def deletar_treinador_pokemon(treinador_id, pokemon_id):
        """
        Remove a relação treinador x Pokémon.
        """
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
        

        
