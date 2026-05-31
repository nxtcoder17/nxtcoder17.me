import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { execSync } from "child_process";

function contentWatcher() {
  return {
    name: "content-watcher",
    configureServer(server: any) {
      server.watcher.add(path.resolve(__dirname, "content/**/*.md"));
      server.watcher.on("change", (filePath: string) => {
        if (filePath.endsWith(".md")) {
          console.log(`\n[content-watcher] File changed: ${path.basename(filePath)}. Rebuilding TIL entries...`);
          try {
            execSync("bun scripts/build-content.ts");
            server.ws.send({ type: "full-reload" });
          } catch (e) {
            console.error("Failed to run build-content.ts:", e);
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    contentWatcher(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
