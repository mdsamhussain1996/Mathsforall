/* ============================================================
   Maths for All — Practice problem bank (edit me!)
   ------------------------------------------------------------
   One array per chapter, keyed by the data-practice="…" value
   used in the page. See the header of js/practice.js for the
   full format. Tips:
     • Write maths with $…$ — thanks to String.raw (the R`…` tags)
       you only need ONE backslash:  R`$\frac{a}{b}$`
     • Order = difficulty (first easiest, fifth hardest).
     • type: "concept" | "computation" | "interview"
     • Keep ids unique; they are the keys of the saved progress.
   ============================================================ */
window.PRACTICE_DATA = window.PRACTICE_DATA || {};
(function (P) {
  var R = String.raw;

  /* ───────────────────────── DISCRETE MATHS ───────────────────────── */

  P["dm-ch1"] = [
    { id: "dm1-1", type: "concept",
      q: R`Is the statement $p \to q$ true or false when $p$ is <em>false</em> and $q$ is <em>true</em>? What about when both are false?`,
      hint: R`$p \to q$ only makes a promise when $p$ is true.`,
      steps: [R`$p \to q \equiv \neg p \lor q$.`, R`$p=F,\ q=T$: $\neg p = T$, so the disjunction is true.`, R`$p=F,\ q=F$: $\neg p = T$, so again true.`],
      answer: R`True in both cases (a <em>vacuous truth</em>).` },
    { id: "dm1-2", type: "concept",
      q: R`Negate: “Every student passed <em>some</em> exam.” Write it as $\forall s\, \exists e\, P(s,e)$, then push the negation inside.`,
      hint: R`Each time $\neg$ crosses a quantifier, $\forall \leftrightarrow \exists$.`,
      steps: [R`$\neg\,\forall s\, \exists e\, P(s,e)$`, R`$\equiv \exists s\, \neg\,\exists e\, P(s,e)$`, R`$\equiv \exists s\, \forall e\, \neg P(s,e)$`],
      answer: R`$\exists s\, \forall e\, \neg P(s,e)$: some student failed <em>every</em> exam.` },
    { id: "dm1-3", type: "computation",
      q: R`For how many of the 8 assignments to $(p,q,r)$ is $(p \lor q) \land \neg r$ true?`,
      hint: R`$\neg r$ must be true, so $r$ is forced. Then count the ways $p \lor q$ holds.`,
      steps: [R`$\neg r$ true $\Rightarrow r = F$.`, R`Remaining pairs $(p,q)$: TT, TF, FT, FF — the disjunction fails only for FF.`, R`So $3$ pairs work, with $r=F$ fixed.`],
      answer: R`3 assignments.` },
    { id: "dm1-4", type: "computation",
      q: R`Use the formula $\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$ to compute $1^2+2^2+\dots+10^2$, then show the inductive step proving the formula.`,
      hint: R`In the inductive step, add $(n+1)^2$ to both sides.`,
      steps: [R`$n=10$: $\frac{10 \cdot 11 \cdot 21}{6} = \frac{2310}{6} = 385$.`, R`Base: $n=1$: $\frac{1\cdot2\cdot3}{6}=1$ ✓.`, R`Assume true for $n$. Then $\sum_{k=1}^{n+1} k^2 = \frac{n(n+1)(2n+1)}{6} + (n+1)^2 = \frac{(n+1)\,[\,n(2n+1) + 6(n+1)\,]}{6}$.`, R`$n(2n+1)+6(n+1) = 2n^2+7n+6 = (n+2)(2n+3)$, giving $\frac{(n+1)(n+2)(2n+3)}{6}$ — the formula at $n+1$ ✓.`],
      answer: R`$385$.` },
    { id: "dm1-5", type: "interview",
      q: R`<strong>Knights &amp; Knaves (classic interview puzzle).</strong> Knights always tell the truth, knaves always lie. Ann says: “We are both knaves.” What are Ann and Bob?`,
      hint: R`Assume Ann is a knight and look for a contradiction.`,
      steps: [R`Suppose Ann is a knight. Then her statement is true, so she is a knave — contradiction.`, R`So Ann is a knave and her statement is false.`, R`“Both are knaves” false, with Ann a knave, forces Bob <em>not</em> to be a knave.`],
      answer: R`Ann is a knave, Bob is a knight.` }
  ];

  P["dm-ch2"] = [
    { id: "dm2-1", type: "concept",
      q: R`Is “$\le$” on the integers an equivalence relation? Check reflexive, symmetric and transitive.`,
      hint: R`Is $3 \le 5$ the same as $5 \le 3$?`,
      steps: [R`Reflexive: $a \le a$ ✓.`, R`Transitive: $a \le b,\ b \le c \Rightarrow a \le c$ ✓.`, R`Symmetric: $3 \le 5$ but $5 \not\le 3$ ✗.`],
      answer: R`No — it is a <em>partial (total) order</em>, not an equivalence relation.` },
    { id: "dm2-2", type: "concept",
      q: R`Is $f:\mathbb{R}\to\mathbb{R},\ f(x)=x^2$ injective? Surjective?`,
      hint: R`Try $x=2$ and $x=-2$; then ask whether $-1$ is ever an output.`,
      steps: [R`$f(2)=f(-2)=4$ with $2\ne -2$, so not injective.`, R`$x^2 \ge 0$ so $-1$ is never hit: not surjective.`],
      answer: R`Neither injective nor surjective.` },
    { id: "dm2-3", type: "computation",
      q: R`In a class of 60, 30 take CS, 25 take Maths and 10 take both. How many take neither?`,
      hint: R`Inclusion–exclusion: $|A\cup B| = |A|+|B|-|A\cap B|$.`,
      steps: [R`$|A \cup B| = 30 + 25 - 10 = 45$.`, R`Neither $= 60 - 45 = 15$.`],
      answer: R`15 students.` },
    { id: "dm2-4", type: "computation",
      q: R`How many <em>reflexive</em> relations exist on a 3-element set?`,
      hint: R`A relation is a subset of $A\times A$ (9 ordered pairs). Some pairs are forced.`,
      steps: [R`$|A \times A| = 9$.`, R`Reflexivity forces the 3 diagonal pairs $(a,a)$ to be present.`, R`The other $9-3=6$ pairs are free: each in or out.`],
      answer: R`$2^6 = 64$.` },
    { id: "dm2-5", type: "interview",
      q: R`<strong>Hash tables.</strong> A hash function maps 3 distinct keys into 4 buckets, each key independently and uniformly. How many functions are there, how many are collision-free, and what is the probability of no collision?`,
      hint: R`Collision-free means the function is injective.`,
      steps: [R`Total functions $\{1,2,3\}\to\{1,2,3,4\}$: $4^3=64$.`, R`Injective: $4\cdot3\cdot2 = 24$.`, R`Probability $= 24/64 = 3/8$.`],
      answer: R`64 functions, 24 injective, $P = 3/8$ (so a collision happens 62.5% of the time — buckets fill faster than you think!).` }
  ];

  P["dm-ch3"] = [
    { id: "dm3-1", type: "concept",
      q: R`Without computing, explain why $\binom{n}{k} = \binom{n}{n-k}$.`,
      hint: R`Choosing who is <em>in</em> the team is the same as choosing who is <em>out</em>.`,
      steps: [R`Every $k$-subset corresponds to exactly one complementary $(n-k)$-subset.`, R`This pairing is a bijection, so the counts match.`],
      answer: R`Complement bijection between $k$-subsets and $(n-k)$-subsets.` },
    { id: "dm3-2", type: "concept",
      q: R`What is the smallest group of people that <em>guarantees</em> two of them were born in the same month?`,
      hint: R`Pigeons = people, holes = months.`,
      steps: [R`There are 12 holes (months).`, R`12 people can all differ; the 13th must repeat.`],
      answer: R`13 people.` },
    { id: "dm3-3", type: "computation",
      q: R`How many 4-digit PINs have <em>all distinct</em> digits (digits $0$–$9$, leading zero allowed)?`,
      hint: R`Order matters and there is no repetition: a permutation $P(10,4)$.`,
      steps: [R`First digit: 10 choices, second: 9, third: 8, fourth: 7.`, R`$P(10,4) = 10\cdot9\cdot8\cdot7$.`],
      answer: R`$5040$.` },
    { id: "dm3-4", type: "computation",
      q: R`A committee of 4 is chosen from 6 men and 5 women. How many committees contain <em>at least 2 women</em>?`,
      hint: R`Count the complement: 0 women or exactly 1 woman.`,
      steps: [R`Total: $\binom{11}{4} = 330$.`, R`0 women: $\binom{6}{4} = 15$.`, R`1 woman: $\binom{5}{1}\binom{6}{3} = 5\cdot20 = 100$.`, R`At least 2 women: $330 - 15 - 100 = 215$.`],
      answer: R`$215$.` },
    { id: "dm3-5", type: "interview",
      q: R`<strong>Party problem (asked at Google-style interviews).</strong> Show that among any 6 people, there are 3 who are mutual friends or 3 who are mutual strangers.`,
      hint: R`Fix one person and apply the pigeonhole principle to their 5 relationships.`,
      steps: [R`Pick person $v$. Each of the other 5 is a friend or stranger of $v$ — 2 “holes”, 5 “pigeons”.`, R`By pigeonhole, at least $\lceil 5/2 \rceil = 3$ share the same relation to $v$; say 3 friends $a,b,c$ (strangers is symmetric).`, R`If any pair among $a,b,c$ are friends, that pair plus $v$ is a friend triangle.`, R`Otherwise $a,b,c$ are pairwise strangers — a stranger triangle. Either way we win.`],
      answer: R`True — this is $R(3,3)=6$, the smallest Ramsey number.` }
  ];

  P["dm-ch4"] = [
    { id: "dm4-1", type: "concept",
      q: R`Which grows faster: $n\log n$ or $n^{1.1}$?`,
      hint: R`Compare $\log n$ with $n^{0.1}$.`,
      steps: [R`Divide both by $n$: $\log n$ versus $n^{0.1}$.`, R`Any positive power of $n$ eventually beats any power of $\log n$.`],
      answer: R`$n^{1.1}$ grows faster, so $n\log n = o(n^{1.1})$.` },
    { id: "dm4-2", type: "concept",
      q: R`Can the Master theorem solve $T(n) = T(n-1) + n$? Why or why not?`,
      hint: R`Look at how the subproblem size shrinks.`,
      steps: [R`The Master theorem needs $T(n) = aT(n/b) + f(n)$ with $b>1$ — sizes divide geometrically.`, R`Here the size shrinks by a constant (subtraction), so it does not apply.`, R`Unroll instead: $T(n)=n+(n-1)+\dots+1 = \frac{n(n+1)}{2} = \Theta(n^2)$.`],
      answer: R`No; unroll to get $\Theta(n^2)$.` },
    { id: "dm4-3", type: "computation",
      q: R`Solve $T(n) = 8\,T(n/2) + n^2$ using the Master theorem.`,
      hint: R`Compare $n^{\log_b a}$ with $f(n)$.`,
      steps: [R`$a=8,\ b=2,\ f(n)=n^2$, so $n^{\log_2 8} = n^3$.`, R`$f(n) = n^2 = O(n^{3-\varepsilon})$ with $\varepsilon = 1$: Case 1.`],
      answer: R`$T(n) = \Theta(n^3)$.` },
    { id: "dm4-4", type: "computation",
      q: R`Let $T(1)=1$ and $T(n)=2T(n/2)+n$. Compute $T(8)$ and check it against $n(\log_2 n + 1)$.`,
      hint: R`Build up: $T(2)$, then $T(4)$, then $T(8)$.`,
      steps: [R`$T(2) = 2\cdot1 + 2 = 4$.`, R`$T(4) = 2\cdot4 + 4 = 12$.`, R`$T(8) = 2\cdot12 + 8 = 32$.`, R`Formula: $8\,(3+1) = 32$ ✓.`],
      answer: R`$T(8) = 32$.` },
    { id: "dm4-5", type: "interview",
      q: R`<strong>Complexity of recursion.</strong> A function sums an array by recursing on the left half and the right half ($T(n)=2T(n/2)+O(1)$). Binary search recurses on only one half ($T(n)=T(n/2)+O(1)$). What are the two running times?`,
      hint: R`Both have $f(n)=n^0$; compare with $n^{\log_b a}$.`,
      steps: [R`Sum: $a=2,b=2$, $n^{\log_2 2}=n$ vs $f=1$: Case 1, so $\Theta(n)$ — every element is touched once.`, R`Binary search: $a=1,b=2$, $n^{\log_2 1}=n^0=1 = f(n)$: Case 2, so $\Theta(\log n)$.`],
      answer: R`Sum: $\Theta(n)$. Binary search: $\Theta(\log n)$ — the number of branches, not the depth, decides the cost.` }
  ];

  P["dm-ch5"] = [
    { id: "dm5-1", type: "concept",
      q: R`How many edges does a tree on $n$ vertices have, and why?`,
      hint: R`Start with one vertex; each new vertex attaches by exactly one edge.`,
      steps: [R`A connected acyclic graph: build it by adding one vertex at a time.`, R`Each new vertex needs exactly one edge to the existing tree (two would form a cycle).`],
      answer: R`$n-1$ edges.` },
    { id: "dm5-2", type: "concept",
      q: R`For which kind of graph does BFS find shortest paths? What breaks Dijkstra’s algorithm?`,
      hint: R`Think about edge weights.`,
      steps: [R`BFS counts edges, so it is optimal when every edge costs the same (unweighted graphs).`, R`Dijkstra assumes that once a vertex is settled no later path can be shorter — false with <em>negative</em> edges.`],
      answer: R`BFS: unweighted graphs. Dijkstra fails on negative weights (use Bellman–Ford).` },
    { id: "dm5-3", type: "computation",
      q: R`Edges (weights): S–A 2, S–B 5, A–B 1, A–T 6, B–T 2. Find the shortest distance from S to T using Dijkstra.`,
      hint: R`Settle vertices in order of distance: S, then the closest unsettled one, and so on.`,
      steps: [R`Start: $d(S)=0$; relax: $d(A)=2,\ d(B)=5$.`, R`Settle A (2): via A, $d(B)=\min(5,\,2+1)=3$, $d(T)=2+6=8$.`, R`Settle B (3): $d(T)=\min(8,\,3+2)=5$.`, R`Settle T: 5, along S→A→B→T.`],
      answer: R`$5$.` },
    { id: "dm5-4", type: "computation",
      q: R`What is the chromatic number of the 5-cycle $C_5$? Justify.`,
      hint: R`2-colourable graphs are exactly the bipartite ones, i.e. no odd cycles.`,
      steps: [R`$C_5$ is an odd cycle, so it is not bipartite: 2 colours are impossible (colours would have to alternate around 5 vertices).`, R`3 colours suffice: colour the vertices 1,2,1,2,3 around the cycle.`],
      answer: R`$\chi(C_5) = 3$.` },
    { id: "dm5-5", type: "interview",
      q: R`<strong>Number of Islands (Amazon).</strong> Count the connected groups of <code>1</code>s (4-directional connectivity) in this grid, and state the time complexity.<pre>11000
11000
00100
00011</pre>`,
      hint: R`Treat each cell as a vertex; run DFS/BFS from every unvisited <code>1</code>.`,
      steps: [R`Scan cells row by row. On an unvisited <code>1</code>, start a flood fill (DFS/BFS) and increment the count.`, R`Top-left block (4 cells) = island 1; middle <code>1</code> at row 3 = island 2; bottom-right pair = island 3.`, R`Each cell is visited at most once.`],
      answer: R`3 islands; $O(R\cdot C)$ time and space.` }
  ];

  P["dm-ch6"] = [
    { id: "dm6-1", type: "concept",
      q: R`Does $12$ have a multiplicative inverse modulo $18$?`,
      hint: R`An inverse of $a$ mod $m$ exists iff $\gcd(a,m)=1$.`,
      steps: [R`$\gcd(12,18) = 6 \neq 1$.`],
      answer: R`No inverse exists.` },
    { id: "dm6-2", type: "concept",
      q: R`In RSA with public key $(n,e)$ and private key $d$, which of $n,\ e,\ d,\ p,\ q,\ \varphi(n)$ must stay secret?`,
      hint: R`Anyone who learns $\varphi(n)$ can compute $d$.`,
      steps: [R`$n$ and $e$ are published.`, R`$d = e^{-1} \bmod \varphi(n)$ and $\varphi(n)=(p-1)(q-1)$, so $d$, $p$, $q$ and $\varphi(n)$ all leak the key.`],
      answer: R`Secret: $d,\ p,\ q,\ \varphi(n)$. Public: $n,\ e$.` },
    { id: "dm6-3", type: "computation",
      q: R`Compute $7^{100} \bmod 13$.`,
      hint: R`Fermat: $a^{p-1} \equiv 1 \pmod p$ for prime $p$ not dividing $a$.`,
      steps: [R`$7^{12}\equiv 1 \pmod{13}$, and $100 = 8\cdot12 + 4$.`, R`So $7^{100} \equiv 7^4 = 2401$.`, R`$2401 = 13\cdot184 + 9$.`],
      answer: R`$9$.` },
    { id: "dm6-4", type: "computation",
      q: R`Find the inverse of $7$ modulo $40$ with the extended Euclidean algorithm.`,
      hint: R`Run Euclid on $(40, 7)$ and back-substitute.`,
      steps: [R`$40 = 5\cdot7 + 5$,  $7 = 1\cdot5 + 2$,  $5 = 2\cdot2 + 1$.`, R`Back-substitute: $1 = 5 - 2\cdot2 = 5 - 2(7-5) = 3\cdot5 - 2\cdot7$.`, R`$= 3(40 - 5\cdot7) - 2\cdot7 = 3\cdot40 - 17\cdot7$.`, R`So $7\cdot(-17)\equiv 1$, and $-17 \equiv 23 \pmod{40}$. Check: $7\cdot23 = 161 = 4\cdot40+1$ ✓.`],
      answer: R`$7^{-1} \equiv 23 \pmod{40}$.` },
    { id: "dm6-5", type: "interview",
      q: R`<strong>TCS-style.</strong> Find the remainder when $2^{2024}$ is divided by $7$. Then explain how to compute $a^b \bmod m$ for $b \approx 10^{18}$ with only about 60 multiplications.`,
      hint: R`Powers of 2 mod 7 repeat quickly. For the second part, think of the binary expansion of $b$.`,
      steps: [R`$2^1=2,\ 2^2=4,\ 2^3=8\equiv1 \pmod 7$ — the cycle length is 3.`, R`$2024 = 3\cdot674 + 2$, so $2^{2024}\equiv (2^3)^{674}\cdot 2^2 \equiv 4$.`, R`Fast exponentiation: repeatedly square ($a, a^2, a^4, \dots$ mod $m$) and multiply in the squares matching the 1-bits of $b$.`, R`$b<2^{60}$ so at most 60 squarings and 60 multiplies — $O(\log b)$ — and numbers never exceed $m^2$. (Python: <code>pow(a, b, m)</code>.)`],
      answer: R`Remainder $4$; fast modular exponentiation is $O(\log b)$.` }
  /* ───────────────────────── THE MATHS BEHIND... ───────────────────────── */
  P["mb-google"] = [
    { id: "mb-g-1", type: "concept",
      q: R`Why can’t a scam website artificially inflate its Google PageRank simply by creating 10,000 links pointing to itself?`,
      hint: R`Consider what a node's outgoing links divide by.`,
      steps: [
        R`In the PageRank transition matrix, a node $i$ divides its current rank $r_i$ equally among all of its outgoing links $C(i)$.`,
        R`If node $i$ has 10,000 links to itself, each link contributes $\frac{r_i}{10000} \cdot 10000 = r_i$. It cannot multiply its own weight.`,
        R`Crucially, PageRank measures <em>incoming</em> votes from <em>other</em> authoritative pages. Self-loops cannot inject new prestige from the outside web.`
      ],
      answer: R`A page cannot vote itself into high rank; outgoing votes conserve total weight, and prestige requires external authoritative links.`
    },
    { id: "mb-google-2", type: "computation",
      q: R`Consider two web pages $A$ and $B$. $A$ links to $B$, and $B$ links to $A$. With damping factor $d = 0.85$, find the stationary PageRank vector $[r_A, r_B]$ such that $r_A + r_B = 1$.`,
      hint: R`By symmetry, what must the relationship between $r_A$ and $r_B$ be?`,
      steps: [
        R`PageRank equation: $r_A = \frac{1-d}{2} + d \cdot r_B$ and $r_B = \frac{1-d}{2} + d \cdot r_A$.`,
        R`Since the graph is completely symmetric ($A \leftrightarrow B$), $r_A = r_B$.`,
        R`Given $r_A + r_B = 1$, we must have $r_A = 0.5$ and $r_B = 0.5$.`
      ],
      answer: R`$r_A = 0.5,\ r_B = 0.5$.`
    },
    { id: "mb-google-3", type: "interview",
      q: R`<strong>Spider Traps & Dead Ends.</strong> In a web graph, what is a “dead end” (dangling node) and how does Google’s damping factor $d=0.85$ prevent the Power Iteration method from losing all probability mass?`,
      hint: R`What happens to a random surfer who reaches a page with 0 outgoing links?`,
      steps: [
        R`A dangling node has no outbound links ($C(i) = 0$), so probability leaks out of the network at each step ($\sum r_j < 1$).`,
        R`A spider trap is a closed loop of pages with no exit, accumulating 100% of the network’s probability over infinite steps.`,
        R`Google solves both by adding a uniform teleportation matrix: at every step, with probability $1-d = 0.15$, the surfer teleports to any random page in the entire graph, guaranteeing irreducibility and a unique stationary eigenvector.`
      ],
      answer: R`The damping factor teleports surfers with probability $1-d$, guaranteeing the Markov chain is irreducible and aperiodic (Perron-Frobenius theorem).`
    }
  ];

  P["mb-chatgpt"] = [
    { id: "mb-gpt-1", type: "concept",
      q: R`In the Transformer Attention formula $\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$, why do we scale the dot products by $\frac{1}{\sqrt{d_k}}$?`,
      hint: R`What happens to the variance of a dot product of two independent random vectors as dimension $d_k$ grows?`,
      steps: [
        R`If components of $q$ and $k$ are independent random variables with mean 0 and variance 1, their dot product $q \cdot k = \sum_{i=1}^{d_k} q_i k_i$ has mean 0 and variance $d_k$.`,
        R`For large dimensions (e.g. $d_k = 64$ or $128$), the standard deviation is $\sqrt{d_k} \approx 8$ to $11$. Dot products become huge in magnitude.`,
        R`Large inputs to the $\text{softmax}$ function push values into regions where gradients are extremely close to zero, causing the vanishing gradient problem during backpropagation. Dividing by $\sqrt{d_k}$ normalizes the variance back to 1.`
      ],
      answer: R`It prevents the dot product from exploding in variance, keeping the softmax in regions with active, non-vanishing gradients.`
    },
    { id: "mb-gpt-2", type: "computation",
      q: R`Let query $Q$ attend to two keys with scaled dot products $s_1 = \frac{Q \cdot K_1}{\sqrt{d_k}} = 2.0$ and $s_2 = \frac{Q \cdot K_2}{\sqrt{d_k}} = 1.0$. Compute the softmax attention weight $\alpha_1$ (rounded to 3 decimal places).`,
      hint: R`$\text{softmax}(s_i) = \frac{e^{s_i}}{\sum_j e^{s_j}}$. Use $e^2 \approx 7.389$ and $e^1 \approx 2.718$.`,
      steps: [
        R`$e^{s_1} = e^2 \approx 7.389056$.`,
        R`$e^{s_2} = e^1 \approx 2.718282$.`,
        R`Sum of exponentials $= 7.389056 + 2.718282 = 10.107338$.`,
        R`$\alpha_1 = \frac{7.389056}{10.107338} \approx 0.731$.`
      ],
      answer: R`$\alpha_1 \approx 0.731$ (or $73.1\%$).`
    },
    { id: "mb-gpt-3", type: "interview",
      q: R`<strong>Complexity Bottleneck.</strong> What is the time and memory complexity of standard Multi-Head Self-Attention with sequence length $N$ and hidden dimension $d$? Why is processing a 100,000-token book challenging?`,
      hint: R`What are the dimensions of the $QK^T$ attention matrix?`,
      steps: [
        R`Computing $Q, K, V$ projections takes $O(N \cdot d^2)$.`,
        R`Computing $Q K^T$ produces an $N \times N$ attention matrix, taking $O(N^2 \cdot d)$ compute and $O(N^2)$ memory to store.`,
        R`Multiplying $(N \times N) \times (N \times d)$ with $V$ takes $O(N^2 \cdot d)$.`,
        R`For $N = 100{,}000$, an $N \times N$ matrix requires $(10^5)^2 = 10^{10}$ floating-point numbers ($\approx 40\text{ GB}$ of GPU VRAM per attention head just for attention scores).`
      ],
      answer: R`$O(N^2 \cdot d)$ time and $O(N^2)$ memory. Quadratic scaling makes long contexts memory-prohibitive without FlashAttention or linear attention.`
    }
  ];

  P["mb-shazam"] = [
    { id: "mb-shz-1", type: "concept",
      q: R`Why does Shazam convert an audio recording into a 2D spectrogram (time vs frequency) rather than taking a single global Fourier Transform over the entire 5-second sample?`,
      hint: R`Does a global Fourier transform tell you *when* a musical note occurred?`,
      steps: [
        R`A global Fourier transform integrates over the entire time signal, revealing *which* frequencies were present, but completely erasing *when* they happened.`,
        R`Music is fundamentally defined by temporal sequence: playing middle C followed by G is a completely different song from playing G followed by middle C.`,
        R`Shazam uses the Short-Time Fourier Transform (STFT) to break audio into short sliding time windows (e.g. 50ms), producing a 2D spectrogram of frequency vs time.`
      ],
      answer: R`A single FFT loses all temporal order. STFT preserves both time and frequency coordinates needed to create acoustic landmark fingerprints.`
    },
    { id: "mb-shz-2", type: "computation",
      q: R`An audio signal is sampled at $f_s = 44{,}100\text{ Hz}$. If each FFT window contains $N = 2048$ samples, what is the frequency resolution $\Delta f$ (width of each frequency bin in Hz)?`,
      hint: R`$\Delta f = \frac{f_s}{N}$.`,
      steps: [
        R`$\Delta f = \frac{44100\text{ Hz}}{2048} \approx 21.533\text{ Hz}$.`,
        R`Each discrete bin in the FFT spectrum represents a slice of approximately $21.53\text{ Hz}$.`
      ],
      answer: R`$\Delta f \approx 21.53\text{ Hz}$.`
    },
    { id: "mb-shz-3", type: "interview",
      q: R`<strong>Combinatorial Hashing.</strong> How does Shazam’s pairing of peak constellation points $(f_1, f_2, \Delta t)$ prevent millions of false positives when querying against a database of 50 million songs?`,
      hint: R`How many songs share a single isolated frequency peak vs a specific timed pair?`,
      steps: [
        R`Single frequency peaks are very common: thousands of songs contain a 440 Hz concert pitch at some point.`,
        R`Instead of indexing single peaks, Shazam chooses an anchor peak $(f_1, t_1)$ and pairs it with multiple target peaks $(f_2, t_2)$ within a small target zone window.`,
        R`The hash key is the tuple $(f_1, f_2, \Delta t)$ where $\Delta t = t_2 - t_1$. This combinatorial pair is exponentially more unique, reducing database collision rates by orders of magnitude while remaining robust to background noise.`
      ],
      answer: R`Pairing two peaks with their time difference $(f_1, f_2, \Delta t)$ provides high entropy, filtering noise and drastically reducing hash collisions.`
    }
  ];

  P["mb-whatsapp"] = [
    { id: "mb-wa-1", type: "concept",
      q: R`What makes modular exponentiation $f(x) = g^x \pmod p$ a “one-way trapdoor function”? Why can’t an eavesdropper easily calculate $x$ from $g^x \pmod p$?`,
      hint: R`Think about the Discrete Logarithm Problem.`,
      steps: [
        R`Computing $g^x \pmod p$ in the forward direction is fast: using repeated squaring (fast modular exponentiation), it requires only $O(\log x)$ multiplications.`,
        R`In reverse, finding $x$ given $y = g^x \pmod p$ is the Discrete Logarithm Problem. There is no known efficient classical algorithm for large prime $p$ (e.g. 2048 bits).`,
        R`The function is easy to compute forward, but computationally infeasible to invert without knowing the secret exponent.`
      ],
      answer: R`Forward calculation takes $O(\log x)$ multiplications, but solving the Discrete Logarithm problem classically requires exponential time.`
    },
    { id: "mb-wa-2", type: "computation",
      q: R`In an RSA setup, let $p = 5, q = 11$, so $n = 55$ and $\phi(n) = (5-1)(11-1) = 40$. If public exponent $e = 3$, find the private decryption key $d$ such that $e \cdot d \equiv 1 \pmod{40}$.`,
      hint: R`Find an integer $k$ such that $3d = 40k + 1$.`,
      steps: [
        R`We need $3d \equiv 1 \pmod{40}$, meaning $3d - 40k = 1$.`,
        R`For $k = 1$: $40(1) + 1 = 41$ (not divisible by 3).`,
        R`For $k = 2$: $40(2) + 1 = 81$.`,
        R`$81 / 3 = 27$. Check: $3 \times 27 = 81 = 2 \times 40 + 1 \equiv 1 \pmod{40}$ ✓.`
      ],
      answer: R`$d = 27$.`
    },
    { id: "mb-wa-3", type: "interview",
      q: R`<strong>Diffie-Hellman Man-in-the-Middle (MitM).</strong> Alice and Bob exchange public keys $g^a \pmod p$ and $g^b \pmod p$ over an insecure channel. How can Eve attack this if the messages are unauthenticated, and how does WhatsApp solve it?`,
      hint: R`Can Eve pretend to be Bob to Alice, and Alice to Bob?`,
      steps: [
        R`In pure Diffie-Hellman, Eve intercepts Alice's public value and sends her own $g^e$, and intercepts Bob's public value sending $g^e$.`,
        R`Eve establishes two independent shared secrets: one with Alice and one with Bob, allowing her to transparently decrypt, read, and re-encrypt all messages.`,
        R`WhatsApp prevents this via Public Key Cryptography & Identity Verification: users verify 60-digit safety numbers (or scan QR codes), which are cryptographic hashes of both users' permanent public identity keys.`
      ],
      answer: R`Pure DH is vulnerable to active MitM. WhatsApp protects against this using digital signatures and verifiable 60-digit safety fingerprint hashes.`
    }
  ];

  P["mb-netflix"] = [
    { id: "mb-nflx-1", type: "concept",
      q: R`In collaborative filtering for movies, what do the columns of matrix $U$ and rows of $V^T$ in the Singular Value Decomposition $A \approx U_k \Sigma_k V_k^T$ intuitively represent?`,
      hint: R`Think about genres, tropes, and human preferences.`,
      steps: [
        R`Matrix $A$ is a giant, sparse $M \times N$ matrix of user ratings for movies.`,
        R`The $k$ latent dimensions discovered by SVD capture unobserved concepts: e.g. "explosive action", "cerebral thriller", "quirky comedy", or "director style".`,
        R`Each row of $U_k$ is a user's affinity vector for these $k$ latent concepts. Each column of $V_k^T$ is how strongly a movie embodies these same $k$ concepts.`,
        R`The dot product $u_i \cdot v_j$ predicts how much user $i$ will enjoy movie $j$.`
      ],
      answer: R`They represent latent factor embeddings: user taste preferences ($U$) and movie attribute loadings ($V^T$) along the $k$ most significant concepts.`
    },
    { id: "mb-nflx-2", type: "computation",
      q: R`Suppose a user's latent taste vector is $u = [0.8, 0.6]$ and a movie's latent attribute vector is $v = [0.5, 0.5]$. In a rank-2 model with singular values $\sigma_1 = 10$ and $\sigma_2 = 5$, what is the predicted rating?`,
      hint: R`Predicted rating $= \sigma_1 u_1 v_1 + \sigma_2 u_2 v_2$.`,
      steps: [
        R`Component 1: $10 \times 0.8 \times 0.5 = 10 \times 0.40 = 4.0$.`,
        R`Component 2: $5 \times 0.6 \times 0.5 = 5 \times 0.30 = 1.5$.`,
        R`Total predicted score $= 4.0 + 1.5 = 5.5$.`
      ],
      answer: R`$5.5$.`
    },
    { id: "mb-nflx-3", type: "interview",
      q: R`<strong>The Cold-Start Problem.</strong> When a new user signs up on Netflix with 0 watched or rated movies, standard matrix factorization fails because row $u_{\text{new}}$ is empty. How do modern recommendation systems handle this?`,
      hint: R`Can we use auxiliary metadata or onboarding questions?`,
      steps: [
        R`Item-based fallback: show globally popular or critically acclaimed trending titles.`,
        R`Onboarding survey: ask the new user to pick 3 titles or genres they love to initialize a pseudo-latent vector.`,
        R`Content-based filtering: leverage non-rating metadata (actors, genres, language, device, region, time of day).`,
        R`Multi-armed bandit exploration: present diverse exploratory titles to rapidly learn user preferences with minimal regret.`
      ],
      answer: R`Through onboarding preference prompts, content metadata heuristics, popularity priors, and multi-armed bandit exploration.`
    }
  ];

  P["mb-jpeg"] = [
    { id: "mb-jpg-1", type: "concept",
      q: R`Why does JPEG use the Discrete Cosine Transform (DCT) instead of the Discrete Fourier Transform (DFT) for $8 \times 8$ pixel image blocks?`,
      hint: R`What happens at the boundary when you mirror an image block vs repeating it periodically?`,
      steps: [
        R`DFT implicitly assumes periodic repetition of the block: the left edge connects to the right edge. If left is dark and right is bright, this creates an artificial sharp discontinuity.`,
        R`Sharp discontinuities introduce spurious high-frequency Fourier harmonics that require many bits to encode (ringing/Gibbs phenomenon).`,
        R`DCT implicitly mirrors the block at the boundaries (even extension), making the signal continuous at every border. This concentrates almost all energy into a few low-frequency coefficients (energy compaction).`
      ],
      answer: R`DCT uses even-symmetry mirroring, eliminating artificial boundary discontinuities and maximizing energy compaction into low frequencies.`
    },
    { id: "mb-jpg-2", type: "computation",
      q: R`An $8 \times 8$ pixel block has a computed DCT DC coefficient $F(0,0) = 640$. What is the average pixel value $\mu$ across the 64 pixels in this block?`,
      hint: R`In standard 2D DCT-II: $F(0,0) = \frac{1}{\sqrt{8 \times 8}} \sum_{x=0}^7 \sum_{y=0}^7 f(x,y) = \frac{1}{8} (64 \cdot \mu)$.`,
      steps: [
        R`$F(0,0) = \frac{1}{8} \sum_{x,y} f(x,y) = \frac{1}{8} (64 \mu) = 8 \mu$.`,
        R`Therefore, $640 = 8 \mu \implies \mu = \frac{640}{8} = 80$.`
      ],
      answer: R`Average pixel value $\mu = 80$.`
    },
    { id: "mb-jpg-3", type: "interview",
      q: R`<strong>Where the Loss Happens.</strong> Neither the DCT nor the Huffman entropy coding loses a single bit of information. Exactly which step in the JPEG pipeline makes it a “lossy” compression algorithm?`,
      hint: R`Where does rounding or division occur?`,
      steps: [
        R`The Discrete Cosine Transform is a completely reversible, orthogonal linear change of basis: $\text{IDCT}(\text{DCT}(X)) = X$.`,
        R`Huffman and run-length encoding are provably lossless compression techniques.`,
        R`The only lossy step is <strong>Quantization</strong>: dividing frequency coefficients by entries in a quantization table $Q$ and rounding to the nearest integer: $F_q(u,v) = \text{round}\left(\frac{F(u,v)}{Q(u,v)}\right)$.`,
        R`Small high-frequency coefficients are rounded directly to zero and discarded forever, exploiting the human eye's insensitivity to fine spatial luminance variations.`
      ],
      answer: R`Quantization: integer rounding after division by the perceptual quantization table irreversibly zeroes high-frequency details.`
    }
  ];

  /* ───────────────────────── EIGENVALUES & SVD (eigen-lecture.html) ───────────────────────── */
  P["eigen-lecture"] = [
    { id: "el-1", type: "concept",
      q: R`In Principal Component Analysis (PCA), why are the principal component directions given by the eigenvectors of the covariance matrix $\Sigma = \frac{1}{n} X^T X$?`,
      hint: R`Think about maximizing variance $\max_u u^T \Sigma u$ subject to $\|u\|=1$.`,
      steps: [
        R`The sample variance of projected data along unit vector $u$ is $u^T \Sigma u$.`,
        R`Using Lagrange multipliers with constraint $u^T u = 1$: $\mathcal{L}(u, \lambda) = u^T \Sigma u - \lambda (u^T u - 1)$.`,
        R`Differentiating and setting to zero yields $2\Sigma u - 2\lambda u = 0 \implies \Sigma u = \lambda u$.`,
        R`Thus, stationary points of variance are exactly the eigenvectors, and variance along $u$ equals the eigenvalue $\lambda$.`
      ],
      answer: R`Eigenvectors maximize projected variance $\text{Var}(u^T X) = u^T \Sigma u = \lambda$ under the unit-norm constraint.`
    },
    { id: "el-2", type: "computation",
      q: R`Find the eigenvalues of matrix $A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$.`,
      hint: R`Solve characteristic equation $\det(A - \lambda I) = 0$.`,
      steps: [
        R`$\det\begin{bmatrix} 4-\lambda & 2 \\ 1 & 3-\lambda \end{bmatrix} = (4-\lambda)(3-\lambda) - 2 = \lambda^2 - 7\lambda + 12 - 2 = \lambda^2 - 7\lambda + 10 = 0$.`,
        R`Factor quadratic: $(\lambda - 5)(\lambda - 2) = 0$.`,
        R`$\lambda_1 = 5,\ \lambda_2 = 2$. Check trace: $4+3=7=5+2$ ✓; determinant: $12-2=10=5\times 2$ ✓.`
      ],
      answer: R`$\lambda_1 = 5,\ \lambda_2 = 2$.`
    },
    { id: "el-3", type: "interview",
      q: R`<strong>Vanishing / Exploding Gradients in RNNs.</strong> In a Recurrent Neural Network with hidden state update $h_t = \tanh(W h_{t-1})$, how does the spectral radius $\rho(W) = \max_i |\lambda_i|$ influence long-term memory stability?`,
      hint: R`What happens to $W^k$ as $k \to \infty$?`,
      steps: [
        R`Unrolling an RNN for $T$ timesteps involves repeated matrix multiplications by weight matrix $W$, behaving like $W^T$.`,
        R`If $\rho(W) > 1$, repeated powers $W^T$ grow exponentially along dominant eigenvectors, leading to exploding gradients.`,
        R`If $\rho(W) < 1$, signals decay exponentially to zero, causing vanishing gradients where the model forgets past inputs.`,
        R`Modern architectures use orthogonal initialization ($\rho(W) = 1$) or gating mechanisms (LSTMs, GRUs) to maintain stable gradient flow.`
      ],
      answer: R`$\rho(W) > 1$ leads to exploding gradients; $\rho(W) < 1$ leads to vanishing gradients. Stable dynamics require $\rho(W) \approx 1$.`
    },
    { id: "el-4", type: "computation",
      q: R`What is the exact mathematical relationship between the singular values $\sigma_i$ of matrix $A$ and the eigenvalues of the symmetric matrix $A^T A$?`,
      hint: R`Consider $A = U \Sigma V^T$.`,
      steps: [
        R`Substitute SVD: $A^T A = (V \Sigma^T U^T)(U \Sigma V^T) = V (\Sigma^T \Sigma) V^T$.`,
        R`Since $V$ is orthogonal ($V^T V = I$), this is an eigenvalue decomposition of $A^T A$ where eigenvectors are columns of $V$.`,
        R`The diagonal entries are $\sigma_i^2$. Therefore, $\lambda_i(A^T A) = \sigma_i^2$, or $\sigma_i = \sqrt{\lambda_i(A^T A)}$.`
      ],
      answer: R`The singular values of $A$ are the non-negative square roots of the eigenvalues of $A^T A$: $\sigma_i = \sqrt{\lambda_i(A^T A)}$.`
    }
  ];

  /* ───────────────────────── ROBOTICS (robotics.html) ───────────────────────── */
  P["robotics"] = [
    { id: "rob-1", type: "concept",
      q: R`What is a kinematic singularity in a robot manipulator arm, and why is operating near one hazardous?`,
      hint: R`What happens to the Jacobian matrix $J(\theta)$ at a singularity?`,
      steps: [
        R`A robotic singularity occurs at joint configurations where the robot Jacobian matrix $J(\theta)$ loses full rank ($\det(J) = 0$).`,
        R`At this point, the manipulator loses one or more degrees of freedom, meaning it cannot move in certain Cartesian directions.`,
        R`Inverting the kinematics $\dot{\theta} = J^{-1} \dot{x}$ requires dividing by $\det(J) \to 0$, commanding infinite joint velocities and causing motor burnout or violent vibrations.`
      ],
      answer: R`A configuration where the Jacobian loses rank; the robot loses a degree of freedom and inverse velocity requests approach infinity.`
    },
    { id: "rob-2", type: "computation",
      q: R`A 2-link planar arm has link lengths $L_1 = 10\text{ cm}$ and $L_2 = 10\text{ cm}$. Joint angles are $\theta_1 = 0^\circ$ and $\theta_2 = 90^\circ$ (relative to link 1). Find the end-effector Cartesian coordinates $(x, y)$.`,
      hint: R`$x = L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2)$, $y = L_1 \sin\theta_1 + L_2 \sin(\theta_1 + \theta_2)$.`,
      steps: [
        R`Total angle for link 2: $\theta_1 + \theta_2 = 0^\circ + 90^\circ = 90^\circ$.`,
        R`$x = 10 \cos(0^\circ) + 10 \cos(90^\circ) = 10(1) + 10(0) = 10\text{ cm}$.`,
        R`$y = 10 \sin(0^\circ) + 10 \sin(90^\circ) = 10(0) + 10(1) = 10\text{ cm}$.`
      ],
      answer: R`$(x, y) = (10\text{ cm}, 10\text{ cm})$.`
    },
    { id: "rob-3", type: "interview",
      q: R`<strong>Gimbal Lock & Quaternions.</strong> Why do autonomous drones and robot arms use unit quaternions $q = (w, x, y, z)$ instead of Euler angles (pitch, roll, yaw) for 3D spatial orientation?`,
      hint: R`What happens when pitch reaches $\pm 90^\circ$?`,
      steps: [
        R`Euler angles suffer from Gimbal Lock: when two rotational axes align (e.g. pitch at $\pm 90^\circ$), one degree of freedom is permanently lost, causing mathematical singularities.`,
        R`Euler angles are non-unique and difficult to interpolate smoothly.`,
        R`Unit quaternions ($q \in \mathbb{H}, \|q\|=1$) represent 3D rotations on the surface of a 4D sphere ($S^3$), completely avoiding gimbal lock and allowing smooth spherical linear interpolation (SLERP).`
      ],
      answer: R`Quaternions avoid Gimbal Lock, have no mathematical singularities, and allow efficient, smooth spherical interpolation (SLERP).`
    },
    { id: "rob-4", type: "computation",
      q: R`Compute the matrix product $R(90^\circ) \cdot \begin{bmatrix} 2 \\ 1 \end{bmatrix}$ where $R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$.`,
      hint: R`$\cos 90^\circ = 0, \sin 90^\circ = 1$.`,
      steps: [
        R`$R(90^\circ) = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$.`,
        R`$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 0(2) - 1(1) \\ 1(2) + 0(1) \end{bmatrix} = \begin{bmatrix} -1 \\ 2 \end{bmatrix}$.`
      ],
      answer: R`$\begin{bmatrix} -1 \\ 2 \end{bmatrix}$.`
    }
  ];

  /* ───────────────────────── CONTROL THEORY (control.html) ───────────────────────── */
  P["control"] = [
    { id: "ctrl-1", type: "concept",
      q: R`For a continuous linear time-invariant system $\dot{x}(t) = A x(t)$, what is the necessary and sufficient condition on the eigenvalues of $A$ for asymptotic stability?`,
      hint: R`Consider the matrix exponential $e^{At}$. What must happen to $e^{\lambda t}$ as $t \to \infty$?`,
      steps: [
        R`The state trajectory is $x(t) = e^{At} x(0) = \sum_i v_i e^{\lambda_i t} c_i$.`,
        R`For $x(t) \to 0$ as $t \to \infty$ for any initial state $x(0)$, all terms $e^{\lambda_i t}$ must decay to zero.`,
        R`This requires the real part of every eigenvalue to be strictly negative: $\text{Re}(\lambda_i) < 0$ for all $i$ (all poles in the open Left Half Plane).`
      ],
      answer: R`All eigenvalues of $A$ must have strictly negative real parts: $\text{Re}(\lambda_i) < 0$.`
    },
    { id: "ctrl-2", type: "computation",
      q: R`Determine whether the system matrix $A = \begin{bmatrix} 0 & 1 \\ -6 & -5 \end{bmatrix}$ is asymptotically stable by computing its eigenvalues.`,
      hint: R`$\det(A - \lambda I) = \lambda^2 - \text{tr}(A)\lambda + \det(A) = 0$.`,
      steps: [
        R`$\det\begin{bmatrix} -\lambda & 1 \\ -6 & -5-\lambda \end{bmatrix} = \lambda(5+\lambda) + 6 = \lambda^2 + 5\lambda + 6 = 0$.`,
        R`Factor: $(\lambda + 2)(\lambda + 3) = 0 \implies \lambda_1 = -2,\ \lambda_2 = -3$.`,
        R`Both eigenvalues are real and strictly negative ($-2 < 0, -3 < 0$).`
      ],
      answer: R`Stable: $\lambda_1 = -2, \lambda_2 = -3$ (both real parts $< 0$).`
    },
    { id: "ctrl-3", type: "interview",
      q: R`<strong>Kalman Controllability.</strong> If an $n$-dimensional system $\dot{x} = Ax + Bu$ has controllability matrix $\mathcal{C} = [B \quad AB \quad A^2B \dots A^{n-1}B]$ with $\text{rank}(\mathcal{C}) < n$, what does this physically mean?`,
      hint: R`Can the input $u$ steer the state in every possible direction in $\mathbb{R}^n$?`,
      steps: [
        R`The column space of $\mathcal{C}$ is the controllable subspace $\mathcal{R}$.`,
        R`If $\text{rank}(\mathcal{C}) < n$, there exists an uncontrollable subspace of dimension $n - \text{rank}(\mathcal{C})$.`,
        R`No control input $u(t)$, no matter how large or smart, can ever influence or steer states in this uncontrollable subspace.`
      ],
      answer: R`The system is uncontrollable: certain internal states are completely isolated from input $u$ and cannot be steered to the origin.`
    },
    { id: "ctrl-4", type: "concept",
      q: R`What is the physical and mathematical intuition behind a Lyapunov candidate function $V(x)$ in nonlinear control?`,
      hint: R`Think of total energy in a mechanical or electrical system.`,
      steps: [
        R`$V(x)$ acts as a generalized measure of "energy" or distance from equilibrium: $V(0) = 0$ and $V(x) > 0$ for all $x \neq 0$ (positive definite).`,
        R`The time derivative $\dot{V}(x) = \nabla V(x) \cdot \dot{x}$ measures whether energy is dissipated over time.`,
        R`If $\dot{V}(x) < 0$ for all $x \neq 0$, the system constantly loses energy, guaranteeing the state slides downhill to $x = 0$ (asymptotic stability).`
      ],
      answer: R`It generalizes physical energy: if $V(x) > 0$ and $\dot{V}(x) < 0$, energy always dissipates, forcing the system into equilibrium.`
    }
  ];

  /* ───────────────────────── MORE MATHEMATICAL BRANCHES (more.html) ───────────────────────── */
  P["more"] = [
    { id: "more-1", type: "concept",
      q: R`In Fourier analysis, why does a periodic square wave contain only odd harmonics ($1f, 3f, 5f, \dots$) in its Fourier series?`,
      hint: R`Look at the half-wave symmetry: $f(t + T/2) = -f(t)$.`,
      steps: [
        R`A symmetric square wave centered at 0 exhibits half-wave odd symmetry: shifting by half a period inverts the sign: $f(t + T/2) = -f(t)$.`,
        R`Even harmonics satisfy $\sin(2k \omega (t + T/2)) = \sin(2k \omega t + 2k \pi) = +\sin(2k \omega t)$, having even half-wave symmetry.`,
        R`Integrating the product of an odd half-wave function with an even harmonic over a full period evaluates identically to zero.`
      ],
      answer: R`Half-wave odd symmetry cancels out all even harmonics, leaving only odd multiples of the fundamental frequency.`
    },
    { id: "more-2", type: "computation",
      q: R`In an SIR infectious disease model, transmission rate $\beta = 0.6$ per day and recovery rate $\gamma = 0.2$ per day. Calculate the basic reproduction number $R_0 = \beta / \gamma$. Will an outbreak grow in a fully susceptible population?`,
      hint: R`An epidemic grows if $R_0 > 1$.`,
      steps: [
        R`$R_0 = \frac{\beta}{\gamma} = \frac{0.6}{0.2} = 3.0$.`,
        R`Each infected individual infects an average of 3 new people before recovering.`,
        R`Since $R_0 = 3 > 1$, $\frac{dI}{dt} = (\beta S - \gamma)I > 0$ when $S \approx 1$, so the infection spreads exponentially.`
      ],
      answer: R`$R_0 = 3.0$; yes, the disease will spread exponentially because $R_0 > 1$.`
    },
    { id: "more-3", type: "interview",
      q: R`<strong>Game Theory.</strong> Define a Nash Equilibrium in plain words without using any mathematical symbols, and give one classic example from computer science or tech.`,
      hint: R`What would happen if any single player unilaterally changed their strategy?`,
      steps: [
        R`A Nash Equilibrium is a state where every player has chosen a strategy, and no individual player can benefit by unilaterally changing their own strategy while everyone else keeps theirs unchanged.`,
        R`CS example: Network routing / TCP Congestion Control. If everyone follows TCP additive-increase multiplicative-decrease, the network reaches stable throughput. If one router cheats, others drop packets, reaching a Nash equilibrium where cooperating is optimal.`
      ],
      answer: R`A state where no player has an incentive to unilaterally deviate. Example: TCP congestion control or routing equilibria.`
    },
    { id: "more-4", type: "computation",
      q: R`In the 1D Heat Diffusion Equation $\frac{\partial u}{\partial t} = \alpha \frac{\partial^2 u}{\partial x^2}$, how does the decay rate of a spatial harmonic mode $\sin(kx)$ depend on its wavenumber $k$?`,
      hint: R`Substitute $u(x, t) = e^{-\lambda t} \sin(kx)$ into the equation.`,
      steps: [
        R`Compute derivatives: $\frac{\partial u}{\partial t} = -\lambda e^{-\lambda t} \sin(kx)$ and $\frac{\partial^2 u}{\partial x^2} = -k^2 e^{-\lambda t} \sin(kx)$.`,
        R`Equating: $-\lambda = \alpha (-k^2) \implies \lambda = \alpha k^2$.`,
        R`The decay rate $\lambda$ is proportional to $k^2$. High frequencies (sharp spikes) decay quadratically faster than smooth broad waves.`
      ],
      answer: R`Decay rate $\lambda = \alpha k^2$: spatial frequencies decay with the square of their wavenumber $k$.`
    }
  ];

})(window.PRACTICE_DATA);
