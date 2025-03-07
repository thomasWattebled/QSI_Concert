<h1> Concert : </h1>

<h2> Set up the project </h2>

<h3>Install the node js project</h3>

In the source directory (with app.js) :

      npm install

<h3>Create the database</h3>

In the source directory (with the Dockerfile) :

      docker build -t concert-postgre-db .

      docker run -p 5432:5432 -e POSTGRES_PASSWORD=admin -d concert-postgre-db

<h3>Apply drizzle changes to the database</h3>

In the source directory (with drizzle.config.ts) :

      npx drizzle-kit push

<h2> Run the project </h2>

      (if the container is not already running) docker run -p 5432:5432 -e POSTGRES_PASSWORD=admin -d concert-postgre-db

      npm run dev

Then do your request on http://localhost:3031

<h2>Routes</h2>

<h3> /concert/add POST : </h3>

    concertId : UUID,
    totalSeats : int,
    availableSeats : int,
    place : varchar


<h3> /concert/idConcert GET </h3> (Billet US2 + Concert US4) 

      concertId : UUID,
      title : varchar,
      place : varchar,
      date : datetime
      totalSeats : int,
      availableSeats : int,
      canceled : bool (Concert RG1)


<h3> /concert/idConcert DELETE </h3> (Concert US2)

<h3> /concerts GET </h3> (Concert US3)


<h2>Technical informations</h2>

API based on Express JS (made with Express Generator)
Uses Drizzle ORM

<h2> User Stories </h2>

- Story 1 : En tant qu’Administrateur, je peux créer un nouveau concert, afin de créer une entrée 
dans le système 
- Story 2 : En tant qu’Administrateur, je peux supprimer concert existant, afin de supprimer une 
entrée dans le système 
- Story 3 : En tant qu’Utilisateur, je peux lister l’ensemble des concerts disponibles, afin de 
connaître le catalogue de concerts. 
- Story 4 : En tant qu’Utilisateur, je peux lire l’ensemble des données d’un concert, afin d’en 
connaître le détail. 


<h2> Règles de gestion </h2>
 
- RG1 : les suppressions de données sont toujours des suppressions logiques 
- RG2 : les identifiants techniques en base de données doivent être au format UUID 
- RG3 : la suppression d’un concert entraîne le remboursement de tous les tickets déjà achetés 
- RG4 : un concert est composé d’au moins un titre, un lieu, une date, un nombre maximum de 
places, … 
