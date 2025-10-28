import React from 'react';
import bg from "../assets/bg.jpg";

const Home = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center bg-cover bg-center text-white w-full min-h-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenu au-dessus de l’overlay */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bienvenue sur JobConnect
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Trouvez l'emploi de vos rêves ou publiez vos offres en un clic !
        </p>
    <div className="flex md:flex-col items-center justify-center gap-6 md:gap-10">
      <button className="bg-cyan-600/80 px-6 py-3 rounded-lg hover:bg-cyan-700 transition" style={{ margin: '0 13px 13px 0' }}>
        Je cherche un emploi
      </button>
      <button className="bg-cyan-600/80 px-6 py-3 rounded-lg hover:bg-cyan-700 transition" style={{ margin: '0 13px 13px 0' }}>
        Je publie une offre
      </button>
    </div>

      </div>
    </section>
  );
};

export default Home;
