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
      <div className={styles.card}>
        <h2>Treinador</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            CPF:
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Cidade:
            <input
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Foto (URL):
            <input
              type="text"
              name="foto"
              value={form.foto}
              onChange={handleChange}
            />
          </label>

          {form.foto && (
            <img
              src={form.foto}
              alt="Treinador"
              className={styles.preview}
            />
          )}

          <div className={styles.buttons}>
            <button type="button" className={styles.cancel} onClick={fechar}>
              Cancelar
            </button>
            <button type="submit" className={styles.save}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
