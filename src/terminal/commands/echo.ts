import { line, text, type Command } from "../types";

// Metin olduğu gibi, düz metin olarak basılır (HTML yorumlanmaz).
// Metni saran tek bir tırnak çifti bash'teki gibi atılır.
export const echo: Command = {
  name: "echo",
  usage: { tr: "echo <metin>", en: "echo <text>" },
  description: { tr: "Metni geri bas", en: "Print text" },
  run: ({ input }) => [line(text(input.replace(/^(["'])(.*)\1$/s, "$2")))],
};
