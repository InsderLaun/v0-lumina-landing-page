import { Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-base font-bold text-primary-foreground">L</span>
          </div>
          <span className="text-lg font-bold text-foreground">Lumina</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://linkedin.com/in/agustintiberio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn de Agustín Tiberio"
          >
            <Linkedin className="h-4 w-4" />
            <span>{"Agustín Tiberio"}</span>
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {"Términos y Condiciones"}
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">
          {"© 2026 Lumina. Todos los derechos reservados."}
        </p>
      </div>
    </footer>
  );
}
