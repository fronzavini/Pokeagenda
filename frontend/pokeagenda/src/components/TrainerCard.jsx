import { useState, useEffect } from "react";
import styles from "../styles/trainerCard.module.css";

export default function TrainerCard({
  treinador,
  fechar,
  salvar,
  trainerMode,
}) {
  const initialForm = {
    id: treinador?.id || "",
    nome: treinador?.nome || "",
    email: treinador?.email || "",
    cpf: treinador?.cpf || "",
    foto: treinador?.foto || "",
    cidade: treinador?.cidade || "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (trainerMode === "create") {
      setForm({
        id: "",
        nome: "",
        email: "",
        cpf: "",
        foto: "",
        cidade: "",
      });
    } else if (trainerMode === "edit" && treinador) {
      setForm(initialForm);
    }
  }, [trainerMode, treinador]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.cpf || !form.foto || !form.cidade) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const resposta = await salvar(form);

    if (resposta?.erro) {
      alert("Erro ao salvar: " + resposta.erro);
      return;
    }

    alert("Treinador atualizado com sucesso!");
    fechar();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/640px-International_Pok%C3%A9mon_logo.svg.png"
            alt="Pokémon Logo"
            className={styles.pokemonLogo}
          />
          <div className={styles.buttons}>
            <button type="button" className={styles.cancel} onClick={fechar}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.save}
              onClick={handleSubmit}
            >
              {trainerMode === "edit" ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div className={styles.trainerDesignColumn}>
            <h3 className={styles.sectionTitle}>Trainer Design</h3>
            <div className={styles.designContent}>
              <label className={styles.photoLabel}>
                Foto (URL):
                <input
                  type="text"
                  name="foto"
                  value={form.foto}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                />
              </label>
              {form.foto && (
                <img
                  src={form.foto}
                  alt="Treinador"
                  className={styles.preview}
                />
              )}
            </div>
          </div>

          <div className={styles.infoColumn}>
            <h3 className={styles.sectionTitle}>Info</h3>
            <div className={styles.infoContent}>
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

              <label className={styles.infoRow}>
                <span className={styles.label}>Cidade:</span>
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
