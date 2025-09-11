---
title: 'Tutorial #2'
date: '2025-09-11 17:35:56'
updated: '2025-09-11 23:30:48'
permalink: /post/tutorial-zvjlv1.html
comments: true
toc: true
---



# Tutorial #2

[MATH1010F_Tutor20250911_Exercise.pdf](assets/MATH1010F_Tutor20250911_Exercise-20250911174310-u4ene0w.pdf)

1. ‍

    1. $$
        \begin{aligned}
        \text{Using M.I. :}&\\
        \text{Base case (n = 1) :}&\\
        a_1 &= 1\\
        &\le 3 \\
        \therefore\text{ It's true}\\
        \text{Induction :}\\
        \text{Assume } a_n &\le 3 \text{ is true.}\\
        \text{When } n &= k+1 :\\
        a_{k+1}  -3&= \frac{12a_k + 12}{a_k + 13} -3\\
        &= \frac{12a_k + 12 - 3a_k - 39}{a_k + 13}\\
        &= \frac{9a_k -27}{a_k + 13}\\
        &=\frac{9(a_k - 3)}{a_k + 13}\\
        \text{Since } 0 \le a_n &\le 3\\
        a_k - 3 &\le 0\\
        \therefore a_{k+1}  -3&=\frac{9(a_k - 3)}{a_k + 13}\\
        &\le 0\\
        a_{k+1} &\le 3 \\
        \therefore \ a_{k+1} \text{ is also true}\\
        \therefore \text{By the principle of M.I.,  }a_n &\le 3
        \end{aligned}
        $$
    2. ‍

        1. Prove it is convergent

            1. Analysis :

                1. To prove it is converges, we can prove $a_n$ is bounded and monotonic (Monotone convergence theorem)
                2. It is proved that $a_n$ is bounded ($0 \le a_n \le 3$)
                3. **Target :**  Prove it is monotonic

                    1. Find direction - increasing or decreasing
                    2. |$n$​|$a_n$​|
                        | ----| ------|
                        |1|1|
                        |2|1.71|
                        |3|2.21|
                    3. It is monotonic increasing ($a_n \le a_{n+1}$)
            2. $$
                \begin{aligned}
                \text{Using M.I. :}\\
                \text{Base case : } a_{2} &= 1.71 \\
                &\ge a_1\\
                \text{Induction : } \\
                \text{Assume } a_n &\le  a_{n+1} \text{ is true}\\
                \text{Let } n &=  k+1\\
                a_{k+2} - a_{k+1} &= \frac{12a_{k+1} + 12}{a_{k+1} + 13} - a_{k+1}\\
                &= \frac{12a_{k+1} + 12  - a^2_{k+1} - 13a_{k+1} }{a_{k+1} + 13}\\
                &= - \frac{a^2_{k+1} + a_{k+1} - 12}{a_{k+1} + 13}\\
                &= - \frac{(a_{k+1} - 3)(a_{k+1} + 4)}{a_{k+1} + 13}\\
                \because a_n &\le 3\\
                \therefore (a_{k+1} - 3) &\le 0\\
                \because a_n &\ge 0\\
                \therefore (a_{k+1} + 4) &> 0\\
                -(a_{k+1} - 3)(a_{k+1} + 4) &\ge0\\
                \\
                a_{k+2} - a_{k+1} &= - \frac{(a_{k+1} - 3)(a_{k+1} + 4)}{a_{k+1} + 13}\\
                &\ge 0\\
                a_{k+2} &\ge a_{k+1}\\
                \text{By the principle of M.I., } a_{n+1} &\ge a_n
                \end{aligned}
                $$
        2. Find limit

            1. When $n \to \infty$, $\lim_{n\to \infty} a_n = \lim_{n\to \infty} a_{n-1}$
            2. Let $\lim_{n\to \infty} a_n = \lim_{n\to \infty} a_{n-1} = A$
            3. $$
                \begin{aligned}
                \lim_{n\to \infty} a_n &= \lim_{n \to \infty} \frac{12a_{n-1} + 12}{a_{n-1} + 13}\\
                &= \frac{12\lim_{n \to \infty} a_{n-1} + 12}{\lim_{n \to \infty} a_{n-1} + 13}\\
                A &= \frac{12A+12}{A+13}\\
                A^2 + 13 A &= 12A+12\\
                A^2 + A - 12&=0\\
                A&= 3 \ or \ -4\ (rej.)\\
                \lim_{n\to \infty} a_n&=  3
                \end{aligned}
                $$

2. ‍

    1. $$
        \begin{aligned}
        \text{Let }x_{n} = X&, y_{n} = Y\\
        x_{n+1} - y_{n+1} &= \frac{x_{n}y_{n}(x_{n} + y_{n})}{x^2_{n} + y^2_{n}} - \frac{x^2_{n} + y^2_{n}}{x_{n}+y_{n}}\\
        &= \frac{XY(X+Y)}{X^2 + Y^2} - \frac{X^2+Y^2}{X+Y}\\
        &=\frac{XY(X+Y)^2 - (X^2+Y^2)^2}{(X^2+ Y^2)(X+Y)}\\
        &= \frac{XY(X^2+ 2XY + Y^2) - (X^4 + 2X^2Y^2 + Y^4)}{(X^2+ Y^2)(X+Y)}\\
        &= \frac{X^3Y + 2X^2Y^2 + XY^3 - X^4 - 2X^2Y^2 - Y^4}{(X^2+ Y^2)(X+Y)}\\
        &= \frac{X^3Y+ XY^3 - X^4 - Y^4}{(X^2+ Y^2)(X+Y)}\\
        &= - \frac{X^4 + Y^4 - X^3Y - XY^3}{(X^2+ Y^2)(X+Y)}\\
        &= -\frac{X^3(X-Y) + Y^3(Y-X)}{(X^2+ Y^2)(X+Y)}\\
        &= -\frac{X^3(X-Y) - Y^3(X-Y)}{(X^2+ Y^2)(X+Y)}\\
        &= \frac{-(X^3-Y^3)(X-Y)}{(X+Y)(X^2+Y^2)}\\
        &=\frac{-(x_n-y_n)(x_n-y_n)}{(x_n+y_n)(x^2_n + y^2_n)}
        \end{aligned}
        $$
    2. ‍

        1. $$
            \begin{aligned}

            \end{aligned}
            $$

‍
