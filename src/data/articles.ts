// Journal — demo editorial content written for the experience.
import { IMG } from "@/data/images";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export interface ArticleDef {
  slug: string;
  index: string;
  category: string;
  title: string;
  excerpt: string;
  minutes: number;
  image: string;
  imageAlt: string;
  body: ArticleBlock[];
}

export const ARTICLES: ArticleDef[] = [
  {
    slug: "what-your-dog-cant-tell-you",
    index: "01",
    category: "DOGS",
    title: "WHAT YOUR DOG CAN'T TELL YOU",
    excerpt: "Dogs hide discomfort until they can't. The strange art of reading the ones you live with.",
    minutes: 5,
    image: IMG.dogKittenMeet.src,
    imageAlt: IMG.dogKittenMeet.alt,
    body: [
      { type: "p", text: "A dog who stops greeting you at the door is telling you something. So is the dog who takes the stairs one at a time, who leaves the crunchy half of dinner, who sleeps facing the wall instead of the room. None of these are dramas. All of them are data." },
      { type: "h2", text: "PAIN LOOKS LIKE PERSONALITY" },
      { type: "p", text: "The most common sentence we hear is \"I thought he was just getting older.\" Slowing down, playing less, being grumpy when touched — these are read as temperament when they are usually symptoms. Animals do not know that limping earns them treatment; they only know that showing weakness is risky. So they compensate, quietly, for months." },
      { type: "quote", text: "Behaviour is the only chart your pet keeps. Learn to read it before it becomes an emergency." },
      { type: "h2", text: "THE FIVE THINGS WORTH WATCHING" },
      { type: "p", text: "Appetite. Thirst. Sleep positions. Greeting behaviour. The walk — its length, its enthusiasm, its symmetry. You do not need veterinary training to notice change in these; you need only the animal you already know. Write down what changed and when. That sentence alone is the most useful diagnostic tool an owner owns." },
      { type: "p", text: "And when something feels off — even if you cannot name it — that intuition deserves an examination, not an apology. Vets would always rather reassure you early than treat you late." },
    ],
  },
  {
    slug: "the-quiet-physics-of-cat-sleep",
    index: "02",
    category: "CATS",
    title: "THE QUIET PHYSICS OF CAT SLEEP",
    excerpt: "Sixteen hours a day is not laziness. Inside the strange, efficient economy of feline rest.",
    minutes: 4,
    image: IMG.huskyPup.src,
    imageAlt: "A young animal in deep sleep, small and unguarded.",
    body: [
      { type: "p", text: "Cats sleep roughly twice as much as we do, and for most of that time they are not asleep in the way we mean it. The ears keep rotating. The nose keeps working. What looks like surrender is a light doze with one paw on the door handle — an inheritance from an animal that was both predator and prey." },
      { type: "h2", text: "WHEN SLEEP CHANGES, LISTEN" },
      { type: "p", text: "The pattern matters more than the hours. A cat who suddenly abandons the warm spot, who sleeps sitting upright, who retreats under the bed at hours they used to spend on it — these changes often arrive weeks before any visible symptom. Cats are masters of the low-key signal." },
      { type: "quote", text: "Nobody knows normal like you do. A deviation from normal is a symptom, even without a name." },
      { type: "p", text: "Kittens and seniors legitimately sleep more. What deserves a call is a change — in amount, in place, in posture. Photograph the odd posture if you can. It tells us more than adjectives do." },
    ],
  },
  {
    slug: "feeding-small-bodies",
    index: "03",
    category: "NUTRITION",
    title: "FEEDING SMALL BODIES WELL",
    excerpt: "Rabbits, birds and guinea pigs don't eat pet food — they eat ecosystems. A field guide to bowls.",
    minutes: 6,
    image: IMG.parrotVeg.src,
    imageAlt: IMG.parrotVeg.alt,
    body: [
      { type: "p", text: "Small companion animals have the fastest metabolisms in the waiting room and the least margin for error. A rabbit that stops eating for twelve hours is not picky — it is an emergency. A bird that loses ten grams is a bird that has lost a meaningful percentage of its body." },
      { type: "h2", text: "HAY IS NOT BEDDING" },
      { type: "p", text: "For rabbits and guinea pigs, unlimited grass hay is the diet — pellets and greens are garnish. The most common small-animal emergencies we see trace back to bowls of colourful muesli and not enough fibre. Their teeth never stop growing; only chewing keeps them worn." },
      { type: "h2", text: "SEEDS ARE CONFECTIONERY" },
      { type: "p", text: "A seed-only parrot is a bird on a lifelong dessert diet: fatty liver, dull feathers, a shortened life. Quality pellets, fresh vegetables, controlled fruit. Transition slowly — birds starve rather than eat food they don't recognise, so introduce the new bowl beside the old one for weeks." },
      { type: "quote", text: "Weigh your small pet monthly, in grams, at the same hour. It is the cheapest diagnostic in all of veterinary medicine." },
      { type: "p", text: "And water matters as much as food. Check sipper bottles daily — a blocked ball-bearing is invisible until the animal is dehydrated. Two bottles, always, for anything living in a cage." },
    ],
  },
  {
    slug: "vaccines-without-the-mystery",
    index: "04",
    category: "VACCINATION",
    title: "VACCINES, WITHOUT THE MYSTERY",
    excerpt: "Which shots, when, and why the schedule your neighbour's dog has isn't your dog's.",
    minutes: 5,
    image: IMG.svcVaccination.src,
    imageAlt: IMG.svcVaccination.alt,
    body: [
      { type: "p", text: "Every vaccination plan answers two questions: what can this animal realistically catch, and how would it go if it did? Core vaccines protect against the diseases that are common, severe, or both. Lifestyle vaccines depend on geography, travel, kennels, water, cats going outdoors, dogs socialising at daycare." },
      { type: "h2", text: "THE FIRST YEAR IS A CONSTRUCTION SITE" },
      { type: "p", text: "Puppies and kittens receive a series, not a single shot, because maternal antibodies — inherited protection — interfere unpredictably with early doses. The series closes the window in which a young animal is protected by neither mother nor vaccine. Until it is complete, treat the ground outside like it has opinions about your puppy: carry, don't walk." },
      { type: "quote", text: "Bring the booklet. The most common vaccination mistake is a duplicated or missing dose in a paper gap." },
      { type: "h2", text: "MYTHS WORTH RETIRING" },
      { type: "p", text: "Indoor cats still need protection — viruses ride in on shoes and clothing. Elderly animals still benefit, often with adjusted intervals. And reactions, when they happen, are overwhelmingly mild: a quiet day, a sore spot, a small nap tax. Tell us about anything previous and we plan around it." },
    ],
  },
  {
    slug: "handling-rabbits-gently",
    index: "05",
    category: "GENERAL CARE",
    title: "THE ART OF HOLDING A PREY ANIMAL",
    excerpt: "Rabbits don't hate being held. They hate feeling held wrong. Technique over affection.",
    minutes: 4,
    image: IMG.careHold.src,
    imageAlt: IMG.careHold.alt,
    body: [
      { type: "p", text: "To a rabbit, being lifted is being hunted. Every instinct says the ground has left because a hawk has arrived. This is why so many affectionate rabbits transform into gymnasts in loving arms — and why a kicked-out hind leg can injure a spine that was evolved for grass, not air." },
      { type: "h2", text: "THE RULES ARE SIMPLE" },
      { type: "p", text: "Four on the floor as long as possible. One hand under the chest, one under the hindquarters — always both, always supported. Bring the body against your body so there is no dangling, no sense of falling. Sit on the floor for the first year of practice; gravity punishes confidence." },
      { type: "quote", text: "Never, under any circumstances, by the ears. The scruff is for kittens carried by mothers, not for rabbits, and not by humans." },
      { type: "p", text: "Children and rabbits are a wonderful combination — with the child sitting and the rabbit free to approach. The animal that chooses the lap stays in the lap. The one that is placed in it is already planning an exit." },
    ],
  },
  {
    slug: "behaviour-changes-are-symptoms",
    index: "06",
    category: "BEHAVIOUR",
    title: "WHEN BAD BEHAVIOUR IS A SYMPTOM",
    excerpt: "The cat on the bed, the dog growling at the sofa. What acting out is actually about.",
    minutes: 5,
    image: IMG.kittensTwo.src,
    imageAlt: IMG.kittensTwo.alt,
    body: [
      { type: "p", text: "A housetrained dog who starts urinating indoors is not making a point. A cat avoiding the litter box is not punishing you for the holiday. In our exam rooms, new aggression, new soiling, new night-waking turn out to be pain, thyroid, kidneys, joints — a medical story wearing a behavioural costume." },
      { type: "h2", text: "RULE OUT THE BODY FIRST" },
      { type: "p", text: "This is why our behaviour consults start with the same stethoscope as everything else. Treating a training problem that is actually a bladder problem trains nothing and hurts daily. Once the body is cleared, behaviour itself is wonderfully workable — animals are honest learners." },
      { type: "h2", text: "WHAT TO BRING TO THE APPOINTMENT" },
      { type: "p", text: "A video of the behaviour, if you can catch one. A timeline — when it started, what changed in the home around then. And no embarrassment. The dog who chews the doorframe has heard it all before, and so have we." },
    ],
  },
];

export function getArticle(slug: string): ArticleDef | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
