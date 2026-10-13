import styles from "@/styles/PracticalInfo.module.css";
import { openingHours } from "@/data/openingHours";

export default function PracticalInfo() {
  return (
    <section className={styles.info}>
      <h2 className={styles.title}>Infos pratiques</h2>

      <div className={styles.columns}>
        <div>
          <h3>Horaires</h3>
          <table className={styles.hours}>
            <tbody>
              {openingHours.map((item) => (
                <tr key={item.day}>
                  <th scope="row">{item.day}</th>
                  <td>
                    {item.open && item.close
                      ? `${item.open.replace(":", "h")} – ${item.close.replace(":", "h")}`
                      : "Fermé"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Adresse</h3>
          <p>238 rue de Belleville, 75020 Paris</p>
          <p>Métro Télégraphe (ligne 11)</p>
          <h3>Contact</h3>
          <a
            href="https://www.instagram.com/librairie_hurlevent/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            @librairie_hurlevent
          </a>
        </div>
      </div>
    </section>
  );
}
