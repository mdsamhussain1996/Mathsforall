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
  ];

})(window.PRACTICE_DATA);
