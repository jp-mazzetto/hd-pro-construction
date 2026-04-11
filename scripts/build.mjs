/**
 * Chama vite.build() via API programática e força process.exit() ao final.
 *
 * O vite-prerender-plugin deixa handles abertos no event loop após o build
 * (ex.: pool de conexões do undici), impedindo que o Node.js saia sozinho.
 * Usar process.exit(0) aqui garante saída limpa tanto no local quanto no CI.
 */
import { build } from "vite";

try {
  await build();
  process.exit(0);
} catch {
  process.exit(1);
}
