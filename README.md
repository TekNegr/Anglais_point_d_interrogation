# Anglais - LiDar DataClouds

Prototype React Three Fiber d'exploration LIDAR en nuage de points, avec scenes pre-construites, selection aleatoire et base d'evolution vers de la generation/modification procedurale.

## Plan d'action complet - LIDAR + scenes aleatoires + exploration

### 1. Objectif global
Creer une maquette 3D ou :

- Le joueur apparait dans une scene choisie aleatoirement.
- La scene est totalement invisible.
- Le joueur scanne l'environnement via un LIDAR (nuage de points).
- Le scan peut etre automatique (pulse regulier) ou manuel (touche dediee).
- Les points reveles reconstruisent visuellement la geometrie.
- Plus tard : possibilite de modifier la scene pour optimiser l'espace.

### 2. Organisation du projet

Arborescence recommandee (version React Three Fiber/TypeScript) :

```text
src/
  main.tsx
  App.tsx
  components/
    Experience.tsx
    User.tsx
    scenes/
      Classroom.tsx
      Street.tsx
      Studio.tsx
    objects/
      ObjectBase.tsx
      Chair.tsx
      Desk.tsx
      Table.tsx
      Tree.tsx
      ...
  systems/
    lidar/
      lidar.ts
      pointCloud.ts
    player/
      controller.ts
  data/
    scenes/
      classroom.json
      street.json
      studio.json
```

Pourquoi cette structure :

- `components/scenes` contient les scenes pre-construites.
- `systems/lidar` centralise le scan et le nuage de points.
- `systems/player` gere deplacement/orientation.
- `data/scenes` prepare la modification procedurale via JSON.
- `Experience.tsx` orchestre le cycle de vie global.

### 3. Systeme de selection aleatoire de scene

Principe :

1. Importer toutes les scenes.
2. Mettre leurs createurs dans un tableau.
3. En choisir une au hasard au lancement.

Exemple (TypeScript) :

```ts
import { Classroom } from './components/scenes/Classroom';
import { Street } from './components/scenes/Street';
import { Studio } from './components/scenes/Studio';

const scenes = [Classroom, Street, Studio] as const;
const SceneComponent = scenes[Math.floor(Math.random() * scenes.length)];
```

### 4. Structure d'une scene

Chaque scene doit :

- Retourner un groupe logique d'objets (ou JSX groupe).
- Utiliser des meshes invisibles (`visible={false}` ou materiau invisible).
- Etre construite en dur au debut (pas besoin de textures).
- Rester optimisee pour le raycast (geometries simples).

Exemple minimal (R3F) :

```tsx
export function Classroom() {
  return (
    <group>
      <mesh visible={false} position={[0, 1.5, -5]}>
        <boxGeometry args={[10, 3, 0.2]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
```

### 5. Le joueur

- Position initiale au centre.
- Deplacement simple (ZQSD).
- Rotation souris (PointerLockControls ou equivalent).
- Le LIDAR part toujours de `player.position`.

### 6. Le LIDAR (nuage de points)

Fonctionnement :

- Generer `N` directions uniformes sur une sphere.
- Faire un raycast dans chaque direction.
- Si impact : ajouter un point dans un `THREE.Points` global.
- Declencher soit en automatique, soit en manuel.

Modes :

- Mode automatique : pulse toutes les `X` ms pour une revelation progressive.
- Mode manuel : touche `E` pour pulse a la demande (meilleure maitrise perf).

### 7. Gestion du nuage de points

Representation recommandee :

- Un seul `THREE.Points` global.
- Une `BufferGeometry` avec tableau dynamique de positions.
- Extensions possibles : couleur selon distance, fade-out, persistance.

Exemple de mise a jour :

```ts
positions.push(hit.point.x, hit.point.y, hit.point.z);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.attributes.position.needsUpdate = true;
```

### 8. Performance et optimisation

- Limiter les raycasts (ex: 1500/pulse).
- Pulse toutes les 200-300 ms en mode automatique.
- Garder les points dans un buffer unique.
- Precalculer les directions spheriques une seule fois.
- Commencer avec des scenes simples.

### 9. Preparer l'avenir : modification de la scene

Objectif : pouvoir reorganiser l'espace sans reecrire la scene en code.

A. Decrire chaque scene en JSON structurel.

```json
{
  "walls": [
    { "type": "box", "size": [10, 3, 0.2], "position": [0, 1.5, -5] }
  ]
}
```

B. Le constructeur de scene lit ce JSON et instancie les meshes.

C. Evolutions futures :

- Interface d'edition pour deplacer les murs/objets.
- Generation procedurale des layouts.
- Optimisation d'espace (packing, contraintes, scoring).

### 10. Extensions possibles

- Mode scan continu (LIDAR rotatif).
- Points colores selon normale ou distance.
- Points persistants vs temporaires.
- Export du nuage de points.
- Mode analyse de scene (volumes, distances, zones).

## Demarrage du projet

```bash
npm install
npm run dev
```

Build production :

```bash
npm run build
```
