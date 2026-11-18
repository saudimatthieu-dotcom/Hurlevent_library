import styles from "@/styles/PracticalInfo.module.css";
import { openingHours } from "@/data/openingHours";
import { useTranslation } from "@/utils/i18n";

export default function PracticalInfo() {
  const { t } = useTranslation();

  return (
    <section className={styles.info}>
      <h2 className={styles.title}>{t.info.title}</h2>

      <div className={styles.columns}>
        <div>
          <h3>{t.info.hours}</h3>
          <table className={styles.hours}>
            <tbody>
              {openingHours.map((item, index) => (
                <tr key={t.days[index]}>
                  <th scope="row">{t.days[index]}</th>
                  <td>
                    {item.open && item.close
                      ? `${t.time(item.open)} – ${t.time(item.close)}`
                      : t.info.closed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>{t.info.address}</h3>
          <p>{t.address}</p>
          <p>{t.metro}</p>
          <h3>{t.info.contact}</h3>
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
