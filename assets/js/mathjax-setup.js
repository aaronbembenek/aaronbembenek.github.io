window.MathJax = {
  tex: {
    tags: "ams",
    macros: {
      inferrule: ["{\\dfrac{\\begin{array}{c}#1\\end{array}}{\\begin{array}{c}#2\\end{array}}}", 2],
    },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
  options: {
    renderActions: {
      addCss: [
        200,
        function (doc) {
          const style = document.createElement("style");
          style.innerHTML = `
          .mjx-container {
            color: inherit;
          }
        `;
          document.head.appendChild(style);
        },
        "",
      ],
    },
  },
};
