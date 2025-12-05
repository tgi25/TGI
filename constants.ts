import { SlideContent } from './types';

export const THEME_COLOR = 'bg-maroon-800';
export const THEME_TEXT = 'text-maroon-800';

export const SLIDES: SlideContent[] = [
  {
    id: 'intro',
    title: 'Bubble Sorting: Introduction',
    content: [
      "Bubble Sort is one of the most foundational sorting methods in computer science.",
      "Despite being simpler and slower than modern algorithms, it provides an excellent starting point for understanding algorithmic thinking."
    ],
    bulletPoints: [
      "Sorting is critical for databases (names, prices, dates).",
      "Real-world examples: Phone books, home sales rankings, GDP analysis.",
      "Bubble Sort, Selection Sort, and Insertion Sort are the three 'simple' sorting algorithms."
    ]
  },
  {
    id: 'analogy',
    title: 'The Baseball Team Analogy',
    content: [
      "Imagine arranging a baseball team in order of increasing height.",
      "Humans can scan the whole line instantly and pick the tallest player. Computers cannot do this."
    ],
    bulletPoints: [
      "Computers are not intelligent; they cannot 'see the big picture'.",
      "A computer can only compare two values at a time.",
      "It must follow a precise set of rules (an algorithm) to sort the data."
    ]
  },
  {
    id: 'mechanism',
    title: 'How Bubble Sort Works',
    content: [
      "The algorithm relies on two fundamental steps: Comparison and Movement (Swap).",
      "We start at the left and compare adjacent players (items)."
    ],
    bulletPoints: [
      "Rule: Compare two adjacent items. If the one on the left is larger, SWAP them.",
      "Move one position to the right and repeat.",
      "This causes larger items to 'bubble up' to the end of the array."
    ]
  },
  {
    id: 'passes',
    title: 'Passes and Progress',
    content: [
      "A 'Pass' is one full run through the array from left to right.",
      "After the first pass, the largest item is guaranteed to be in its final sorted position at the end."
    ],
    bulletPoints: [
      "Pass 1: N-1 comparisons. Largest item reaches position N-1.",
      "Pass 2: N-2 comparisons. Second largest item reaches position N-2.",
      "The algorithm repeats until all items are sorted."
    ]
  },
  {
    id: 'efficiency',
    title: 'Efficiency and Big O',
    content: [
      "Bubble Sort is comparatively slow for large datasets.",
      "We measure efficiency by counting Comparisons and Swaps."
    ],
    bulletPoints: [
      "Comparisons: Sum of (N-1) + (N-2) + ... + 1 ≈ N²/2.",
      "Swaps: In the worst case (reverse order), also ≈ N²/2. Average is N²/4.",
      "Big O Notation: We ignore constants (like 1/2). Bubble Sort is O(N²).",
      "Meaning: Doubling the items quadruples the sorting time."
    ]
  }
];

export const INITIAL_ARRAY = [45, 9, 78, 23, 12, 60, 31, 55];
