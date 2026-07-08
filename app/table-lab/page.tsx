import Link from "next/link";
import { SiteSpaceBackground } from "../../components/SiteSpaceBackground";
import { TableLab } from "../../components/TableLab";

export const metadata = {
  title: "Table Lab | Alliant",
  description:
    "A modular tabletop test engine prototype for draggable cards, decks, cells, and card metadata controls.",
};

export default function TableLabPage() {
  return (
    <main className="alliant-page table-lab-page">
      <SiteSpaceBackground />

      <header className="site-header">
        <Link className="brand-mark" href="/" aria-label="Alliant home">
          <span className="brand-dot" />
          <span>Alliant</span>
        </Link>
        <nav className="project-nav" aria-label="Table Lab navigation">
          <Link href="/">Home</Link>
          <Link href="/quantum-tunnel">Quantum Tunnel</Link>
          <Link href="/dictionary">Dictionary</Link>
        </nav>
      </header>

      <TableLab />
    </main>
  );
}
