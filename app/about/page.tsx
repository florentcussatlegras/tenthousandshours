export default function AboutPage() {
  return (
    <section id="about" className="w-full text-left">
      <header className="mb-6">
        <p className="text-2xl text-default-500 mt-2">
          Votre chemin vers la maîtrise, minute après minute.
        </p>
      </header>

      <div className="prose dark:prose-invert">
        <p>
          Nous avons tous des rêves, des passions et des compétences que nous
          souhaitons développer. Mais entre le quotidien, les distractions et le
          manque de repères, il est souvent difficile de savoir si nous
          progressons réellement.
        </p>

        <p>
          Ce site a été créé pour répondre à une idée simple&nbsp;:{" "}
          <strong>
            progresser devient évident quand on peut voir son chemin
          </strong>
          <br />
          <br />
           Inspiré par le principe des <em>10 000 heures</em> — l’idée selon
          laquelle atteindre l’expertise demande un long investissement — notre
          plateforme vous permet de suivre précisément votre temps de pratique,
          de visualiser votre progression et d’avancer, session après session,
          vers la maîtrise.
        </p>

        <br />

        <p>Sur cette plateforme vous pouvez :</p>
        <br />
        <ul className="list-disc ml-12">
          <li>Enregistrer facilement vos sessions de travail</li>
          <li>Suivre votre évolution en temps réel</li>
          <li>Organiser et archiver vos matières d’apprentissage</li>
          <li>
            Visualiser votre progression jusqu’au cap symbolique des 10 000
            heures
          </li>
        </ul>

        <br />
        <p>
          Plus qu’un simple tracker, c’est un compagnon de route — un espace
          conçu pour celles et ceux qui veulent apprendre, persévérer et
          s’améliorer. Chaque minute compte. Chaque session vous rapproche de
          votre objectif.
        </p>

        <p className="mt-6 font-semibold">
          Votre progression commence ici. Bienvenue dans votre chemin vers la
          maîtrise.
        </p>
      </div>
    </section>
  );
}
