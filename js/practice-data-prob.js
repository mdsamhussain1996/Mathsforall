/* ============================================================
   Maths for All — Practice problem bank: PROBABILITY & STATISTICS
   Course: probability-statistics.html (8 chapters, 6 problems each)
   Keys: prob-ch1 … prob-ch8
   Author: Dr. Md Samshad Hussain Ansari
   ============================================================ */
(function () {
  'use strict';

  var P = window.PRACTICE_DATA = window.PRACTICE_DATA || {};
  var R = String.raw;

  // CHAPTER 1: COUNTING & SAMPLE SPACES
  P["prob-ch1"] = [
    { id: "prob1-1", type: "concept",
      q: R`State Kolmogorov’s three probability axioms for a sample space $\Omega$ and an event field $\mathcal{F}$. Why does axiom 3 require countable additivity rather than merely finite additivity?`,
      hint: R`Consider an infinite sequence of mutually disjoint events, such as waiting for the first success in independent coin tosses.` ,
      steps: [
        R`1. Non-negativity: For every event $E \in \mathcal{F}$, $P(E) \ge 0$.`,
        R`2. Unit measure: $P(\Omega) = 1$.`,
        R`3. Countable additivity: For any countable sequence of pairwise disjoint events $E_1, E_2, \dots$ ($E_i \cap E_j = \emptyset$ for $i \ne j$), $P\left(\bigcup_{i=1}^\infty E_i\right) = \sum_{i=1}^\infty P(E_i)$.`,
        R`Countable additivity is necessary because discrete computer algorithms can run for an arbitrarily large number of steps (e.g. geometric random variables, algorithm termination proofs), requiring limits of probabilities $\lim_{n \to \infty} P(A_n)$ to equal $P(\lim_{n \to \infty} A_n)$.`
      ],
      answer: R`Axiom 1: $P(E) \ge 0$; Axiom 2: $P(\Omega) = 1$; Axiom 3: $P(\bigcup_{i=1}^\infty E_i) = \sum_{i=1}^\infty P(E_i)$ for pairwise disjoint events. Countable additivity ensures continuity of probability measures under infinite limits.`
    },
    { id: "prob1-2", type: "concept",
      q: R`In a hash table with $N$ slots and $k$ inserted keys, what is the Birthday Paradox threshold for $k$ such that the probability of at least one collision is at least $50\%$? What is the asymptotic relationship between $k$ and $N$?`,
      hint: R`Calculate $P(\text{no collision})$ using the product $\prod_{i=0}^{k-1} (1 - i/N) \approx \prod e^{-i/N}$.`,
      steps: [
        R`The probability that all $k$ keys map to distinct slots is $P(\text{no collision}) = \prod_{i=0}^{k-1} \left(1 - \frac{i}{N}\right)$.`,
        R`Using the Taylor approximation $1 - x \approx e^{-x}$ for small $x = i/N$: $P(\text{no collision}) \approx \exp\left(-\sum_{i=0}^{k-1} \frac{i}{N}\right) = \exp\left(-\frac{k(k-1)}{2N}\right)$.`,
        R`For collision probability $\ge 0.5$, we set $P(\text{no collision}) \le 0.5 \implies \exp\left(-\frac{k^2}{2N}\right) \le \frac{1}{2}$.`,
        R`Taking natural logs: $-\frac{k^2}{2N} \le -\ln 2 \implies k^2 \ge 2 \ln(2) N \implies k \approx \sqrt{2 \ln 2} \sqrt{N} \approx 1.177 \sqrt{N} = \Theta(\sqrt{N})$.`
      ],
      answer: R`$k \approx \sqrt{2 \ln 2 \cdot N} \approx 1.177 \sqrt{N} = \Theta(\sqrt{N})$. For $N=365$, $k \approx 23$.`
    },
    { id: "prob1-3", type: "computation",
      q: R`A distributed microservice architecture consists of three services $A$, $B$, and $C$. During peak traffic, the failure probabilities are $P(A) = 0.10$, $P(B) = 0.08$, $P(C) = 0.05$. Joint failure probabilities are $P(A \cap B) = 0.02$, $P(A \cap C) = 0.01$, $P(B \cap C) = 0.01$, and all three fail together with probability $P(A \cap B \cap C) = 0.002$. Compute the probability that at least one service fails.`,
      hint: R`Apply the Principle of Inclusion-Exclusion for 3 events: $P(A \cup B \cup C) = \sum P(A) - \sum P(A \cap B) + P(A \cap B \cap C)$.`,
      steps: [
        R`Step 1: Sum single probabilities: $P(A) + P(B) + P(C) = 0.10 + 0.08 + 0.05 = 0.23$.`,
        R`Step 2: Sum pairwise intersections: $P(A \cap B) + P(A \cap C) + P(B \cap C) = 0.02 + 0.01 + 0.01 = 0.04$.`,
        R`Step 3: Add triple intersection: $P(A \cap B \cap C) = 0.002$.`,
        R`Step 4: Combine via PIE: $P(A \cup B \cup C) = 0.23 - 0.04 + 0.002 = 0.192$.`
      ],
      answer: R`$P(\text{at least one failure}) = 0.192$ (or $19.2\%$).`
    },
    { id: "prob1-4", type: "computation",
      q: R`A 64-bit cryptographic hash function maps arbitrary byte strings into $2^{64}$ possible values. How many unique strings must an attacker generate before the probability of discovering at least one hash collision exceeds $50\%$?`,
      hint: R`Use the birthday collision formula $k \approx \sqrt{2 \ln 2 \cdot N}$ with $N = 2^{64}$.`,
      steps: [
        R`Step 1: Total possible hashes $N = 2^{64} \approx 1.84467 \times 10^{19}$.`,
        R`Step 2: Birthday collision bound gives $k \approx \sqrt{2 \ln 2} \times \sqrt{2^{64}} = \sqrt{2 \ln 2} \times 2^{32}$.`,
        R`Step 3: $\sqrt{2 \ln 2} = \sqrt{1.38629} \approx 1.1774$.`,
        R`Step 4: $k \approx 1.1774 \times 4,294,967,296 \approx 5.057 \times 10^9 \approx 5.06 \text{ billion hashes}$.`
      ],
      answer: R`$k \approx 1.1774 \times 2^{32} \approx 5.06 \times 10^9$ hashes (around $5.06$ billion hashes, illustrating why 64-bit hashes are insecure against birthday attacks).`
    },
    { id: "prob1-5", type: "proof",
      q: R`Prove Boole’s inequality (the Union Bound): for any countable sequence of events $A_1, A_2, \dots$, prove that $P\left(\bigcup_{i=1}^n A_i\right) \le \sum_{i=1}^n P(A_i)$. Why is this bound ubiquitous in randomized algorithm analysis?`,
      hint: R`Disjointify the union by defining $B_1 = A_1$ and $B_i = A_i \setminus (\bigcup_{j=1}^{i-1} A_j)$ for $i \ge 2$.`,
      steps: [
        R`Define disjoint sets: $B_1 = A_1$, and for $i \ge 2$, $B_i = A_i \setminus \left(\bigcup_{j=1}^{i-1} A_j\right)$.`,
        R`Notice that: (i) the sets $B_i$ are pairwise disjoint; (ii) $\bigcup_{i=1}^n B_i = \bigcup_{i=1}^n A_i$; and (iii) $B_i \subseteq A_i$ for all $i$.`,
        R`By Axiom 3 (countable/finite additivity on disjoint sets): $P\left(\bigcup_{i=1}^n A_i\right) = P\left(\bigcup_{i=1}^n B_i\right) = \sum_{i=1}^n P(B_i)$.`,
        R`By monotonicity of probability, since $B_i \subseteq A_i$, we have $P(B_i) \le P(A_i)$ for every $i$.`,
        R`Substituting gives: $P\left(\bigcup_{i=1}^n A_i\right) = \sum_{i=1}^n P(B_i) \le \sum_{i=1}^n P(A_i)$.`,
        R`In randomized algorithms, error events $E_i$ are often correlated and their joint distributions are intractable; the union bound allows us to guarantee the total failure probability $P(\text{failure}) = P(\bigcup E_i) \le \sum P(E_i)$ without knowing dependencies.`
      ],
      answer: R`Disjointification $B_i = A_i \setminus (\bigcup_{j<i} A_j)$ gives $P(\bigcup A_i) = \sum P(B_i) \le \sum P(A_i)$ because $B_i \subseteq A_i$. It bounds worst-case failure without requiring event independence.`
    },
    { id: "prob1-6", type: "interview",
      q: R`[Google / Jane Street] You have a shuffled standard 52-card deck. You draw cards one by one without replacement. What is the probability that the first Ace appears on the 10th card?`,
      hint: R`The first 9 cards must contain 0 Aces, and the 10th card must be an Ace. Use conditional probability along the chain or combinations.`,
      steps: [
        R`Method 1 (Combinations): Total ways to choose 10 cards in order is $P(52, 10)$.`,
        R`Favorable sequences: First 9 cards must come from the 48 non-Aces ($P(48, 9)$ ways), and the 10th card must be one of the 4 Aces ($4$ ways).`,
        R`$P = \frac{P(48, 9) \times 4}{P(52, 10)} = \frac{\frac{48!}{39!} \times 4}{\frac{52!}{42!}} = 4 \times \frac{48! \cdot 42!}{52! \cdot 39!}$.`,
        R`Simplifying: $\frac{48 \times 47 \times 46 \times 45 \times 44 \times 43 \times 42 \times 41 \times 40}{52 \times 51 \times 50 \times 49 \times 48 \times 47 \times 46 \times 45 \times 44} \times \frac{4}{43} = \frac{42 \times 41 \times 40 \times 4}{52 \times 51 \times 50 \times 49}$.`,
        R`Computing numerical value: $\frac{275,520}{6,497,400} \approx 0.0424$ (around $4.24\%$).`
      ],
      answer: R`$P = \frac{48 \cdot 47 \cdots 40 \cdot 4}{52 \cdot 51 \cdots 43} = \frac{42 \times 41 \times 40 \times 4}{52 \times 51 \times 50 \times 49} = \frac{4592}{108290} \approx 0.0424$ ($4.24\%$).`
    }
  ];

  // CHAPTER 2: CONDITIONAL PROBABILITY & BAYES' THEOREM
  P["prob-ch2"] = [
    { id: "prob2-1", type: "concept",
      q: R`Explain the difference between statistical independence ($P(A \cap B) = P(A)P(B)$) and mutual exclusivity ($A \cap B = \emptyset$). Can two non-empty events with $P(A) > 0$ and $P(B) > 0$ be simultaneously independent and mutually exclusive?`,
      hint: R`Substitute $A \cap B = \emptyset$ into the definition of independence.` ,
      steps: [
        R`Mutual exclusivity is a set-theoretic property: $A$ and $B$ cannot occur at the same time ($A \cap B = \emptyset$). Hence $P(A \cap B) = 0$.`,
        R`Statistical independence is an informational property: knowing $B$ occurred gives zero information about $A$, so $P(A|B) = P(A)$, which implies $P(A \cap B) = P(A)P(B)$.`,
        R`If $A$ and $B$ are both independent and mutually exclusive, then $P(A)P(B) = P(A \cap B) = 0$.`,
        R`Since $P(A) > 0$ and $P(B) > 0$, their product $P(A)P(B) > 0 \ne 0$. This is a contradiction!`,
        R`Therefore, two non-trivial events CANNOT be both mutually exclusive and independent. Mutual exclusivity is the strongest possible form of dependence!`
      ],
      answer: R`No. If mutually exclusive, $P(A \cap B) = 0$. If independent, $P(A \cap B) = P(A)P(B) > 0$. They are mutually exclusive concepts unless at least one event has probability zero.`
    },
    { id: "prob2-2", type: "concept",
      q: R`What is the "Base Rate Fallacy" in machine learning classification and medical diagnostics? How does Bayes’ theorem resolve it?`,
      hint: R`Consider a condition with very low prior $P(H) \ll 1$ and a high-accuracy test.` ,
      steps: [
        R`The Base Rate Fallacy occurs when humans evaluate the posterior $P(H|+)$ based primarily on the test accuracy $P(+|H)$, completely ignoring the tiny prior base rate $P(H)$.`,
        R`By Bayes’ Rule: $P(H|+) = \frac{P(+|H) P(H)}{P(+|H)P(H) + P(+|\neg H)P(\neg H)}$.`,
        R`When the prior $P(H)$ is minuscule (e.g. $0.001$), the false-positive term $P(+|\neg H)P(\neg H)$ dominates the denominator even if false positive rate $P(+|\neg H)$ is small (e.g. $1\%$).`,
        R`As a result, most positive test alerts are false positives. Bayes' theorem explicitly scales the test evidence by the prior prevalence.`
      ],
      answer: R`The base rate fallacy ignores the prior prevalence $P(H)$. When a phenomenon is rare, false positives from the large healthy population easily outnumber true positives from the tiny afflicted population.`
    },
    { id: "prob2-3", type: "computation",
      q: R`A spam classifier inspects emails. $20\%$ of incoming emails are spam ($P(S) = 0.20$). The word “free” appears in $70\%$ of spam emails ($P(W|S) = 0.70$), but also appears in $5\%$ of legitimate emails ($P(W|\neg S) = 0.05$). An incoming email contains the word “free”. Compute the posterior probability $P(S|W)$ that this email is spam.`,
      hint: R`Apply Bayes' theorem: $P(S|W) = \frac{P(W|S)P(S)}{P(W|S)P(S) + P(W|\neg S)P(\neg S)}$.`,
      steps: [
        R`Prior: $P(S) = 0.20 \implies P(\neg S) = 0.80$.`,
        R`Likelihoods: $P(W|S) = 0.70$, $P(W|\neg S) = 0.05$.`,
        R`Total probability of observing word $W$: $P(W) = P(W|S)P(S) + P(W|\neg S)P(\neg S) = (0.70)(0.20) + (0.05)(0.80) = 0.14 + 0.04 = 0.18$.`,
        R`Bayes' Rule: $P(S|W) = \frac{P(W|S)P(S)}{P(W)} = \frac{0.14}{0.18} = \frac{14}{18} = \frac{7}{9} \approx 0.7778$.`
      ],
      answer: R`$P(S|W) = \frac{7}{9} \approx 0.778$ ($77.8\%$).`
    },
    { id: "prob2-4", type: "computation",
      q: R`A factory has three machines $M_1, M_2, M_3$ that produce microchips. $M_1$ produces $50\%$ of chips with defective rate $1\%$; $M_2$ produces $30\%$ with defective rate $2\%$; $M_3$ produces $20\%$ with defective rate $5\%$. A randomly inspected chip is found to be defective. What is the probability it came from machine $M_3$?`,
      hint: R`Calculate total defective probability $P(D) = \sum P(D|M_i)P(M_i)$, then Bayes rule for $M_3$.`,
      steps: [
        R`Priors: $P(M_1)=0.5, P(M_2)=0.3, P(M_3)=0.2$.`,
        R`Defect rates: $P(D|M_1)=0.01, P(D|M_2)=0.02, P(D|M_3)=0.05$.`,
        R`Total probability of defect: $P(D) = (0.5)(0.01) + (0.3)(0.02) + (0.2)(0.05) = 0.005 + 0.006 + 0.010 = 0.021$.`,
        R`Posterior for $M_3$: $P(M_3|D) = \frac{P(D|M_3)P(M_3)}{P(D)} = \frac{0.010}{0.021} = \frac{10}{21} \approx 0.4762$.`
      ],
      answer: R`$P(M_3|D) = \frac{10}{21} \approx 0.476$ ($47.6\%$). Even though $M_3$ only produces $20\%$ of all chips, it accounts for nearly half of all defects!`
    },
    { id: "prob2-5", type: "proof",
      q: R`In the Monty Hall problem, there are 3 closed doors. Behind one is a car; behind the other two are goats. You pick Door 1. The host (who knows where the car is) opens Door 3 to reveal a goat, and offers you the chance to switch to Door 2. Prove rigorously using Bayes’ Theorem that $P(\text{Car at Door 2} \mid \text{Host opens Door 3}) = 2/3$.`,
      hint: R`Let $C_i$ be the event car is at Door $i$ ($P(C_i)=1/3$). Let $H_3$ be host opens Door 3. Find $P(H_3|C_1), P(H_3|C_2), P(H_3|C_3)$.`,
      steps: [
        R`Prior: $P(C_1) = P(C_2) = P(C_3) = 1/3$.`,
        R`Host behavior conditions: Host cannot open contestant's door (Door 1), and host cannot open the door hiding the car.`,
        R`If $C_1$: Car is behind Door 1. Host can open Door 2 or 3 at random $\implies P(H_3|C_1) = 1/2$.`,
        R`If $C_2$: Car is behind Door 2. Host is forced to open Door 3 $\implies P(H_3|C_2) = 1$.`,
        R`If $C_3$: Car is behind Door 3. Host can never open Door 3 $\implies P(H_3|C_3) = 0$.`,
        R`Total probability of host opening Door 3: $P(H_3) = P(H_3|C_1)P(C_1) + P(H_3|C_2)P(C_2) + P(H_3|C_3)P(C_3) = (1/2)(1/3) + (1)(1/3) + 0 = 1/6 + 1/3 = 1/2$.`,
        R`Posterior for Door 2: $P(C_2|H_3) = \frac{P(H_3|C_2)P(C_2)}{P(H_3)} = \frac{1 \cdot (1/3)}{1/2} = \frac{2}{3}$.`,
        R`Posterior for Door 1: $P(C_1|H_3) = \frac{(1/2)(1/3)}{1/2} = \frac{1}{3}$. Switching doubles the win probability!`
      ],
      answer: R`$P(C_2 \mid H_3) = \frac{1 \times 1/3}{1/2} = 2/3$. The host's constrained choice concentrates the remaining $2/3$ probability mass onto Door 2.`
    },
    { id: "prob2-6", type: "interview",
      q: R`[Amazon / Meta] Two coins are in a box. Coin 1 is fair ($P(\text{Heads}) = 0.5$). Coin 2 is two-headed ($P(\text{Heads}) = 1.0$). You pick one coin uniformly at random and flip it $k$ times; it lands Heads every single time. What is the posterior probability that you picked the two-headed coin? How large must $k$ be for you to be $\ge 99\%$ certain?`,
      hint: R`Apply Bayes rule with $P(C_1)=P(C_2)=0.5$, $P(k\text{ Heads}|C_1) = (1/2)^k$, $P(k\text{ Heads}|C_2) = 1$.`,
      steps: [
        R`Priors: $P(C_1) = 0.5$, $P(C_2) = 0.5$.`,
        R`Likelihood of $k$ consecutive Heads: $P(H^k|C_1) = (1/2)^k = 2^{-k}$, and $P(H^k|C_2) = 1^k = 1$.`,
        R`Total probability: $P(H^k) = (1/2)(2^{-k}) + (1/2)(1) = \frac{1 + 2^{-k}}{2}$.`,
        R`Posterior for Coin 2: $P(C_2|H^k) = \frac{1 \times 0.5}{\frac{1 + 2^{-k}}{2}} = \frac{1}{1 + 2^{-k}} = \frac{2^k}{2^k + 1}$.`,
        R`For $99\%$ certainty: $\frac{2^k}{2^k + 1} \ge 0.99 \implies 2^k \ge 0.99(2^k + 1) \implies 0.01 \cdot 2^k \ge 0.99 \implies 2^k \ge 99$.`,
        R`Since $2^6 = 64$ and $2^7 = 128$, the smallest integer is $k = 7$.`
      ],
      answer: R`$P(C_2 \mid H^k) = \frac{2^k}{2^k + 1}$. For $\ge 99\%$ certainty, $2^k \ge 99 \implies k \ge 7$ consecutive heads.`
    }
  ];

  // CHAPTER 3: RANDOM VARIABLES, EXPECTATION & VARIANCE
  P["prob-ch3"] = [
    { id: "prob3-1", type: "concept",
      q: R`State the Linearity of Expectation property. Does it require the random variables to be mutually independent? Give a counter-example where variance fails to be linear due to dependence.`,
      hint: R`$\mathbb{E}[X + Y] = \mathbb{E}[X] + \mathbb{E}[Y]$. Look at $\operatorname{Var}(X + X)$.` ,
      steps: [
        R`Linearity of Expectation states: For any random variables $X_1, \dots, X_n$ and constants $c_1, \dots, c_n$, $\mathbb{E}\left[\sum_{i=1}^n c_i X_i\right] = \sum_{i=1}^n c_i \mathbb{E}[X_i]$.`,
        R`Crucially, linearity holds regardless of whether the variables are independent, mutually correlated, or completely identical!`,
        R`In contrast, Variance is NOT linear under dependence: $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X,Y)$.`,
        R`Counter-example: Let $Y = X$. Then $\operatorname{Var}(X + X) = \operatorname{Var}(2X) = 4\operatorname{Var}(X) \ne \operatorname{Var}(X) + \operatorname{Var}(X) = 2\operatorname{Var}(X)$ (for any variable with $\operatorname{Var}(X) > 0$).`
      ],
      answer: R`Linearity of expectation $\mathbb{E}[\sum c_i X_i] = \sum c_i \mathbb{E}[X_i]$ holds for arbitrary dependencies. Variance fails to be linear when covariance is non-zero (e.g. $\operatorname{Var}(X+X) = 4\operatorname{Var}(X) \ne 2\operatorname{Var}(X)$).`
    },
    { id: "prob3-2", type: "concept",
      q: R`In the analysis of Randomized Quicksort on an array of $n$ distinct elements, why does the pair of sorted elements $(z_i, z_j)$ (where $i < j$) get compared at most once? What is the exact probability that $z_i$ and $z_j$ are compared?`,
      hint: R`Elements are only compared if one is chosen as a pivot while both belong to the same recursive subproblem.` ,
      steps: [
        R`In Quicksort, two elements are only compared if one of them is the chosen pivot. Once an element is chosen as pivot, it is placed in its permanent position and never compared again.`,
        R`Consider the set of elements $S_{ij} = \{z_i, z_{i+1}, \dots, z_j\}$, which has cardinality $j - i + 1$.`,
        R`$z_i$ and $z_j$ are compared if and only if the FIRST element chosen as pivot from $S_{ij}$ is either $z_i$ or $z_j$.`,
        R`If any intermediate element $z_k$ ($i < k < j$) is chosen as pivot first, $z_i$ and $z_j$ are split into separate recursive partitions and will NEVER be compared.`,
        R`Since pivots are chosen uniformly at random, every element in $S_{ij}$ is equally likely to be selected first.`,
        R`Thus, $P(z_i \text{ and } z_j \text{ compared}) = \frac{2}{|S_{ij}|} = \frac{2}{j - i + 1}$.`
      ],
      answer: R`$P(z_i \text{ and } z_j \text{ compared}) = \frac{2}{j - i + 1}$. They are compared if and only if either $z_i$ or $z_j$ is selected as pivot before any element strictly between them in sorted order.`
    },
    { id: "prob3-3", type: "computation",
      q: R`$n$ letters are placed randomly into $n$ matching addressed envelopes (one letter per envelope, uniformly at random). Let $X$ be the number of letters that end up in their correct envelope. Compute $\mathbb{E}[X]$ and $\operatorname{Var}(X)$.`,
      hint: R`Use indicator random variables $X_i = 1$ if letter $i$ is correct. Compute $\mathbb{E}[X_i X_j]$ for $i \ne j$.`,
      steps: [
        R`Let $X = \sum_{i=1}^n X_i$, where $X_i = 1$ if letter $i$ is placed in envelope $i$, and $0$ otherwise.`,
        R`$P(X_i = 1) = \frac{1}{n}$, so $\mathbb{E}[X_i] = \frac{1}{n}$.`,
        R`By Linearity of Expectation: $\mathbb{E}[X] = \sum_{i=1}^n \mathbb{E}[X_i] = n \times \frac{1}{n} = 1$. This holds for any $n$!`,
        R`For variance: $\operatorname{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2 = \mathbb{E}[X^2] - 1$.`,
        R`$X^2 = \left(\sum X_i\right)^2 = \sum_{i=1}^n X_i^2 + \sum_{i \ne j} X_i X_j$. Since $X_i \in \{0, 1\}$, $X_i^2 = X_i$.`,
        R`For $i \ne j$: $P(X_i = 1 \cap X_j = 1) = \frac{1}{n(n-1)}$, so $\mathbb{E}[X_i X_j] = \frac{1}{n(n-1)}$.`,
        R`There are $n(n-1)$ such pairs, so $\mathbb{E}[X^2] = \sum_{i=1}^n \mathbb{E}[X_i] + \sum_{i \ne j} \mathbb{E}[X_i X_j] = 1 + n(n-1) \frac{1}{n(n-1)} = 1 + 1 = 2$.`,
        R`Thus, $\operatorname{Var}(X) = 2 - 1^2 = 1$.`
      ],
      answer: R`$\mathbb{E}[X] = 1$ and $\operatorname{Var}(X) = 1$ for all $n \ge 2$. Both the mean and variance of fixed points in a random permutation are exactly 1.`
    },
    { id: "prob3-4", type: "computation",
      q: R`Using the indicator formula $\mathbb{E}[C] = \sum_{i=1}^{n-1} \sum_{j=i+1}^n \frac{2}{j - i + 1}$, calculate the exact expected number of comparisons performed by Randomized Quicksort on an array of size $n = 5$.`,
      hint: R`Substitute $k = j - i + 1$. For each difference $k \in \{2, 3, 4, 5\}$, count how many pairs $(i,j)$ have that distance.` ,
      steps: [
        R`Let $k = j - i + 1$. The distance $k$ ranges from $2$ to $n=5$.`,
        R`For distance $k$, there are $n - k + 1 = 6 - k$ pairs $(i, j)$, each contributing $\frac{2}{k}$ to the expectation.`,
        R`For $k = 2$ (adjacent elements): $6 - 2 = 4$ pairs, each with prob $2/2 = 1 \implies 4 \times 1 = 4$.`,
        R`For $k = 3$: $6 - 3 = 3$ pairs, each with prob $2/3 \implies 3 \times \frac{2}{3} = 2$.`,
        R`For $k = 4$: $6 - 4 = 2$ pairs, each with prob $2/4 = 1/2 \implies 2 \times \frac{1}{2} = 1$.`,
        R`For $k = 5$: $6 - 5 = 1$ pair, with prob $2/5 \implies 1 \times \frac{2}{5} = 0.4$.`,
        R`Summing all terms: $\mathbb{E}[C] = 4 + 2 + 1 + 0.4 = 7.4$ comparisons.`
      ],
      answer: R`$\mathbb{E}[C] = 4 + 2 + 1 + \frac{2}{5} = 7.4$ comparisons.`
    },
    { id: "prob3-5", type: "proof",
      q: R`Prove Jensen’s Inequality: if $g: \mathbb{R} \to \mathbb{R}$ is a convex function and $X$ is an integrable random variable, then $\mathbb{E}[g(X)] \ge g(\mathbb{E}[X])$. Use this to prove that $\mathbb{E}[X^2] \ge (\mathbb{E}[X])^2$ with equality if and only if $\operatorname{Var}(X) = 0$.`,
      hint: R`Use the supporting tangent line property of convex functions: for any $\mu$, there exists a line $L(x) = g(\mu) + c(x - \mu) \le g(x)$.`,
      steps: [
        R`Let $\mu = \mathbb{E}[X]$. Since $g$ is convex, at every point $\mu$ there exists a supporting subgradient line: $g(x) \ge g(\mu) + c(x - \mu)$ for all $x \in \mathbb{R}$, where $c \in \partial g(\mu)$.`,
        R`Substitute the random variable $X$ into this inequality: $g(X) \ge g(\mu) + c(X - \mu)$.`,
        R`Take the expectation of both sides (using monotonicity and linearity of expectation): $\mathbb{E}[g(X)] \ge \mathbb{E}[g(\mu) + c(X - \mu)] = g(\mu) + c(\mathbb{E}[X] - \mu)$.`,
        R`Since $\mathbb{E}[X] = \mu$, the term $c(\mathbb{E}[X] - \mu) = c(0) = 0$.`,
        R`Therefore, $\mathbb{E}[g(X)] \ge g(\mu) = g(\mathbb{E}[X])$.`,
        R`Applying this to $g(x) = x^2$ (which is strictly convex since $g''(x) = 2 > 0$): $\mathbb{E}[X^2] \ge (\mathbb{E}[X])^2$.`,
        R`Equality $\mathbb{E}[X^2] - (\mathbb{E}[X])^2 = \operatorname{Var}(X) = 0$ occurs if and only if $X$ is a constant almost surely.`
      ],
      answer: R`By supporting tangent $g(x) \ge g(\mu) + c(x - \mu)$, taking expectation yields $\mathbb{E}[g(X)] \ge g(\mathbb{E}[X])$. For $g(x) = x^2$, $\mathbb{E}[X^2] \ge (\mathbb{E}[X])^2$, establishing $\operatorname{Var}(X) \ge 0$.`
    },
    { id: "prob3-6", type: "interview",
      q: R`[Google / Microsoft] (The Coupon Collector’s Problem) A cereal company places one of $n$ distinct collectible toy coupons in each cereal box uniformly at random. What is the expected number of boxes of cereal you must buy to collect all $n$ unique coupons? What is its asymptotic value?`,
      hint: R`Let $X_i$ be the number of boxes bought to get the $i$-th new coupon after having collected $i-1$ coupons. $X_i$ is Geometric.` ,
      steps: [
        R`Let $T$ be the total boxes purchased to collect all $n$ coupons. Write $T = \sum_{i=1}^n X_i$, where $X_i$ is the additional boxes needed to find the $i$-th new coupon after having collected $i-1$ distinct coupons.`,
        R`When you already have $i-1$ distinct coupons, the probability that the next box contains an uncollected coupon is $p_i = \frac{n - (i-1)}{n}$.`,
        R`$X_i$ is a Geometric random variable with success parameter $p_i$.`,
        R`The expectation of a Geometric random variable is $\mathbb{E}[X_i] = \frac{1}{p_i} = \frac{n}{n - i + 1}$.`,
        R`By Linearity of Expectation: $\mathbb{E}[T] = \sum_{i=1}^n \mathbb{E}[X_i] = \sum_{i=1}^n \frac{n}{n - i + 1} = n \left(\frac{1}{n} + \frac{1}{n-1} + \dots + \frac{1}{2} + 1\right) = n H_n$, where $H_n$ is the $n$-th harmonic number.`,
        R`Since $H_n = \ln n + \gamma + O(1/n)$ (where Euler's constant $\gamma \approx 0.5772$): $\mathbb{E}[T] = n \ln n + \gamma n + O(1) = \Theta(n \ln n)$.`
      ],
      answer: R`$\mathbb{E}[T] = n H_n = n \sum_{k=1}^n \frac{1}{k} \approx n \ln n + \gamma n$. For $n=50$ coupons, you need about $50 \times (\ln 50 + 0.577) \approx 225$ boxes.`
    }
  ];

  // CHAPTER 4: KEY DISTRIBUTIONS
  P["prob-ch4"] = [
    { id: "prob4-1", type: "concept",
      q: R`What is the memoryless property of probability distributions? Which discrete distribution and which continuous distribution are the unique memoryless distributions?`,
      hint: R`Memoryless means $P(X > s + t \mid X > s) = P(X > t)$ for all $s, t \ge 0$.` ,
      steps: [
        R`The memoryless property states that the remaining waiting time until an event occurs does not depend on how much time has already elapsed: $P(X > s + t \mid X > s) = P(X > t)$.`,
        R`In other words, a component that has survived for $s$ hours is "as good as new" with respect to failing in the next $t$ hours.`,
        R`In discrete probability, the Geometric distribution ($P(X=k) = (1-p)^{k-1}p$) is the UNIQUE memoryless distribution.`,
        R`In continuous probability, the Exponential distribution ($f(x) = \lambda e^{-\lambda x}$) is the UNIQUE memoryless distribution.`
      ],
      answer: R`Memorylessness means $P(X > s+t \mid X > s) = P(X > t)$. The Geometric distribution is the unique discrete memoryless distribution, and the Exponential distribution is the unique continuous memoryless distribution.`
    },
    { id: "prob4-2", type: "concept",
      q: R`Explain the Poisson Limit Theorem: under what conditions does a $\operatorname{Binomial}(n, p)$ distribution converge to a $\operatorname{Poisson}(\lambda)$ distribution? Why is this essential for modeling web server traffic?`,
      hint: R`Take the limit as $n \to \infty$ and $p \to 0$ while the product $np = \lambda$ remains constant.` ,
      steps: [
        R`Let $X_n \sim \operatorname{Binomial}(n, p)$ where $n \to \infty$ and $p \to 0$ such that $np = \lambda$ (constant).`,
        R`$P(X=k) = \binom{n}{k} p^k (1-p)^{n-k} = \frac{n(n-1)\cdots(n-k+1)}{k!} \left(\frac{\lambda}{n}\right)^k \left(1 - \frac{\lambda}{n}\right)^{n-k}$.`,
        R`As $n \to \infty$, $\frac{n(n-1)\cdots(n-k+1)}{n^k} \to 1$, $\left(1 - \frac{\lambda}{n}\right)^n \to e^{-\lambda}$, and $\left(1 - \frac{\lambda}{n}\right)^{-k} \to 1$.`,
        R`Therefore, $P(X=k) \to \frac{\lambda^k e^{-\lambda}}{k!}$, which is the $\operatorname{Poisson}(\lambda)$ PMF.`,
        R`In web server traffic, millions of independent internet users ($n$ very large) each have a tiny probability ($p \ll 1$) of sending an HTTP request in any millisecond; the aggregate request arrival count is cleanly modeled by Poisson.`
      ],
      answer: R`As $n \to \infty$ and $p \to 0$ with $np = \lambda$, $\binom{n}{k}p^k(1-p)^{n-k} \to \frac{\lambda^k e^{-\lambda}}{k!}$. It models server traffic where vast user populations generate rare individual requests.`
    },
    { id: "prob4-3", type: "computation",
      q: R`A cloud API server receives requests following a Poisson process at an average rate of $\lambda = 4$ requests per second. Compute: (a) the probability of receiving exactly zero requests in a 1-second window, and (b) the probability of receiving at least 2 requests in a 1-second window.`,
      hint: R`Use $P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}$ with $\lambda = 4$. For (b), use complement $1 - P(X=0) - P(X=1)$.`,
      steps: [
        R`Part (a): For $k = 0$: $P(X = 0) = \frac{4^0 e^{-4}}{0!} = e^{-4} \approx 0.0183$ ($1.83\%$).`,
        R`Part (b): $P(X \ge 2) = 1 - [P(X=0) + P(X=1)]$.`,
        R`$P(X = 1) = \frac{4^1 e^{-4}}{1!} = 4 e^{-4} \approx 4(0.0183156) = 0.0733$.`,
        R`$P(X \le 1) = e^{-4} + 4e^{-4} = 5e^{-4} \approx 5 \times 0.0183156 = 0.0916$.`,
        R`$P(X \ge 2) = 1 - 0.0916 = 0.9084$ ($90.84\%$).`
      ],
      answer: R`(a) $P(X=0) = e^{-4} \approx 0.0183$ ($1.83\%$); (b) $P(X \ge 2) = 1 - 5e^{-4} \approx 0.9084$ ($90.84\%$).`
    },
    { id: "prob4-4", type: "computation",
      q: R`Network packet transmission latency across a transatlantic link is normally distributed with mean $\mu = 80\text{ ms}$ and standard deviation $\sigma = 10\text{ ms}$. If an interactive gaming SLA requires latency to be under $95\text{ ms}$, what percentage of packets violate the SLA? (Use standard normal $\Phi(1.5) \approx 0.9332$).`,
      hint: R`Compute $z$-score $z = \frac{x - \mu}{\sigma}$ and find $P(Z > z) = 1 - \Phi(z)$.`,
      steps: [
        R`SLA threshold $x = 95\text{ ms}$.`,
        R`Compute $z$-score: $z = \frac{x - \mu}{\sigma} = \frac{95 - 80}{10} = \frac{15}{10} = 1.50$.`,
        R`The probability of complying with the SLA ($X \le 95$) is $P(Z \le 1.50) = \Phi(1.50) = 0.9332$.`,
        R`The percentage violating the SLA ($X > 95$) is $1 - \Phi(1.50) = 1 - 0.9332 = 0.0668 = 6.68\%$.`
      ],
      answer: R`$z = 1.5 \implies P(\text{violation}) = 1 - \Phi(1.5) = 1 - 0.9332 = 0.0668$ ($6.68\%$ of packets violate the SLA).`
    },
    { id: "prob4-5", type: "proof",
      q: R`Prove the memoryless property of the Exponential distribution: for $X \sim \operatorname{Exp}(\lambda)$ with PDF $f(x) = \lambda e^{-\lambda x}$ ($x \ge 0$), prove that $P(X > s + t \mid X > s) = P(X > t)$ for any $s, t \ge 0$.`,
      hint: R`First calculate the survival function $P(X > x) = \int_x^\infty \lambda e^{-\lambda u} du = e^{-\lambda x}$.`,
      steps: [
        R`Step 1: Compute survival function: $P(X > x) = \int_x^\infty \lambda e^{-\lambda u} du = \left[-e^{-\lambda u}\right]_x^\infty = 0 - (-e^{-\lambda x}) = e^{-\lambda x}$.`,
        R`Step 2: By definition of conditional probability: $P(X > s + t \mid X > s) = \frac{P(X > s + t \text{ and } X > s)}{P(X > s)}$.`,
        R`Step 3: Since $s + t \ge s$, the event $\{X > s+t\}$ is a subset of $\{X > s\}$, so $\{X > s+t\} \cap \{X > s\} = \{X > s+t\}$.`,
        R`Step 4: Substitute survival values: $\frac{P(X > s+t)}{P(X > s)} = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = \frac{e^{-\lambda s} e^{-\lambda t}}{e^{-\lambda s}} = e^{-\lambda t}$.`,
        R`Step 5: Notice that $e^{-\lambda t} = P(X > t)$. Thus, $P(X > s+t \mid X > s) = P(X > t)$.`
      ],
      answer: R`$P(X > s+t \mid X > s) = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t} = P(X > t)$. Elapsed waiting time provides zero information about remaining waiting time.`
    },
    { id: "prob4-6", type: "interview",
      q: R`[Goldman Sachs / Bloomberg] An algorithmic order execution system submits market orders. The probability that an individual order executes successfully is $p = 0.05$. (a) What is the expected number of submissions needed until the first successful execution? (b) What is the probability that it takes strictly more than 20 submissions to get the first success?`,
      hint: R`The number of submissions $X$ follows a Geometric distribution with parameter $p = 0.05$. Use $P(X > k) = (1-p)^k$.`,
      steps: [
        R`Let $X \sim \operatorname{Geometric}(p)$ with $p = 0.05$.`,
        R`Part (a): Expected number of trials until first success is $\mathbb{E}[X] = \frac{1}{p} = \frac{1}{0.05} = 20$ submissions.`,
        R`Part (b): $X > 20$ means the first 20 consecutive submissions all failed.`,
        R`$P(X > 20) = (1 - p)^{20} = (0.95)^{20}$.`,
        R`Compute numerical value: $(0.95)^{20} = ((0.95)^{10})^2 \approx (0.5987)^2 \approx 0.3585$ ($35.85\%$).`
      ],
      answer: R`(a) $\mathbb{E}[X] = 1/p = 20$ submissions; (b) $P(X > 20) = (1 - 0.05)^{20} = 0.95^{20} \approx 0.3585$ ($35.85\%$).`
    }
  ];

  // CHAPTER 5: JOINT DISTRIBUTIONS, COVARIANCE & CORRELATION
  P["prob-ch5"] = [
    { id: "prob5-1", type: "concept",
      q: R`Prove that zero covariance ($\operatorname{Cov}(X, Y) = 0$) does NOT imply statistical independence. Give a simple discrete random variable example where $Y$ is completely determined by $X$, yet $\operatorname{Cov}(X,Y) = 0$.`,
      hint: R`Let $X$ be symmetric around 0, and let $Y = X^2$.` ,
      steps: [
        R`Let $X$ take values $\{-1, 0, 1\}$ each with equal probability $1/3$.`,
        R`Then $\mathbb{E}[X] = \frac{-1 + 0 + 1}{3} = 0$.`,
        R`Let $Y = X^2$. Note that $Y$ is completely deterministic given $X$, so $X$ and $Y$ are strongly dependent!`,
        R`The random variable $XY = X \cdot X^2 = X^3$.`,
        R`$X^3$ takes values $(-1)^3 = -1, 0^3 = 0, 1^3 = 1$ with probability $1/3$ each, so $\mathbb{E}[XY] = \mathbb{E}[X^3] = 0$.`,
        R`Now compute covariance: $\operatorname{Cov}(X,Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = 0 - (0)(\mathbb{E}[Y]) = 0$.`,
        R`Thus $\operatorname{Cov}(X,Y) = 0$, yet knowing $X$ completely determines $Y$. Covariance only measures LINEAR dependence!`
      ],
      answer: R`Covariance only measures linear association. If $X \in \{-1, 0, 1\}$ with $P=1/3$ and $Y = X^2$, $\mathbb{E}[X]=0$ and $\mathbb{E}[XY]=\mathbb{E}[X^3]=0 \implies \operatorname{Cov}(X,Y)=0$, despite perfect non-linear dependence.`
    },
    { id: "prob5-2", type: "concept",
      q: R`Explain the geometric and statistical relationship between the sample covariance matrix $\boldsymbol{\Sigma} = \frac{1}{n} \mathbf{X}^T \mathbf{X}$ of centered data and Principal Component Analysis (PCA). Why must $\boldsymbol{\Sigma}$ be symmetric positive semi-definite?`,
      hint: R`Consider the quadratic form $\mathbf{v}^T \boldsymbol{\Sigma} \mathbf{v}$ which represents the variance of the data projected onto vector $\mathbf{v}$.` ,
      steps: [
        R`Let centered data matrix be $\mathbf{X} \in \mathbb{R}^{n \times d}$ (mean $\mathbf{0}$). The sample covariance matrix is $\boldsymbol{\Sigma} = \frac{1}{n}\mathbf{X}^T \mathbf{X} \in \mathbb{R}^{d \times d}$.`,
        R`Symmetry: $\boldsymbol{\Sigma}^T = \frac{1}{n}(\mathbf{X}^T \mathbf{X})^T = \frac{1}{n}\mathbf{X}^T \mathbf{X} = \boldsymbol{\Sigma}$.`,
        R`Positive semi-definiteness: For any vector $\mathbf{v} \in \mathbb{R}^d$, the quadratic form is $\mathbf{v}^T \boldsymbol{\Sigma} \mathbf{v} = \frac{1}{n} \mathbf{v}^T \mathbf{X}^T \mathbf{X} \mathbf{v} = \frac{1}{n} \|\mathbf{X}\mathbf{v}\|_2^2 \ge 0$. Since variance cannot be negative, $\boldsymbol{\Sigma} \succeq 0$.`,
        R`By the Spectral Theorem, $\boldsymbol{\Sigma}$ has orthonormal eigenvectors $\mathbf{u}_1, \dots, \mathbf{u}_d$ with non-negative eigenvalues $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_d \ge 0$.`,
        R`The top eigenvector $\mathbf{u}_1$ is the first principal component—the direction of maximum data variance—and $\lambda_1$ is the variance along that axis.`
      ],
      answer: R`$\mathbf{v}^T \boldsymbol{\Sigma} \mathbf{v} = \frac{1}{n}\|\mathbf{X}\mathbf{v}\|^2 \ge 0$ represents the variance along direction $\mathbf{v}$. The orthogonal eigenvectors of $\boldsymbol{\Sigma}$ are the principal axes of the data ellipsoid in PCA, and eigenvalues represent the variance explained.`
    },
    { id: "prob5-3", type: "computation",
      q: R`A joint distribution of two random variables $X \in \{0, 1\}$ (cache miss) and $Y \in \{1, 2\}$ (latency class) is given by the table: $P(X=0, Y=1) = 0.5$, $P(X=0, Y=2) = 0.2$, $P(X=1, Y=1) = 0.1$, $P(X=1, Y=2) = 0.2$. Compute: (a) the marginal distribution of $X$, (b) $\mathbb{E}[X]$, $\mathbb{E}[Y]$, and (c) $\operatorname{Cov}(X, Y)$.`,
      hint: R`Sum rows to get marginal $P_X(x)$, sum columns for $P_Y(y)$, then find $\mathbb{E}[XY] = \sum x y p(x,y)$.`,
      steps: [
        R`Part (a): Marginals: $P(X=0) = 0.5 + 0.2 = 0.7$, $P(X=1) = 0.1 + 0.2 = 0.3$.`,
        R`$P(Y=1) = 0.5 + 0.1 = 0.6$, $P(Y=2) = 0.2 + 0.2 = 0.4$.`,
        R`Part (b): Expectations: $\mathbb{E}[X] = 0(0.7) + 1(0.3) = 0.3$.`,
        R`$\mathbb{E}[Y] = 1(0.6) + 2(0.4) = 0.6 + 0.8 = 1.4$.`,
        R`Part (c): Expectation of product: $\mathbb{E}[XY] = (0)(1)(0.5) + (0)(2)(0.2) + (1)(1)(0.1) + (1)(2)(0.2) = 0 + 0 + 0.1 + 0.4 = 0.5$.`,
        R`Covariance: $\operatorname{Cov}(X,Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = 0.5 - (0.3)(1.4) = 0.50 - 0.42 = +0.08$.`
      ],
      answer: R`(a) $P(X=0)=0.7, P(X=1)=0.3$; (b) $\mathbb{E}[X]=0.3, \mathbb{E}[Y]=1.4$; (c) $\operatorname{Cov}(X,Y) = +0.08$ (positive correlation: cache misses increase latency).`
    },
    { id: "prob5-4", type: "computation",
      q: R`Let $X$ and $Y$ have variances $\operatorname{Var}(X) = 16$, $\operatorname{Var}(Y) = 25$, and correlation coefficient $\rho = 0.6$. Compute $\operatorname{Var}(3X - 2Y + 4)$.`,
      hint: R`Use $\operatorname{Var}(aX + bY + c) = a^2 \operatorname{Var}(X) + b^2 \operatorname{Var}(Y) + 2ab \operatorname{Cov}(X,Y)$ where $\operatorname{Cov}(X,Y) = \rho \sigma_X \sigma_Y$.`,
      steps: [
        R`Step 1: Standard deviations: $\sigma_X = \sqrt{16} = 4$, $\sigma_Y = \sqrt{25} = 5$.`,
        R`Step 2: Covariance: $\operatorname{Cov}(X,Y) = \rho \sigma_X \sigma_Y = 0.6 \times 4 \times 5 = 12$.`,
        R`Step 3: Variance formula with $a = 3, b = -2, c = 4$:`,
        R`$\operatorname{Var}(3X - 2Y + 4) = 3^2 \operatorname{Var}(X) + (-2)^2 \operatorname{Var}(Y) + 2(3)(-2) \operatorname{Cov}(X,Y) + 0$.`,
        R`$\operatorname{Var} = 9(16) + 4(25) - 12(12) = 144 + 100 - 144 = 100$.`
      ],
      answer: R`$\operatorname{Var}(3X - 2Y + 4) = 100$. (Notice that the covariance term $-144$ cancels $9 \operatorname{Var}(X) = 144$).`
    },
    { id: "prob5-5", type: "proof",
      q: R`Prove using the Cauchy-Schwarz inequality for random variables that the Pearson correlation coefficient $\rho_{X,Y} = \frac{\operatorname{Cov}(X,Y)}{\sigma_X \sigma_Y}$ satisfies $-1 \le \rho_{X,Y} \le 1$, and that $|\rho| = 1$ if and only if $Y = aX + b$ almost surely for some constants $a \ne 0, b$.`,
      hint: R`Define inner product $\langle U, V \rangle = \mathbb{E}[UV]$ for zero-mean variables $U = X - \mu_X, V = Y - \mu_Y$.`,
      steps: [
        R`Let centered variables be $U = X - \mu_X$ and $V = Y - \mu_Y$. Note $\mathbb{E}[U^2] = \sigma_X^2$, $\mathbb{E}[V^2] = \sigma_Y^2$, and $\mathbb{E}[UV] = \operatorname{Cov}(X,Y)$.`,
        R`For any real scalar $t \in \mathbb{R}$, consider the expected square: $Q(t) = \mathbb{E}[(tU + V)^2] \ge 0$.`,
        R`Expanding: $Q(t) = t^2 \mathbb{E}[U^2] + 2t \mathbb{E}[UV] + \mathbb{E}[V^2] = t^2 \sigma_X^2 + 2t \operatorname{Cov}(X,Y) + \sigma_Y^2 \ge 0$.`,
        R`Since this quadratic polynomial in $t$ is non-negative for all $t$, its discriminant must be non-positive: $\Delta = (2\operatorname{Cov}(X,Y))^2 - 4 \sigma_X^2 \sigma_Y^2 \le 0$.`,
        R`$4(\operatorname{Cov}(X,Y))^2 \le 4 \sigma_X^2 \sigma_Y^2 \implies \frac{(\operatorname{Cov}(X,Y))^2}{\sigma_X^2 \sigma_Y^2} \le 1 \implies \rho^2 \le 1 \implies -1 \le \rho \le 1$.`,
        R`Equality $|\rho| = 1 \iff \Delta = 0 \iff$ there exists $t$ such that $\mathbb{E}[(tU + V)^2] = 0 \iff V = -tU$ almost surely $\iff Y - \mu_Y = a(X - \mu_X)$, which is a perfect linear relationship.`
      ],
      answer: R`Non-negativity of $\mathbb{E}[(t(X-\mu_X) + (Y-\mu_Y))^2] \ge 0$ implies discriminant $\Delta = 4\operatorname{Cov}^2 - 4\sigma_X^2\sigma_Y^2 \le 0 \implies \rho^2 \le 1$. Equality occurs if and only if $Y$ is an exact linear function of $X$.`
    },
    { id: "prob5-6", type: "interview",
      q: R`[Uber / DoorDash] Suppose you have $d$ correlated feature variables $\mathbf{x} = (x_1, \dots, x_d)^T$ with known positive definite covariance matrix $\boldsymbol{\Sigma}$. How can you linearly transform $\mathbf{x}$ to produce a new vector $\mathbf{z} = \mathbf{A}\mathbf{x}$ such that the features in $\mathbf{z}$ are completely uncorrelated and each has unit variance ($\operatorname{Cov}(\mathbf{z}) = \mathbf{I}$)? What is this transformation called?`,
      hint: R`Use eigendecomposition $\boldsymbol{\Sigma} = \mathbf{V} \boldsymbol{\Lambda} \mathbf{V}^T$ or Cholesky decomposition $\boldsymbol{\Sigma} = \mathbf{L}\mathbf{L}^T$.` ,
      steps: [
        R`We seek matrix $\mathbf{A}$ such that $\operatorname{Cov}(\mathbf{A}\mathbf{x}) = \mathbf{A} \boldsymbol{\Sigma} \mathbf{A}^T = \mathbf{I}_d$.`,
        R`Method 1 (Eigendecomposition / PCA Whitening): Since $\boldsymbol{\Sigma}$ is symmetric positive definite: $\boldsymbol{\Sigma} = \mathbf{V} \boldsymbol{\Lambda} \mathbf{V}^T$, where $\mathbf{V}$ is orthogonal ($\mathbf{V}^T \mathbf{V} = \mathbf{I}$) and $\boldsymbol{\Lambda} = \operatorname{diag}(\lambda_1, \dots, \lambda_d)$ with all $\lambda_i > 0$.`,
        R`Define $\boldsymbol{\Sigma}^{-1/2} = \mathbf{V} \boldsymbol{\Lambda}^{-1/2} \mathbf{V}^T$, where $\boldsymbol{\Lambda}^{-1/2} = \operatorname{diag}(1/\sqrt{\lambda_1}, \dots, 1/\sqrt{\lambda_d})$.`,
        R`Setting $\mathbf{A} = \boldsymbol{\Lambda}^{-1/2} \mathbf{V}^T$: $\operatorname{Cov}(\mathbf{z}) = (\boldsymbol{\Lambda}^{-1/2}\mathbf{V}^T)(\mathbf{V}\boldsymbol{\Lambda}\mathbf{V}^T)(\mathbf{V}\boldsymbol{\Lambda}^{-1/2}) = \boldsymbol{\Lambda}^{-1/2}\boldsymbol{\Lambda}\boldsymbol{\Lambda}^{-1/2} = \mathbf{I}_d$.`,
        R`This transformation is called "Whitening" or "Sphering" (e.g. PCA Whitening or ZCA Whitening), widely used in image preprocessing and deep learning batch normalization.`
      ],
      answer: R`$\mathbf{z} = \boldsymbol{\Lambda}^{-1/2} \mathbf{V}^T \mathbf{x}$ (PCA Whitening) or $\mathbf{z} = \boldsymbol{\Sigma}^{-1/2}\mathbf{x}$ (ZCA Whitening). It transforms an anisotropic ellipsoid data distribution into a standardized isotropic sphere with identity covariance matrix $\mathbf{I}$.`
    }
  ];

  // CHAPTER 6: LIMIT THEOREMS: LLN & CLT
  P["prob-ch6"] = [
    { id: "prob6-1", type: "concept",
      q: R`Distinguish between the Weak Law of Large Numbers (WLLN) and the Strong Law of Large Numbers (SLLN). What modes of convergence do they establish?`,
      hint: R`WLLN establishes convergence in probability, while SLLN establishes almost sure convergence.` ,
      steps: [
        R`Let $X_1, X_2, \dots$ be i.i.d. with mean $\mu$. Let sample mean be $\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i$.`,
        R`WLLN states that $\bar{X}_n$ converges in probability to $\mu$: for any $\epsilon > 0$, $\lim_{n \to \infty} P(|\bar{X}_n - \mu| \ge \epsilon) = 0$.`,
        R`SLLN states that $\bar{X}_n$ converges almost surely to $\mu$: $P\left(\lim_{n \to \infty} \bar{X}_n = \mu\right) = 1$.`,
        R`The difference: WLLN guarantees that for any specific very large $n$, the probability of a large error is small. SLLN guarantees that the entire sample path trajectory never deviates permanently as $n \to \infty$ with probability 1.`
      ],
      answer: R`WLLN establishes convergence in probability ($\lim P(|\bar{X}_n - \mu| > \epsilon) = 0$). SLLN establishes almost sure convergence ($P(\lim \bar{X}_n = \mu) = 1$), ruling out permanent asymptotic excursions.`
    },
    { id: "prob6-2", type: "concept",
      q: R`Why does the error of Monte Carlo integration and simulation decay as $O(1/\sqrt{N})$, where $N$ is the number of samples? If you want to reduce the standard error by a factor of 10, how many more samples must you generate?`,
      hint: R`Recall that the variance of the sample mean $\bar{X}_N = \frac{1}{N}\sum X_i$ is $\operatorname{Var}(\bar{X}_N) = \frac{\sigma^2}{N}$.`,
      steps: [
        R`Let estimator be $\hat{I}_N = \frac{1}{N}\sum_{i=1}^N f(U_i)$ for i.i.d. random samples $U_i$.`,
        R`The variance of the sum of $N$ independent terms is $\operatorname{Var}(\sum f(U_i)) = N \sigma^2$.`,
        R`The variance of the sample mean is $\operatorname{Var}(\hat{I}_N) = \frac{1}{N^2} \operatorname{Var}\left(\sum_{i=1}^N f(U_i)\right) = \frac{N \sigma^2}{N^2} = \frac{\sigma^2}{N}$.`,
        R`The standard error is the standard deviation: $\operatorname{SE}(\hat{I}_N) = \sqrt{\operatorname{Var}(\hat{I}_N)} = \frac{\sigma}{\sqrt{N}} = O(1/\sqrt{N})$.`,
        R`To reduce the standard error by a factor of $10$, we must decrease $\frac{\sigma}{\sqrt{N}}$ tenfold: $\frac{1}{\sqrt{N_{\text{new}}}} = \frac{1}{10 \sqrt{N}} \implies \sqrt{N_{\text{new}}} = 10 \sqrt{N} \implies N_{\text{new}} = 100 N$.`,
        R`You need $100\times$ as many samples ($10^2 = 100$).`
      ],
      answer: R`$\operatorname{SE} = \sigma / \sqrt{N} = O(1/\sqrt{N})$ because variance scales as $1/N$. Reducing error tenfold requires $10^2 = 100\times$ more samples.`
    },
    { id: "prob6-3", type: "computation",
      q: R`A cloud data center runs batch jobs. Job execution times have mean $\mu = 10\text{ minutes}$ and standard deviation $\sigma = 2\text{ minutes}$. Use Chebyshev’s inequality to find an upper bound on the probability that a randomly chosen job takes 16 minutes or longer, or 4 minutes or shorter.`,
      hint: R`Notice that $|X - 10| \ge 6$. Compute $k = 6 / \sigma = 6 / 2 = 3$, and use $P(|X - \mu| \ge k\sigma) \le \frac{1}{k^2}$.`,
      steps: [
        R`Event: $X \ge 16$ or $X \le 4 \iff |X - 10| \ge 6$.`,
        R`Deviation $\delta = 6\text{ minutes}$. Since $\sigma = 2$, this represents $k = \frac{\delta}{\sigma} = \frac{6}{2} = 3$ standard deviations.`,
        R`Chebyshev's inequality states: $P(|X - \mu| \ge k\sigma) \le \frac{1}{k^2}$.`,
        R`Substituting $k = 3$: $P(|X - 10| \ge 6) \le \frac{1}{3^2} = \frac{1}{9} \approx 0.1111$.`
      ],
      answer: R`$P(|X - 10| \ge 6) \le \frac{1}{3^2} = \frac{1}{9} \approx 11.1\%$. Chebyshev guarantees that at most $11.1\%$ of jobs deviate by 6 minutes or more, without making any normality assumptions.`
    },
    { id: "prob6-4", type: "computation",
      q: R`You roll 100 fair 6-sided dice. Let $S_{100}$ be the sum of all 100 dice. Using the Central Limit Theorem, approximate the probability that the sum $S_{100}$ is between 330 and 370 inclusive. (For a fair die, $\mu = 3.5, \sigma^2 = 35/12 \approx 2.9167$; $\Phi(1.17) \approx 0.8790$).`,
      hint: R`$\mathbb{E}[S_{100}] = 100(3.5) = 350$. $\operatorname{Var}(S_{100}) = 100(35/12) \approx 291.67$. Compute $z$-scores with continuity correction or direct normal approximation.`,
      steps: [
        R`Mean: $\mu_{\text{sum}} = 100 \times 3.5 = 350$.`,
        R`Variance: $\sigma^2_{\text{sum}} = 100 \times \frac{35}{12} = \frac{3500}{12} \approx 291.667$.`,
        R`Standard deviation: $\sigma_{\text{sum}} = \sqrt{291.667} \approx 17.078$.`,
        R`$z$-score for 370: $z = \frac{370 - 350}{17.078} = \frac{20}{17.078} \approx 1.171$.`,
        R`$z$-score for 330: $z = \frac{330 - 350}{17.078} = \frac{-20}{17.078} \approx -1.171$.`,
        R`$P(330 \le S_{100} \le 370) \approx \Phi(1.17) - \Phi(-1.17) = \Phi(1.17) - [1 - \Phi(1.17)] = 2\Phi(1.17) - 1$.`,
        R`$P \approx 2(0.8790) - 1 = 1.7580 - 1 = 0.7580 = 75.8\%$.`
      ],
      answer: R`$z = \pm 1.17 \implies P(330 \le S_{100} \le 370) \approx 2\Phi(1.17) - 1 \approx 0.758$ ($75.8\%$).`
    },
    { id: "prob6-5", type: "proof",
      q: R`Prove Markov’s Inequality: for any non-negative random variable $X \ge 0$ and any positive constant $a > 0$, prove that $P(X \ge a) \le \frac{\mathbb{E}[X]}{a}$. Then show how Chebyshev’s inequality is derived as an immediate corollary.`,
      hint: R`Split the expectation integral/sum into two regions: $\{x < a\}$ and $\{x \ge a\}$.`,
      steps: [
        R`For continuous non-negative $X$ with PDF $f(x)$ (discrete proof is identical with sums):`,
        R`$\mathbb{E}[X] = \int_0^\infty x f(x) dx = \int_0^a x f(x) dx + \int_a^\infty x f(x) dx$.`,
        R`Since $x \ge 0$ and $f(x) \ge 0$, the first integral $\int_0^a x f(x) dx \ge 0$. Therefore: $\mathbb{E}[X] \ge \int_a^\infty x f(x) dx$.`,
        R`On the interval $[a, \infty)$, $x \ge a$. Replacing $x$ with the smaller constant $a$ gives: $\mathbb{E}[X] \ge \int_a^\infty a f(x) dx = a \int_a^\infty f(x) dx = a P(X \ge a)$.`,
        R`Dividing by $a > 0$: $P(X \ge a) \le \frac{\mathbb{E}[X]}{a}$, which proves Markov's inequality.`,
        R`Deriving Chebyshev: Let $Y = (X - \mu)^2$. Notice $Y \ge 0$ and $\mathbb{E}[Y] = \operatorname{Var}(X) = \sigma^2$.`,
        R`Apply Markov to $Y$ with threshold $a = k^2 \sigma^2$: $P(|X - \mu| \ge k\sigma) = P((X - \mu)^2 \ge k^2 \sigma^2) \le \frac{\mathbb{E}[(X - \mu)^2]}{k^2 \sigma^2} = \frac{\sigma^2}{k^2 \sigma^2} = \frac{1}{k^2}$.`
      ],
      answer: R`$\mathbb{E}[X] \ge \int_a^\infty x f(x) dx \ge a \int_a^\infty f(x) dx = a P(X \ge a)$. Applying Markov to $(X-\mu)^2$ with threshold $k^2\sigma^2$ directly yields Chebyshev's $P(|X-\mu| \ge k\sigma) \le 1/k^2$.`
    },
    { id: "prob6-6", type: "interview",
      q: R`[Two Sigma / Citadel] (Reservoir Sampling) You are streaming an infinite sequence of data packets $x_1, x_2, \dots$ one by one. You do not know the total length $n$ in advance. You can store only ONE element in memory. Algorithm: For the 1st element, store it. For the $k$-th element ($k \ge 2$), replace your stored element with $x_k$ with probability $1/k$, otherwise keep the existing element. Prove by induction that after seeing $n$ items, every item has been chosen with probability exactly $1/n$.`,
      hint: R`Base case $n=1$. Induction hypothesis: after step $n-1$, each item has probability $1/(n-1)$. At step $n$, element $n$ is chosen with prob $1/n$; previous elements survive with prob $(1 - 1/n)$.`,
      steps: [
        R`Base Case ($n = 1$): Element $x_1$ is stored with probability $1 = 1/1$. Holds trivially.`,
        R`Inductive Hypothesis: Assume that after processing $n-1$ items, each item $x_i$ ($1 \le i \le n-1$) is held in the reservoir with probability $\frac{1}{n-1}$.`,
        R`Inductive Step: Now item $x_n$ arrives.`,
        R`For item $x_n$: The algorithm explicitly selects $x_n$ to replace the stored item with probability $\frac{1}{n}$. Thus $P(\text{holding } x_n) = \frac{1}{n}$.`,
        R`For any previous item $x_i$ ($1 \le i \le n-1$): To be in memory after step $n$, two independent conditions must hold: (1) it must have been in memory at step $n-1$ (prob $\frac{1}{n-1}$ by hypothesis), AND (2) it must not be replaced by $x_n$ at step $n$ (prob $1 - \frac{1}{n} = \frac{n-1}{n}$).`,
        R`$P(\text{holding } x_i \text{ at step } n) = P(\text{held at } n-1) \times P(\text{not replaced}) = \frac{1}{n-1} \times \frac{n-1}{n} = \frac{1}{n}$.`,
        R`Hence, every item in $\{x_1, \dots, x_n\}$ is currently held with probability exactly $\frac{1}{n}$.`
      ],
      answer: R`By induction: $x_n$ is picked with probability $1/n$. Any prior element $x_i$ survives with probability $\frac{1}{n-1} \times \left(1 - \frac{1}{n}\right) = \frac{1}{n-1} \times \frac{n-1}{n} = \frac{1}{n}$. Every stream element has equal $1/n$ probability in $O(1)$ space!`
    }
  ];

  // CHAPTER 7: ESTIMATION: MLE & MAP
  P["prob-ch7"] = [
    { id: "prob7-1", type: "concept",
      q: R`Explain why minimizing the Cross-Entropy loss in neural network classification is mathematically identical to maximizing the likelihood of a categorical distribution (MLE).`,
      hint: R`Write out the log-likelihood of categorical targets $\mathbf{y}_i$ given predicted probabilities $\mathbf{p}_i$.` ,
      steps: [
        R`In classification with $C$ classes, each label is a one-hot vector $\mathbf{y} \in \{0, 1\}^C$ where $\sum_{c=1}^C y_c = 1$.`,
        R`The model outputs a probability distribution $\mathbf{p} = \operatorname{softmax}(\mathbf{z})$, so $P(Y = c \mid \mathbf{x}) = p_c$.`,
        R`The likelihood of observing label $\mathbf{y}$ for a single sample is modeled by the categorical (generalized Bernoulli) distribution: $L(\boldsymbol{\theta}) = \prod_{c=1}^C p_c^{y_c}$.`,
        R`For $N$ i.i.d. training samples, total likelihood is $L(\boldsymbol{\theta}) = \prod_{i=1}^N \prod_{c=1}^C p_{ic}^{y_{ic}}$.`,
        R`Taking the natural logarithm yields the log-likelihood: $\ell(\boldsymbol{\theta}) = \sum_{i=1}^N \sum_{c=1}^C y_{ic} \ln p_{ic}$.`,
        R`Maximizing $\ell(\boldsymbol{\theta})$ is equivalent to minimizing $-\ell(\boldsymbol{\theta}) = -\sum_{i=1}^N \sum_{c=1}^C y_{ic} \ln p_{ic}$, which is precisely the Multi-Class Cross-Entropy loss!`
      ],
      answer: R`Maximizing $\ell(\boldsymbol{\theta}) = \sum_i \sum_c y_{ic} \ln p_{ic}$ is identical to minimizing the negative log-likelihood $\mathcal{L}_{\text{CE}} = -\sum_i \sum_c y_{ic} \ln p_{ic}$. Cross-entropy loss IS the negative log-likelihood under a categorical distribution.`
    },
    { id: "prob7-2", type: "concept",
      q: R`What is the fundamental difference between Maximum Likelihood Estimation (MLE) and Maximum A Posteriori (MAP) estimation? Show that MAP with a Gaussian prior is equivalent to $L_2$ weight regularization (Ridge).`,
      hint: R`MAP maximizes $\ln P(\mathcal{D}|\theta) + \ln P(\theta)$. Substitute prior $P(\theta) \sim \mathcal{N}(0, \sigma_0^2)$.`,
      steps: [
        R`MLE treats parameters $\theta$ as unknown fixed constants and maximizes the likelihood of observed data: $\hat{\theta}_{\text{MLE}} = \arg\max_\theta \ln P(\mathcal{D} \mid \theta)$.`,
        R`MAP treats $\theta$ as a random variable with a prior distribution $P(\theta)$: $\hat{\theta}_{\text{MAP}} = \arg\max_\theta [\ln P(\mathcal{D} \mid \theta) + \ln P(\theta)]$.`,
        R`Assume a zero-mean Gaussian prior on weights: $P(\theta) = \prod_j \frac{1}{\sqrt{2\pi}\sigma_0} \exp\left(-\frac{\theta_j^2}{2\sigma_0^2}\right)$.`,
        R`Taking the log-prior: $\ln P(\theta) = -\sum_j \frac{\theta_j^2}{2\sigma_0^2} + \text{const} = -\frac{1}{2\sigma_0^2} \|\theta\|_2^2 + \text{const}$.`,
        R`The MAP objective becomes: $\arg\max_\theta [\ln P(\mathcal{D} \mid \theta) - \lambda \|\theta\|_2^2]$ where $\lambda = \frac{1}{2\sigma_0^2}$.`,
        R`Minimizing the negative objective yields $\arg\min_\theta [\text{Loss}(\theta) + \lambda \|\theta\|_2^2]$, which is exactly $L_2$ regularization!`
      ],
      answer: R`MLE maximizes data likelihood alone; MAP incorporates a Bayesian prior. A Gaussian prior $\mathcal{N}(0, \sigma_0^2)$ penalizes $-\frac{\|\theta\|_2^2}{2\sigma_0^2}$, which mathematically reproduces $L_2$ weight decay.`
    },
    { id: "prob7-3", type: "computation",
      q: R`Given $n$ independent packet inter-arrival times $t_1, t_2, \dots, t_n$ sampled from an Exponential distribution $f(t; \lambda) = \lambda e^{-\lambda t}$ ($t \ge 0$). Derive the Maximum Likelihood Estimator (MLE) $\hat{\lambda}_{\text{MLE}}$ in terms of the sample mean $\bar{t} = \frac{1}{n}\sum_{i=1}^n t_i$.`,
      hint: R`Write likelihood $L(\lambda) = \prod \lambda e^{-\lambda t_i}$, take log, and set $\frac{d\ell}{d\lambda} = 0$.`,
      steps: [
        R`Likelihood function: $L(\lambda) = \prod_{i=1}^n \lambda e^{-\lambda t_i} = \lambda^n \exp\left(-\lambda \sum_{i=1}^n t_i\right)$.`,
        R`Log-likelihood function: $\ell(\lambda) = \ln L(\lambda) = n \ln \lambda - \lambda \sum_{i=1}^n t_i$.`,
        R`Compute first derivative with respect to $\lambda$: $\frac{d\ell}{d\lambda} = \frac{n}{\lambda} - \sum_{i=1}^n t_i$.`,
        R`Set derivative to zero: $\frac{n}{\hat{\lambda}} - \sum_{i=1}^n t_i = 0 \implies \frac{n}{\hat{\lambda}} = \sum_{i=1}^n t_i$.`,
        R`Solving for $\hat{\lambda}$: $\hat{\lambda}_{\text{MLE}} = \frac{n}{\sum_{i=1}^n t_i} = \frac{1}{\bar{t}}$.`,
        R`Check second derivative: $\frac{d^2 \ell}{d\lambda^2} = -\frac{n}{\lambda^2} < 0$ for all $\lambda > 0$, confirming a global maximum.`
      ],
      answer: R`$\hat{\lambda}_{\text{MLE}} = \frac{1}{\bar{t}}$ (the reciprocal of the sample mean inter-arrival time).`
    },
    { id: "prob7-4", type: "computation",
      q: R`In a load test of a microservice, 100 benchmark queries are measured. The sample mean latency is $\bar{x} = 45\text{ ms}$ and the sample standard deviation is $s = 10\text{ ms}$. Compute the $95\%$ confidence interval for the true population mean latency. (Use standard normal $z_{0.025} = 1.96$).`,
      hint: R`Use $\text{CI} = \bar{x} \pm z \frac{s}{\sqrt{n}}$ with $n = 100$.`,
      steps: [
        R`Sample size $n = 100 \implies \sqrt{n} = 10$.`,
        R`Sample mean $\bar{x} = 45\text{ ms}$; sample standard deviation $s = 10\text{ ms}$.`,
        R`Standard error of the mean: $\operatorname{SE} = \frac{s}{\sqrt{n}} = \frac{10}{10} = 1.0\text{ ms}$.`,
        R`Margin of error for $95\%$ confidence: $ME = z_{0.025} \times \operatorname{SE} = 1.96 \times 1.0 = 1.96\text{ ms}$.`,
        R`Confidence interval: $\bar{x} \pm ME = 45 \pm 1.96 = [43.04, 46.96]\text{ ms}$.`
      ],
      answer: R`$95\% \text{ CI} = [43.04\text{ ms}, 46.96\text{ ms}]$ ($45 \pm 1.96\text{ ms}$).`
    },
    { id: "prob7-5", type: "proof",
      q: R`Prove that the sample variance $S^2 = \frac{1}{n-1}\sum_{i=1}^n (X_i - \bar{X})^2$ is an unbiased estimator of the population variance $\sigma^2$ ($\mathbb{E}[S^2] = \sigma^2$), whereas the naive estimator $\hat{\sigma}^2_{\text{naive}} = \frac{1}{n}\sum_{i=1}^n (X_i - \bar{X})^2$ has expectation $\frac{n-1}{n}\sigma^2$. (This is Bessel’s correction).`,
      hint: R`Expand $\sum (X_i - \bar{X})^2 = \sum (X_i - \mu)^2 - n(\bar{X} - \mu)^2$, then take expectation.` ,
      steps: [
        R`Write: $X_i - \bar{X} = (X_i - \mu) - (\bar{X} - \mu)$.`,
        R`Square and sum: $\sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n (X_i - \mu)^2 - 2(\bar{X} - \mu)\sum_{i=1}^n (X_i - \mu) + \sum_{i=1}^n (\bar{X} - \mu)^2$.`,
        R`Since $\sum (X_i - \mu) = n(\bar{X} - \mu)$, the cross term is $-2n(\bar{X} - \mu)^2$.`,
        R`Thus: $\sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n (X_i - \mu)^2 - n(\bar{X} - \mu)^2$.`,
        R`Take expectation: $\mathbb{E}\left[\sum_{i=1}^n (X_i - \bar{X})^2\right] = \sum_{i=1}^n \mathbb{E}[(X_i - \mu)^2] - n\mathbb{E}[(\bar{X} - \mu)^2] = n\sigma^2 - n \operatorname{Var}(\bar{X})$.`,
        R`Since $\operatorname{Var}(\bar{X}) = \frac{\sigma^2}{n}$, we get: $n\sigma^2 - n\left(\frac{\sigma^2}{n}\right) = n\sigma^2 - \sigma^2 = (n-1)\sigma^2$.`,
        R`Dividing by $n$: $\mathbb{E}[\hat{\sigma}^2_{\text{naive}}] = \frac{n-1}{n}\sigma^2$ (underestimates variance).`,
        R`Dividing by $n-1$: $\mathbb{E}[S^2] = \frac{(n-1)\sigma^2}{n-1} = \sigma^2$, proving unbiasedness.`
      ],
      answer: R`$\mathbb{E}[\sum (X_i - \bar{X})^2] = (n-1)\sigma^2$ because estimating the sample mean $\bar{X}$ consumes one degree of freedom. Dividing by $n-1$ (Bessel's correction) makes $S^2$ unbiased.`
    },
    { id: "prob7-6", type: "interview",
      q: R`[Netflix / Spotify] You are estimating the Click-Through Rate (CTR) $p$ of a new thumbnail algorithm. You observe $k = 0$ clicks out of $n = 100$ impressions. MLE gives $\hat{p}_{\text{MLE}} = 0/100 = 0$, which is disastrous for exploration. Show how MAP with a $\operatorname{Beta}(\alpha=2, \beta=20)$ prior (Laplace/Bayesian smoothing) provides a sensible non-zero estimate.`,
      hint: R`The posterior of a Beta prior with Binomial likelihood is $\operatorname{Beta}(\alpha + k, \beta + n - k)$. Posterior mode is $\frac{\alpha + k - 1}{\alpha + \beta + n - 2}$; posterior mean is $\frac{\alpha + k}{\alpha + \beta + n}$.`,
      steps: [
        R`Likelihood is Binomial: $L(p) \propto p^k (1-p)^{n-k} = p^0 (1-p)^{100}$. MLE gives $\hat{p} = 0$.`,
        R`Prior distribution is $P(p) \sim \operatorname{Beta}(\alpha, \beta) \propto p^{\alpha - 1} (1-p)^{\beta - 1}$. Here $\alpha = 2, \beta = 20$.`,
        R`Posterior distribution by Bayes' Rule: $P(p \mid k, n) \propto p^{\alpha + k - 1} (1-p)^{\beta + n - k - 1} = \operatorname{Beta}(\alpha + k, \beta + n - k)$.`,
        R`Updated parameters: $\alpha' = 2 + 0 = 2$, $\beta' = 20 + 100 - 0 = 120$.`,
        R`Posterior mean estimator: $\mathbb{E}[p \mid \mathcal{D}] = \frac{\alpha'}{\alpha' + \beta'} = \frac{2}{2 + 120} = \frac{2}{122} \approx 0.0164$ ($1.64\%$).`,
        R`Posterior mode (MAP): $\hat{p}_{\text{MAP}} = \frac{\alpha + k - 1}{\alpha + \beta + n - 2} = \frac{2 + 0 - 1}{2 + 20 + 100 - 2} = \frac{1}{120} \approx 0.0083$ ($0.83\%$).`,
        R`Bayesian smoothing prevents zero-probability traps and preserves exploration in bandit algorithms.`
      ],
      answer: R`Posterior mean $\hat{p} = \frac{\alpha + k}{\alpha + \beta + n} = \frac{2}{122} \approx 1.64\%$. Bayesian MAP smoothing prevents catastrophic zero-probabilities when sample sizes are small.`
    }
  ];

  // CHAPTER 8: HYPOTHESIS TESTING & A/B TESTING
  P["prob-ch8"] = [
    { id: "prob8-1", type: "concept",
      q: R`In an A/B test, define Type I error ($\alpha$), Type II error ($\beta$), and Statistical Power ($1 - \beta$). Why is a $p$-value NOT "the probability that the null hypothesis is true"?`,
      hint: R`$p$-value is $P(\text{data as or more extreme} \mid H_0)$, not $P(H_0 \mid \text{data})$.` ,
      steps: [
        R`Type I error ($\alpha$): Rejecting the null hypothesis $H_0$ when $H_0$ is actually true (False Positive, e.g. shipping a feature that actually has zero true effect).`,
        R`Type II error ($\beta$): Failing to reject $H_0$ when the alternative hypothesis $H_1$ is true (False Negative, e.g. discarding an improved algorithm because noise masked the gain).`,
        R`Statistical Power ($1 - \beta$): The probability of correctly rejecting $H_0$ when an effect genuinely exists (typically targeted at $80\%$ or $90\%$).`,
        R`The $p$-value is defined as $P(\text{observing a test statistic as extreme or more extreme} \mid H_0 \text{ is true})$.`,
        R`It is a conditional probability given $H_0$. It is NOT $P(H_0 \mid \text{data})$ because computing $P(H_0 \mid \text{data})$ would require Bayes' Rule with an explicit prior probability $P(H_0)$.`
      ],
      answer: R`Type I error ($\alpha$) is a false positive; Type II error ($\beta$) is a false negative; Power ($1-\beta$) is true detection rate. The $p$-value is $P(\text{extreme data} \mid H_0)$, NOT $P(H_0 \mid \text{data})$ (confusing them is the transposed conditional fallacy).`
    },
    { id: "prob8-2", type: "concept",
      q: R`What is the “peeking problem” (continuous monitoring) in web A/B testing? How does repeatedly checking $p$-values every hour until $p < 0.05$ invalidate the experiment?`,
      hint: R`Consider the random walk of the test statistic over time and the probability of crossing the boundary at ANY time step.` ,
      steps: [
        R`Standard hypothesis testing assumes a fixed sample size $N$ fixed before the experiment begins, with a single evaluation at the end.`,
        R`If an engineer inspects the dashboard repeatedly (e.g. 50 times during the run) and stops as soon as $p < 0.05$, they are testing multiple dependent hypotheses: $P(\exists t \le T : p_t < 0.05 \mid H_0)$.`,
        R`Under $H_0$, the cumulative $z$-statistic performs a random walk. By the law of the iterated logarithm, a random walk will cross any finite boundary with high probability if given enough observation opportunities.`,
        R`As a result, the true false positive rate inflates from the intended $5\%$ to $30\%$ or higher!`,
        R`Tech companies solve this using Sequential Testing (e.g. mSPRT - mixture Sequential Probability Ratio Test) or False Discovery Rate corrections.`
      ],
      answer: R`Repeatedly checking for $p < 0.05$ creates an optional stopping problem. The random walk of the test statistic under $H_0$ will cross the significance boundary by chance, inflating the true false positive rate from $5\%$ up to $>30\%$.`
    },
    { id: "prob8-3", type: "computation",
      q: R`An e-commerce site runs an A/B test on checkout flow. Control variant $A$ has $n_A = 10,000$ visitors and $x_A = 400$ conversions ($4.0\%$). Treatment variant $B$ has $n_B = 10,000$ visitors and $x_B = 470$ conversions ($4.7\%$). Compute the pooled proportion $\hat{p}$, the two-sample $z$-statistic, and determine whether the lift is statistically significant at $\alpha = 0.05$ (two-tailed critical value $z_{\text{crit}} = 1.96$).`,
      hint: R`Pooled $\hat{p} = \frac{x_A + x_B}{n_A + n_B}$. Standard error $\operatorname{SE} = \sqrt{\hat{p}(1-\hat{p})(1/n_A + 1/n_B)}$. $z = \frac{\hat{p}_B - \hat{p}_A}{\operatorname{SE}}$.`,
      steps: [
        R`Observed conversion rates: $\hat{p}_A = \frac{400}{10000} = 0.040$, $\hat{p}_B = \frac{470}{10000} = 0.047$. Difference $\Delta = 0.007$.`,
        R`Pooled proportion: $\hat{p} = \frac{400 + 470}{10000 + 10000} = \frac{870}{20000} = 0.0435$.`,
        R`$1 - \hat{p} = 0.9565$.`,
        R`Standard error: $\operatorname{SE} = \sqrt{0.0435 \times 0.9565 \times \left(\frac{1}{10000} + \frac{1}{10000}\right)} = \sqrt{0.041608 \times 0.0002} = \sqrt{8.3216 \times 10^{-6}} \approx 0.0028847$.`,
        R`Compute $z$-statistic: $z = \frac{0.047 - 0.040}{0.0028847} = \frac{0.007}{0.0028847} \approx 2.4266$.`,
        R`Compare to critical value: $|z| = 2.43 > 1.96$. Two-tailed $p$-value is $2(1 - \Phi(2.43)) \approx 2(0.0075) = 0.015 < 0.05$.`,
        R`Conclusion: Reject the null hypothesis. The conversion lift is statistically significant at $\alpha = 0.05$.`
      ],
      answer: R`Pooled $\hat{p} = 0.0435$, $z = 2.43$, $p \approx 0.015$. Since $|z| > 1.96$ ($p < 0.05$), the lift is statistically significant.`
    },
    { id: "prob8-4", type: "computation",
      q: R`A machine learning platform tracks 20 different operational metrics simultaneously in an A/B test (e.g. latency, memory, crash rate, CTR, scroll depth). If each metric is tested at individual significance level $\alpha = 0.05$ and all null hypotheses are true, what is the Family-Wise Error Rate (probability of at least one false positive alarm)? What should the Bonferroni-corrected threshold $\alpha'$ be?`,
      hint: R`$FWER = 1 - (1 - \alpha)^m$ assuming independence. Bonferroni threshold is $\alpha / m$.`,
      steps: [
        R`Number of hypotheses $m = 20$, individual significance level $\alpha = 0.05$.`,
        R`Probability that a single metric does NOT trigger a false alarm: $1 - \alpha = 0.95$.`,
        R`Under independence, probability that NONE of the 20 metrics trigger a false alarm: $(0.95)^{20} \approx 0.3585$.`,
        R`Family-Wise Error Rate (FWER): $P(\text{at least one false alarm}) = 1 - (0.95)^{20} = 1 - 0.3585 = 0.6415 \approx 64.2\%$.`,
        R`There is a $64.2\%$ chance of reporting a false discovery without correction!`,
        R`To control FWER at $\le 0.05$, the Bonferroni correction sets the per-metric threshold to: $\alpha' = \frac{\alpha}{m} = \frac{0.05}{20} = 0.0025$.`
      ],
      answer: R`Uncorrected FWER $= 1 - (0.95)^{20} \approx 64.2\%$. The Bonferroni-corrected threshold is $\alpha' = 0.05 / 20 = 0.0025$.`
    },
    { id: "prob8-5", type: "proof",
      q: R`Derive the sample size formula for an A/B test comparing two proportions with equal sample sizes $n_A = n_B = n$: show that for significance level $\alpha$ (two-sided critical value $z_{\alpha/2}$) and power $1 - \beta$ (one-sided critical value $z_\beta$), the required sample size per variant is $n \approx \frac{2(z_{\alpha/2} + z_\beta)^2 \bar{p}(1-\bar{p})}{\Delta^2}$, where $\Delta = p_B - p_A$ is the Minimum Detectable Effect.`,
      hint: R`Set the difference in means $\Delta$ equal to the distance required to satisfy both the null rejection boundary and the alternative power threshold: $\Delta = (z_{\alpha/2} + z_\beta) \operatorname{SE}$.`,
      steps: [
        R`Let $\Delta = p_B - p_A$ be the true effect size. Under $H_0: \Delta = 0$, the decision boundary for rejection at level $\alpha$ is at $\text{threshold} = z_{\alpha/2} \sigma_{\Delta}$.`,
        R`Under $H_1: \Delta \ne 0$, to achieve statistical power $1 - \beta$, the mean of the test statistic distribution must lie $z_\beta$ standard errors past the rejection threshold.`,
        R`Therefore, the total distance $\Delta$ must bridge both margins: $\Delta = (z_{\alpha/2} + z_\beta) \sigma_{\Delta}$.`,
        R`The standard error of the difference of two independent proportions with sample size $n$ each is $\sigma_{\Delta} = \sqrt{\frac{p_A(1-p_A)}{n} + \frac{p_B(1-p_B)}{n}} \approx \sqrt{\frac{2\bar{p}(1-\bar{p})}{n}}$.`,
        R`Substitute $\sigma_{\Delta}$ into the equation: $\Delta = (z_{\alpha/2} + z_\beta) \sqrt{\frac{2\bar{p}(1-\bar{p})}{n}}$.`,
        R`Square both sides: $\Delta^2 = (z_{\alpha/2} + z_\beta)^2 \frac{2\bar{p}(1-\bar{p})}{n}$.`,
        R`Solve for $n$: $n = \frac{2(z_{\alpha/2} + z_\beta)^2 \bar{p}(1-\bar{p})}{\Delta^2}$. For $\alpha=0.05, 1-\beta=0.80$, $(1.96 + 0.84)^2 \approx 7.84$, yielding the rule of thumb $n \approx 16 \frac{\bar{p}(1-\bar{p})}{\Delta^2}$.`
      ],
      answer: R`$n \approx \frac{2(z_{\alpha/2} + z_\beta)^2 \bar{p}(1-\bar{p})}{\Delta^2}$. For standard $\alpha=0.05$ and $80\%$ power, $(z_{0.025} + z_{0.20})^2 \approx 7.84 \implies n \approx 16 \frac{\bar{p}(1-\bar{p})}{\Delta^2}$.`
    },
    { id: "prob8-6", type: "interview",
      q: R`[Google / Meta / Airbnb] You launch an A/B test. Variant A (control) has 1,000,000 users and conversion $2.000\%$. Variant B (new ranking model) has 1,000,000 users and conversion $2.015\%$. The $p$-value is $0.008 < 0.01$. The VP of Product says: “The $p$-value is tiny, so this feature has a massive impact! Ship it immediately!” As the Lead Data Scientist / ML Engineer, how do you respond? What distinction must you explain?`,
      hint: R`Distinguish between statistical significance and practical/clinical significance.` ,
      steps: [
        R`Step 1: Clarify the distinction between Statistical Significance and Practical Significance.`,
        R`Step 2: Explain why the $p$-value is small: with a colossal sample size of $N = 1,000,000$ per variant, standard error $\operatorname{SE} = \sqrt{\frac{2(0.02)(0.98)}{1,000,000}} \approx 0.000198$. Even a microscopic difference $\Delta = 0.00015$ ($0.015\%$ absolute lift) yields $z = \frac{0.00015}{0.000198} \approx 0.76$ (or with slightly higher pooled stats, $p < 0.01$).`,
        R`Step 3: Point out that the relative lift is only $\frac{2.015 - 2.000}{2.000} = +0.75\%$.`,
        R`Step 4: Business tradeoff analysis: If the new ranking model consumes $30\%$ more GPU compute cluster resources, adds 40ms of latency, or introduces high code maintenance overhead, the monetary cost of running the model far exceeds the tiny revenue gain from a $0.015\%$ conversion bump!`,
        R`Step 5: Recommendation: Compute the $95\%$ Confidence Interval of the economic revenue impact vs compute infrastructure cost, rather than relying on a $p$-value.`
      ],
      answer: R`Explain that Statistical Significance $\ne$ Practical Significance. With $N=10^6$, tests detect trivial effects with tiny $p$-values. The $0.015\%$ lift must be evaluated against server GPU costs, latency overhead, and engineering maintenance before shipping.`
    }
  ];

})();
