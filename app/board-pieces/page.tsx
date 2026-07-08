import Link from "next/link";
import { BoardPiecesStudio } from "../../components/BoardPiecesStudio";

export const metadata = {
  title: "Board-Pieces | Alliant",
  description:
    "A scaled board for placing room pieces and movable objects with free drag and rotation.",
};

export default function BoardPiecesPage() {
  return (
    <main className="alliant-page board-pieces-page">
      <div className="page-backdrop" aria-hidden="true" />

      <header className="site-header">
        <Link className="brand-mark" href="/" aria-label="Alliant home">
          <span className="brand-dot" />
          <span>Alliant</span>
        </Link>
        <nav className="project-nav" aria-label="Board pieces navigation">
          <Link href="/">Home</Link>
          <Link href="/quantum-tunnel">Quantum Tunnel</Link>
          <Link href="/dictionary">Dictionary</Link>
        </nav>
      </header>

      <BoardPiecesStudio />
    </main>
  );
}
