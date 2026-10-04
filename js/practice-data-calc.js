/* ============================================================
   Maths for All — Practice problem bank: CALCULUS & OPTIMISATION
   Course: calculus-optimisation.html (7 chapters, 6 problems each)
   Keys: calc-ch1 … calc-ch7
   ============================================================ */
window.PRACTICE_DATA = window.PRACTICE_DATA || {};
(function (P) {
  var R = String.raw;

  // ════════════════════════════════════════════════════════════
  // CHAPTER 1: DERIVATIVES REVISITED
  // ════════════════════════════════════════════════════════════
  P["calc-ch1"] = [
    { id: "calc1-1", type: "concept",
      q: R`Why is the symmetric central difference formula $\frac{f(x+h) - f(x-h)}{2h}$ an $\mathcal{O}(h^2)$ approximation, while the forward difference $\frac{f(x+h) - f(x)}{h}$ is only $\mathcal{O}(h)$?`,
      hint: R`Expand $f(x+h)$ and $f(x-h)$ in Taylor series around $x$ and subtract them.`,
      steps: [
        R`Taylor expansions: $f(x+h) = f(x) + h f'(x) + \frac{h^2}{2} f''(x) + \frac{h^3}{6} f'''(x) + \mathcal{O}(h^4)$.`,
        R`$f(x-h) = f(x) - h f'(x) + \frac{h^2}{2} f''(x) - \frac{h^3}{6} f'''(x) + \mathcal{O}(h^4)$.`,
        R`Subtracting cancels both $f(x)$ and the quadratic term $\frac{h^2}{2}f''(x)$: $f(x+h) - f(x-h) = 2h f'(x) + \frac{h^3}{3} f'''(x) + \mathcal{O}(h^5)$.`,
        R`Dividing by $2h$ leaves $f'(x) + \frac{h^2}{6} f'''(x) + \mathcal{O}(h^4)$, proving the leading error is proportional to $h^2$.`
      ],
      answer: R`Symmetry cancels all even-powered Taylor terms (including the $\mathcal{O}(h)$ term $\frac{h^2}{2}f''$), leaving the leading error as $\mathcal{O}(h^2)$.` },

    { id: "calc1-2", type: "concept",
      q: R`What is catastrophic cancellation in floating-point numerical differentiation, and why does choosing step size $h = 10^{-20}$ in standard 64-bit float result in complete garbage?`,
      hint: R`Consider the machine epsilon $\epsilon_{\text{mach}} \approx 10^{-16}$ of IEEE 754 float64.`,
      steps: [
        R`In float64, numbers have 53 bits of precision ($\approx 15-17$ significant decimal digits).`,
        R`When $h < 10^{-16}$, $x + h$ and $x$ round to the identical binary representation: $\text{fl}(x + h) = \text{fl}(x)$.`,
        R`Their difference evaluates to exactly $0.0$, yielding numerical derivative $0 / h = 0$, regardless of the true slope!`,
        R`The total error is Truncation Error ($\approx h^2$) + Roundoff Error ($\approx \frac{\epsilon_{\text{mach}}}{h}$). Minimizing total error gives optimal step $h^* \approx \sqrt{\epsilon_{\text{mach}}} \approx 10^{-8}$.`
      ],
      answer: R`When $h < \epsilon_{\text{mach}}$, $x+h$ and $x$ round to the exact same float, causing $(f(x+h)-f(x))$ to cancel to zero. The optimal step size is $h \approx \sqrt{\epsilon_{\text{mach}}} \approx 10^{-8}$.` },

    { id: "calc1-3", type: "computation",
      q: R`For the popular neural network activation function GELU approximation $f(x) \approx x \cdot \sigma(1.702 x)$, compute the exact analytical derivative at $x = 0$.`,
      hint: R`Use the product rule: $(u \cdot v)' = u' v + u v'$, and recall $\sigma(0) = 0.5$.`,
      steps: [
        R`Let $u(x) = x \implies u'(x) = 1$. Let $v(x) = \sigma(1.702 x)$.`,
        R`By chain rule: $v'(x) = 1.702 \cdot \sigma(1.702 x) (1 - \sigma(1.702 x))$.`,
        R`Product rule: $f'(x) = 1 \cdot \sigma(1.702 x) + x \cdot [1.702 \sigma(1.702 x)(1 - \sigma(1.702 x))]$.`,
        R`Evaluate at $x = 0$: $f'(0) = \sigma(0) + 0 = 0.5 + 0 = 0.5$.`
      ],
      answer: R`$f'(0) = 0.5$.` },

    { id: "calc1-4", type: "computation",
      q: R`Use the central difference formula with $h = 0.01$ to approximate the derivative of $f(x) = \ln(x^2 + 1)$ at $x = 1$. Compare with the exact derivative.`,
      hint: R`Compute $f(1.01)$, $f(0.99)$, and divide difference by $0.02$. Exact derivative is $\frac{2x}{x^2+1}$.`,
      steps: [
        R`Exact derivative: $f'(x) = \frac{2x}{x^2 + 1} \implies f'(1) = \frac{2(1)}{1^2 + 1} = \frac{2}{2} = 1.0$.`,
        R`$f(1.01) = \ln(1.01^2 + 1) = \ln(2.0201) \approx 0.7031473$.`,
        R`$f(0.99) = \ln(0.99^2 + 1) = \ln(1.9801) \approx 0.6831470$.`,
        R`Numerical approx: $\frac{0.7031473 - 0.6831470}{0.02} = \frac{0.0200003}{0.02} \approx 1.000015$.`,
        R`Absolute error: $|1.000015 - 1.0| = 1.5 \times 10^{-5}$, which matches theoretical $\mathcal{O}(h^2) = \mathcal{O}(10^{-4})$ bound.`
      ],
      answer: R`Exact = $1.0$; Numerical approximation = $1.000015$ (absolute error $\approx 1.5 \times 10^{-5}$).` },

    { id: "calc1-5", type: "proof",
      q: R`Prove from first principles that the linear approximation error $E(\Delta x) = f(x+\Delta x) - [f(x) + f'(x)\Delta x]$ satisfies $\lim_{\Delta x \to 0} \frac{E(\Delta x)}{\Delta x} = 0$.`,
      hint: R`Divide by $\Delta x$ and use the definition $f'(x) = \lim_{\Delta x \to 0} \frac{f(x+\Delta x)-f(x)}{\Delta x}$.`,
      steps: [
        R`Write the ratio: $\frac{E(\Delta x)}{\Delta x} = \frac{f(x+\Delta x) - f(x) - f'(x)\Delta x}{\Delta x}$.`,
        R`Split terms: $= \frac{f(x+\Delta x) - f(x)}{\Delta x} - \frac{f'(x)\Delta x}{\Delta x} = \frac{f(x+\Delta x) - f(x)}{\Delta x} - f'(x)$.`,
        R`Take limit as $\Delta x \to 0$: $\lim_{\Delta x \to 0} \left[ \frac{f(x+\Delta x) - f(x)}{\Delta x} - f'(x) \right] = f'(x) - f'(x) = 0$.`,
        R`Thus $E(\Delta x)$ is little-o of $\Delta x$, formally $E(\Delta x) = o(\Delta x)$.`
      ],
      answer: R`Proved directly from the definition of the derivative; the tangent line is the unique first-order polynomial whose approximation error decays strictly faster than $\Delta x$.` },

    { id: "calc1-6", type: "interview",
      q: R`<strong>ML Systems / PyTorch Internals.</strong> In PyTorch's <code>torch.autograd.gradcheck</code>, why are all tensor arguments converted to <code>torch.float64</code> before running finite-difference checks, and what relative tolerance formula is used?`,
      hint: R`Think about the noise floor of float32 ($\approx 10^{-7}$) vs float64 ($\approx 10^{-16}$).`,
      steps: [
        R`In float32, machine epsilon is $\sim 1.19 \times 10^{-7}$. The minimal numerical difference error $\sqrt{\epsilon_{\text{mach}}} \approx 3.5 \times 10^{-4}$.`,
        R`At $10^{-4}$ error, subtle algorithmic bugs in custom CUDA backward kernels (e.g. missing factor of 2 or wrong index) cannot be distinguished from finite difference error!`,
        R`In float64, $\epsilon_{\text{mach}} \approx 2.22 \times 10^{-16}$, achieving $\sim 10^{-8}$ finite-difference precision.`,
        R`PyTorch tests relative error: $\frac{\|J_{\text{analytical}} - J_{\text{numerical}}\|_2}{\|J_{\text{analytical}}\|_2 + \|J_{\text{numerical}}\|_2 + \epsilon} \le \text{rtol}$. With float64, default tolerance is strict: $\text{rtol} = 10^{-3}$ to $10^{-5}$.`
      ],
      answer: R`Float32 numerical noise ($\sim 10^{-4}$) masks implementation bugs. Float64 provides $10^{-8}$ precision, enabling strict relative error checks ($\le 10^{-5}$) to prove mathematical correctness.` }
  ];

  // ════════════════════════════════════════════════════════════
  // CHAPTER 2: MULTIVARIABLE CALCULUS
  // ════════════════════════════════════════════════════════════
  P["calc-ch2"] = [
    { id: "calc2-1", type: "concept",
      q: R`Why is the gradient vector $\nabla f(\mathbf{x})$ always perpendicular (orthogonal) to the contour line (level curve) $f(\mathbf{x}) = c$?`,
      hint: R`Parametrize the level curve as $\mathbf{r}(t)$ and apply the multivariable chain rule to $f(\mathbf{r}(t)) = c$.`,
      steps: [
        R`Along a level curve, $f(\mathbf{r}(t)) = c$ is constant for all $t$.`,
        R`Differentiate both sides with respect to $t$: $\frac{d}{dt}[f(\mathbf{r}(t))] = \frac{d}{dt}[c] = 0$.`,
        R`By the multivariable chain rule: $\nabla f(\mathbf{r}(t)) \cdot \mathbf{r}'(t) = 0$.`,
        R`Since $\mathbf{r}'(t)$ is tangent to the level curve, the dot product being zero proves $\nabla f$ is orthogonal to the tangent direction.`
      ],
      answer: R`Because along any level set, the rate of change is identically zero: $\nabla f \cdot \mathbf{r}'(t) = 0$. Hence $\nabla f$ must be orthogonal to the tangent vector $\mathbf{r}'(t)$.` },

    { id: "calc2-2", type: "concept",
      q: R`In what direction relative to $\nabla f(\mathbf{x})$ is the directional derivative $D_{\mathbf{u}}f(\mathbf{x})$ equal to zero?`,
      hint: R`Recall $D_{\mathbf{u}}f = \|\nabla f\| \|\mathbf{u}\| \cos\theta$. When is $\cos\theta = 0$?`,
      steps: [
        R`The directional derivative formula is $D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u} = \|\nabla f\| \cos\theta$ where $\|\mathbf{u}\| = 1$.`,
        R`For $D_{\mathbf{u}}f = 0$, we require $\cos\theta = 0$.`,
        R`This occurs at $\theta = 90^\circ$ and $\theta = 270^\circ$.`,
        R`These directions are orthogonal to the gradient, which corresponds exactly to moving tangentially along the level curve!`
      ],
      answer: R`At an angle of $90^\circ$ (perpendicular) to the gradient vector, which corresponds to moving along the level curve.` },

    { id: "calc2-3", type: "computation",
      q: R`For $f(x, y) = x^3 - 3xy + 2y^2$, compute the gradient $\nabla f(2, 1)$ and the directional derivative in the direction of vector $\mathbf{v} = (4, 3)$.`,
      hint: R`First compute $\nabla f = [\partial f/\partial x, \partial f/\partial y]^T$, then normalize $\mathbf{v}$ to unit vector $\mathbf{u} = \mathbf{v}/\|\mathbf{v}\|$.`,
      steps: [
        R`Partial derivatives: $\frac{\partial f}{\partial x} = 3x^2 - 3y \implies \frac{\partial f}{\partial x}(2, 1) = 3(4) - 3(1) = 9$.`,
        R`$\frac{\partial f}{\partial y} = -3x + 4y \implies \frac{\partial f}{\partial y}(2, 1) = -3(2) + 4(1) = -2$.`,
        R`Gradient vector: $\nabla f(2, 1) = \begin{bmatrix} 9 \\ -2 \end{bmatrix}$.`,
        R`Normalize direction: $\|\mathbf{v}\| = \sqrt{4^2 + 3^2} = 5 \implies \mathbf{u} = \begin{bmatrix} 0.8 \\ 0.6 \end{bmatrix}$.`,
        R`Directional derivative: $D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u} = 9(0.8) + (-2)(0.6) = 7.2 - 1.2 = 6.0$.`
      ],
      answer: R`$\nabla f(2, 1) = \begin{bmatrix} 9 \\ -2 \end{bmatrix}$ and $D_{\mathbf{u}}f = 6.0$.` },

    { id: "calc2-4", type: "computation",
      q: R`Find the linear approximation (tangent plane) equation to the paraboloid surface $z = 4x^2 + y^2$ at the point $(x_0, y_0) = (1, 2)$.`,
      hint: R`Use $z = f(x_0, y_0) + \frac{\partial f}{\partial x}(x_0, y_0)(x - x_0) + \frac{\partial f}{\partial y}(x_0, y_0)(y - y_0)$.`,
      steps: [
        R`$z_0 = f(1, 2) = 4(1)^2 + (2)^2 = 4 + 4 = 8$.`,
        R`$\frac{\partial f}{\partial x} = 8x \implies \frac{\partial f}{\partial x}(1, 2) = 8$.`,
        R`$\frac{\partial f}{\partial y} = 2y \implies \frac{\partial f}{\partial y}(1, 2) = 4$.`,
        R`Plane equation: $z = 8 + 8(x - 1) + 4(y - 2) = 8 + 8x - 8 + 4y - 8 = 8x + 4y - 8$.`,
        R`Standard linear form: $8x + 4y - z = 8$.`
      ],
      answer: R`$z = 8x + 4y - 8$ (or $8x + 4y - z = 8$).` },

    { id: "calc2-5", type: "proof",
      q: R`Prove using the Cauchy–Schwarz inequality that the unit vector maximizing the directional derivative $D_{\mathbf{u}}f(\mathbf{x})$ is $\mathbf{u}^* = \frac{\nabla f(\mathbf{x})}{\|\nabla f(\mathbf{x})\|}$, and the maximum directional derivative equals $\|\nabla f(\mathbf{x})\|$.`,
      hint: R`For any unit vector $\|\mathbf{u}\| = 1$, Cauchy–Schwarz states $|\nabla f \cdot \mathbf{u}| \le \|\nabla f\| \|\mathbf{u}\|$.`,
      steps: [
        R`By definition: $D_{\mathbf{u}}f(\mathbf{x}) = \nabla f(\mathbf{x}) \cdot \mathbf{u}$.`,
        R`By Cauchy–Schwarz: $\nabla f(\mathbf{x}) \cdot \mathbf{u} \le \|\nabla f(\mathbf{x})\| \|\mathbf{u}\| = \|\nabla f(\mathbf{x})\| \cdot 1 = \|\nabla f(\mathbf{x})\|$.`,
        R`Equality holds if and only if $\mathbf{u}$ is a positive scalar multiple of $\nabla f(\mathbf{x})$.`,
        R`Since $\|\mathbf{u}\| = 1$, the unique maximizing direction is $\mathbf{u}^* = \frac{\nabla f(\mathbf{x})}{\|\nabla f(\mathbf{x})\|}$.`,
        R`Substituting $\mathbf{u}^*$ gives $D_{\mathbf{u}^*}f(\mathbf{x}) = \nabla f(\mathbf{x}) \cdot \frac{\nabla f(\mathbf{x})}{\|\nabla f(\mathbf{x})\|} = \frac{\|\nabla f(\mathbf{x})\|^2}{\|\nabla f(\mathbf{x})\|} = \|\nabla f(\mathbf{x})\|$.`
      ],
      answer: R`Proved; this establishes why the negative gradient $-\nabla f$ is mathematically guaranteed to be the direction of steepest descent.` },

    { id: "calc2-6", type: "interview",
      q: R`<strong>Reinforcement Learning / Optimization interview.</strong> Why is standard Euclidean gradient descent parameterization-dependent, and what is the mathematical definition of the Natural Gradient $\tilde{\nabla}_\theta J$?`,
      hint: R`Recall that in probability distributions, distance is measured by KL divergence rather than Euclidean coordinate distance.`,
      steps: [
        R`Standard gradient $\nabla_\theta J$ depends on arbitrary coordinate choices because Euclidean norm $\|\Delta \theta\|_2^2$ ignores the geometry of the probability manifold.`,
        R`For parameterized policy $\pi_\theta$, the natural invariant distance metric is the Kullback–Leibler divergence $D_{\text{KL}}(\pi_\theta \| \pi_{\theta + d\theta})$.`,
        R`The second-order Taylor expansion of KL divergence is governed by the Fisher Information Matrix: $F(\theta) = \mathbb{E}[\nabla_\theta \ln \pi_\theta (\nabla_\theta \ln \pi_\theta)^T]$.`,
        R`The Natural Gradient is defined as $\tilde{\nabla}_\theta J = F(\theta)^{-1} \nabla_\theta J$. It takes the steepest ascent step under constant KL-divergence constraint.`
      ],
      answer: R`$\tilde{\nabla}_\theta J = F(\theta)^{-1} \nabla_\theta J$, where $F(\theta)$ is the Fisher Information Matrix. It makes optimization invariant to policy reparameterization.` }
  ];

  // ════════════════════════════════════════════════════════════
  // CHAPTER 3: THE CHAIN RULE & COMPUTATIONAL GRAPHS
  // ════════════════════════════════════════════════════════════
  P["calc-ch3"] = [
    { id: "calc3-1", type: "concept",
      q: R`In computational graphs, when a single node $u$ branches out to feed into multiple child nodes $v_1, v_2, \dots, v_k$, how is the adjoint (incoming gradient) $\frac{\partial L}{\partial u}$ computed?`,
      hint: R`Apply the multivariable chain rule across all directed paths from $u$ to the final scalar loss $L$.`,
      steps: [
        R`By the multivariable chain rule, total derivative is the sum of contributions along all paths.`,
        R`Each child node $v_i$ receives a gradient $\frac{\partial L}{\partial v_i}$ from downstream.`,
        R`The contribution from child $v_i$ through edge $(u \to v_i)$ is $\frac{\partial L}{\partial v_i} \cdot \frac{\partial v_i}{\partial u}$.`,
        R`Therefore, incoming gradients must be summed: $\frac{\partial L}{\partial u} = \sum_{i=1}^k \frac{\partial L}{\partial v_i} \frac{\partial v_i}{\partial u}$.`
      ],
      answer: R`Gradients are summed across all outgoing branches: $\frac{\partial L}{\partial u} = \sum_{i} \frac{\partial L}{\partial v_i} \frac{\partial v_i}{\partial u}$. In code, this corresponds to accumulating gradients (e.g. <code>+=</code>).` },

    { id: "calc3-2", type: "concept",
      q: R`Why does reverse-mode automatic differentiation compute gradients with time complexity $\mathcal{O}(1)$ passes with respect to parameter count $N$, while forward-mode AD requires $\mathcal{O}(N)$ passes?`,
      hint: R`Consider the dimensions of the Jacobian matrix $\mathbf{J} \in \mathbb{R}^{m \times n}$ where $m$ is outputs and $n$ is inputs.`,
      steps: [
        R`For function $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$, the Jacobian $\mathbf{J}$ has $m$ rows and $n$ columns.`,
        R`Forward-mode AD evaluates Jacobian-Vector Products (JVP): $\mathbf{J} \mathbf{v}$. Each pass computes 1 column ($\mathcal{O}(n)$ passes needed for full Jacobian).`,
        R`Reverse-mode AD evaluates Vector-Jacobian Products (VJP): $\mathbf{v}^T \mathbf{J}$. Each pass computes 1 row ($\mathcal{O}(m)$ passes needed).`,
        R`In Deep Learning, loss $L \in \mathbb{R}$ is scalar ($m = 1$), while parameter count $N = n \approx 10^6 - 10^{11}$.`,
        R`Hence, reverse-mode computes all $N$ gradients in exactly $m = 1$ single backward pass!`
      ],
      answer: R`Reverse-mode computes one row of the Jacobian per pass. Since neural network loss is scalar ($m=1$), all $N$ gradients are obtained in a single backward pass ($\mathcal{O}(1)$ passes).` },

    { id: "calc3-3", type: "computation",
      q: R`Given scalar computational graph $z = \sin(x \cdot y) + x^2$, compute the exact Jacobian $\mathbf{J} = \left[\frac{\partial z}{\partial x}, \frac{\partial z}{\partial y}\right]$ evaluated at $(x, y) = (\sqrt{\pi}, \sqrt{\pi})$.`,
      hint: R`Note that $x \cdot y = \pi$, and $\cos(\pi) = -1$.`,
      steps: [
        R`Product in sine argument: $u = x \cdot y = \sqrt{\pi} \cdot \sqrt{\pi} = \pi$.`,
        R`Partial w.r.t $x$: $\frac{\partial z}{\partial x} = \cos(xy) \cdot y + 2x$.`,
        R`Evaluate at $(\sqrt{\pi}, \sqrt{\pi})$: $\cos(\pi)\sqrt{\pi} + 2\sqrt{\pi} = (-1)\sqrt{\pi} + 2\sqrt{\pi} = \sqrt{\pi}$.`,
        R`Partial w.r.t $y$: $\frac{\partial z}{\partial y} = \cos(xy) \cdot x = \cos(\pi)\sqrt{\pi} = -\sqrt{\pi}$.`,
        R`Jacobian matrix: $\mathbf{J} = [\sqrt{\pi}, -\sqrt{\pi}] \approx [1.7725, -1.7725]$.`
      ],
      answer: R`$\mathbf{J} = [\sqrt{\pi}, -\sqrt{\pi}] \approx [1.7725, -1.7725]$.` },

    { id: "calc3-4", type: "computation",
      q: R`Let vector mappings be $\mathbf{f}(u, v) = \begin{bmatrix} u^2 v \\ u + 3v \end{bmatrix}$ and $\mathbf{g}(x, y) = \begin{bmatrix} x + y \\ 2x \end{bmatrix}$. Compute the Jacobian $\mathbf{J}_{(\mathbf{f} \circ \mathbf{g})}(1, 1)$ via matrix multiplication $\mathbf{J}_{\mathbf{f}} \cdot \mathbf{J}_{\mathbf{g}}$.`,
      hint: R`First evaluate $\mathbf{g}(1, 1) = [u, v]^T$, compute each Jacobian matrix, and multiply.`,
      steps: [
        R`Inner evaluation: $\mathbf{g}(1, 1) = \begin{bmatrix} 1 + 1 \\ 2(1) \end{bmatrix} = \begin{bmatrix} 2 \\ 2 \end{bmatrix} \implies u = 2, v = 2$.`,
        R`Jacobian of $\mathbf{g}$: $\mathbf{J}_{\mathbf{g}} = \begin{bmatrix} \frac{\partial g_1}{\partial x} & \frac{\partial g_1}{\partial y} \\ \frac{\partial g_2}{\partial x} & \frac{\partial g_2}{\partial y} \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 2 & 0 \end{bmatrix}$.`,
        R`Jacobian of $\mathbf{f}$: $\mathbf{J}_{\mathbf{f}} = \begin{bmatrix} 2uv & u^2 \\ 1 & 3 \end{bmatrix}$. At $(2, 2)$: $\mathbf{J}_{\mathbf{f}} = \begin{bmatrix} 2(2)(2) & 2^2 \\ 1 & 3 \end{bmatrix} = \begin{bmatrix} 8 & 4 \\ 1 & 3 \end{bmatrix}$.`,
        R`Chain rule: $\mathbf{J}_{(\mathbf{f} \circ \mathbf{g})} = \mathbf{J}_{\mathbf{f}} \mathbf{J}_{\mathbf{g}} = \begin{bmatrix} 8 & 4 \\ 1 & 3 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 2 & 0 \end{bmatrix} = \begin{bmatrix} 8(1)+4(2) & 8(1)+4(0) \\ 1(1)+3(2) & 1(1)+3(0) \end{bmatrix} = \begin{bmatrix} 16 & 8 \\ 7 & 1 \end{bmatrix}$.`
      ],
      answer: R`$\mathbf{J}_{(\mathbf{f} \circ \mathbf{g})}(1, 1) = \begin{bmatrix} 16 & 8 \\ 7 & 1 \end{bmatrix}$.` },

    { id: "calc3-5", type: "proof",
      q: R`Prove by the chain rule that for the Softmax activation $p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$ and Categorical Cross-Entropy loss $L = -\sum_k y_k \ln p_k$ with one-hot target $\sum_k y_k = 1$, the gradient simplifies to $\frac{\partial L}{\partial z_i} = p_i - y_i$.`,
      hint: R`Calculate $\frac{\partial p_k}{\partial z_i}$ for $k=i$ and $k \ne i$, then apply $\frac{\partial L}{\partial z_i} = \sum_k \frac{\partial L}{\partial p_k} \frac{\partial p_k}{\partial z_i}$.`,
      steps: [
        R`Softmax derivatives: $\frac{\partial p_i}{\partial z_i} = p_i(1 - p_i)$, and for $k \ne i$: $\frac{\partial p_k}{\partial z_i} = -p_k p_i$.`,
        R`Loss derivative w.r.t probabilities: $\frac{\partial L}{\partial p_k} = -\frac{y_k}{p_k}$.`,
        R`Chain rule sum: $\frac{\partial L}{\partial z_i} = \sum_k \frac{\partial L}{\partial p_k} \frac{\partial p_k}{\partial z_i} = -\frac{y_i}{p_i} p_i(1 - p_i) - \sum_{k \ne i} \frac{y_k}{p_k} (-p_k p_i)$.`,
        R`Simplify terms: $= -y_i(1 - p_i) + p_i \sum_{k \ne i} y_k = -y_i + y_i p_i + p_i(1 - y_i)$.`,
        R`Combine: $= -y_i + y_i p_i + p_i - p_i y_i = p_i - y_i$.`
      ],
      answer: R`$\frac{\partial L}{\partial z_i} = p_i - y_i$ (Proved). This remarkably simple gradient is why Softmax + Cross-Entropy is the universal standard in classification.` },

    { id: "calc3-6", type: "interview",
      q: R`<strong>PyTorch Core Team interview.</strong> How does PyTorch prevent silently computing corrupted gradients when a user executes an in-place mutation (e.g. <code>x.add_(1)</code>) on a tensor that is required for the backward pass?`,
      hint: R`What internal integer metadata does every PyTorch Tensor maintain to detect memory mutations?`,
      steps: [
        R`Every <code>torch.Tensor</code> contains an internal metadata attribute <code>_version</code> (version counter), initialized to 0.`,
        R`During the forward pass, operations that need intermediate tensors in backward (e.g. activations $\mathbf{a}$ in $\sigma'(z) = \sigma(z)(1-\sigma(z))$) save them using <code>ctx.save_for_backward(...)</code>, recording their current version counter.`,
        R`Whenever any in-place mutation (like <code>.add_()</code> or <code>[idx] = val</code>) modifies the underlying data buffer, PyTorch increments the tensor's <code>_version</code>.`,
        R`When <code>loss.backward()</code> executes, PyTorch checks if the saved version matches the tensor's current version. If mismatched, it immediately halts and raises a <code>RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation</code>.`
      ],
      answer: R`PyTorch uses tensor version counters. Any in-place mutation increments the counter. If the version during backward execution doesn't match the version saved during forward execution, autograd raises a RuntimeError.` }
  ];

  // ════════════════════════════════════════════════════════════
  // CHAPTER 4: BACKPROPAGATION BY HAND
  // ════════════════════════════════════════════════════════════
  P["calc-ch4"] = [
    { id: "calc4-1", type: "concept",
      q: R`In deep networks using Sigmoid activations $\sigma(z)$, what causes the vanishing gradient problem in early layers, and why does ReLU eliminate it?`,
      hint: R`Examine the maximum value of $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ compared to $\text{ReLU}'(z)$ for $z > 0$.`,
      steps: [
        R`The derivative $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ attains its maximum at $z = 0$, where $\sigma'(0) = 0.5 \times 0.5 = 0.25$.`,
        R`Through $L$ hidden layers, gradients multiply by $\prod_{l=1}^L \sigma'(z_l) \le (0.25)^L$. For $L=10$, $(0.25)^{10} \approx 9.5 \times 10^{-7}$.`,
        R`This exponential decay prevents weights in early layers from receiving meaningful updates during training.`,
        R`In contrast, $\text{ReLU}(z) = \max(0, z)$ has derivative $\text{ReLU}'(z) = 1.0$ for all $z > 0$. Gradients pass through active neurons without any exponential damping factor!`
      ],
      answer: R`Sigmoid derivative has maximum value $0.25$, causing gradients across $L$ layers to shrink as $(0.25)^L \to 0$. ReLU has constant derivative $1.0$ for positive inputs, eliminating exponential attenuation.` },

    { id: "calc4-2", type: "concept",
      q: R`What is the subgradient of the ReLU function $g(z) = \max(0, z)$ at the non-differentiable point $z = 0$, and what value do practical deep learning libraries assign?`,
      hint: R`Look at the left derivative $\lim_{h \to 0^-} \frac{g(h)-0}{h}$ and right derivative $\lim_{h \to 0^+} \frac{g(h)-0}{h}$.`,
      steps: [
        R`Left derivative: $\lim_{h \to 0^-} \frac{0 - 0}{h} = 0$.`,
        R`Right derivative: $\lim_{h \to 0^+} \frac{h - 0}{h} = 1$.`,
        R`The subdifferential $\partial g(0)$ is the set of all slopes of supporting lines: $\partial g(0) = [0, 1]$.`,
        R`In practical software (PyTorch, TensorFlow, JAX), standard convention defines $g'(0) = 0$ (or sometimes $0.5$ or $1.0$). Since float coordinates land on exact $0.000000$ with probability measure zero, any value in $[0, 1]$ converges reliably.`
      ],
      answer: R`The subdifferential is the interval $[0, 1]$. Deep learning libraries conventionally set $g'(0) = 0$, which ensures numerical stability.` },

    { id: "calc4-3", type: "computation",
      q: R`A single neuron has weight $w = 2.0$, bias $b = 0.5$, input $x = 1.5$, sigmoid activation $\hat{y} = \sigma(wx + b)$, target $y = 1.0$, and loss $L = \frac{1}{2}(\hat{y} - y)^2$. Compute the numerical gradient $\frac{\partial L}{\partial w}$.`,
      hint: R`First calculate $z$, $\hat{y}$, the error delta $\delta = (\hat{y} - y)\hat{y}(1-\hat{y})$, and $\frac{\partial L}{\partial w} = \delta \cdot x$.`,
      steps: [
        R`Linear sum: $z = w x + b = 2.0(1.5) + 0.5 = 3.5$.`,
        R`Activation: $\hat{y} = \sigma(3.5) = \frac{1}{1 + e^{-3.5}} \approx \frac{1}{1 + 0.030197} \approx 0.97067$.`,
        R`Activation derivative: $\sigma'(3.5) = \hat{y}(1 - \hat{y}) = 0.97067(1 - 0.97067) \approx 0.02847$.`,
        R`Output delta: $\delta = (\hat{y} - y) \cdot \sigma'(z) = (0.97067 - 1.0) \cdot 0.02847 = -0.02933 \cdot 0.02847 \approx -0.000835$.`,
        R`Weight gradient: $\frac{\partial L}{\partial w} = \delta \cdot x = -0.000835 \cdot 1.5 \approx -0.00125$.`
      ],
      answer: R`$\frac{\partial L}{\partial w} \approx -0.00125$.` },

    { id: "calc4-4", type: "computation",
      q: R`In a 2-layer network with 1 hidden neuron: $z_1 = w_1 x + b_1$, $a_1 = \text{ReLU}(z_1)$, $\hat{y} = w_2 a_1 + b_2$, loss $L = (\hat{y} - y)^2$. Given $x = 3, y = 5, w_1 = -1, b_1 = 2, w_2 = 4, b_2 = 1$. Compute $\frac{\partial L}{\partial w_1}$.`,
      hint: R`Check if the hidden neuron is active ($z_1 > 0$) or inactive ($z_1 \le 0$).`,
      steps: [
        R`Hidden pre-activation: $z_1 = w_1 x + b_1 = (-1)(3) + 2 = -3 + 2 = -1$.`,
        R`Activation: $a_1 = \text{ReLU}(-1) = \max(0, -1) = 0$.`,
        R`Because $z_1 < 0$, the derivative of the activation function is strictly $\text{ReLU}'(z_1) = 0$.`,
        R`By chain rule: $\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial a_1} \cdot \text{ReLU}'(z_1) \cdot \frac{\partial z_1}{\partial w_1} = 2(\hat{y}-y) \cdot w_2 \cdot 0 \cdot x = 0$.`
      ],
      answer: R`$\frac{\partial L}{\partial w_1} = 0.0$ (Demonstrating the Dying ReLU phenomenon where inactive neurons block gradient flow).` },

    { id: "calc4-5", type: "proof",
      q: R`Derive the matrix equations for backpropagation through a dense linear layer $\mathbf{z} = \mathbf{W}\mathbf{x} + \mathbf{b}$: given upstream incoming gradient $\boldsymbol{\delta} = \frac{\partial L}{\partial \mathbf{z}} \in \mathbb{R}^{m \times 1}$, prove that $\frac{\partial L}{\partial \mathbf{W}} = \boldsymbol{\delta} \mathbf{x}^T$ and $\frac{\partial L}{\partial \mathbf{x}} = \mathbf{W}^T \boldsymbol{\delta}$.`,
      hint: R`Write out the component equation $z_i = \sum_j W_{ij} x_j + b_i$ and take partial derivatives.`,
      steps: [
        R`For element $W_{ij}$: $z_i = \sum_{k} W_{ik} x_k + b_i \implies \frac{\partial z_i}{\partial W_{ij}} = x_j$.`,
        R`Chain rule for weight entry: $\frac{\partial L}{\partial W_{ij}} = \frac{\partial L}{\partial z_i} \frac{\partial z_i}{\partial W_{ij}} = \delta_i x_j$.`,
        R`The $m \times n$ matrix whose $(i, j)$ entry is $\delta_i x_j$ is precisely the outer product $\boldsymbol{\delta} \mathbf{x}^T$.`,
        R`For input coordinate $x_j$: $x_j$ appears in every $z_i$ scaled by $W_{ij}$.`,
        R`Chain rule: $\frac{\partial L}{\partial x_j} = \sum_{i=1}^m \frac{\partial L}{\partial z_i} \frac{\partial z_i}{\partial x_j} = \sum_{i=1}^m \delta_i W_{ij} = \sum_{i=1}^m W^T_{ji} \delta_i = (\mathbf{W}^T \boldsymbol{\delta})_j$. In vector notation: $\frac{\partial L}{\partial \mathbf{x}} = \mathbf{W}^T \boldsymbol{\delta}$.`
      ],
      answer: R`Proved; weight gradient is the outer product $\boldsymbol{\delta} \mathbf{x}^T$, and input gradient is the transpose vector-matrix product $\mathbf{W}^T \boldsymbol{\delta}$.` },

    { id: "calc4-6", type: "interview",
      q: R`<strong>Deep Learning Systems interview.</strong> You write a custom CUDA backward kernel and run gradient check. The relative error is $0.05$ (fails the $10^{-5}$ threshold). Describe an algorithmic 3-step debugging checklist to isolate whether the bug is in the forward or backward pass.`,
      hint: R`How can you test the forward pass independently without using any backward code?`,
      steps: [
        R`Step 1: Test forward pass against a trusted reference (e.g. pure NumPy or hand calculation on a tiny $2 \times 2$ input). If forward numerical values deviate by $> 10^{-6}$, the bug is in the forward kernel itself.`,
        R`Step 2: If forward pass is 100% bit-exact, compute the numerical gradient coordinate-by-coordinate using symmetric central difference with float64. Compare each individual entry of $\frac{\partial L}{\partial W_{ij}}$ against analytical backward output.`,
        R`Step 3: Check for the 3 most common GPU backward bugs: (a) matrix transpose swapped (e.g. column-major vs row-major stride), (b) missing factor of batch size $\frac{1}{N}$ in reduction, or (c) race conditions in GPU atomicAdd when accumulating gradients.`
      ],
      answer: R`(1) Verify forward pass independently against reference implementation; (2) Compare entry-by-entry analytical vs central difference gradients; (3) Check for matrix transposition mistakes, batch-size scaling factors, and atomicAdd race conditions.` }
  ];

  // ════════════════════════════════════════════════════════════
  // CHAPTER 5: CONVEXITY
  // ════════════════════════════════════════════════════════════
  P["calc-ch5"] = [
    { id: "calc5-1", type: "concept",
      q: R`Why is convexity called the golden property of mathematical optimization? What makes solving non-convex optimization problems fundamentally harder?`,
      hint: R`Think about the relationship between local minima and global minima.`,
      steps: [
        R`In convex optimization, every local minimum is rigorously guaranteed to be a global minimum.`,
        R`Furthermore, the first-order stationary condition $\nabla f(\mathbf{x}^*) = \mathbf{0}$ is both necessary and sufficient for global optimality.`,
        R`In non-convex optimization, objective landscapes contain exponentially many suboptimal local minima, saddle points, and flat plateaus.`,
        R`Algorithms can get permanently trapped in poor local traps, making finding the global optimum NP-hard in general.`
      ],
      answer: R`For convex functions, every local minimum is guaranteed to be a global minimum, and $\nabla f(\mathbf{x}^*) = \mathbf{0}$ confirms global optimality. Non-convex functions have multiple local minima and saddle points.` },

    { id: "calc5-2", type: "concept",
      q: R`What is the geometric meaning of the first-order condition for convexity: $f(\mathbf{y}) \ge f(\mathbf{x}) + \nabla f(\mathbf{x})^T(\mathbf{y} - \mathbf{x})$?`,
      hint: R`Notice that the right side is the equation of the tangent hyperplane at $\mathbf{x}$.`,
      steps: [
        R`The right-hand side $L(\mathbf{y}) = f(\mathbf{x}) + \nabla f(\mathbf{x})^T(\mathbf{y} - \mathbf{x})$ is the tangent plane to $f$ at point $\mathbf{x}$.`,
        R`The inequality states that for all $\mathbf{y}$, $f(\mathbf{y}) \ge L(\mathbf{y})$.`,
        R`Geometrically, this means the tangent hyperplane at ANY point lies globally below (or touches) the graph of the function everywhere.`,
        R`The function curves upward away from all of its supporting hyperplanes.`
      ],
      answer: R`The tangent hyperplane at any point forms a global underestimator (supporting hyperplane) of the function; the function lies entirely above all of its tangent planes.` },

    { id: "calc5-3", type: "computation",
      q: R`Determine whether $f(x, y) = 2x^2 - 4xy + 5y^2 + 6x - 2y$ is strictly convex by computing its Hessian matrix $\mathbf{H}$ and finding its eigenvalues.`,
      hint: R`Compute second partial derivatives to form $\mathbf{H} = \begin{bmatrix} f_{xx} & f_{xy} \\ f_{yx} & f_{yy} \end{bmatrix}$ and solve $\det(\mathbf{H} - \lambda \mathbf{I}) = 0$.`,
      steps: [
        R`First partials: $\frac{\partial f}{\partial x} = 4x - 4y + 6$, $\frac{\partial f}{\partial y} = -4x + 10y - 2$.`,
        R`Second partials: $f_{xx} = 4$, $f_{yy} = 10$, $f_{xy} = f_{yx} = -4$.`,
        R`Hessian: $\mathbf{H} = \begin{bmatrix} 4 & -4 \\ -4 & 10 \end{bmatrix}$.`,
        R`Characteristic equation: $\det(\mathbf{H} - \lambda \mathbf{I}) = (4 - \lambda)(10 - \lambda) - (-4)^2 = \lambda^2 - 14\lambda + 40 - 16 = \lambda^2 - 14\lambda + 24 = 0$.`,
        R`Factor: $(\lambda - 2)(\lambda - 12) = 0 \implies \lambda_1 = 2, \lambda_2 = 12$.`,
        R`Since both eigenvalues are strictly positive ($\lambda_1, \lambda_2 > 0$), the Hessian is positive definite ($\mathbf{H} \succ 0$).`
      ],
      answer: R`$f$ is strictly convex; its Hessian has eigenvalues $\lambda_1 = 2 > 0$ and $\lambda_2 = 12 > 0$, confirming positive definiteness $\mathbf{H} \succ 0$.` },

    { id: "calc5-4", type: "computation",
      q: R`Find the unique global minimum $\mathbf{x}^* = (x^*, y^*)$ of the strictly convex function $f(x, y) = 2x^2 - 4xy + 5y^2 + 6x - 2y$ by solving $\nabla f(\mathbf{x}) = \mathbf{0}$.`,
      hint: R`Set the first partial derivatives equal to zero and solve the $2 \times 2$ linear system.`,
      steps: [
        R`System of equations from $\nabla f = \mathbf{0}$:`,
        R`1) $4x - 4y + 6 = 0 \implies 2x - 2y = -3$.`,
        R`2) $-4x + 10y - 2 = 0 \implies -2x + 5y = 1$.`,
        R`Add equations (1) and (2): $(2x - 2x) + (-2y + 5y) = -3 + 1 \implies 3y = -2 \implies y^* = -\frac{2}{3}$.`,
        R`Substitute into (1): $2x - 2(-2/3) = -3 \implies 2x + \frac{4}{3} = -3 \implies 2x = -\frac{13}{3} \implies x^* = -\frac{13}{6}$.`
      ],
      answer: R`Unique global minimum at $(x^*, y^*) = \left(-\frac{13}{6}, -\frac{2}{3}\right) \approx (-2.167, -0.667)$.` },

    { id: "calc5-5", type: "proof",
      q: R`Prove that the intersection $S = \bigcap_{i \in I} S_i$ of any collection of convex sets $\{S_i\}_{i \in I}$ is always a convex set.`,
      hint: R`Take two arbitrary points $\mathbf{x}, \mathbf{y} \in S$ and show that their convex combination $\theta \mathbf{x} + (1-\theta)\mathbf{y}$ belongs to $S$.`,
      steps: [
        R`Let $\mathbf{x}, \mathbf{y} \in S$ and let scalar $\theta \in [0, 1]$.`,
        R`By definition of set intersection, $\mathbf{x} \in S_i$ and $\mathbf{y} \in S_i$ for every index $i \in I$.`,
        R`Since each individual set $S_i$ is convex, the line segment combination satisfies $\theta \mathbf{x} + (1-\theta)\mathbf{y} \in S_i$ for each $i \in I$.`,
        R`Because the convex combination belongs to every set $S_i$, it must belong to their intersection: $\theta \mathbf{x} + (1-\theta)\mathbf{y} \in \bigcap_{i \in I} S_i = S$.`,
        R`Therefore, $S$ satisfies the definition of a convex set.`
      ],
      answer: R`Proved; the intersection of any arbitrary (even infinite) family of convex sets is always convex. (This is why feasible sets defined by multiple convex constraints remain convex).` },

    { id: "calc5-6", type: "interview",
      q: R`<strong>Quantitative Research / Portfolio Optimization interview.</strong> Is the composition of two convex functions $f(g(x))$ always convex? If not, what additional condition is required, and give a clear counterexample.`,
      hint: R`Compute the second derivative $(f(g(x)))''$ using the chain rule and check when it is non-negative.`,
      steps: [
        R`Compute second derivative via chain rule: $(f(g(x)))' = f'(g(x)) g'(x)$.`,
        R`Second derivative: $(f(g(x)))'' = f''(g(x)) (g'(x))^2 + f'(g(x)) g''(x)$.`,
        R`Since $f$ and $g$ are convex, $f'' \ge 0$ and $g'' \ge 0$, and $(g'(x))^2 \ge 0$. The first term is always non-negative.`,
        R`However, the second term $f'(g(x)) g''(x)$ can be negative if $f$ is decreasing ($f' < 0$)!`,
        R`Counterexample: Let $g(x) = x^2$ (convex) and $f(u) = -u$ (convex). The composition is $f(g(x)) = -x^2$, which is strictly concave!`,
        R`Required condition: $f$ must be convex AND non-decreasing ($f' \ge 0$).`
      ],
      answer: R`No; composition requires the outer function $f$ to be convex AND non-decreasing. Counterexample: $g(x) = x^2$ (convex) and $f(u) = -u$ (convex) yields $f(g(x)) = -x^2$ (concave).` }
  ];

  // ════════════════════════════════════════════════════════════
  // CHAPTER 6: GRADIENT-BASED OPTIMISATION
  // ════════════════════════════════════════════════════════════
  P["calc-ch6"] = [
    { id: "calc6-1", type: "concept",
      q: R`What is an ill-conditioned loss surface (e.g. an elongated valley or ravine), and why does vanilla Gradient Descent perform poorly on it?`,
      hint: R`Recall the condition number $\kappa = \frac{\lambda_{\max}}{\lambda_{\min}}$ of the Hessian matrix.`,
      steps: [
        R`An ill-conditioned quadratic surface has Hessian condition number $\kappa = \lambda_{\max} / \lambda_{\min} \gg 1$.`,
        R`The surface is extremely steep along the $\lambda_{\max}$ eigenvector direction and very flat along the $\lambda_{\min}$ eigenvector direction.`,
        R`The gradient vector points almost entirely across the narrow ravine (perpendicular to the valley floor) rather than along the gentle path toward the minimum.`,
        R`To avoid divergence in the steep direction, the learning rate must be capped at $\eta < 2 / \lambda_{\max}$.`,
        R`With this tiny step size, progress along the flat valley floor proceeds at an excruciating rate of $\mathcal{O}(\lambda_{\min} / \lambda_{\max})$.`
      ],
      answer: R`In an ill-conditioned ravine ($\lambda_{\max} \gg \lambda_{\min}$), gradient vectors point across the canyon walls rather than toward the valley floor, causing violent oscillations and slow convergence.` },

    { id: "calc6-2", type: "concept",
      q: R`In the Adam optimizer, what is the exact purpose of the bias correction factors $\frac{1}{1 - \beta_1^t}$ and $\frac{1}{1 - \beta_2^t}$?`,
      hint: R`Consider what happens at step $t=1$ when initial moment vectors $\mathbf{m}_0 = \mathbf{0}$ and $\mathbf{v}_0 = \mathbf{0}$.`,
      steps: [
        R`Moment vectors are initialized to zero: $\mathbf{m}_0 = \mathbf{0}, \mathbf{v}_0 = \mathbf{0}$.`,
        R`Unrolling $\mathbf{m}_t = \sum_{i=1}^t (1 - \beta_1) \beta_1^{t-i} \mathbf{g}_i$. Taking expectation assuming stationary gradients $\mathbb{E}[\mathbf{g}_i] = \mathbb{E}[\mathbf{g}]$:`,
        R`$\mathbb{E}[\mathbf{m}_t] = \mathbb{E}[\mathbf{g}] (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i} = \mathbb{E}[\mathbf{g}] (1 - \beta_1) \frac{1 - \beta_1^t}{1 - \beta_1} = \mathbb{E}[\mathbf{g}] (1 - \beta_1^t)$.`,
        R`Notice the factor $(1 - \beta_1^t) < 1$. For $t=1$ with $\beta_1 = 0.9$, $1 - 0.9^1 = 0.1$, so $\mathbf{m}_1$ is only $10\%$ of the true gradient expectation!`,
        R`Dividing by $1 - \beta_1^t$ normalizes $\hat{\mathbf{m}}_t$ so that $\mathbb{E}[\hat{\mathbf{m}}_t] = \mathbb{E}[\mathbf{g}]$, ensuring unbiased steps right from iteration 1.`
      ],
      answer: R`Because moments are initialized to zero, raw estimates are heavily biased toward zero in early steps. Dividing by $(1 - \beta^t)$ cancels this initialization bias so updates maintain full expected scale.` },

    { id: "calc6-3", type: "computation",
      q: R`For 1D loss $f(x) = 5 x^2$, what is the exact theoretical upper bound on learning rate $\eta_{\max}$ for gradient descent to converge? Show what happens for $\eta = 0.25$ over 3 iterations starting from $x_0 = 1$.`,
      hint: R`Gradient descent update is $x_{t+1} = (1 - \eta L) x_t$ where $L = f''(x) = 10$.`,
      steps: [
        R`Hessian / Lipschitz constant: $L = f''(x) = 10$.`,
        R`Update equation: $x_{t+1} = x_t - \eta (10 x_t) = (1 - 10\eta) x_t$.`,
        R`Convergence condition: $|1 - 10\eta| < 1 \implies 0 < \eta < \frac{2}{L} = \frac{2}{10} = 0.20$.`,
        R`If $\eta = 0.25 > 0.20$, multiplier is $1 - 10(0.25) = 1 - 2.5 = -1.5$.`,
        R`Iter 1: $x_1 = -1.5(1.0) = -1.5$.`,
        R`Iter 2: $x_2 = -1.5(-1.5) = +2.25$.`,
        R`Iter 3: $x_3 = -1.5(+2.25) = -3.375$. Diverges to $\pm \infty$ with alternating sign!`
      ],
      answer: R`$\eta_{\max} = 0.20$. For $\eta = 0.25$, sequence is $x_1 = -1.5, x_2 = 2.25, x_3 = -3.375$, oscillating with exponentially growing amplitude.` },

    { id: "calc6-4", type: "computation",
      q: R`At iteration $t=1$, loss gradient is $g_1 = 4.0$. For Adam with $\beta_1 = 0.9, \beta_2 = 0.99, \eta = 0.01, \epsilon = 10^{-8}$, calculate the exact numerical values of $m_1, v_1, \hat{m}_1, \hat{v}_1$, and the parameter change $\Delta x_1$.`,
      hint: R`Use $m_1 = (1-\beta_1)g_1$, $v_1 = (1-\beta_2)g_1^2$, and divide each by $(1 - \beta^1)$.`,
      steps: [
        R`First moment: $m_1 = 0.9(0) + (1 - 0.9)(4.0) = 0.1(4.0) = 0.4$.`,
        R`Second moment: $v_1 = 0.99(0) + (1 - 0.99)(4.0^2) = 0.01(16.0) = 0.16$.`,
        R`Bias-corrected first moment: $\hat{m}_1 = \frac{m_1}{1 - 0.9^1} = \frac{0.4}{0.1} = 4.0$.`,
        R`Bias-corrected second moment: $\hat{v}_1 = \frac{v_1}{1 - 0.99^1} = \frac{0.16}{0.01} = 16.0$.`,
        R`Denominator: $\sqrt{\hat{v}_1} + \epsilon = \sqrt{16.0} + 10^{-8} = 4.0$.`,
        R`Parameter update: $\Delta x_1 = -\eta \frac{\hat{m}_1}{\sqrt{\hat{v}_1} + \epsilon} = -0.01 \frac{4.0}{4.0} = -0.01$.`
      ],
      answer: R`$m_1 = 0.4$, $v_1 = 0.16$, $\hat{m}_1 = 4.0$, $\hat{v}_1 = 16.0$, $\Delta x_1 = -0.01$ (Notice Adam scales the initial step size to exactly the nominal rate $\eta$).` },

    { id: "calc6-5", type: "proof",
      q: R`Prove that under a constant steady gradient $\mathbf{g}_t = \mathbf{g}$, Polyak Momentum $\mathbf{v}_{t+1} = \beta \mathbf{v}_t + \mathbf{g}_t$ accelerates steady-state velocity by an effective factor of $\frac{1}{1 - \beta}$.`,
      hint: R`Unroll the recursion into a geometric series $\sum_{k=0}^{t-1} \beta^k$ and evaluate the infinite limit.`,
      steps: [
        R`Assume $\mathbf{v}_0 = \mathbf{0}$ and constant gradient $\mathbf{g}_t = \mathbf{g}$.`,
        R`$\mathbf{v}_1 = \mathbf{g}$.`,
        R`$\mathbf{v}_2 = \beta \mathbf{g} + \mathbf{g} = (1 + \beta)\mathbf{g}$.`,
        R`$\mathbf{v}_3 = \beta(1 + \beta)\mathbf{g} + \mathbf{g} = (1 + \beta + \beta^2)\mathbf{g}$.`,
        R`At step $t$: $\mathbf{v}_t = \left(\sum_{k=0}^{t-1} \beta^k\right) \mathbf{g}$.`,
        R`Since $0 \le \beta < 1$, as $t \to \infty$ the sum converges to geometric series sum $\frac{1}{1 - \beta}$.`,
        R`For standard $\beta = 0.9$, $\frac{1}{1 - 0.9} = \frac{1}{0.1} = 10 \times$ acceleration along consistent gradient paths.`
      ],
      answer: R`Proved; the accumulated velocity satisfies $\lim_{t \to \infty} \mathbf{v}_t = \frac{1}{1 - \beta} \mathbf{g}$.` },

    { id: "calc6-6", type: "interview",
      q: R`<strong>Senior LLM Pre-training Engineer interview.</strong> Explain why standard Adam with L2 regularization added to the loss function fails to correctly decay weights, and how AdamW (decoupled weight decay) solves this problem.`,
      hint: R`How does adding $\lambda \mathbf{w}$ to the gradient corrupt the second-moment accumulator $\mathbf{v}_t$?`,
      steps: [
        R`In L2 regularization, loss is $L_{\text{reg}} = L + \frac{\lambda}{2} \|\mathbf{w}\|^2$, so modified gradient is $\mathbf{g} + \lambda \mathbf{w}$.`,
        R`In standard Adam, this combined gradient enters the second moment: $\mathbf{v}_t = \beta_2 \mathbf{v}_{t-1} + (1-\beta_2)(\mathbf{g} + \lambda \mathbf{w})^2$.`,
        R`The update step divides by $\sqrt{\hat{\mathbf{v}}_t}$: $\mathbf{w}_t = \mathbf{w}_{t-1} - \frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t$.`,
        R`Consequently, weights with large historical gradients get divided by a huge denominator, suppressing their weight decay! Conversely, weights with small gradients receive disproportionately large decay.`,
        R`AdamW decouples weight decay completely from the gradient moments: $\mathbf{w}_t = \mathbf{w}_{t-1} - \eta \lambda \mathbf{w}_{t-1} - \frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t$, restoring true uniform exponential shrinkage.`
      ],
      answer: R`L2 regularisation mixes weight penalty into the adaptive variance denominator, penalising active weights less than inactive ones. AdamW applies weight decay directly to the parameter update, restoring true weight decay.` }
  ];

  // ════════════════════════════════════════════════════════════
  // CHAPTER 7: CONSTRAINED OPTIMISATION
  // ════════════════════════════════════════════════════════════
  P["calc-ch7"] = [
    { id: "calc7-1", type: "concept",
      q: R`What is the physical and economic interpretation of the Lagrange multiplier $\lambda$? How does it quantify the shadow price of a constraint?`,
      hint: R`Differentiate the optimal objective value $f^*(\mathbf{x}^*(c))$ with respect to the constraint boundary $c$ in $g(\mathbf{x}) = c$.`,
      steps: [
        R`Consider the perturbed equality constraint $g(\mathbf{x}) = c$. Let $\mathbf{x}^*(c)$ be the optimal solution and $f^*(c) = f(\mathbf{x}^*(c))$.`,
        R`By the envelope theorem: $\frac{d f^*(c)}{dc} = -\lambda$.`,
        R`The Lagrange multiplier $\lambda$ measures the exact sensitivity of the optimal cost with respect to relaxing or tightening the constraint.`,
        R`In cloud systems, if constraint represents GPU memory budget $M$, $\lambda$ is the shadow price: the reduction in loss per additional gigabyte of memory allocated.`
      ],
      answer: R`$\lambda = -\frac{d f^*}{dc}$. It represents the marginal improvement in the optimal objective value obtained by relaxing the constraint by one unit (its shadow price).` },

    { id: "calc7-2", type: "concept",
      q: R`In the Karush–Kuhn–Tucker (KKT) conditions for inequality constraint $h(\mathbf{x}) \le 0$, explain the Complementary Slackness condition $\mu \cdot h(\mathbf{x}^*) = 0$.`,
      hint: R`Can both the multiplier $\mu$ and the constraint slack $h(\mathbf{x}^*)$ be strictly non-zero simultaneously?`,
      steps: [
        R`The condition $\mu \cdot h(\mathbf{x}^*) = 0$ requires that at least one of the two factors must be zero.`,
        R`Case 1 (Inactive / Slack constraint): If $h(\mathbf{x}^*) < 0$, the optimum lies strictly in the interior of the feasible region. The boundary does not restrict the minimum, so removing the constraint changes nothing; hence $\mu = 0$.`,
        R`Case 2 (Active / Binding constraint): If the boundary restricts the minimum, the optimum sits directly on the boundary $h(\mathbf{x}^*) = 0$, in which case the shadow price $\mu > 0$.`,
        R`They can never be simultaneously non-zero: either the constraint is binding ($h=0$) or it has zero influence ($\mu=0$).`
      ],
      answer: R`Either the constraint is active ($h(\mathbf{x}^*)=0$) and holds the solution with positive force $\mu>0$, or it is inactive ($h(\mathbf{x}^*)<0$) and exerts zero force ($\mu=0$).` },

    { id: "calc7-3", type: "computation",
      q: R`Minimize $f(x, y) = x^2 + 2y^2$ subject to the linear equality constraint $x + y = 3$ using Lagrange multipliers. Find the optimal point $(x^*, y^*)$ and minimum value.`,
      hint: R`Set up $\mathcal{L}(x, y, \lambda) = x^2 + 2y^2 + \lambda(x + y - 3)$ and solve $\nabla \mathcal{L} = \mathbf{0}$.`,
      steps: [
        R`Lagrangian: $\mathcal{L}(x, y, \lambda) = x^2 + 2y^2 + \lambda(x + y - 3)$.`,
        R`Stationarity conditions:`,
        R`$\frac{\partial \mathcal{L}}{\partial x} = 2x + \lambda = 0 \implies x = -\frac{\lambda}{2}$.`,
        R`$\frac{\partial \mathcal{L}}{\partial y} = 4y + \lambda = 0 \implies y = -\frac{\lambda}{4}$.`,
        R`Substitute into constraint: $-\frac{\lambda}{2} - \frac{\lambda}{4} = 3 \implies -\frac{3\lambda}{4} = 3 \implies \lambda = -4$.`,
        R`Solve coordinates: $x^* = -\frac{-4}{2} = 2$, $y^* = -\frac{-4}{4} = 1$.`,
        R`Minimum value: $f(2, 1) = 2^2 + 2(1^2) = 4 + 2 = 6$.`
      ],
      answer: R`Optimal solution $(x^*, y^*) = (2, 1)$ with $\lambda = -4$ and minimum cost $f^* = 6$.` },

    { id: "calc7-4", type: "computation",
      q: R`Solve the inequality-constrained problem $\min f(x) = (x - 4)^2$ subject to $x \le 2$ using KKT conditions. Show which KKT case holds.`,
      hint: R`Rewrite constraint as $h(x) = x - 2 \le 0$. Test $\mu = 0$ (inactive) vs $x = 2$ (active).`,
      steps: [
        R`Formulate: $f(x) = (x - 4)^2$, $h(x) = x - 2 \le 0$. Lagrangian: $\mathcal{L}(x, \mu) = (x - 4)^2 + \mu(x - 2)$.`,
        R`KKT Stationarity: $2(x - 4) + \mu = 0 \implies \mu = 2(4 - x)$.`,
        R`KKT Dual Feasibility: $\mu \ge 0$. Primal Feasibility: $x \le 2$. Slackness: $\mu(x - 2) = 0$.`,
        R`Hypothesis A (Inactive $\mu = 0$): $2(x - 4) = 0 \implies x = 4$. But $4 \not\le 2$, violates primal feasibility!`,
        R`Hypothesis B (Active $x = 2$): $\mu = 2(4 - 2) = 4 \ge 0$. Both primal and dual conditions satisfied!`,
        R`Optimal value: $f(2) = (2 - 4)^2 = (-2)^2 = 4$.`
      ],
      answer: R`$x^* = 2, \mu^* = 4$, with minimum value $f^* = 4$ (Active constraint case).` },

    { id: "calc7-5", type: "proof",
      q: R`In the Support Vector Machine dual formulation, prove that the optimal weight vector $\mathbf{w}^*$ is a sparse linear combination of only the support vectors: $\mathbf{w}^* = \sum_{i \in \text{SV}} \alpha_i y_i \mathbf{x}_i$.`,
      hint: R`Set the gradient of the primal Lagrangian $\mathcal{L}(\mathbf{w}, b, \boldsymbol{\alpha}) = \frac{1}{2}\|\mathbf{w}\|^2 - \sum_i \alpha_i [y_i(\mathbf{w}^T \mathbf{x}_i + b) - 1]$ w.r.t $\mathbf{w}$ to zero and apply complementary slackness.`,
      steps: [
        R`Primal Lagrangian: $\mathcal{L}(\mathbf{w}, b, \boldsymbol{\alpha}) = \frac{1}{2}\|\mathbf{w}\|^2 - \sum_{i=1}^N \alpha_i [y_i(\mathbf{w}^T \mathbf{x}_i + b) - 1]$.`,
        R`Differentiate w.r.t $\mathbf{w}$: $\nabla_{\mathbf{w}} \mathcal{L} = \mathbf{w} - \sum_{i=1}^N \alpha_i y_i \mathbf{x}_i = \mathbf{0} \implies \mathbf{w}^* = \sum_{i=1}^N \alpha_i y_i \mathbf{x}_i$.`,
        R`By KKT complementary slackness: $\alpha_i [y_i(\mathbf{w}^T \mathbf{x}_i + b) - 1] = 0$.`,
        R`For any training example that lies strictly outside the margin boundary, $y_i(\mathbf{w}^T \mathbf{x}_i + b) > 1$.`,
        R`This forces $\alpha_i = 0$ for all non-boundary points.`,
        R`Therefore, $\mathbf{w}^* = \sum_{i \in \text{SV}} \alpha_i y_i \mathbf{x}_i$ where $\text{SV} = \{i : \alpha_i > 0\}$ is the sparse subset of points directly on the margin.`
      ],
      answer: R`Proved; KKT complementary slackness guarantees that $\alpha_i = 0$ for all points strictly off the margin, rendering the solution sparse.` },

    { id: "calc7-6", type: "interview",
      q: R`<strong>ML Scientist / Theory interview.</strong> Why does the dual formulation of Support Vector Machines allow the use of infinite-dimensional non-linear feature spaces (Kernel Trick), while the primal formulation is computationally impossible in such spaces?`,
      hint: R`What are the optimization variables in the primal ($\mathbf{w}$) vs dual ($\boldsymbol{\alpha}$), and how do data vectors appear?`,
      steps: [
        R`In the primal problem, we optimize the weight vector $\mathbf{w} \in \mathbb{R}^D$ where $D$ is the dimensionality of the transformed feature space $\phi(\mathbf{x})$.`,
        R`If $\phi(\mathbf{x})$ maps into an infinite-dimensional space (such as with Gaussian RBF kernels), $\mathbf{w}$ has infinitely many parameters, making the primal intractable.`,
        R`In the dual formulation, the optimization variables are the $N$ Lagrange multipliers $\alpha_1, \dots, \alpha_N$ (one per data sample), which is independent of feature dimension $D$.`,
        R`Crucially, the feature vectors enter the dual objective and decision function exclusively through pairwise inner products $\phi(\mathbf{x}_i) \cdot \phi(\mathbf{x}_j)$.`,
        R`By Mercer's Theorem, this inner product can be computed directly in input space via a kernel function $K(\mathbf{x}_i, \mathbf{x}_j) = \exp(-\gamma \|\mathbf{x}_i - \mathbf{x}_j\|^2)$ without ever calculating high-dimensional coordinates explicitly.`
      ],
      answer: R`The dual formulation replaces infinite-dimensional weight vectors $\mathbf{w}$ with $N$ scalar multipliers $\boldsymbol{\alpha}$, and depends solely on inner products $\phi(\mathbf{x}_i) \cdot \phi(\mathbf{x}_j) = K(\mathbf{x}_i, \mathbf{x}_j)$, enabling the Kernel Trick.` }
  ];

})(window.PRACTICE_DATA);
