// Curated real photography (Pexels CDN). Consistent natural-light grading.
export interface Img {
  src: string;
  alt: string;
}

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMG = {
  hero: { src: px(32742545, 1800), alt: "Golden retriever in soft green surroundings, looking into the camera." },
  intro: { src: px(37143684, 1300), alt: "Intimate close-up of a cat's face, fur and expressive eyes." },
  careExam: { src: px(7468978, 1200), alt: "Veterinarian gently examining a dog during a check-up." },
  careListen: { src: px(6235648, 1200), alt: "Veterinarian listening to a Pomeranian with a stethoscope." },
  careHold: { src: px(37144808, 1200), alt: "Fluffy rabbit held gently in someone's arms." },

  catDogs: { src: px(9470781, 1100), alt: "Jack Russell terrier standing on grass, looking at the camera." },
  catCats: { src: px(29881867, 1100), alt: "Cat with striking eyes in natural indoor light." },
  catSmall: { src: px(20714890, 1300), alt: "Three black and white rabbits photographed together in a studio." },

  svcGeneral: { src: px(6235648, 1300), alt: "Routine examination with a stethoscope." },
  svcVaccination: { src: px(7468978, 1300), alt: "Veterinarian performing a calm vaccination visit." },
  svcDiagnostics: { src: px(7470634, 1300), alt: "Veterinarian performing a diagnostic examination." },
  svcDental: { src: px(7470631, 1300), alt: "Veterinarian examining a dog's mouth and teeth." },
  svcSurgery: { src: px(7470632, 1300), alt: "Veterinarian in a mask during a careful examination." },
  svcDerm: { src: px(7470635, 1300), alt: "Veterinarian examining a dog's ear and skin." },

  docMaya: { src: px(7470633, 1000), alt: "Dr. Maya Chen with a canine patient." },
  docJonas: { src: px(6235017, 1000), alt: "Dr. Jonas Weber holding a small dog." },
  docAmara: { src: px(7470631, 1000), alt: "Dr. Amara Osei during a dental examination." },
  docLuca: { src: px(7470635, 1000), alt: "Dr. Luca Marchetti examining a patient's ear." },
  docMayaAlt: { src: px(6235664, 1300), alt: "Veterinarian using a stethoscope on a small dog." },
  docJonasAlt: { src: px(6235650, 1300), alt: "A dog being checked at the clinic." },
  docAmaraAlt: { src: px(7470634, 1300), alt: "Careful hands-on clinical examination." },
  docLucaAlt: { src: px(7468978, 1300), alt: "Gentle clinical care for a canine patient." },

  speciesDog: { src: px(9470781, 900), alt: "Dog" },
  speciesCat: { src: px(34802423, 900), alt: "Cat" },
  speciesRabbit: { src: px(13460159, 900), alt: "Rabbit" },
  speciesBird: { src: px(34595530, 900), alt: "Bird" },
  speciesOther: { src: px(17376946, 900), alt: "Small companion animals" },

  ageBaby: { src: px(35409275, 1000), alt: "Siamese kitten sitting on a green blanket." },
  ageYoung: { src: px(29628210, 1000), alt: "Two young puppies sitting on grass." },
  ageAdult: { src: px(243914, 1000), alt: "Adult Akita dog outdoors." },
  ageSenior: { src: px(6305909, 1000), alt: "Senior white dog in warm light." },

  teaser: { src: px(6235650, 1300), alt: "A dog being listened to with a stethoscope at the clinic." },
  confirm: { src: px(7527370, 1300), alt: "A Labrador and a small kitten meeting on a wooden floor." },
  emergency: { src: px(28852102, 1400), alt: "A dog and a cat standing together calmly outdoors." },
  finalCta: { src: px(14610317, 1300), alt: "A dog and a cat together in a meadow." },
  authLogin: { src: px(10954785, 1100), alt: "Dog and cat cuddling in the countryside." },
  authRegister: { src: px(27806129, 1100), alt: "Cat and dog resting together in a warm living room." },
  accountHero: { src: px(29357039, 1400), alt: "Dog and cat side by side outdoors." },
  aboutSpace: { src: px(7470634, 1400), alt: "Inside the clinic during an examination." },

  petDog: { src: px(6069133, 900), alt: "Corgi sitting on grass." },
  petCat: { src: px(16178730, 900), alt: "Domestic cat with green eyes." },
  petRabbit: { src: px(13460159, 900), alt: "Grey rabbit lying on grass." },
  petBird: { src: px(29184927, 900), alt: "Blue parakeet perched on a branch." },
  petOther: { src: px(12728580, 900), alt: "Two rabbits photographed in black and white." },

  galleryWall: { src: px(36619092, 1100), alt: "Black cat with vivid green eyes." },
  gingerCat: { src: px(29296243, 1100), alt: "Ginger cat with amber eyes." },
  catEye: { src: px(34812828, 1100), alt: "Close-up of a cat's green iris." },
  bulldog: { src: px(7174179, 1100), alt: "Bulldog sitting on a sofa." },
  chihuahua: { src: px(3090875, 1100), alt: "Chihuahua sitting on wooden stairs." },
  huskyPup: { src: px(6207406, 1100), alt: "Husky puppy asleep on bedding." },
  budgies: { src: px(29083886, 1100), alt: "Two budgies among green leaves." },
  parrotVeg: { src: px(34951080, 1100), alt: "Parakeet eating fresh vegetables." },
  rabbitRed: { src: px(15288664, 1100), alt: "Ginger rabbit on a red background." },
  streetPair: { src: px(12064408, 1100), alt: "Dog and cat cuddling on a cobblestone street, black and white." },
  kittensTwo: { src: px(38189496, 1100), alt: "Two kittens side by side." },
  blackLab: { src: px(8850572, 1100), alt: "Black Labrador looking up with curious eyes." },
  corgi: { src: px(6069133, 1100), alt: "Corgi dog sitting on grass." },
  tabby: { src: px(34852195, 1100), alt: "Playful tabby cat with a head tilt." },
  bunnyHands: { src: px(19298398, 1100), alt: "Tiny bunny cradled in hands." },
  kittenStreet: { src: px(13078128, 1100), alt: "Kitten walking, black and white photograph." },
  dogKittenMeet: { src: px(20736349, 1100), alt: "Dog curiously meeting a newborn kitten." },
} satisfies Record<string, Img>;

export function petDefaultPhoto(species: string): string {
  switch (species) {
    case "dog":
      return IMG.petDog.src;
    case "cat":
      return IMG.petCat.src;
    case "rabbit":
      return IMG.petRabbit.src;
    case "bird":
      return IMG.petBird.src;
    default:
      return IMG.petOther.src;
  }
}

export function speciesPhoto(species: string): string {
  return petDefaultPhoto(species);
}
