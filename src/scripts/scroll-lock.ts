/** Bloquea el scroll del body mientras hay un diálogo abierto (igual que el original). */
export function lockScroll() {
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  document.body.style.overflow = "";
}
