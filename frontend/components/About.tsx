import styles from "@/styles/About.module.css";

export default function About() {
  return (
    <section className={styles.about}>
      <h2 className={styles.title}>La librairie</h2>
      <div className={styles.text}>
        <p>
          Hurlevent est une librairie indépendante et généraliste installée en
          haut de la rue de Belleville, face au métro Télégraphe.
        </p>
        <p>
          Romans, essais, bandes dessinées, jeunesse : nos libraires choisissent
          chaque livre et vous conseillent avec plaisir. Tout au long de
          l’année, nous accueillons des rencontres et des dédicaces avec les
          auteurs.
        </p>
        <p>
          Un livre n’est pas en rayon ? Nous le commandons pour vous, à retirer
          en librairie.
        </p>
      </div>
    </section>
  );
}
