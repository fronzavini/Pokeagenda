import { useState } from "react";
import styles from "../styles/trainerCard.module.css";

export default function TrainerCard({ treinador, fechar, salvar }) {
  const [form, setForm] = useState({
    id: treinador.id,
    nome: treinador.nome,
    email: treinador.email,
    cpf: treinador.cpf,
    foto: treinador.foto,
    cidade: treinador.cidade,
    // Adicionando campos para replicar o meme, usando valores padrão se não existirem
    idade: treinador.idade || "???",
    region: treinador.region || "Kanto",
    firstPokemon: treinador.firstPokemon || "Charizard",
    trainerClass: treinador.trainerClass || "Kanto Champion",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    salvar(form);
    fechar();
  };

  return (
    <div className={styles.overlay}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/640px-International_Pok%C3%A9mon_logo.svg.png"
        alt="Pokémon Logo"
        className={styles.pokemonLogo}
      />
      <div className={styles.card}>
        {/* CABEÇALHO */}

        <div className={styles.header}>
          {/* Use a tag <img> para o logo Pokémon */}

          {/* BOTÕES */}
          <div className={styles.buttons}>
            <button type="button" className={styles.cancel} onClick={fechar}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.save}
              onClick={handleSubmit}
            >
              Salvar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          {/* COLUNA DA ESQUERDA: Trainer Design (Imagem) */}
          <div className={styles.trainerDesignColumn}>
            <h3 className={styles.sectionTitle}>Trainer Design</h3>
            <div className={styles.designContent}>
              {/* Campo URL da Foto */}
              <label className={styles.photoLabel}>
                Foto (URL):
                <input
                  type="text"
                  name="foto"
                  value={form.foto}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>

              {/* Preview da Foto */}
              {form.foto && (
                <img
                  src={form.foto}
                  alt="Treinador"
                  className={styles.preview}
                />
              )}
            </div>
          </div>

          {/* COLUNA DA DIREITA: Info (Detalhes) */}
          <div className={styles.infoColumn}>
            <h3 className={styles.sectionTitle}>Info</h3>
            <div className={styles.infoContent}>
              {/* Campo Nome */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Nome:</span>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </label>

              {/* Campo Idade */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Idade:</span>
                <input
                  type="text"
                  name="idade"
                  value={form.idade}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>

              {/* Campo Email */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </label>

              {/* Campo CPF */}
              <label className={styles.infoRow}>
                <span className={styles.label}>CPF:</span>
                <input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </label>

              {/* Campo Cidade (Hometown) */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Cidade (Hometown):</span>
                <input
                  type="text"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
